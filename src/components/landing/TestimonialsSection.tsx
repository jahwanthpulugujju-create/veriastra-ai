import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Veriastra cut our fraud-related chargebacks by 94%. The explainable risk scores let our compliance team audit every decision in seconds.",
    name: "Rachel Torres",
    role: "Head of Fraud Prevention",
    company: "NeoBank Europe",
    stars: 5,
  },
  {
    quote: "We integrated the SDK in under an hour. The liveness detection catches replay attacks our previous vendor missed completely.",
    name: "Tomás Herrera",
    role: "CTO",
    company: "VerifyFirst",
    stars: 5,
  },
  {
    quote: "The multi-modal fusion is a game-changer. Voice clone attempts that slipped through other tools get flagged instantly with clear reason codes.",
    name: "Ananya Kapoor",
    role: "VP of Engineering",
    company: "TrustLayer AI",
    stars: 5,
  },
];

const TestimonialsSection = () => (
  <section className="py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono-data uppercase tracking-widest text-primary">Customer Stories</span>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">
          Trusted by security leaders
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 card-glow flex flex-col"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.quote}"</p>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-sm font-semibold text-foreground">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
