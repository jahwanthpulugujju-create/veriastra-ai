import { motion } from "framer-motion";

const logos = [
  "HSBC", "Revolut", "Stripe", "Palantir", "Deloitte", "JPMorgan", "Wise", "Coinbase"
];

const TrustedBySection = () => (
  <section className="py-16 border-t border-border">
    <div className="container">
      <p className="text-center text-xs font-mono-data uppercase tracking-widest text-muted-foreground mb-10">
        Trusted by security teams at 2,400+ companies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {logos.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="text-lg font-semibold text-muted-foreground/40 tracking-wide select-none"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
