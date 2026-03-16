import { motion } from "framer-motion";
import { Eye, AudioLines, Fingerprint, Brain, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Video Deepfake Detection",
    description: "Xception & EfficientNet backbones detect face swaps, re-enactments, and GAN artifacts at the frame level with temporal consistency analysis.",
  },
  {
    icon: AudioLines,
    title: "Voice Clone Detection",
    description: "Wav2Vec2 & ECAPA-TDNN models identify synthetic speech, voice cloning, and TTS artifacts across ASVspoof-trained classifiers.",
  },
  {
    icon: Fingerprint,
    title: "Liveness & Anti-Spoofing",
    description: "rPPG pulse detection, depth-from-motion, challenge-response verification, and multi-frame consistency checks defeat replay attacks.",
  },
  {
    icon: Brain,
    title: "Multi-Modal Fusion",
    description: "Late-fusion ensemble combines video, audio, and liveness signals through a meta-classifier for calibrated risk probabilities.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable Risk Scores",
    description: "Transparent 0–100 risk scores with Grad-CAM heatmaps, SHAP attributions, reason codes, and timestamped evidence artifacts.",
  },
  {
    icon: BarChart3,
    title: "Enterprise Analytics",
    description: "Real-time dashboards tracking detection accuracy, throughput, false accept rates, and model drift with automated alerting.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="platform" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono-data uppercase tracking-widest text-primary">Detection Capabilities</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">
            Multi-modal threat detection
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Six layers of AI defense analyzing video, audio, and biometric signals simultaneously.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all duration-200 card-glow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
