import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

const tests = [
  { name: "FaceSwap Deepfake", result: "Detected", confidence: 98, fake: true },
  { name: "Voice Clone Attack", result: "Detected", confidence: 96, fake: true },
  { name: "Replay Video Attack", result: "Detected", confidence: 94, fake: true },
  { name: "Mask Spoof Attempt", result: "Detected", confidence: 91, fake: true },
  { name: "Synthetic Audio (TTS)", result: "Detected", confidence: 93, fake: true },
  { name: "Printed Photo Attack", result: "Detected", confidence: 89, fake: true },
  { name: "Real Human Verification", result: "Passed", confidence: 99, fake: false },
  { name: "Real Human + Liveness", result: "Passed", confidence: 99, fake: false },
];

const AttackSimulation = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-xl border border-border bg-card p-6">
    <div className="flex items-center gap-2 mb-1">
      <ShieldCheck className="h-4 w-4 text-success" />
      <h3 className="text-sm font-semibold text-foreground">Attack Simulation Results</h3>
    </div>
    <p className="text-xs text-muted-foreground mb-6">Controlled test scenarios — adversarial robustness validation</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Test Case", "Result", "Confidence", "Status"].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((t, i) => (
            <motion.tr
              key={t.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="border-b border-border/50"
            >
              <td className="py-3 px-4 text-foreground font-medium">{t.name}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono-data ${
                  t.fake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                }`}>
                  {t.fake ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  {t.result}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.fake ? "bg-destructive" : "bg-success"}`} style={{ width: `${t.confidence}%` }} />
                  </div>
                  <span className="font-mono-data text-foreground">{t.confidence}%</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`h-2 w-2 rounded-full inline-block ${t.fake ? "bg-destructive" : "bg-success"}`} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default AttackSimulation;
