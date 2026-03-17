import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const metrics = [
  { label: "Accuracy", value: 97.4, tip: "Percentage of correct predictions (both real and fake) out of all samples." },
  { label: "Precision", value: 96.9, tip: "Of all samples flagged as fake, the percentage that were actually fake. High precision = low false positives." },
  { label: "Recall", value: 97.1, tip: "Of all actual fake samples, the percentage correctly detected. High recall = low false negatives." },
  { label: "F1 Score", value: 97.0, tip: "Harmonic mean of precision and recall, balancing both metrics equally." },
  { label: "ROC-AUC", value: 99.2, tip: "Area under the ROC curve measuring the model's ability to distinguish real from fake across all thresholds." },
];

const ModelMetrics = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-1">Model Performance Metrics</h3>
    <p className="text-xs text-muted-foreground mb-6">Evaluation on held-out test set (n=10,000)</p>
    <div className="space-y-5">
      {metrics.map((m) => (
        <div key={m.label}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              {m.label}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px] text-xs">{m.tip}</TooltipContent>
              </Tooltip>
            </span>
            <span className="text-sm font-mono-data text-foreground font-semibold">{m.label === "ROC-AUC" ? (m.value / 100).toFixed(3) : `${m.value}%`}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.value}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default ModelMetrics;
