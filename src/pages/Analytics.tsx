import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICards from "@/components/analytics/KPICards";
import AccuracyTrends from "@/components/analytics/AccuracyTrends";
import VerificationVolume from "@/components/analytics/VerificationVolume";
import ModelMetrics from "@/components/analytics/ModelMetrics";
import AttackDistribution from "@/components/analytics/AttackDistribution";
import ExplainabilityPanel from "@/components/analytics/ExplainabilityPanel";
import AttackSimulation from "@/components/analytics/AttackSimulation";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { toast } from "@/hooks/use-toast";
import { generateAnalyticsReport } from "@/lib/generateReport";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [isLive, setIsLive] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    toast({ title: "Dashboard refreshed", description: "All metrics updated to latest data." });
  }, []);

  const handleExport = useCallback(() => {
    toast({ title: "Generating Security Report", description: "Your PDF report will download shortly." });
    setTimeout(() => {
      generateAnalyticsReport();
      toast({ title: "Report downloaded", description: "Analytics PDF saved." });
    }, 500);
  }, []);

  // Live refresh simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <DashboardLayout>
      <div key={refreshKey} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Model Performance</h1>
            <p className="text-sm text-muted-foreground mt-1">Detection accuracy, robustness, and explainability under controlled test scenarios</p>
          </div>
        </div>

        <AnalyticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isLive={isLive}
          onToggleLive={() => setIsLive((l) => !l)}
        />

        <KPICards />

        <div className="grid lg:grid-cols-2 gap-6">
          <AccuracyTrends />
          <VerificationVolume />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ModelMetrics />
          <AttackDistribution />
        </div>

        <ExplainabilityPanel />
        <AttackSimulation />

        {/* Bottom summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Decisions with Attribution", value: "99.4%", sub: "Grad-CAM + SHAP coverage" },
            { label: "Reviewer Satisfaction", value: "4.7/5", sub: "Based on 2,840 reviews" },
            { label: "Evidence Pack Gen", value: "< 500ms", sub: "EAP auto-generation time" },
            { label: "Robustness (Adversarial)", value: "96.1%", sub: "AUC under perturbation" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5">
              <div className="text-xl font-bold text-foreground font-mono-data">{m.value}</div>
              <div className="text-sm text-foreground mt-1">{m.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
