import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, ShieldAlert, CheckCircle2, AlertTriangle, Clock, XCircle,
  Activity, Zap, TrendingUp, Eye, Globe, Cpu
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface LiveEvent {
  id: string;
  name: string;
  timestamp: string;
  status: "processing" | "verified" | "flagged" | "rejected";
  riskScore: number;
  type: string;
  region: string;
  latency: string;
}

const names = ["Sarah Chen", "James Wilson", "Aiko Tanaka", "Priya Sharma", "Omar Hassan", "Elena Popov", "David Müller", "Marcus Johnson", "Li Wei", "Anna Kowalski", "Roberto Silva", "Yuki Sato"];
const types = ["KYC Onboarding", "Re-verification", "Access Request", "Document Upload", "Liveness Check"];
const regions = ["US-East", "EU-West", "APAC", "US-West", "EU-Central", "LATAM"];

const randomEvent = (): LiveEvent => {
  const statuses: LiveEvent["status"][] = ["verified", "verified", "verified", "verified", "processing", "flagged", "rejected"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const risk = status === "verified" ? Math.floor(Math.random() * 18) : status === "flagged" ? 55 + Math.floor(Math.random() * 35) : status === "rejected" ? 80 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 45);
  const lat = (1.0 + Math.random() * 1.2).toFixed(1);
  return {
    id: `VRF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    name: names[Math.floor(Math.random() * names.length)],
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    status,
    riskScore: risk,
    type: types[Math.floor(Math.random() * types.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    latency: `${lat}s`,
  };
};

const statusConfig = {
  processing: { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "Processing" },
  verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified" },
  flagged: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Flagged" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

const riskBadge = (s: number) => s < 20 ? "text-success bg-success/10 border-success/20" : s < 60 ? "text-warning bg-warning/10 border-warning/20" : "text-destructive bg-destructive/10 border-destructive/20";

const heatmapData = Array.from({ length: 24 }, (_, h) =>
  Array.from({ length: 7 }, () => Math.floor(
    h >= 8 && h <= 18
      ? 30 + Math.random() * 70
      : Math.random() * 30
  ))
);

const initialAlerts = [
  { time: "2m ago", msg: "Spike in face-swap attempts from EU-West", severity: "critical", count: 7 },
  { time: "8m ago", msg: "Voice-clone pattern — IP cluster 185.x.x.x", severity: "critical", count: 3 },
  { time: "15m ago", msg: "Repeat attacker: 3 attempts in 10 min", severity: "high", count: 3 },
  { time: "22m ago", msg: "Model latency spike: p99 > 3s on GPU-02", severity: "medium", count: 1 },
  { time: "35m ago", msg: "New vector: printed photo + screen replay", severity: "critical", count: 5 },
];

const severityConfig = {
  critical: { color: "text-destructive", bg: "bg-destructive/8 border-destructive/20", dot: "bg-destructive", badge: "CRITICAL" },
  high: { color: "text-warning", bg: "bg-warning/8 border-warning/20", dot: "bg-warning", badge: "HIGH" },
  medium: { color: "text-primary", bg: "bg-primary/8 border-primary/20", dot: "bg-primary", badge: "MED" },
  low: { color: "text-muted-foreground", bg: "bg-secondary/50 border-border", dot: "bg-muted-foreground", badge: "LOW" },
};

const threatLevelData = [
  { label: "Critical", count: 15, color: "bg-destructive", pct: 35 },
  { label: "High", count: 27, color: "bg-warning", pct: 28 },
  { label: "Medium", count: 42, color: "bg-primary", pct: 22 },
  { label: "Low", count: 58, color: "bg-success", pct: 15 },
];

const LiveMonitoring = () => {
  const [events, setEvents] = useState<LiveEvent[]>(() => Array.from({ length: 14 }, randomEvent));
  const [stats, setStats] = useState({ total: 12843, perMin: 8, threats: 42, avgRisk: 14 });
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { hour12: false }));
  const [gpuLoad] = useState([67, 71, 74, 70, 68, 72, 75, 73, 78, 76, 74, 72]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = randomEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
      setStats(prev => ({
        total: prev.total + 1,
        perMin: 7 + Math.floor(Math.random() * 5),
        threats: prev.threats + (newEvent.status === "flagged" || newEvent.status === "rejected" ? 1 : 0),
        avgRisk: 12 + Math.floor(Math.random() * 6),
      }));
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Live Monitoring</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-data border border-success/40 bg-success/10 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono-data">
              <Cpu className="h-3.5 w-3.5" /> GPU-01 {gpuLoad[gpuLoad.length - 1]}%
            </div>
            <span className="text-xs text-muted-foreground font-mono-data">{time}</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: "Total Today", value: stats.total.toLocaleString(), accent: "text-primary", sub: "+12% vs yesterday" },
            { icon: Zap, label: "Req / min", value: stats.perMin.toString(), accent: "text-success", sub: "avg over last 5m" },
            { icon: ShieldAlert, label: "Threats Blocked", value: stats.threats.toString(), accent: "text-destructive", sub: `${((stats.threats / stats.total) * 100).toFixed(1)}% of total` },
            { icon: TrendingUp, label: "Avg Risk Score", value: stats.avgRisk.toString(), accent: "text-warning", sub: "across all regions" },
          ].map((k) => (
            <motion.div key={k.label} className="rounded-xl border border-border bg-card p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <k.icon className={`h-4 w-4 ${k.accent}`} />
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                </div>
              </div>
              <div className={`text-2xl font-bold font-mono-data ${k.accent}`}>{k.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Live feed */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-destructive animate-pulse" />
                <h3 className="text-sm font-semibold text-foreground">Live Verification Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-mono-data">{events.length} events · all regions</span>
              </div>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-[100px_1fr_80px_70px_50px_40px] gap-2 px-5 py-2 border-b border-border/50 text-[10px] text-muted-foreground font-mono-data">
              <span>STATUS</span>
              <span>NAME / ID</span>
              <span>TYPE</span>
              <span>REGION</span>
              <span>LAT</span>
              <span className="text-right">RISK</span>
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {events.map((e, i) => {
                  const cfg = statusConfig[e.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={`${e.id}-${i}`}
                      initial={i === 0 ? { opacity: 0, y: -12, backgroundColor: "hsl(217, 91%, 60%, 0.06)" } : false}
                      animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-[100px_1fr_80px_70px_50px_40px] gap-2 px-5 py-2.5 border-b border-border/40 text-xs items-center"
                    >
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-data w-fit ${cfg.bg} ${cfg.color}`}>
                        <Icon className="h-2.5 w-2.5" />{cfg.label}
                      </span>
                      <div>
                        <div className="text-foreground font-medium text-xs truncate">{e.name}</div>
                        <div className="text-muted-foreground font-mono-data text-[10px]">{e.id} · {e.timestamp}</div>
                      </div>
                      <span className="text-muted-foreground text-[10px] truncate">{e.type}</span>
                      <span className="text-muted-foreground font-mono-data text-[10px]">{e.region}</span>
                      <span className="text-muted-foreground font-mono-data text-[10px]">{e.latency}</span>
                      <span className={`text-right font-mono-data font-bold text-xs px-1.5 py-0.5 rounded border ${riskBadge(e.riskScore)}`}>{e.riskScore}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Alerts + threat breakdown */}
          <div className="space-y-4">
            {/* Threat level breakdown */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" /> Threat Breakdown
              </h3>
              <div className="space-y-2.5">
                {threatLevelData.map((t) => (
                  <div key={t.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{t.label}</span>
                      <span className="font-mono-data text-foreground">{t.count}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.pct}%` }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className={`h-full rounded-full ${t.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk alerts */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold text-foreground">Risk Alerts</h3>
                <span className="ml-auto text-[10px] font-mono-data text-muted-foreground">{initialAlerts.filter(a => a.severity === "critical").length} critical</span>
              </div>
              <div className="divide-y divide-border/40">
                {initialAlerts.map((a, i) => {
                  const s = severityConfig[a.severity as keyof typeof severityConfig];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`px-4 py-3 border-l-2 ${a.severity === "critical" ? "border-l-destructive" : a.severity === "high" ? "border-l-warning" : "border-l-primary"}`}
                    >
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[9px] font-mono-data font-bold px-1.5 py-0.5 rounded border ${s.bg} ${s.color}`}>
                              {s.badge}
                            </span>
                            {a.count > 1 && (
                              <span className="text-[9px] text-muted-foreground font-mono-data">{a.count} events</span>
                            )}
                          </div>
                          <p className="text-xs text-foreground leading-snug">{a.msg}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Verification Volume Heatmap</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono-data">Last 7 days · by hour</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Peak hours 08:00–18:00 UTC · brighter = higher volume</p>
          <div className="flex gap-1.5">
            <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground font-mono-data shrink-0">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} className="h-5 flex items-center w-7">{d}</div>
              ))}
            </div>
            <div className="flex gap-0.5 flex-1 overflow-x-auto">
              {heatmapData.map((col, h) => (
                <div key={h} className="flex flex-col gap-0.5 shrink-0" style={{ minWidth: "calc((100% - 32px) / 24)" }}>
                  {col.map((val, d) => (
                    <div
                      key={d}
                      className="h-5 rounded-sm transition-colors cursor-default"
                      style={{
                        backgroundColor: val < 10 ? "hsl(217, 33%, 13%)" : val < 30 ? "hsl(217, 91%, 60%, 0.12)" : val < 55 ? "hsl(217, 91%, 60%, 0.28)" : val < 75 ? "hsl(217, 91%, 60%, 0.5)" : "hsl(217, 91%, 60%, 0.8)",
                      }}
                      title={`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d]} ${h.toString().padStart(2,"0")}:00 UTC — ${val} verifications`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">Low</span>
              {[0.06, 0.15, 0.28, 0.5, 0.8].map((o, i) => (
                <div key={i} className="h-3 w-4 rounded-sm" style={{ backgroundColor: `hsl(217, 91%, 60%, ${o})` }} />
              ))}
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono-data">Hover for details</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveMonitoring;
