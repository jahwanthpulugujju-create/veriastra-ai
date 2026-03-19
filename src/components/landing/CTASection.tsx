import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-border bg-card p-12 md:p-20 text-center overflow-hidden glow-border"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
          <h2 className="relative text-3xl md:text-5xl font-bold text-foreground">
            Secure your identity pipeline
          </h2>
          <p className="relative mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Deploy enterprise-grade deepfake detection in minutes. Start with our free trial — no credit card required.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:sales@veriastra.ai">
            <Button variant="outline" size="lg" className="h-12 px-8 border-border text-foreground hover:bg-secondary">
              Contact sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
