import { motion } from "framer-motion";
import { Brain, Eye, AudioLines, Scan } from "lucide-react";

const signals = [
  { icon: Eye, label: "Lip Sync Mismatch", confidence: 92, color: "text-destructive" },
  { icon: Scan, label: "Facial Texture Artifacts", confidence: 87, color: "text-warning" },
  { icon: Eye, label: "Eye Blink Pattern Anomaly", confidence: 81, color: "text-warning" },
  { icon: AudioLines, label: "Audio Spectral Inconsistency", confidence: 76, color: "text-primary" },
];

const ExplainabilityPanel = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6">
    <div className="flex items-center gap-2 mb-1">
      <Brain className="h-4 w-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">AI Explainability</h3>
    </div>
    <p className="text-xs text-muted-foreground mb-6">Grad-CAM saliency & top detection signals</p>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Heatmap placeholder */}
      <div className="rounded-lg border border-border bg-secondary/50 p-4">
        <p className="text-xs text-muted-foreground mb-3">Grad-CAM Heatmap — Sample Frame</p>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-navy-deep">
          {/* Simulated face silhouette with heatmap overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-28">
              {/* Face outline */}
              <div className="absolute inset-0 rounded-[50%] border-2 border-muted-foreground/30" />
              {/* Heatmap zones */}
              <div className="absolute top-[30%] left-[15%] w-[30%] h-[15%] rounded-full bg-destructive/60 blur-sm" />
              <div className="absolute top-[30%] right-[15%] w-[30%] h-[15%] rounded-full bg-destructive/40 blur-sm" />
              <div className="absolute top-[55%] left-[25%] w-[50%] h-[20%] rounded-full bg-warning/50 blur-sm" />
              <div className="absolute top-[20%] left-[30%] w-[40%] h-[10%] rounded-full bg-warning/30 blur-sm" />
            </div>
          </div>
          {/* Legend */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <div className="flex-1 mx-2 h-1.5 rounded-full bg-gradient-to-r from-primary/30 via-warning to-destructive" />
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">Manipulation detected around eye and mouth regions with high saliency scores</p>
      </div>

      {/* Detection signals */}
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">Top Detection Signals</p>
        {signals.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <s.icon className={`h-4 w-4 ${s.color} shrink-0`} />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground">{s.label}</span>
                <span className={`text-sm font-mono-data font-semibold ${s.color}`}>{s.confidence}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.confidence}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                  className={`h-full rounded-full ${
                    s.confidence >= 90 ? "bg-destructive" : s.confidence >= 80 ? "bg-warning" : "bg-primary"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ExplainabilityPanel;
