import { motion } from "framer-motion";
import { Upload, ScanFace, Cpu, Scale, UserCheck, FileCheck } from "lucide-react";

const steps = [
  { icon: Upload, label: "Capture", desc: "SDK captures video selfie + audio sample with local pre-checks" },
  { icon: ScanFace, label: "Preprocess", desc: "Face alignment, audio normalization, rPPG extraction" },
  { icon: Cpu, label: "Inference", desc: "Multi-model detection: video, audio, liveness in parallel" },
  { icon: Scale, label: "Fusion & Score", desc: "Meta-classifier produces calibrated risk score 0–100" },
  { icon: UserCheck, label: "Decision", desc: "Auto-approve, soft-verify, or escalate to human review" },
  { icon: FileCheck, label: "Audit Pack", desc: "Evidence timeline, heatmaps, and tamper-evident logs" },
];

const PipelineSection = () => {
  return (
    <section id="solutions" className="py-24 bg-navy-deep/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono-data uppercase tracking-widest text-primary">Verification Pipeline</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">
            From capture to verdict in &lt;2 seconds
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-6 relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-12 w-px h-full bg-border" />
              )}
              <div className="relative z-10 h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="pb-10">
                <div className="flex items-center gap-3">
                  <span className="font-mono-data text-xs text-muted-foreground">0{i + 1}</span>
                  <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
