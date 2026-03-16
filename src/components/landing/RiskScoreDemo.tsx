import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const RiskScoreDemo = () => {
  const [score, setScore] = useState(0);
  const targetScore = 78;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= targetScore) {
            clearInterval(interval);
            return targetScore;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getColor = (s: number) => {
    if (s < 20) return "text-success";
    if (s < 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono-data uppercase tracking-widest text-primary">Risk Intelligence</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">
            Transparent, explainable decisions
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Score gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-8 card-glow flex flex-col items-center justify-center"
          >
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                <circle
                  cx="60" cy="60" r="50"
                  stroke="currentColor"
                  strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 314} 314`}
                  className={`transition-all duration-100 ${getColor(score)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold font-mono-data ${getColor(score)}`}>{score}</span>
                <span className="text-xs text-muted-foreground">Risk Score</span>
              </div>
            </div>
            <div className="mt-6 flex gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Low (&lt;20)</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> High (&gt;60)</span>
            </div>
          </motion.div>

          {/* Evidence JSON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border bg-card p-6 card-glow overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="ml-2 text-xs text-muted-foreground font-mono-data">verification_result.json</span>
            </div>
            <pre className="text-xs font-mono-data text-muted-foreground leading-relaxed overflow-x-auto">
{`{
  "verification_id": "vid_8f3a..c7e2",
  "risk_score": ${score},
  "reason_codes": [
    "low_liveness",
    "video_artifacts_detected"
  ],
  "video_confidence": 0.02,
  "audio_confidence": 0.87,
  "liveness_score": 0.15,
  "face_similarity": 0.92,
  "decision": "escalate",
  "evidence": [
    {
      "type": "frame",
      "time_ms": 1200,
      "anomaly": "gan_artifacts"
    }
  ]
}`}
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RiskScoreDemo;
