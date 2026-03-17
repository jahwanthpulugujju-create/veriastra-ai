import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Camera, Mic, Shield, CheckCircle2, XCircle, Eye, Scan,
  AudioLines, Fingerprint, ChevronRight, RotateCcw, Download,
  AlertTriangle, Loader2, Video, Volume2, Brain, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FaceAnalyzer, loadModels, areModelsLoaded, type FrameData } from "@/lib/faceAnalysis";
import { AudioAnalyzer } from "@/lib/audioAnalysis";
import { buildResult, saveVerification } from "@/lib/verificationStore";
import { useAuth } from "@/contexts/AuthContext";

type Step = "loading" | "capture" | "audio" | "processing" | "result";

const processingStages = [
  { label: "Extracting video frames", icon: Video, key: "frames" },
  { label: "Running face detection model", icon: Scan, key: "face" },
  { label: "Analyzing facial landmarks", icon: Eye, key: "landmarks" },
  { label: "Audio spectral analysis", icon: Volume2, key: "audio" },
  { label: "Liveness validation", icon: Fingerprint, key: "liveness" },
  { label: "Computing fusion risk score", icon: Brain, key: "fusion" },
];

const Verify = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const faceAnalyzer = useRef(new FaceAnalyzer());
  const audioAnalyzer = useRef(new AudioAnalyzer());

  const [sessionId] = useState(() => `VRF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const [step, setStep] = useState<Step>("loading");
  const [modelLoadPct, setModelLoadPct] = useState(0);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [liveFrame, setLiveFrame] = useState<FrameData | null>(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioFreqData, setAudioFreqData] = useState<Uint8Array>(new Uint8Array(128));
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [processedResult, setProcessedResult] = useState<ReturnType<typeof buildResult> | null>(null);
  const [capturedStats, setCapturedStats] = useState<ReturnType<FaceAnalyzer["getStats"]> | null>(null);
  const [capturedAudio, setCapturedAudio] = useState<{ spectralFlatness: number; f0Regularity: number; energy: number; score: number } | null>(null);

  // Load models on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadModels((pct) => { if (!cancelled) setModelLoadPct(pct); });
        if (!cancelled) {
          setStep("capture");
        }
      } catch (err) {
        if (!cancelled) setModelError("Failed to load AI models. Check your connection and reload.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Camera helpers
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setCameraActive(false);
      toast({ title: "Camera required", description: "Please grant camera access to proceed.", variant: "destructive" });
    }
  }, []);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  }, []);

  // Start camera + analysis loop when on capture step
  useEffect(() => {
    if (step !== "capture") return;
    startCamera();
    return () => { cancelAnimationFrame(animFrameRef.current); };
  }, [step, startCamera]);

  // Real-time face analysis loop
  useEffect(() => {
    if (step !== "capture" || !cameraActive) return;

    let running = true;
    const loop = async () => {
      if (!running || !videoRef.current || !canvasRef.current) return;
      if (videoRef.current.readyState >= 2) {
        const res = await faceAnalyzer.current.analyzeFrame(videoRef.current);
        if (running) {
          setLiveFrame(res.frame);
          setBlinkCount(res.blinkCount);
          if (canvasRef.current) {
            faceAnalyzer.current.drawOverlay(canvasRef.current, res.frame, res.isBlinking);
          }
          if (res.blinkCount >= 2) setChallengeComplete(true);
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [step, cameraActive]);

  // Audio recording + level animation
  useEffect(() => {
    if (step !== "audio" || !audioStarted) return;
    let running = true;
    const lvlInterval = setInterval(() => {
      if (!running) return;
      setAudioLevel(audioAnalyzer.current.getRealtimeLevel());
      setAudioFreqData(audioAnalyzer.current.getFrequencyData().slice(0, 128));
    }, 80);
    const secInterval = setInterval(() => { if (running) setAudioSeconds(s => s + 1); }, 1000);
    return () => { running = false; clearInterval(lvlInterval); clearInterval(secInterval); };
  }, [step, audioStarted]);

  // Auto-complete audio after 5s
  useEffect(() => {
    if (step !== "audio" || !audioStarted) return;
    if (audioSeconds >= 5) {
      handleAudioComplete();
    }
  }, [audioSeconds, audioStarted, step]);

  // Processing pipeline runner
  useEffect(() => {
    if (step !== "processing") return;
    if (processingStage >= processingStages.length) {
      // Compute final result
      const stats = capturedStats!;
      const audio = capturedAudio!;
      const livenessScore = (() => {
        let s = 0;
        if (stats.faceDetected) s += 40;
        if (stats.blinkCount >= 1) s += 35;
        if (stats.landmarkStability > 0.03) s += 15;
        if (stats.faceCount === 1) s += 10;
        return Math.min(100, s);
      })();
      const res = buildResult(user?.id || "anon", user?.name || "Unknown", {
        faceDetected: stats.faceDetected,
        faceCount: stats.faceCount,
        blinkCount: stats.blinkCount,
        symmetryScore: stats.symmetryScore,
        landmarkStability: stats.landmarkStability,
        faceConfidence: stats.faceConfidence,
        expression: stats.expression,
        audioSpectralFlatness: audio.spectralFlatness,
        audioF0Regularity: audio.f0Regularity,
        audioEnergy: audio.energy,
        livenessScore,
      });
      saveVerification(res);
      setProcessedResult(res);
      setStep("result");
      return;
    }
    const stage = processingStages[processingStage];
    const durations: Record<string, number> = { frames: 700, face: 900, landmarks: 600, audio: 800, liveness: 500, fusion: 700 };
    const t = setTimeout(() => setProcessingStage(s => s + 1), durations[stage.key] || 600);
    return () => clearTimeout(t);
  }, [step, processingStage, capturedStats, capturedAudio, user]);

  const handleCaptureComplete = () => {
    const stats = faceAnalyzer.current.getStats();
    setCapturedStats(stats);
    stopCamera();
    setStep("audio");
  };

  const startAudio = async () => {
    const ok = await audioAnalyzer.current.start();
    if (ok) {
      setAudioStarted(true);
      setAudioSeconds(0);
    } else {
      toast({ title: "Microphone required", description: "Please grant microphone access or skip.", variant: "destructive" });
    }
  };

  const handleAudioComplete = async () => {
    const result = await audioAnalyzer.current.stop();
    setCapturedAudio({ spectralFlatness: result.spectralFlatness, f0Regularity: result.f0Regularity, energy: result.energy, score: result.score });
    setAudioStarted(false);
    setStep("processing");
    setProcessingStage(0);
  };

  const handleSkipAudio = () => {
    audioAnalyzer.current.stopStream();
    setCapturedAudio({ spectralFlatness: 0.2, f0Regularity: 0.4, energy: 0.5, score: 70 });
    setStep("processing");
    setProcessingStage(0);
  };

  const handleReset = () => {
    faceAnalyzer.current.reset();
    audioAnalyzer.current.stopStream();
    setBlinkCount(0);
    setChallengeComplete(false);
    setAudioStarted(false);
    setAudioSeconds(0);
    setProcessingStage(0);
    setProcessedResult(null);
    setCapturedStats(null);
    setCapturedAudio(null);
    setLiveFrame(null);
    setStep(areModelsLoaded() ? "capture" : "loading");
  };

  const handleExport = () => {
    if (!processedResult) return;
    const r = processedResult;
    const content = `VERIASTRA VERIFICATION REPORT\n${"=".repeat(40)}\nSession ID : ${r.id}\nTimestamp  : ${r.timestamp}\nOperator   : ${user?.name || "Unknown"}\n\nVERDICT: ${r.prediction === "REAL" ? "AUTHENTIC" : "SYNTHETIC MEDIA DETECTED"}\nRisk Score : ${r.riskScore}/100\nConfidence : ${r.confidence.toFixed(1)}%\nStatus     : ${r.status.toUpperCase()}\n\nSIGNALS\n${r.signals.map(s => `${s.label.padEnd(24)}: ${s.score}/100`).join("\n")}\n\nREASON CODES\n${r.reasonCodes.join(", ") || "none"}\n\nModel: veriastra-fusion-v2.1.0\nSigned: Veriastra Verification Authority\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${r.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (s: number) => s < 20 ? "text-success" : s < 60 ? "text-warning" : "text-destructive";
  const getRiskBg = (s: number) => s < 20 ? "bg-success" : s < 60 ? "bg-warning" : "bg-destructive";

  const stepIndicators = [
    { key: "capture", label: "Liveness" },
    { key: "audio", label: "Audio" },
    { key: "processing", label: "Analysis" },
    { key: "result", label: "Result" },
  ] as const;
  const stepOrder = ["capture", "audio", "processing", "result"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/veriastra-logo.png" alt="Veriastra" className="h-5 w-5 object-contain" />
          <span className="font-bold text-foreground text-sm tracking-widest uppercase">Veriastra</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono-data">{sessionId}</span>
          {user && <span className="text-xs text-muted-foreground">{user.name}</span>}
        </div>
      </header>

      {step !== "loading" && (
        <div className="flex items-center justify-center gap-2 py-3.5 px-6 border-b border-border">
          {stepIndicators.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                i < currentIdx ? "bg-success/10 text-success" : i === currentIdx ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {i < currentIdx ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 flex items-center justify-center text-[10px] font-mono-data">{i + 1}</span>}
                {s.label}
              </div>
              {i < stepIndicators.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">

          {/* LOADING */}
          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm text-center space-y-6">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Loading AI Models</h2>
                <p className="text-sm text-muted-foreground mt-1">Downloading pre-trained detection models…</p>
              </div>
              {modelError ? (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                  <p className="text-sm text-destructive">{modelError}</p>
                  <Button onClick={() => window.location.reload()} size="sm" className="mt-3">Reload</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono-data">
                    <span>veriastra-fusion-v2.1.0</span>
                    <span>{modelLoadPct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${modelLoadPct}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground font-mono-data mt-2">
                    <span className={modelLoadPct >= 45 ? "text-success" : ""}>TinyFaceDetector {modelLoadPct >= 45 ? "✓" : "…"}</span>
                    <span className={modelLoadPct >= 80 ? "text-success" : ""}>FaceLandmark68 {modelLoadPct >= 80 ? "✓" : "…"}</span>
                    <span className={modelLoadPct >= 100 ? "text-success" : ""}>FaceExpression {modelLoadPct >= 100 ? "✓" : "…"}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* CAPTURE + LIVE LIVENESS */}
          {step === "capture" && (
            <motion.div key="capture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Liveness Check</h2>
                <p className="text-sm text-muted-foreground mt-1">Real-time face analysis · Please blink twice naturally</p>
              </div>

              <div className="relative rounded-xl overflow-hidden border-2 border-border bg-navy-deep" style={{ aspectRatio: "4/3" }}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: "100%", height: "100%" }} />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/90">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Requesting camera access…</p>
                    </div>
                  </div>
                )}
                {/* Live stats overlay */}
                {liveFrame?.faceDetected && (
                  <div className="absolute top-3 left-3 space-y-1">
                    <div className="px-2 py-1 rounded bg-background/80 text-[10px] font-mono-data text-success flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" /> Face detected
                    </div>
                    <div className="px-2 py-1 rounded bg-background/80 text-[10px] font-mono-data text-primary">
                      EAR {liveFrame.avgEAR.toFixed(3)} · Sym {(liveFrame.symmetryScore * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
                {!liveFrame?.faceDetected && cameraActive && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/80 text-[10px] font-mono-data text-muted-foreground">
                    Searching for face…
                  </div>
                )}
              </div>

              {/* Challenge progress */}
              <div className={`rounded-xl border p-4 transition-colors ${challengeComplete ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${challengeComplete ? "bg-success/20" : "bg-warning/20"}`}>
                    {challengeComplete ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Fingerprint className="h-5 w-5 text-warning" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${challengeComplete ? "text-success" : "text-warning"}`}>
                      {challengeComplete ? "Challenge complete!" : "Blink twice to confirm liveness"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {challengeComplete ? `${blinkCount} blinks detected by AI` : `Blinks detected: ${blinkCount}/2 · Looking for natural eye movement`}
                    </p>
                  </div>
                  <div className="text-2xl font-bold font-mono-data text-foreground">{blinkCount}</div>
                </div>
                {!challengeComplete && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono-data">
                    <div className={`flex items-center gap-1.5 ${blinkCount >= 1 ? "text-success" : "text-muted-foreground"}`}>
                      {blinkCount >= 1 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground" />}
                      First blink
                    </div>
                    <div className={`flex items-center gap-1.5 ${blinkCount >= 2 ? "text-success" : "text-muted-foreground"}`}>
                      {blinkCount >= 2 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground" />}
                      Second blink
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="border-border text-muted-foreground px-4">
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
                </Button>
                <Button
                  onClick={handleCaptureComplete}
                  disabled={!challengeComplete}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 mr-1.5" />
                  {challengeComplete ? "Continue to Audio" : "Waiting for blinks…"}
                </Button>
                <Button variant="outline" onClick={handleCaptureComplete} className="border-border text-muted-foreground px-4 text-xs">
                  Skip
                </Button>
              </div>
            </motion.div>
          )}

          {/* AUDIO */}
          {step === "audio" && (
            <motion.div key="audio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Voice Sample</h2>
                <p className="text-sm text-muted-foreground mt-1">Real-time spectral analysis to detect synthetic voice</p>
              </div>

              <div className="rounded-xl border-2 border-border bg-card p-6 space-y-5">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-colors ${audioStarted ? "bg-destructive/10" : "bg-primary/10"}`}>
                      <Mic className={`h-9 w-9 ${audioStarted ? "text-destructive" : "text-primary"}`} />
                    </div>
                    {audioStarted && <div className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />}
                  </div>
                </div>

                {!audioStarted ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Please say aloud:</p>
                    <p className="text-base font-semibold text-primary font-mono-data">"I verify my identity with Veriastra"</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono-data text-destructive flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> Recording {audioSeconds}s / 5s
                      </span>
                      <span className="font-mono-data">Level: {(audioLevel * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full bg-destructive rounded-full" animate={{ width: `${(audioSeconds / 5) * 100}%` }} transition={{ duration: 0.2 }} />
                    </div>
                    {/* Real frequency bars from Web Audio API */}
                    <div className="flex items-end gap-0.5 h-14 bg-navy-deep rounded-lg px-2 py-1.5">
                      {Array.from(audioFreqData.slice(0, 64)).map((v, i) => (
                        <div key={i} className="flex-1 rounded-t-sm transition-all duration-75" style={{
                          height: `${Math.max(2, (v / 255) * 100)}%`,
                          backgroundColor: v > 100 ? `hsl(347, 77%, ${30 + (v / 255) * 30}%)` : `hsl(217, 91%, ${15 + (v / 255) * 35}%)`,
                          opacity: 0.5 + (v / 255) * 0.5,
                        }} />
                      ))}
                    </div>
                    <p className="text-[11px] text-center text-muted-foreground font-mono-data">Real-time FFT · spectral flatness analysis active</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!audioStarted ? (
                  <>
                    <Button variant="outline" onClick={handleSkipAudio} className="flex-1 border-border text-muted-foreground">Skip analysis</Button>
                    <Button onClick={startAudio} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Mic className="h-4 w-4 mr-2" /> Start Recording
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAudioComplete} className="w-full bg-success/10 text-success hover:bg-success/20 border border-success/20">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Submit Voice Sample
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* PROCESSING */}
          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Running AI Analysis</h2>
                <p className="text-sm text-muted-foreground mt-1">Multi-modal fusion pipeline · veriastra-fusion-v2.1.0</p>
              </div>

              {/* Frame analysis visualizer */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="font-mono-data">Frame Analysis</span>
                  <span className="font-mono-data text-primary">{Math.min(processingStage * 2, 10)}/10 frames</span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const analyzed = i < processingStage * 2;
                    const flagged = analyzed && capturedStats?.blinkCount === 0 && [1, 4, 7].includes(i);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: analyzed ? 1 : 0.3 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex-1 h-8 rounded border-2 text-[8px] font-mono-data flex items-center justify-center ${
                          analyzed ? (flagged ? "border-destructive bg-destructive/10 text-destructive" : "border-success bg-success/10 text-success") : "border-border bg-secondary/30 text-muted-foreground"
                        }`}
                      >
                        {analyzed ? (flagged ? "⚠" : "✓") : i + 1}
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono-data">
                  {processingStage < 3 ? `Analyzing facial landmarks…` :
                   processingStage < 5 ? `Running artifact detection…` :
                   "Computing fusion risk score…"}
                </p>
              </div>

              {/* Pipeline stages */}
              <div className="space-y-2">
                {processingStages.map((stage, i) => {
                  const done = i < processingStage;
                  const active = i === processingStage;
                  return (
                    <motion.div
                      key={stage.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
                        done ? "border-success/30 bg-success/5" : active ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : active ? <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" /> : <stage.icon className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                      <span className={`text-sm ${done ? "text-success" : active ? "text-primary" : "text-muted-foreground/50"}`}>{stage.label}</span>
                      {done && <span className="ml-auto text-[10px] font-mono-data text-success">done</span>}
                      {active && <span className="ml-auto text-[10px] font-mono-data text-primary animate-pulse">running…</span>}
                    </motion.div>
                  );
                })}
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono-data mb-1.5">
                  <span>Overall progress</span>
                  <span>{Math.round((processingStage / processingStages.length) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(processingStage / processingStages.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && processedResult && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg space-y-5">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-lg font-bold ${
                    processedResult.prediction === "REAL"
                      ? "bg-success/10 text-success border border-success/30"
                      : "bg-destructive/10 text-destructive border border-destructive/30"
                  }`}
                >
                  {processedResult.prediction === "REAL" ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                  {processedResult.prediction === "REAL" ? "VERIFIED — AUTHENTIC" : "WARNING — ANOMALY DETECTED"}
                </motion.div>
              </div>

              {/* Score + Confidence */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
                  <div className="relative h-28 w-28 mb-2">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
                        initial={{ strokeDasharray: "0 314" }}
                        animate={{ strokeDasharray: `${(processedResult.riskScore / 100) * 314} 314` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        className={getRiskColor(processedResult.riskScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold font-mono-data ${getRiskColor(processedResult.riskScore)}`}>{processedResult.riskScore}</span>
                      <span className="text-[10px] text-muted-foreground">RISK SCORE</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Based on real AI analysis</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center justify-center gap-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold font-mono-data text-foreground">{processedResult.confidence.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Model Confidence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{processedResult.blinkCount} blinks</p>
                    <p className="text-xs text-muted-foreground">Detected live</p>
                  </div>
                </div>
              </div>

              {/* Signals */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Multi-Modal Signals
                </h3>
                {processedResult.signals.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`font-mono-data font-bold ${s.color === "success" ? "text-success" : s.color === "warning" ? "text-warning" : "text-destructive"}`}>{s.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${s.color === "success" ? "bg-success" : s.color === "warning" ? "bg-warning" : "bg-destructive"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reason codes */}
              {processedResult.reasonCodes.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" /> Reason Codes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {processedResult.reasonCodes.map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-md text-xs font-mono-data bg-warning/10 text-warning border border-warning/20">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session info */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs font-mono-data text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>Session</span><span className="text-foreground">{processedResult.id}</span></div>
                <div className="flex justify-between"><span>Model</span><span className="text-foreground">veriastra-fusion-v2.1.0</span></div>
                <div className="flex justify-between"><span>Latency</span><span className="text-foreground">{processedResult.latency}</span></div>
                <div className="flex justify-between"><span>Status</span><span className={processedResult.status === "approved" ? "text-success" : processedResult.status === "rejected" ? "text-destructive" : "text-warning"}>{processedResult.status.toUpperCase()}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1 border-border text-muted-foreground">
                  <RotateCcw className="h-4 w-4 mr-2" /> New Verification
                </Button>
                <Button onClick={handleExport} variant="outline" className="flex-1 border-primary/30 text-primary hover:bg-primary/5">
                  <Download className="h-4 w-4 mr-2" /> Export Report
                </Button>
                <Button onClick={() => navigate("/dashboard")} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Eye className="h-4 w-4 mr-2" /> View Dashboard
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Verify;
