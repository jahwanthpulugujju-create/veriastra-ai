import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, AlertTriangle, Eye, AudioLines, Fingerprint, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "<1.8s", label: "Inference Latency" },
  { value: "50M+", label: "Verifications Processed" },
  { value: "0.01%", label: "False Accept Rate" },
];

const demoSignals = [
  { icon: Eye, label: "Video Authenticity", value: 2, color: "bg-destructive", text: "text-destructive" },
  { icon: AudioLines, label: "Audio Authenticity", value: 87, color: "bg-destructive", text: "text-destructive" },
  { icon: Fingerprint, label: "Liveness Score", value: 15, color: "bg-destructive", text: "text-destructive" },
  { icon: Brain, label: "Behavioral Signals", value: 32, color: "bg-warning", text: "text-warning" },
];

const recentActivity = [
  { id: "VRF-8A3K", status: "approved", risk: 7, name: "Sarah Chen", time: "2s ago" },
  { id: "VRF-2X9M", status: "flagged", risk: 81, name: "Unknown", time: "5s ago" },
  { id: "VRF-7P2Z", status: "approved", risk: 4, name: "Aiko T.", time: "9s ago" },
];

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground font-mono-data tracking-wide uppercase">
                Identity Verification &amp; Deepfake Defense Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              Detect deepfakes,
              <br />
              <span className="text-gradient-brand">Verify identity</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Real-time identity verification powered by multimodal AI. Detect deepfakes, validate liveness,
              and analyze behavioral signals with explainable risk scoring.
            </p>

            <p className="mt-3 text-sm font-medium tracking-widest text-primary/70 uppercase font-mono-data">
              Trust, Verified in Real Time.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border text-foreground hover:bg-secondary">
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-lg bg-secondary/40 border border-border">
                  <div className="text-2xl font-bold text-foreground font-mono-data">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — live product UI demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Main verification result card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden glow-border">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-xs font-mono-data text-muted-foreground">VRF-2846 · Marcus Johnson</span>
                </div>
                <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                  HIGH RISK · 78/100
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Verdict banner */}
                <div className="flex items-center gap-3 rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-destructive">Synthetic Media Detected</div>
                    <div className="text-xs text-muted-foreground mt-0.5">4 detection signals exceeded threshold · 93.2% confidence</div>
                  </div>
                </div>

                {/* Signal bars */}
                <div className="space-y-3">
                  {demoSignals.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <s.icon className={`h-3.5 w-3.5 shrink-0 ${s.text}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className={`font-mono-data font-semibold ${s.text}`}>{s.value}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.value}%` }}
                            transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
                            className={`h-full rounded-full ${s.color}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reason codes */}
                <div className="flex flex-wrap gap-1.5">
                  {["low_liveness", "video_artifacts", "lip_sync_mismatch"].map(code => (
                    <span key={code} className="px-2 py-0.5 rounded text-[10px] font-mono-data bg-destructive/8 text-destructive border border-destructive/15">
                      {code}
                    </span>
                  ))}
                </div>

                {/* Model info */}
                <div className="text-[10px] text-muted-foreground/60 font-mono-data border-t border-border pt-3 flex items-center justify-between">
                  <span>veriastra-fusion-v2.1.0</span>
                  <span>EU-West-1 · 1.4s inference</span>
                </div>
              </div>
            </div>

            {/* Live feed mini-card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-3 rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-mono-data text-muted-foreground">Live Verification Feed</span>
              </div>
              <div className="divide-y divide-border/50">
                {recentActivity.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-2 text-xs">
                    {a.status === "approved"
                      ? <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                      : <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
                    }
                    <span className="text-foreground font-medium">{a.name}</span>
                    <span className="text-muted-foreground font-mono-data">{a.id}</span>
                    <span className="ml-auto text-muted-foreground">{a.time}</span>
                    <span className={`font-mono-data font-bold ${a.risk < 20 ? "text-success" : "text-destructive"}`}>{a.risk}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
