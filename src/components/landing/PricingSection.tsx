import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "CPU-only, single region",
    features: [
      "1,000 verifications/mo",
      "Video detection",
      "Basic risk scoring",
      "REST API access",
      "Community support",
      "7-day data retention",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mo",
    description: "GPU inference, multi-zone",
    features: [
      "50,000 verifications/mo",
      "Multi-modal detection",
      "Advanced fusion & liveness",
      "Web SDK + Mobile SDK",
      "Priority support & SLA",
      "30-day retention + BYOK",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Custom",
    period: "",
    description: "Multi-region, HA, dedicated",
    features: [
      "Unlimited verifications",
      "Dedicated GPU pools",
      "Custom model training",
      "SAML SSO & RBAC",
      "Dedicated success manager",
      "Custom retention & compliance",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-navy-deep/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono-data uppercase tracking-widest text-primary">Pricing</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground">
            Transparent, usage-based pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Scale from prototype to production with predictable costs.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-card glow-border"
                  : "border-border bg-card card-glow"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block text-xs font-mono-data uppercase tracking-widest text-primary mb-4">Most popular</span>
              )}
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground font-mono-data">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.name === "Custom" ? (
                <a href="mailto:sales@veriastra.ai">
                  <Button className="w-full mt-8 bg-secondary text-foreground hover:bg-accent">{plan.cta}</Button>
                </a>
              ) : (
                <Link to="/signup">
                  <Button className={`w-full mt-8 ${plan.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-foreground hover:bg-accent"}`}>{plan.cta}</Button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
