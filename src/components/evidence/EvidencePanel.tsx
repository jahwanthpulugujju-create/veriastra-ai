import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, AudioLines, Scan, Brain, Clock, AlertTriangle, Download, X, ChevronDown, ChevronUp, Layers, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  verificationId?: string;
}

const frames = [
  { time: "0.4s", frame: 1, flagged: false, score: 0.12, reason: null },
  { time: "0.8s", frame: 2, flagged: true, score: 0.89, reason: "Facial texture" },
  { time: "1.2s", frame: 3, flagged: true, score: 0.94, reason: "Lip sync" },
  { time: "1.6s", frame: 4, flagged: false, score: 0.15, reason: null },
  { time: "2.0s", frame: 5, flagged: true, score: 0.91, reason: "Temporal" },
  { time: "2.4s", frame: 6, flagged: false, score: 0.22, reason: null },
  { time: "2.8s", frame: 7, flagged: true, score: 0.87, reason: "GAN print" },
  { time: "3.2s", frame: 8, flagged: false, score: 0.08, reason: null },
];

const signals = [
  {
    icon: Eye,
    label: "Lip Sync Mismatch",
    score: 92,
    detail: "Mouth movements deviate from expected phoneme patterns by >2.3σ",
    plain: "The mouth movements don't match the sounds being produced — a classic sign of AI-generated facial animation.",
  },
  {
    icon: Scan,
    label: "Facial Texture Artifacts",
    score: 87,
    detail: "GAN fingerprint detected in periocular region with high confidence",
    plain: "Subtle pixel-level patterns around the eyes reveal this face was synthesized by a generative AI model.",
  },
  {
    icon: Eye,
    label: "Eye Blink Anomaly",
    score: 81,
    detail: "Blink frequency and duration inconsistent with natural patterns",
    plain: "The blinking pattern is too regular and brief compared to how real people blink — a common deepfake signature.",
  },
  {
    icon: AudioLines,
    label: "Audio Spectral Inconsistency",
    score: 76,
    detail: "Spectral flatness suggests synthetic vocoder artifacts at 1.5s–2.2s",
    plain: "The voice audio contains digital artifacts typical of AI voice synthesis tools and voice cloning models.",
  },
];

const multiFactor = [
  { label: "Face Authenticity", score: 11, color: "bg-destructive", text: "text-destructive" },
  { label: "Liveness Score", score: 15, color: "bg-destructive", text: "text-destructive" },
  { label: "Behavioral Analysis", score: 34, color: "bg-warning", text: "text-warning" },
  { label: "Audio Signals", score: 24, color: "bg-destructive", text: "text-destructive" },
];

const EvidencePanel = ({ open, onClose, verificationId = "VRF-2846" }: Props) => {
  const [heatmap, setHeatmap] = useState(true);
  const [expandedSignal, setExpandedSignal] = useState<number | null>(0);
  const [selectedFrame, setSelectedFrame] = useState<number | null>(1);

  if (!open) return null;

  const handleExport = () => {
    toast({ title: "Generating Evidence Pack", description: "PDF with frames, heatmaps, and audit trail" });
    setTimeout(() => {
      const hash = Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18);
      const content = `VERIASTRA FORENSIC EVIDENCE PACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verification ID : ${verificationId}
Generated       : ${new Date().toISOString()}
Operator        : admin@veriastra.ai
Session Region  : EU-West-1

VERDICT: SYNTHETIC MEDIA DETECTED
Overall Risk Score : 78 / 100
Confidence         : 93.2%
Classification     : HIGH RISK — DEEPFAKE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MULTI-FACTOR BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Face Authenticity    : 11/100 (CRITICAL)
Liveness Score       : 15/100 (CRITICAL)
Behavioral Analysis  : 34/100 (ELEVATED)
Audio Signals        : 24/100 (CRITICAL)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLAGGED FRAMES (4 of 8 analyzed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frame 2 @ 0.8s — Score: 89% — Facial texture artifacts
Frame 3 @ 1.2s — Score: 94% — Lip sync mismatch
Frame 5 @ 2.0s — Score: 91% — Temporal inconsistency
Frame 7 @ 2.8s — Score: 87% — GAN fingerprint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTION SIGNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lip Sync Mismatch          : 92% confidence
Facial Texture Artifacts   : 87% confidence
Eye Blink Anomaly          : 81% confidence
Audio Spectral Inconsistency: 76% confidence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROVENANCE CHAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Model   : veriastra-fusion-v2.1.0
Evidence Hash : sha256:${hash}
Signed  : Veriastra Verification Authority
`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `evidence-pack-${verificationId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] rounded-xl border border-border bg-card overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Forensic Evidence Analysis</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-destructive/10 text-destructive border border-destructive/20">SYNTHETIC MEDIA</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono-data mt-0.5">{verificationId} · {new Date().toLocaleString()} · veriastra-fusion-v2.1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setHeatmap(h => !h)}
              className={`text-xs border-border h-8 ${heatmap ? "text-primary border-primary/40 bg-primary/5" : "text-muted-foreground"}`}
            >
              <Layers className="h-3 w-3 mr-1" />
              {heatmap ? "Heatmap ON" : "Heatmap OFF"}
            </Button>
            <Button size="sm" onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
              <Download className="h-3 w-3 mr-1" /> Export Pack
            </Button>
            <button onClick={onClose} className="ml-1 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-5 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">

            {/* Left — Frame timeline + audio */}
            <div className="lg:col-span-2 p-5 space-y-5">

              {/* Multi-factor summary */}
              <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5" /> Multi-Factor Risk Breakdown
                </h3>
                {multiFactor.map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className={`font-mono-data font-semibold ${f.text}`}>{f.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.score}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`h-full rounded-full ${f.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Frame timeline */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Frame Timeline · {frames.filter(f => f.flagged).length} of {frames.length} flagged
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {frames.map((f, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedFrame(f.flagged ? i : null)}
                      className={`rounded-lg border-2 overflow-hidden transition-all ${
                        selectedFrame === i ? "border-primary ring-1 ring-primary/30" :
                        f.flagged ? "border-destructive/50 hover:border-destructive" : "border-border opacity-60"
                      }`}
                    >
                      <div className="w-full aspect-[4/3] bg-navy-deep relative">
                        {/* Face outline */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-7 rounded-[50%] border border-muted-foreground/20" />
                        </div>
                        {/* Heatmap overlay */}
                        {f.flagged && heatmap && (
                          <>
                            <div className="absolute top-[20%] left-[15%] w-[40%] h-[25%] rounded-full bg-destructive/50 blur-[3px]" />
                            <div className="absolute top-[48%] left-[20%] w-[60%] h-[12%] rounded-full bg-warning/40 blur-[2px]" />
                          </>
                        )}
                        {f.flagged && (
                          <div className="absolute top-1 right-1">
                            <AlertTriangle className="h-2.5 w-2.5 text-destructive" />
                          </div>
                        )}
                        {/* Frame number */}
                        <div className="absolute bottom-1 left-1 text-[8px] text-muted-foreground font-mono-data">{f.frame}</div>
                      </div>
                      <div className={`px-1 py-1 text-center ${f.flagged ? "bg-destructive/5" : "bg-secondary/30"}`}>
                        <div className="text-[9px] text-muted-foreground font-mono-data">{f.time}</div>
                        <div className={`text-[10px] font-mono-data font-bold ${f.flagged ? "text-destructive" : "text-success"}`}>
                          {(f.score * 100).toFixed(0)}%
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {selectedFrame !== null && frames[selectedFrame].flagged && (
                  <motion.div
                    key={selectedFrame}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 rounded-lg bg-destructive/5 border border-destructive/20 px-3 py-2 text-xs text-destructive"
                  >
                    <span className="font-semibold">Frame {frames[selectedFrame].frame} @ {frames[selectedFrame].time}</span>
                    {" — "}{frames[selectedFrame].reason} artifact detected ({(frames[selectedFrame].score * 100).toFixed(0)}% confidence)
                  </motion.div>
                )}
              </div>

              {/* Audio spectrogram */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AudioLines className="h-3.5 w-3.5" /> Audio Spectrogram
                </h3>
                <div className="rounded-lg border border-border bg-navy-deep p-3">
                  <div className="h-16 flex items-end gap-px">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const h = (Math.sin(i * 0.4) * 0.3 + 0.5) + Math.random() * 0.2;
                      const anomaly = i > 24 && i < 38;
                      return (
                        <div key={i} className="flex-1 rounded-t-sm" style={{
                          height: `${(h * 55 + 10)}%`,
                          backgroundColor: anomaly
                            ? `hsl(347, 77%, ${35 + h * 25}%)`
                            : `hsl(217, 91%, ${15 + h * 35}%)`,
                          opacity: 0.5 + h * 0.5,
                        }} />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] text-muted-foreground font-mono-data">0.0s</span>
                    <span className="text-[9px] text-destructive font-mono-data">⚠ vocoder artifact 1.5–2.2s</span>
                    <span className="text-[9px] text-muted-foreground font-mono-data">3.2s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Signals + provenance */}
            <div className="lg:col-span-3 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Scan className="h-3.5 w-3.5" /> Detection Signals
              </h3>

              <div className="space-y-2">
                {signals.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="rounded-lg border border-border bg-secondary/20 overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
                      onClick={() => setExpandedSignal(expandedSignal === i ? null : i)}
                    >
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${s.score >= 85 ? "bg-destructive/15" : "bg-warning/15"}`}>
                        <s.icon className={`h-4 w-4 ${s.score >= 85 ? "text-destructive" : "text-warning"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-foreground">{s.label}</span>
                          <span className={`text-sm font-mono-data font-bold ${s.score >= 85 ? "text-destructive" : "text-warning"}`}>
                            {s.score}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score}%` }}
                            transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                            className={`h-full rounded-full ${s.score >= 85 ? "bg-destructive" : "bg-warning"}`}
                          />
                        </div>
                      </div>
                      {expandedSignal === i
                        ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      }
                    </button>

                    <AnimatePresence>
                      {expandedSignal === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t border-border/50">
                            <div className="pt-3">
                              <div className="text-[10px] font-mono-data uppercase tracking-wider text-muted-foreground mb-1">Technical detail</div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                            </div>
                            <div className="rounded-md bg-primary/5 border border-primary/15 px-3 py-2">
                              <div className="text-[10px] font-mono-data uppercase tracking-wider text-primary mb-1">Why this matters</div>
                              <p className="text-xs text-foreground leading-relaxed">{s.plain}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Verdict summary */}
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-destructive mb-1">Why was this flagged?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This submission triggered 4 high-confidence detection signals across facial, audio, and temporal domains.
                      The multi-modal fusion model assigned a risk score of <strong className="text-foreground">78/100</strong> with
                      93.2% confidence. All signals independently exceed the HIGH RISK threshold, strongly indicating AI-generated
                      or manipulated media.
                    </p>
                  </div>
                </div>
              </div>

              {/* Provenance */}
              <div className="rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Provenance Chain</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono-data text-muted-foreground">
                  <div><span className="text-muted-foreground/60">Model</span></div>
                  <div className="text-foreground">veriastra-fusion-v2.1.0</div>
                  <div><span className="text-muted-foreground/60">Inference</span></div>
                  <div className="text-foreground">{new Date().toISOString().replace("T", " ").slice(0, 19)}Z</div>
                  <div><span className="text-muted-foreground/60">Region</span></div>
                  <div className="text-foreground">EU-West-1</div>
                  <div><span className="text-muted-foreground/60">Frames</span></div>
                  <div className="text-foreground">8 analyzed · 4 flagged</div>
                  <div><span className="text-muted-foreground/60">Hash</span></div>
                  <div className="text-foreground truncate">sha256:a3f8c1e2...</div>
                  <div><span className="text-muted-foreground/60">Signed by</span></div>
                  <div className="text-foreground">Veriastra Authority</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EvidencePanel;
