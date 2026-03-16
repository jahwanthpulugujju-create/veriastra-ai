import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, AudioLines, Fingerprint,
  AlertTriangle, CheckCircle2, Clock, XCircle, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const verifications = [
  { id: "VRF-2847", name: "Sarah Chen", time: "12s ago", riskScore: 12, status: "approved", video: 0.95, audio: 0.91, liveness: 0.97 },
  { id: "VRF-2846", name: "Marcus Johnson", time: "34s ago", riskScore: 78, status: "escalated", video: 0.02, audio: 0.87, liveness: 0.15 },
  { id: "VRF-2845", name: "Aiko Tanaka", time: "1m ago", riskScore: 8, status: "approved", video: 0.98, audio: 0.94, liveness: 0.99 },
  { id: "VRF-2844", name: "David Müller", time: "2m ago", riskScore: 45, status: "review", video: 0.72, audio: 0.65, liveness: 0.58 },
  { id: "VRF-2843", name: "Priya Sharma", time: "3m ago", riskScore: 3, status: "approved", video: 0.99, audio: 0.97, liveness: 0.99 },
  { id: "VRF-2842", name: "James Wilson", time: "4m ago", riskScore: 92, status: "rejected", video: 0.01, audio: 0.03, liveness: 0.05 },
  { id: "VRF-2841", name: "Elena Popov", time: "5m ago", riskScore: 31, status: "review", video: 0.82, audio: 0.55, liveness: 0.71 },
  { id: "VRF-2840", name: "Omar Hassan", time: "7m ago", riskScore: 5, status: "approved", video: 0.97, audio: 0.96, liveness: 0.98 },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-success", label: "Approved" },
  escalated: { icon: AlertTriangle, color: "text-destructive", label: "Escalated" },
  review: { icon: Clock, color: "text-warning", label: "In Review" },
  rejected: { icon: XCircle, color: "text-destructive", label: "Rejected" },
};

const getRiskColor = (score: number) => {
  if (score < 20) return "text-success bg-success/10";
  if (score < 60) return "text-warning bg-warning/10";
  return "text-destructive bg-destructive/10";
};

const getRiskBarColor = (score: number) => {
  if (score < 20) return "bg-success";
  if (score < 60) return "bg-warning";
  return "bg-destructive";
};

const Dashboard = () => {
  const [selected, setSelected] = useState<string | null>("VRF-2846");
  const selectedItem = verifications.find(v => v.id === selected);

  return (
    <DashboardLayout>
      <div className="flex-1 flex overflow-hidden">
        {/* Verification list */}
        <div className="w-full lg:w-[55%] flex flex-col overflow-hidden border-r border-border">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-border shrink-0">
            {[
              { label: "Total Today", value: "1,284", change: "+12%" },
              { label: "Approved", value: "1,089", change: "84.8%" },
              { label: "Escalated", value: "142", change: "11.1%" },
              { label: "Avg Latency", value: "1.7s", change: "-0.2s" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-4">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-xl font-bold text-foreground font-mono-data">{s.value}</div>
                <div className="mt-1 text-xs text-success font-mono-data">{s.change}</div>
              </div>
            ))}
          </div>

          {/* List header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold text-foreground">Verification Queue</h2>
            <Button variant="outline" size="sm" className="h-7 text-xs border-border text-muted-foreground hover:text-foreground">
              <Filter className="h-3 w-3 mr-1" /> Filter
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {verifications.map((v, i) => {
              const statusCfg = statusConfig[v.status];
              const StatusIcon = statusCfg.icon;
              return (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(v.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 border-b border-border text-left transition-colors ${
                    selected === v.id ? "bg-primary/5" : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{v.name}</span>
                      <span className="text-xs text-muted-foreground font-mono-data">{v.id}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{v.time}</span>
                      <span className={`inline-flex items-center gap-1 text-xs ${statusCfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-sm font-mono-data font-semibold ${getRiskColor(v.riskScore)}`}>
                    {v.riskScore}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="hidden lg:flex lg:w-[45%] flex-col overflow-y-auto p-6">
          {selectedItem ? (
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono-data">{selectedItem.id} · {selectedItem.time}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-lg font-bold font-mono-data ${getRiskColor(selectedItem.riskScore)}`}>
                  {selectedItem.riskScore}
                </div>
              </div>

              {/* Risk gauge */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h4 className="text-sm font-semibold text-foreground mb-4">Risk Assessment</h4>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative h-32 w-32">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="50" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
                      <circle
                        cx="60" cy="60" r="50"
                        stroke="currentColor"
                        strokeWidth="8" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(selectedItem.riskScore / 100) * 314} 314`}
                        className={selectedItem.riskScore < 20 ? "text-success" : selectedItem.riskScore < 60 ? "text-warning" : "text-destructive"}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold font-mono-data ${selectedItem.riskScore < 20 ? "text-success" : selectedItem.riskScore < 60 ? "text-warning" : "text-destructive"}`}>
                        {selectedItem.riskScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground">RISK</span>
                    </div>
                  </div>
                </div>

                {[
                  { icon: Eye, label: "Video Authenticity", value: selectedItem.video },
                  { icon: AudioLines, label: "Audio Authenticity", value: selectedItem.audio },
                  { icon: Fingerprint, label: "Liveness Score", value: selectedItem.liveness },
                ].map((signal) => (
                  <div key={signal.label} className="flex items-center gap-3 py-3 border-t border-border">
                    <signal.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground">{signal.label}</span>
                        <span className="font-mono-data text-muted-foreground">{(signal.value * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getRiskBarColor(100 - signal.value * 100)}`}
                          style={{ width: `${signal.value * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedItem.riskScore >= 20 && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Reason Codes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.riskScore >= 60 && (
                      <>
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono-data bg-destructive/10 text-destructive">low_liveness</span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono-data bg-destructive/10 text-destructive">video_artifacts</span>
                      </>
                    )}
                    {selectedItem.riskScore >= 20 && selectedItem.riskScore < 60 && (
                      <>
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono-data bg-warning/10 text-warning">audio_mismatch</span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono-data bg-warning/10 text-warning">low_confidence</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1 bg-success/10 text-success hover:bg-success/20 border border-success/20">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                </Button>
                <Button className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a verification to view details
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
