import { motion } from "framer-motion";
import { Eye, AudioLines, Scan, Brain, Clock, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  verificationId?: string;
}

const frames = [
  { time: "0.4s", flagged: false, score: 0.12 },
  { time: "0.8s", flagged: true, score: 0.89 },
  { time: "1.2s", flagged: true, score: 0.94 },
  { time: "1.6s", flagged: false, score: 0.15 },
  { time: "2.0s", flagged: true, score: 0.91 },
  { time: "2.4s", flagged: false, score: 0.22 },
  { time: "2.8s", flagged: true, score: 0.87 },
  { time: "3.2s", flagged: false, score: 0.08 },
];

const signals = [
  { icon: Eye, label: "Lip Sync Mismatch", score: 92, detail: "Mouth movements deviate from expected phoneme patterns by >2.3σ" },
  { icon: Scan, label: "Facial Texture Artifacts", score: 87, detail: "GAN fingerprint detected in periocular region with high confidence" },
  { icon: Eye, label: "Eye Blink Anomaly", score: 81, detail: "Blink frequency and duration inconsistent with natural patterns" },
  { icon: AudioLines, label: "Audio Spectral Inconsistency", score: 76, detail: "Spectral flatness suggests synthetic vocoder artifacts" },
];

const EvidencePanel = ({ open, onClose, verificationId = "VRF-2846" }: Props) => {
  if (!open) return null;

  const handleExport = () => {
    toast({ title: "Generating Evidence Pack", description: "PDF with frames, heatmaps, and audit trail" });
    setTimeout(() => {
      const content = `SentinelID Evidence Pack\nVerification: ${verificationId}\nGenerated: ${new Date().toISOString()}\n\nVerdict: SYNTHETIC MEDIA DETECTED\nRisk Score: 78/100\nConfidence: 93.2%\n\nFlagged Frames:\n- Frame @ 0.8s — Score: 0.89 — Facial texture artifacts\n- Frame @ 1.2s — Score: 0.94 — Lip sync mismatch\n- Frame @ 2.0s — Score: 0.91 — Temporal inconsistency\n- Frame @ 2.8s — Score: 0.87 — GAN fingerprint\n\nDetection Signals:\n- Lip Sync Mismatch: 92% confidence\n- Facial Texture Artifacts: 87% confidence\n- Eye Blink Anomaly: 81% confidence\n- Audio Spectral Inconsistency: 76% confidence\n\nModel: sentinelid-fusion-v2.1.0\nHash: sha256:${Math.random().toString(36).slice(2)}\n`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] rounded-xl border border-border bg-card overflow-y-auto m-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Evidence Analysis</h2>
              <p className="text-xs text-muted-foreground font-mono-data">{verificationId} · Synthetic media detected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
              <Download className="h-3 w-3 mr-1" /> Export Pack
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm px-2">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Frame Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Frame Timeline
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frames.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer transition-colors ${
                    f.flagged ? "border-destructive/60" : "border-border"
                  }`}
                >
                  {/* Frame placeholder with heatmap */}
                  <div className="w-24 h-20 bg-navy-deep relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-10 rounded-[50%] border border-muted-foreground/30" />
                    </div>
                    {f.flagged && (
                      <>
                        <div className="absolute top-[25%] left-[20%] w-[30%] h-[20%] rounded-full bg-destructive/40 blur-sm" />
                        <div className="absolute top-[50%] left-[25%] w-[50%] h-[15%] rounded-full bg-warning/30 blur-sm" />
                        <div className="absolute top-1 right-1">
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`px-2 py-1.5 text-center ${f.flagged ? "bg-destructive/5" : "bg-secondary/50"}`}>
                    <div className="text-[10px] text-muted-foreground font-mono-data">{f.time}</div>
                    <div className={`text-[11px] font-mono-data font-semibold ${f.flagged ? "text-destructive" : "text-success"}`}>
                      {(f.score * 100).toFixed(0)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Audio Spectrogram */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AudioLines className="h-4 w-4 text-warning" /> Audio Analysis
            </h3>
            <div className="rounded-lg border border-border bg-navy-deep p-4">
              {/* Fake spectrogram */}
              <div className="h-20 flex items-end gap-px">
                {Array.from({ length: 80 }).map((_, i) => {
                  const h = Math.random();
                  const anomaly = i > 30 && i < 45;
                  return (
                    <div key={i} className="flex-1 rounded-t-sm" style={{
                      height: `${(h * 60 + 10)}%`,
                      backgroundColor: anomaly
                        ? `hsl(347, 77%, ${40 + h * 20}%)`
                        : `hsl(217, 91%, ${20 + h * 40}%)`,
                      opacity: 0.6 + h * 0.4,
                    }} />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground font-mono-data">0s</span>
                <span className="text-[10px] text-destructive font-mono-data">⚠ anomaly detected 1.5s–2.2s</span>
                <span className="text-[10px] text-muted-foreground font-mono-data">3.2s</span>
              </div>
            </div>
          </div>

          {/* Detection Signals */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Scan className="h-4 w-4 text-destructive" /> Detection Signals
            </h3>
            <div className="space-y-3">
              {signals.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <s.icon className={`h-4 w-4 shrink-0 ${s.score >= 85 ? "text-destructive" : "text-warning"}`} />
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                    <span className={`ml-auto text-sm font-mono-data font-bold ${s.score >= 85 ? "text-destructive" : "text-warning"}`}>{s.score}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                      className={`h-full rounded-full ${s.score >= 85 ? "bg-destructive" : "bg-warning"}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{s.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Provenance */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Provenance Chain</h4>
            <div className="space-y-1 text-xs font-mono-data text-muted-foreground">
              <p>Model: sentinelid-fusion-v2.1.0</p>
              <p>Inference: 2026-03-17T{new Date().toISOString().slice(11)}</p>
              <p>Evidence Hash: sha256:{Math.random().toString(36).slice(2, 18)}{Math.random().toString(36).slice(2, 18)}</p>
              <p>Signed by: SentinelID Verification Authority</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EvidencePanel;
