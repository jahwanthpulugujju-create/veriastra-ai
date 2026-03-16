import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Activity, Target, ShieldCheck, Zap } from "lucide-react";

// --- Mock data ---
const dailyVolume = [
  { date: "Mar 1", total: 980, approved: 840, escalated: 98, rejected: 42 },
  { date: "Mar 2", total: 1050, approved: 890, escalated: 112, rejected: 48 },
  { date: "Mar 3", total: 1120, approved: 960, escalated: 105, rejected: 55 },
  { date: "Mar 4", total: 890, approved: 760, escalated: 90, rejected: 40 },
  { date: "Mar 5", total: 1200, approved: 1040, escalated: 110, rejected: 50 },
  { date: "Mar 6", total: 1340, approved: 1150, escalated: 130, rejected: 60 },
  { date: "Mar 7", total: 1180, approved: 1010, escalated: 118, rejected: 52 },
  { date: "Mar 8", total: 1420, approved: 1230, escalated: 132, rejected: 58 },
  { date: "Mar 9", total: 1380, approved: 1180, escalated: 140, rejected: 60 },
  { date: "Mar 10", total: 1500, approved: 1300, escalated: 138, rejected: 62 },
  { date: "Mar 11", total: 1280, approved: 1100, escalated: 125, rejected: 55 },
  { date: "Mar 12", total: 1450, approved: 1260, escalated: 130, rejected: 60 },
  { date: "Mar 13", total: 1520, approved: 1320, escalated: 142, rejected: 58 },
  { date: "Mar 14", total: 1600, approved: 1390, escalated: 148, rejected: 62 },
];

const accuracyOverTime = [
  { date: "Jan", videoAUC: 96.2, audioAUC: 93.8, fusionAUC: 97.1 },
  { date: "Feb", videoAUC: 96.5, audioAUC: 94.1, fusionAUC: 97.4 },
  { date: "Mar", videoAUC: 96.8, audioAUC: 94.5, fusionAUC: 97.8 },
  { date: "Apr", videoAUC: 97.0, audioAUC: 94.8, fusionAUC: 98.0 },
  { date: "May", videoAUC: 97.2, audioAUC: 95.0, fusionAUC: 98.2 },
  { date: "Jun", videoAUC: 97.1, audioAUC: 95.3, fusionAUC: 98.4 },
  { date: "Jul", videoAUC: 97.4, audioAUC: 95.5, fusionAUC: 98.5 },
  { date: "Aug", videoAUC: 97.6, audioAUC: 95.7, fusionAUC: 98.7 },
  { date: "Sep", videoAUC: 97.5, audioAUC: 95.9, fusionAUC: 98.6 },
  { date: "Oct", videoAUC: 97.8, audioAUC: 96.1, fusionAUC: 98.9 },
  { date: "Nov", videoAUC: 97.9, audioAUC: 96.3, fusionAUC: 99.0 },
  { date: "Dec", videoAUC: 98.1, audioAUC: 96.5, fusionAUC: 99.2 },
];

const latencyData = [
  { date: "Mar 1", p50: 1.2, p95: 1.8, p99: 2.4 },
  { date: "Mar 3", p50: 1.1, p95: 1.7, p99: 2.3 },
  { date: "Mar 5", p50: 1.3, p95: 1.9, p99: 2.6 },
  { date: "Mar 7", p50: 1.1, p95: 1.6, p99: 2.2 },
  { date: "Mar 9", p50: 1.0, p95: 1.5, p99: 2.1 },
  { date: "Mar 11", p50: 1.2, p95: 1.7, p99: 2.3 },
  { date: "Mar 13", p50: 1.1, p95: 1.6, p99: 2.2 },
  { date: "Mar 14", p50: 1.0, p95: 1.5, p99: 2.0 },
];

const attackBreakdown = [
  { name: "Face Swap", value: 342, color: "hsl(347, 77%, 50%)" },
  { name: "Voice Clone", value: 218, color: "hsl(38, 92%, 50%)" },
  { name: "Replay Attack", value: 156, color: "hsl(217, 91%, 60%)" },
  { name: "Printed Photo", value: 89, color: "hsl(160, 60%, 45%)" },
  { name: "Mask", value: 47, color: "hsl(280, 60%, 55%)" },
];

const modelPerformance = [
  { model: "Xception", accuracy: 97.8, f1: 96.2, auc: 98.1, latency: "420ms" },
  { model: "EfficientNet-B4", accuracy: 98.1, f1: 96.8, auc: 98.5, latency: "380ms" },
  { model: "Wav2Vec2 (Audio)", accuracy: 96.5, f1: 94.9, auc: 96.8, latency: "210ms" },
  { model: "ECAPA-TDNN", accuracy: 95.8, f1: 93.7, auc: 96.1, latency: "180ms" },
  { model: "rPPG Liveness", accuracy: 94.2, f1: 92.1, auc: 95.0, latency: "150ms" },
  { model: "Fusion (Ensemble)", accuracy: 99.2, f1: 98.4, auc: 99.5, latency: "1.7s" },
];

const kpiCards = [
  { icon: Target, label: "Detection AUC", value: "99.2%", change: "+0.3%", up: true },
  { icon: ShieldCheck, label: "TPR @ 0.1% FPR", value: "97.8%", change: "+0.5%", up: true },
  { icon: Activity, label: "Avg Latency (p50)", value: "1.0s", change: "-0.2s", up: true },
  { icon: Zap, label: "False Accept Rate", value: "0.01%", change: "-0.002%", up: true },
];

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(217, 33%, 13%)",
    border: "1px solid hsl(217, 33%, 20%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210, 40%, 98%)",
  },
  itemStyle: { color: "hsl(215, 20%, 55%)" },
};

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Model performance, detection accuracy, and operational metrics</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <span className={`flex items-center gap-1 text-xs font-mono-data ${kpi.up ? "text-success" : "text-destructive"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground font-mono-data">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Row 1: Volume + Accuracy */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Verification Volume */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Verification Volume</h3>
            <p className="text-xs text-muted-foreground mb-6">Daily verification sessions by outcome</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyVolume}>
                  <defs>
                    <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradEscalated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="approved" stroke="hsl(160, 60%, 45%)" fill="url(#gradApproved)" strokeWidth={2} />
                  <Area type="monotone" dataKey="escalated" stroke="hsl(38, 92%, 50%)" fill="url(#gradEscalated)" strokeWidth={2} />
                  <Area type="monotone" dataKey="rejected" stroke="hsl(347, 77%, 50%)" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                { label: "Approved", color: "bg-success" },
                { label: "Escalated", color: "bg-warning" },
                { label: "Rejected", color: "bg-destructive" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${l.color}`} />{l.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Detection Accuracy Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Detection Accuracy (ROC-AUC)</h3>
            <p className="text-xs text-muted-foreground mb-6">Monthly model performance trending</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[92, 100]} tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="fusionAUC" name="Fusion" stroke="hsl(217, 91%, 60%)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="videoAUC" name="Video" stroke="hsl(160, 60%, 45%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="audioAUC" name="Audio" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                { label: "Fusion", color: "bg-primary" },
                { label: "Video", color: "bg-success" },
                { label: "Audio", color: "bg-warning" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${l.color}`} />{l.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Latency + Attack Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Latency */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Inference Latency</h3>
            <p className="text-xs text-muted-foreground mb-6">p50 / p95 / p99 latency in seconds</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="p50" name="p50" fill="hsl(217, 91%, 60%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="p95" name="p95" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="p99" name="p99" fill="hsl(347, 77%, 50%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {[
                { label: "p50", color: "bg-primary" },
                { label: "p95", color: "bg-warning" },
                { label: "p99", color: "bg-destructive" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono-data">
                  <span className={`h-2 w-2 rounded-full ${l.color}`} />{l.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Attack Type Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Detected Attack Types</h3>
            <p className="text-xs text-muted-foreground mb-6">Breakdown of blocked synthetic media</p>
            <div className="flex items-center gap-8">
              <div className="h-52 w-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackBreakdown}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {attackBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1">
                {attackBreakdown.map((a) => (
                  <div key={a.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
                      {a.name}
                    </span>
                    <span className="text-sm font-mono-data text-foreground">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Model Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Model Performance Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-6">Per-model accuracy, F1, AUC, and latency on evaluation set</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Model", "Accuracy", "F1 Score", "ROC-AUC", "Latency"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelPerformance.map((m, i) => (
                  <tr key={m.model} className={`border-b border-border/50 ${i === modelPerformance.length - 1 ? "bg-primary/5" : ""}`}>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {m.model}
                      {i === modelPerformance.length - 1 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono-data bg-primary/10 text-primary">PRODUCTION</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-data text-foreground">{m.accuracy}%</td>
                    <td className="py-3 px-4 font-mono-data text-foreground">{m.f1}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(m.auc - 90) * 10}%` }} />
                        </div>
                        <span className="font-mono-data text-foreground">{m.auc}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-data text-muted-foreground">{m.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Explainability metrics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
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
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
