import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Radio, ShieldAlert, CheckCircle2, AlertTriangle, Clock, XCircle,
  Activity, Zap, TrendingUp, Eye
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface LiveEvent {
  id: string;
  name: string;
  time: string;
  status: "processing" | "verified" | "flagged" | "rejected";
  riskScore: number;
  type: string;
  region: string;
}

const names = ["Sarah Chen", "James Wilson", "Aiko Tanaka", "Priya Sharma", "Omar Hassan", "Elena Popov", "David Müller", "Marcus Johnson", "Li Wei", "Anna Kowalski", "Roberto Silva", "Yuki Sato"];
const types = ["KYC Onboarding", "Re-verification", "Access Request", "Document Upload", "Liveness Check"];
const regions = ["US-East", "EU-West", "APAC", "US-West", "EU-Central", "LATAM"];

const randomEvent = (): LiveEvent => {
  const statuses: LiveEvent["status"][] = ["verified", "verified", "verified", "verified", "processing", "flagged", "rejected"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const risk = status === "verified" ? Math.floor(Math.random() * 20) : status === "flagged" ? 50 + Math.floor(Math.random() * 40) : status === "rejected" ? 80 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 50);
  return {
    id: `VRF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    name: names[Math.floor(Math.random() * names.length)],
    time: "just now",
    status,
    riskScore: risk,
    type: types[Math.floor(Math.random() * types.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
  };
};

const statusConfig = {
  processing: { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "Processing" },
  verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified" },
  flagged: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Flagged" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

const riskColor = (s: number) => s < 20 ? "text-success bg-success/10" : s < 60 ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";

// Generate activity heatmap data
const heatmapData = Array.from({ length: 24 }, (_, h) =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
);

const alerts = [
  { time: "2m ago", msg: "Spike in face-swap attempts from EU-West", severity: "high" },
  { time: "8m ago", msg: "Unusual voice-clone pattern detected — IP 192.168.x.x", severity: "high" },
  { time: "15m ago", msg: "Repeat attacker flagged: 3 attempts in 10 min", severity: "medium" },
  { time: "22m ago", msg: "Model latency spike: p99 > 3s on GPU-02", severity: "low" },
  { time: "35m ago", msg: "New attack vector: printed photo + screen replay", severity: "high" },
];

const LiveMonitoring = () => {
  const [events, setEvents] = useState<LiveEvent[]>(() => Array.from({ length: 12 }, randomEvent));
  const [stats, setStats] = useState({ total: 12843, perMin: 8, threats: 42, avgRisk: 14 });
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate live events
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
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Live Monitoring</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-data border border-success/50 bg-success/10 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono-data">{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Live KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: "Total Today", value: stats.total.toLocaleString(), accent: "text-primary" },
            { icon: Zap, label: "Req/min", value: stats.perMin.toString(), accent: "text-success" },
            { icon: ShieldAlert, label: "Threats Blocked", value: stats.threats.toString(), accent: "text-destructive" },
            { icon: TrendingUp, label: "Avg Risk Score", value: stats.avgRisk.toString(), accent: "text-warning" },
          ].map((k) => (
            <motion.div key={k.label} className="rounded-xl border border-border bg-card p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <k.icon className={`h-4 w-4 ${k.accent}`} />
                <span className="text-xs text-muted-foreground">{k.label}</span>
              </div>
              <div className={`text-2xl font-bold font-mono-data ${k.accent}`}>{k.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-destructive animate-pulse" />
                <h3 className="text-sm font-semibold text-foreground">Live Verification Feed</h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono-data">{events.length} events</span>
            </div>
            <div ref={feedRef} className="max-h-[420px] overflow-y-auto">
              {events.map((e, i) => {
                const cfg = statusConfig[e.status];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={`${e.id}-${i}`}
                    initial={i === 0 ? { opacity: 0, x: -20, backgroundColor: "hsl(217, 91%, 60%, 0.05)" } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 px-5 py-3 border-b border-border/50 text-sm"
                  >
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-data ${cfg.bg} ${cfg.color}`}>
                      <Icon className="h-3 w-3 inline mr-0.5" />{cfg.label}
                    </span>
                    <span className="text-foreground font-medium truncate min-w-0">{e.name}</span>
                    <span className="text-muted-foreground font-mono-data text-xs">{e.id}</span>
                    <span className="text-muted-foreground text-xs hidden sm:block">{e.type}</span>
                    <span className="text-muted-foreground text-xs hidden md:block">{e.region}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-xs font-mono-data font-semibold ${riskColor(e.riskScore)}`}>{e.riskScore}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <h3 className="text-sm font-semibold text-foreground">Risk Alerts</h3>
            </div>
            <div className="divide-y divide-border/50">
              {alerts.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="px-5 py-3">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${a.severity === "high" ? "bg-destructive" : a.severity === "medium" ? "bg-warning" : "bg-primary"}`} />
                    <div>
                      <p className="text-sm text-foreground">{a.msg}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Activity Heatmap</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Verification volume by hour × day of week</p>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground font-mono-data">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} className="h-5 flex items-center">{d}</div>
              ))}
            </div>
            <div className="flex gap-0.5 flex-1">
              {heatmapData.map((col, h) => (
                <div key={h} className="flex flex-col gap-0.5 flex-1">
                  {col.map((val, d) => (
                    <div
                      key={d}
                      className="h-5 rounded-sm transition-colors"
                      style={{
                        backgroundColor: val < 20 ? "hsl(217, 33%, 15%)" : val < 40 ? "hsl(217, 91%, 60%, 0.15)" : val < 60 ? "hsl(217, 91%, 60%, 0.3)" : val < 80 ? "hsl(217, 91%, 60%, 0.5)" : "hsl(217, 91%, 60%, 0.8)",
                      }}
                      title={`${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d]} ${h}:00 — ${val} verifications`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[10px] text-muted-foreground">Less</span>
            {[0.05, 0.15, 0.3, 0.5, 0.8].map((o, i) => (
              <div key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `hsl(217, 91%, 60%, ${o})` }} />
            ))}
            <span className="text-[10px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveMonitoring;
