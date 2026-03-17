import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, AudioLines, Fingerprint, Brain,
  AlertTriangle, CheckCircle2, Clock, XCircle, Filter, ShieldAlert, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EvidencePanel from "@/components/evidence/EvidencePanel";

const verifications = [
  { id: "VRF-2847", name: "Sarah Chen", time: "12s ago", region: "US-East", type: "KYC Onboarding", riskScore: 12, status: "approved", video: 0.95, audio: 0.91, liveness: 0.97, behavioral: 0.94 },
  { id: "VRF-2846", name: "Marcus Johnson", time: "34s ago", region: "EU-West", type: "Re-verification", riskScore: 78, status: "escalated", video: 0.02, audio: 0.87, liveness: 0.15, behavioral: 0.32 },
  { id: "VRF-2845", name: "Aiko Tanaka", time: "1m ago", region: "APAC", type: "Access Request", riskScore: 8, status: "approved", video: 0.98, audio: 0.94, liveness: 0.99, behavioral: 0.97 },
  { id: "VRF-2844", name: "David Müller", time: "2m ago", region: "EU-Central", type: "Liveness Check", riskScore: 45, status: "review", video: 0.72, audio: 0.65, liveness: 0.58, behavioral: 0.61 },
  { id: "VRF-2843", name: "Priya Sharma", time: "3m ago", region: "APAC", type: "KYC Onboarding", riskScore: 3, status: "approved", video: 0.99, audio: 0.97, liveness: 0.99, behavioral: 0.99 },
  { id: "VRF-2842", name: "James Wilson", time: "4m ago", region: "US-West", type: "Document Upload", riskScore: 92, status: "rejected", video: 0.01, audio: 0.03, liveness: 0.05, behavioral: 0.08 },
  { id: "VRF-2841", name: "Elena Popov", time: "5m ago", region: "EU-West", type: "Re-verification", riskScore: 31, status: "review", video: 0.82, audio: 0.55, liveness: 0.71, behavioral: 0.68 },
  { id: "VRF-2840", name: "Omar Hassan", time: "7m ago", region: "LATAM", type: "KYC Onboarding", riskScore: 5, status: "approved", video: 0.97, audio: 0.96, liveness: 0.98, behavioral: 0.96 },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Approved" },
  escalated: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Escalated" },
  review: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "In Review" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

const reasonCodes: Record<string, { code: string; color: string; label: string }[]> = {
  escalated: [
    { code: "low_liveness", color: "text-destructive bg-destructive/10", label: "Low liveness — face movement inconsistent with a live person" },
    { code: "video_artifacts", color: "text-destructive bg-destructive/10", label: "Video artifacts — GAN fingerprint detected in facial region" },
    { code: "lip_sync_mismatch", color: "text-destructive bg-destructive/10", label: "Lip sync mismatch — mouth movements don't align with audio" },
  ],
  review: [
    { code: "audio_mismatch", color: "text-warning bg-warning/10", label: "Audio mismatch — slight spectral deviation from reference" },
    { code: "low_confidence", color: "text-warning bg-warning/10", label: "Low confidence — model uncertainty above threshold" },
  ],
  rejected: [
    { code: "synthetic_media", color: "text-destructive bg-destructive/10", label: "Synthetic media — all signals confirm AI generation" },
    { code: "replay_attack", color: "text-destructive bg-destructive/10", label: "Replay attack — static image or screen replay detected" },
  ],
};

const getRiskColor = (score: number) => {
  if (score < 20) return "text-success bg-success/10 border border-success/20";
  if (score < 60) return "text-warning bg-warning/10 border border-warning/20";
  return "text-destructive bg-destructive/10 border border-destructive/20";
};

const getRiskBarColor = (score: number) => {
  if (score < 20) return "bg-success";
  if (score < 60) return "bg-warning";
  return "bg-destructive";
};

const getRiskLabel = (score: number) => {
  if (score < 20) return "LOW";
  if (score < 60) return "MEDIUM";
  return "HIGH";
};

const signals = [
  { icon: Eye, label: "Video Authenticity", key: "video" as const },
  { icon: AudioLines, label: "Audio Authenticity", key: "audio" as const },
  { icon: Fingerprint, label: "Liveness Score", key: "liveness" as const },
  { icon: Brain, label: "Behavioral Signals", key: "behavioral" as const },
];

const Dashboard = () => {
  const [selected, setSelected] = useState<string | null>("VRF-2846");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const selectedItem = verifications.find(v => v.id === selected);

  return (
    <DashboardLayout>
      <div className="flex-1 flex overflow-hidden">
        {/* Verification list */}
        <div className="w-full lg:w-[55%] flex flex-col overflow-hidden border-r border-border">
          {/* KPI bar */}
          <div className="grid grid-cols-4 gap-3 p-5 border-b border-border shrink-0">
            {[
              { label: "Total Today", value: "1,284", change: "+12%", up: true },
              { label: "Approved", value: "1,089", change: "84.8%", up: true },
              { label: "Escalated", value: "142", change: "11.1%", up: false },
              { label: "Avg Latency", value: "1.7s", change: "-0.2s", up: true },
            ].map((s) => (
              <div key={s.label} className="bg-secondary/50 rounded-lg border border-border p-3">
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
                <div className="mt-0.5 text-lg font-bold text-foreground font-mono-data">{s.value}</div>
                <div className={`mt-0.5 text-[10px] font-mono-data flex items-center gap-0.5 ${s.up ? "text-success" : "text-destructive"}`}>
                  <TrendingUp className="h-2.5 w-2.5" />
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Queue header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">Verification Queue</h2>
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-mono-data">live</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs border-border text-muted-foreground hover:text-foreground">
              <Filter className="h-3 w-3 mr-1" /> Filter
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {verifications.map((v, i) => {
              const statusCfg = statusConfig[v.status];
              const StatusIcon = statusCfg.icon;
              return (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(v.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 border-b border-border text-left transition-colors ${
                    selected === v.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-accent/40"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{v.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono-data">{v.id}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusCfg.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{v.type}</span>
                      <span className="text-[10px] text-muted-foreground font-mono-data">{v.region}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`px-2 py-0.5 rounded text-xs font-mono-data font-bold ${getRiskColor(v.riskScore)}`}>
                      {v.riskScore}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{v.time}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="hidden lg:flex lg:w-[45%] flex-col overflow-y-auto p-5 space-y-5">
          {selectedItem ? (
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedItem.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono-data mt-0.5">
                    {selectedItem.id} · {selectedItem.region} · {selectedItem.type} · {selectedItem.time}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1.5 rounded-lg text-2xl font-bold font-mono-data ${getRiskColor(selectedItem.riskScore)}`}>
                    {selectedItem.riskScore}
                  </div>
                  <div className={`text-[10px] font-mono-data font-bold mt-0.5 ${
                    selectedItem.riskScore < 20 ? "text-success" : selectedItem.riskScore < 60 ? "text-warning" : "text-destructive"
                  }`}>{getRiskLabel(selectedItem.riskScore)} RISK</div>
                </div>
              </div>

              {/* Risk gauge + signals */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground">Risk Assessment</h4>
                  <span className="text-xs text-muted-foreground font-mono-data">4 signals · 93.2% confidence</span>
                </div>
                <div className="flex items-center justify-center mb-5">
                  <div className="relative h-28 w-28">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="60" cy="60" r="50"
                        stroke="currentColor"
                        strokeWidth="8" fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 314" }}
                        animate={{ strokeDasharray: `${(selectedItem.riskScore / 100) * 314} 314` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={selectedItem.riskScore < 20 ? "text-success" : selectedItem.riskScore < 60 ? "text-warning" : "text-destructive"}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold font-mono-data ${selectedItem.riskScore < 20 ? "text-success" : selectedItem.riskScore < 60 ? "text-warning" : "text-destructive"}`}>
                        {selectedItem.riskScore}
                      </span>
                      <span className="text-[9px] text-muted-foreground tracking-widest">RISK</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {signals.map((signal) => {
                    const val = selectedItem[signal.key];
                    const riskVal = 100 - val * 100;
                    return (
                      <div key={signal.label} className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${riskVal > 60 ? "bg-destructive/10" : riskVal > 30 ? "bg-warning/10" : "bg-success/10"}`}>
                          <signal.icon className={`h-3.5 w-3.5 ${riskVal > 60 ? "text-destructive" : riskVal > 30 ? "text-warning" : "text-success"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground">{signal.label}</span>
                            <span className="font-mono-data text-muted-foreground">{(val * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${val * 100}%` }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className={`h-full rounded-full ${getRiskBarColor(riskVal)}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reason codes with plain-language explanation */}
              {reasonCodes[selectedItem.status] && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-warning" /> Reason Codes
                  </h4>
                  <div className="space-y-2">
                    {reasonCodes[selectedItem.status].map((r) => (
                      <div key={r.code} className={`rounded-md px-3 py-2.5 ${r.color.split(" ")[1]}`}>
                        <div className={`text-[10px] font-mono-data font-bold mb-0.5 ${r.color.split(" ")[0]}`}>{r.code}</div>
                        <div className="text-xs text-muted-foreground">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-success/10 text-success hover:bg-success/20 border border-success/20 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                </Button>
                <Button className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 text-sm">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </div>

              {selectedItem.riskScore >= 20 && (
                <Button
                  variant="outline"
                  onClick={() => setEvidenceOpen(true)}
                  className="w-full border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Brain className="h-4 w-4 mr-2" /> Open Forensic Evidence Panel
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a verification to view details
            </div>
          )}
        </div>
      </div>

      <EvidencePanel open={evidenceOpen} onClose={() => setEvidenceOpen(false)} verificationId={selected || undefined} />
    </DashboardLayout>
  );
};

export default Dashboard;
