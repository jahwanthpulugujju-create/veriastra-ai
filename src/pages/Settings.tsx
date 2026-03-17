import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Database, Bell, Users, Key, Clock, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [riskThreshold, setRiskThreshold] = useState(60);
  const [autoApprove, setAutoApprove] = useState(20);
  const [retentionDays, setRetentionDays] = useState(30);
  const [ephemeral, setEphemeral] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your configuration has been updated." });
  };

  const sections = [
    {
      icon: Shield,
      title: "Detection Thresholds",
      description: "Configure risk scoring and auto-decision boundaries",
      content: (
        <div className="space-y-5">
          <div>
            <label className="text-sm text-foreground mb-2 block">Escalation Threshold (risk ≥)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={20} max={90} value={riskThreshold} onChange={(e) => setRiskThreshold(+e.target.value)} className="flex-1 accent-primary" />
              <span className="text-sm font-mono-data text-foreground w-12 text-right">{riskThreshold}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sessions scoring ≥ {riskThreshold} are escalated for manual review</p>
          </div>
          <div>
            <label className="text-sm text-foreground mb-2 block">Auto-Approve Threshold (risk ≤)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={5} max={50} value={autoApprove} onChange={(e) => setAutoApprove(+e.target.value)} className="flex-1 accent-success" />
              <span className="text-sm font-mono-data text-foreground w-12 text-right">{autoApprove}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sessions scoring ≤ {autoApprove} are auto-approved without review</p>
          </div>
        </div>
      ),
    },
    {
      icon: Database,
      title: "Data Retention & Privacy",
      description: "Control how verification data is stored and retained",
      content: (
        <div className="space-y-5">
          <div>
            <label className="text-sm text-foreground mb-2 block">Retention Period (days)</label>
            <div className="flex items-center gap-3">
              <Input type="number" min={1} max={365} value={retentionDays} onChange={(e) => setRetentionDays(+e.target.value)} className="w-24 bg-secondary border-border text-foreground" />
              <p className="text-xs text-muted-foreground">Raw media and artifacts are deleted after {retentionDays} days</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Ephemeral Processing Mode</p>
              <p className="text-xs text-muted-foreground">Process media in memory only — never persist raw frames</p>
            </div>
            <button onClick={() => setEphemeral(!ephemeral)} className={`relative w-11 h-6 rounded-full transition-colors ${ephemeral ? "bg-success" : "bg-secondary"}`}>
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${ephemeral ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notifications & Webhooks",
      description: "Configure alerting for escalated verifications",
      content: (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive alerts for high-risk escalations</p>
            </div>
            <button onClick={() => setEmailAlerts(!emailAlerts)} className={`relative w-11 h-6 rounded-full transition-colors ${emailAlerts ? "bg-primary" : "bg-secondary"}`}>
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${emailAlerts ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div>
            <label className="text-sm text-foreground mb-2 block">Webhook URL</label>
            <Input placeholder="https://your-service.com/webhook" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">POST verification results to this endpoint in real-time</p>
          </div>
        </div>
      ),
    },
    {
      icon: Users,
      title: "Access Control",
      description: "Manage team roles and permissions (RBAC)",
      content: (
        <div className="space-y-3">
          {[
            { name: "Admin", email: "admin@sentinelid.ai", role: "Owner" },
            { name: "Sarah Chen", email: "sarah@company.com", role: "Reviewer" },
            { name: "Marcus Johnson", email: "marcus@company.com", role: "Analyst" },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <p className="text-sm text-foreground">{u.name}</p>
                <p className="text-xs text-muted-foreground font-mono-data">{u.email}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-xs font-mono-data bg-primary/10 text-primary">{u.role}</span>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2 text-xs border-border text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> Invite Team Member
          </Button>
        </div>
      ),
    },
    {
      icon: Key,
      title: "API Configuration",
      description: "Manage API keys and SDK integration settings",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-foreground mb-2 block">API Key (publishable)</label>
            <div className="flex gap-2">
              <Input value="pk_live_sentinelid_a8f3k2..." readOnly className="bg-secondary border-border text-muted-foreground font-mono-data text-xs" />
              <Button variant="outline" size="sm" className="text-xs border-border text-muted-foreground shrink-0">Copy</Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-foreground mb-2 block">Tenant ID</label>
            <Input value="tenant_org_2xK8m9..." readOnly className="bg-secondary border-border text-muted-foreground font-mono-data text-xs" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Tenant configuration, thresholds, and access controls</p>
          </div>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>

        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-5">{s.description}</p>
            {s.content}
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
