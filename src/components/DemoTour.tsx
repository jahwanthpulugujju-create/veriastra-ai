import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const TOUR_KEY = "veriastra_tour_step";

const steps = [
  {
    title: "Welcome to Veriastra",
    body: "AI-powered deepfake & identity verification platform. 97.4% detection accuracy across video, audio, and liveness checks.",
    route: "/dashboard",
    target: "sidebar-logo",
  },
  {
    title: "Real-time verification queue",
    body: "Every identity verification attempt appears here instantly. Color-coded risk scores: green = safe, amber = review, red = threat detected.",
    route: "/dashboard",
    target: "verification-queue",
  },
  {
    title: "Explainable AI risk scoring",
    body: "Our multi-modal AI breaks down exactly why a verification failed — video authenticity, audio, and liveness scored independently.",
    route: "/dashboard",
    target: "risk-panel",
  },
  {
    title: "Model performance analytics",
    body: "97.4% accuracy on 10,000 held-out test cases. Live Grad-CAM heatmaps show exactly where manipulation was detected.",
    route: "/dashboard/analytics",
    target: null,
  },
  {
    title: "Live SOC monitoring",
    body: "Real-time feed of all verification events globally. Risk alerts fire automatically when attack patterns are detected.",
    route: "/dashboard/live",
    target: null,
  },
  {
    title: "One API, full integration",
    body: "Three lines of code to integrate. REST API + SDKs for JavaScript and Python. Sub-2 second verdict, every time.",
    route: "/dashboard/api",
    target: null,
  },
];

const DemoTour = () => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(TOUR_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (active) {
      localStorage.setItem(TOUR_KEY, String(step));
      const s = steps[step];
      if (s.route !== location.pathname) {
        navigate(s.route);
      }
    }
  }, [step, active, navigate, location.pathname]);

  const next = useCallback(() => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else { setActive(false); setStep(0); localStorage.removeItem(TOUR_KEY); }
  }, [step]);

  const prev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const reset = () => {
    setStep(0);
    setActive(false);
    setShowMenu(false);
    localStorage.removeItem(TOUR_KEY);
  };

  const skip = () => {
    setActive(false);
    localStorage.removeItem(TOUR_KEY);
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { if (active) { setShowMenu(m => !m); } else { setActive(true); setShowMenu(false); } }}
            onContextMenu={(e) => { e.preventDefault(); setShowMenu(m => !m); }}
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors pulse-glow"
            title="Judge Demo Tour"
          >
            <Play className="h-5 w-5 ml-0.5" />
          </motion.button>

          {/* Context menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute bottom-14 right-0 w-44 rounded-lg border border-border bg-card shadow-xl py-1 z-[61]"
              >
                <button onClick={() => { setActive(true); setShowMenu(false); }} className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent text-left flex items-center gap-2">
                  <Play className="h-3 w-3" /> {step > 0 ? "Continue Tour" : "Start Tour"}
                </button>
                <button onClick={reset} className="w-full px-3 py-2 text-xs text-muted-foreground hover:bg-accent text-left flex items-center gap-2">
                  <RotateCcw className="h-3 w-3" /> Reset Tour
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tour overlay */}
      <AnimatePresence>
        {active && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm"
              onClick={skip}
            />

            {/* Tooltip */}
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="fixed z-[80] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-w-[90vw]"
            >
              <div className="rounded-xl border-2 border-primary bg-card shadow-2xl overflow-hidden">
                {/* Step header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-primary/5">
                  <h3 className="text-sm font-bold text-foreground">{current.title}</h3>
                  <span className="text-[10px] font-mono-data text-muted-foreground">{step + 1} of {steps.length}</span>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-1.5 pb-3">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                  <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Skip tour
                  </button>
                  <div className="flex items-center gap-2">
                    {step > 0 && (
                      <button onClick={prev} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent">
                        <ChevronLeft className="h-3 w-3" /> Prev
                      </button>
                    )}
                    <button
                      onClick={next}
                      className="flex items-center gap-1 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors"
                    >
                      {isLast ? "Finish Tour" : "Next"} {!isLast && <ChevronRight className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoTour;
