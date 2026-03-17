import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Camera, Mic, Shield, CheckCircle2, XCircle, Eye, Scan,
  AudioLines, Fingerprint, ChevronRight, RotateCcw, Download,
  AlertTriangle, Loader2, Video, Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = "capture" | "liveness" | "audio" | "processing" | "result";

const challenges = [
  "Please blink twice slowly",
  "Turn your head left, then right",
  "Nod your head up and down",
];

const processingStages = [
  { label: "Extracting video frames", icon: Video, duration: 800 },
  { label: "Running face detection", icon: Scan, duration: 600 },
  { label: "Analyzing facial artifacts", icon: Eye, duration: 900 },
  { label: "Audio spectral analysis", icon: Volume2, duration: 700 },
  { label: "Liveness validation", icon: Fingerprint, duration: 500 },
  { label: "Computing fusion risk score", icon: Shield, duration: 600 },
];

const Verify = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>("capture");
  const [sessionId] = useState(() => `VRF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const [challenge] = useState(() => challenges[Math.floor(Math.random() * challenges.length)]);
  const [countdown, setCountdown] = useState(5);
  const [recording, setRecording] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  // Simulated result
  const [result] = useState(() => {
    const isFake = Math.random() > 0.6;
    return {
      prediction: isFake ? "FAKE" : "REAL",
      confidence: isFake ? 87 + Math.random() * 10 : 95 + Math.random() * 4,
      riskScore: isFake ? 72 + Math.floor(Math.random() * 20) : 5 + Math.floor(Math.random() * 15),
      signals: isFake
        ? [
            { label: "Facial Texture Artifacts", score: 89 },
            { label: "Lip Sync Mismatch", score: 84 },
            { label: "Temporal Inconsistency", score: 76 },
            { label: "Audio-Visual Desync", score: 71 },
          ]
        : [
            { label: "Face Match Verified", score: 97 },
            { label: "Liveness Confirmed", score: 99 },
            { label: "Audio Consistent", score: 95 },
            { label: "No Artifacts Detected", score: 98 },
          ],
    };
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (step === "capture" || step === "liveness") startCamera();
    return () => { if (step === "audio" || step === "processing") stopCamera(); };
  }, [step, startCamera, stopCamera]);

  // Capture countdown
  useEffect(() => {
    if (step !== "capture" || !recording) return;
    if (countdown <= 0) { setStep("liveness"); setRecording(false); setCountdown(5); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, recording, countdown]);

  // Processing stages
  useEffect(() => {
    if (step !== "processing") return;
    if (processingStage >= processingStages.length) { setStep("result"); return; }
    const t = setTimeout(() => setProcessingStage(s => s + 1), processingStages[processingStage].duration);
    return () => clearTimeout(t);
  }, [step, processingStage]);

  const getRiskColor = (s: number) => s < 20 ? "text-success" : s < 60 ? "text-warning" : "text-destructive";
  const getRiskBg = (s: number) => s < 20 ? "bg-success" : s < 60 ? "bg-warning" : "bg-destructive";

  const stepIndicators: { key: Step; label: string }[] = [
    { key: "capture", label: "Capture" },
    { key: "liveness", label: "Liveness" },
    { key: "audio", label: "Audio" },
    { key: "processing", label: "Analysis" },
    { key: "result", label: "Result" },
  ];
  const currentIdx = stepIndicators.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <img src="/veriastra-logo.png" alt="Veriastra" className="h-5 w-5 object-contain" />
          <span className="font-bold text-foreground text-sm tracking-widest uppercase">Veriastra</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono-data">{sessionId}</span>
      </header>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 py-4 px-6 border-b border-border">
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* CAPTURE */}
          {step === "capture" && (
            <motion.div key="capture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg space-y-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-foreground">Video Capture</h2>
                <p className="text-sm text-muted-foreground mt-1">Position your face in the frame and hold still</p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border bg-navy-deep mx-auto">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Face overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-48 h-60 rounded-[50%] border-2 ${recording ? "border-success animate-pulse" : "border-primary/60"} transition-colors`} />
                </div>
                {recording && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-mono-data">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground animate-pulse" />
                    REC {countdown}s
                  </div>
                )}
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/80">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera access required</p>
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={() => { setRecording(true); setCountdown(5); }} disabled={recording || !cameraActive} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                <Camera className="h-4 w-4 mr-2" />
                {recording ? `Recording... ${countdown}s` : "Start Recording"}
              </Button>
            </motion.div>
          )}

          {/* LIVENESS */}
          {step === "liveness" && (
            <motion.div key="liveness" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg space-y-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-foreground">Liveness Challenge</h2>
                <p className="text-sm text-muted-foreground mt-1">Complete the challenge to prove you're a real person</p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-warning/50 bg-navy-deep mx-auto">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-warning/10 border border-warning/30">
                    <Fingerprint className="h-5 w-5 text-warning" />
                    <span className="text-sm font-medium text-warning">{challenge}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setStep("capture"); stopCamera(); }} className="flex-1 border-border text-muted-foreground">
                  <RotateCcw className="h-4 w-4 mr-2" /> Retry
                </Button>
                <Button onClick={() => { stopCamera(); setStep("audio"); }} className="flex-1 bg-success/10 text-success hover:bg-success/20 border border-success/20">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Challenge Complete
                </Button>
              </div>
            </motion.div>
          )}

          {/* AUDIO */}
          {step === "audio" && (
            <motion.div key="audio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg space-y-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-foreground">Voice Sample</h2>
                <p className="text-sm text-muted-foreground mt-1">Record a short voice sample for audio verification</p>
              </div>
              <div className="rounded-xl border-2 border-border bg-card p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                </div>
                <p className="text-sm text-foreground mb-2">Please say:</p>
                <p className="text-lg font-medium text-primary font-mono-data">"I verify my identity with Veriastra"</p>
                {/* Fake waveform */}
                <div className="flex items-end justify-center gap-0.5 h-12 mt-6">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary/60 rounded-full"
                      animate={{ height: [4, 8 + Math.random() * 30, 4] }}
                      transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.03 }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("processing")} className="flex-1 border-border text-muted-foreground">
                  Skip
                </Button>
                <Button onClick={() => setStep("processing")} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Mic className="h-4 w-4 mr-2" /> Submit Sample
                </Button>
              </div>
            </motion.div>
          )}

          {/* PROCESSING */}
          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md space-y-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-foreground">Analyzing with Veriastra AI</h2>
                <p className="text-sm text-muted-foreground mt-1">Running multi-modal detection pipeline · veriastra-fusion-v2.1.0</p>
              </div>

              {/* Frame analysis counter */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="font-mono-data">Frame Analysis</span>
                  <span className="font-mono-data text-primary">
                    {Math.min(processingStage * 2, 10)}/10 frames
                  </span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const analyzed = i < processingStage * 2;
                    const flagged = analyzed && [1, 2, 4, 6].includes(i);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: analyzed ? 1 : 0.3, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex-1 h-8 rounded border-2 text-[8px] font-mono-data flex items-center justify-center transition-colors ${
                          analyzed
                            ? flagged
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : "border-success bg-success/10 text-success"
                            : "border-border bg-secondary/30 text-muted-foreground"
                        }`}
                      >
                        {analyzed ? (flagged ? "⚠" : "✓") : i + 1}
                      </motion.div>
                    );
                  })}
                </div>
                {processingStage > 0 && (
                  <motion.p
                    key={processingStage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-muted-foreground font-mono-data"
                  >
                    {processingStage < 3
                      ? `Analyzing frame ${Math.min(processingStage * 2, 10)}/10 — extracting facial landmarks`
                      : processingStage < 5
                      ? `Analyzing frame ${Math.min(processingStage * 2, 10)}/10 — running artifact detection`
                      : "Aggregating signals — computing fusion risk score"}
                  </motion.p>
                )}
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
                      transition={{ delay: i * 0.07 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
                        done ? "border-success/30 bg-success/5" : active ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                      ) : (
                        <stage.icon className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={`text-sm ${done ? "text-success" : active ? "text-primary" : "text-muted-foreground/60"}`}>
                        {stage.label}
                      </span>
                      {done && <span className="ml-auto text-[10px] font-mono-data text-success">done</span>}
                      {active && <span className="ml-auto text-[10px] font-mono-data text-primary animate-pulse">running…</span>}
                    </motion.div>
                  );
                })}
              </div>

              {/* Overall progress */}
              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono-data mb-1.5">
                  <span>Overall progress</span>
                  <span>{Math.round((processingStage / processingStages.length) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${(processingStage / processingStages.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold ${
                    result.prediction === "REAL" ? "bg-success/10 text-success border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"
                  }`}
                >
                  {result.prediction === "REAL" ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                  {result.prediction === "REAL" ? "VERIFIED — AUTHENTIC" : "WARNING — SYNTHETIC DETECTED"}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Risk gauge */}
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center">
                  <div className="relative h-28 w-28 mb-2">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="60" cy="60" r="50"
                        stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
                        initial={{ strokeDasharray: "0 314" }}
                        animate={{ strokeDasharray: `${(result.riskScore / 100) * 314} 314` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={getRiskColor(result.riskScore)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold font-mono-data ${getRiskColor(result.riskScore)}`}>{result.riskScore}</span>
                      <span className="text-[10px] text-muted-foreground">RISK</span>
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono-data text-foreground">{result.confidence.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground mt-1">Confidence</span>
                  <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`h-full rounded-full ${getRiskBg(result.riskScore)}`}
                    />
                  </div>
                </div>
              </div>

              {/* Signals */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4">Detection Signals</h4>
                <div className="space-y-3">
                  {result.signals.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">{s.label}</span>
                          <span className="text-sm font-mono-data text-muted-foreground">{s.score}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score}%` }}
                            transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                            className={`h-full rounded-full ${
                              result.prediction === "REAL" ? "bg-success" : s.score >= 80 ? "bg-destructive" : "bg-warning"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reason codes */}
              {result.prediction === "FAKE" && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Explanation</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Synthetic facial manipulation artifacts detected in periocular region</p>
                    <p>• Temporal inconsistencies between consecutive frames suggest GAN-based generation</p>
                    <p>• Lip movement patterns deviate from expected phoneme alignment</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1 border-border text-muted-foreground">
                  View in Dashboard
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
              </div>
              <Button variant="outline" onClick={() => { setStep("capture"); setProcessingStage(0); }} className="w-full border-border text-muted-foreground">
                <RotateCcw className="h-4 w-4 mr-2" /> New Verification
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Verify;
