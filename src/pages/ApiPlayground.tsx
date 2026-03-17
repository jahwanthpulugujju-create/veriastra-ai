import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Code, Upload, Copy, Clock, CheckCircle2, Terminal, Play, FileJson, Braces
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "@/hooks/use-toast";

const sampleResponse = {
  verification_id: "vrf_8kA3mX9z",
  timestamp: new Date().toISOString(),
  prediction: "FAKE",
  confidence: 0.93,
  risk_score: 87,
  model: "sentinelid-fusion-v2",
  frame_analysis: [0.91, 0.95, 0.92, 0.88, 0.94],
  liveness: { passed: false, blink_count: 0, frames_checked: 142 },
  reason_codes: ["facial_texture_artifacts", "lip_sync_mismatch", "temporal_inconsistency"],
  evidence: [
    { type: "frame", time_ms: 1200, heatmap: "base64_grad_cam_data..." },
    { type: "audio_snippet", time_ms: 1000, spectrogram: "base64_spectrogram..." },
  ],
  explainability: {
    video_saliency: "base64_saliency_map...",
    fusion_shap: [0.42, 0.28, 0.18, 0.12],
  },
};

const curlExample = `curl -X POST https://api.sentinelid.ai/v1/analyze \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@sample_video.mp4" \\
  -F "mode=full"`;

const jsExample = `import SentinelID from '@sentinelid/sdk';

const sentinel = new SentinelID({
  apiKey: 'sk_live_...',
  tenantId: 'tenant_org_2xK8m9'
});

// Analyze a file
const result = await sentinel.analyze({
  file: videoBlob,
  mode: 'full', // 'video' | 'audio' | 'full'
});

console.log(result.prediction); // "REAL" | "FAKE"
console.log(result.risk_score); // 0-100
console.log(result.reason_codes);`;

const pythonExample = `import requests

url = "https://api.sentinelid.ai/v1/analyze"
headers = {"Authorization": "Bearer sk_live_..."}

with open("sample.mp4", "rb") as f:
    response = requests.post(
        url,
        headers=headers,
        files={"file": f},
        data={"mode": "full"}
    )

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Risk Score: {result['risk_score']}")`;

const endpoints = [
  { method: "POST", path: "/v1/analyze", desc: "Analyze video/image/audio for deepfakes" },
  { method: "POST", path: "/v1/analyze-audio", desc: "Audio-only deepfake detection" },
  { method: "POST", path: "/v1/liveness-check", desc: "Liveness verification from video" },
  { method: "GET", path: "/v1/verify/{session_id}", desc: "Get verification result & evidence" },
  { method: "POST", path: "/v1/verify/session", desc: "Start new verification session" },
  { method: "POST", path: "/v1/verify/callback", desc: "Webhook for async results" },
];

const ApiPlayground = () => {
  const [selectedTab, setSelectedTab] = useState<"curl" | "javascript" | "python">("javascript");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const runTest = useCallback(() => {
    setLoading(true);
    setResponse(null);
    const startTime = Date.now();
    // Simulate API call
    setTimeout(() => {
      setResponse(JSON.stringify(sampleResponse, null, 2));
      setResponseTime(Date.now() - startTime);
      setLoading(false);
    }, 800 + Math.random() * 600);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const codeExamples = { curl: curlExample, javascript: jsExample, python: pythonExample };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Playground</h1>
          <p className="text-sm text-muted-foreground mt-1">Test endpoints, view responses, and integrate SentinelID into your application</p>
        </div>

        {/* API Endpoints */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">API Endpoints</h3>
          </div>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data font-bold ${
                  ep.method === "POST" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                }`}>{ep.method}</span>
                <span className="text-sm font-mono-data text-foreground">{ep.path}</span>
                <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{ep.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Request</h3>
              </div>
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(["curl", "javascript", "python"] as const).map((t) => (
                  <button key={t} onClick={() => setSelectedTab(t)} className={`px-3 py-1 text-xs font-mono-data transition-colors ${
                    selectedTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <pre className="p-4 text-xs font-mono-data text-foreground/90 overflow-x-auto whitespace-pre leading-relaxed max-h-[300px]">
                {codeExamples[selectedTab]}
              </pre>
              <button onClick={() => copyToClipboard(codeExamples[selectedTab])} className="absolute top-3 right-3 p-1.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <div className="px-5 py-3 border-t border-border flex gap-3">
              <Button onClick={runTest} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="h-3.5 w-3.5 mr-1.5" /> {loading ? "Sending..." : "Send Request"}
              </Button>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload File
                <input type="file" className="hidden" accept="video/*,image/*,audio/*" onChange={runTest} />
              </label>
            </div>
          </motion.div>

          {/* Response */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-success" />
                <h3 className="text-sm font-semibold text-foreground">Response</h3>
              </div>
              {responseTime && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-success font-mono-data">
                    <CheckCircle2 className="h-3 w-3" /> 200 OK
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground font-mono-data">
                    <Clock className="h-3 w-3" /> {responseTime}ms
                  </span>
                </div>
              )}
            </div>
            <div className="relative">
              {response ? (
                <pre className="p-4 text-xs font-mono-data text-foreground/90 overflow-auto whitespace-pre leading-relaxed max-h-[340px]">
                  {response}
                </pre>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Braces className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">{loading ? "Waiting for response..." : "Send a request to see the response"}</p>
                </div>
              )}
              {response && (
                <button onClick={() => copyToClipboard(response)} className="absolute top-3 right-3 p-1.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="h-3 w-3" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Headers */}
        {responseTime && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Response Headers</h3>
            <div className="space-y-1.5 text-xs font-mono-data">
              {[
                ["content-type", "application/json; charset=utf-8"],
                ["x-request-id", "req_" + Math.random().toString(36).slice(2, 10)],
                ["x-model-version", "sentinelid-fusion-v2.1.0"],
                ["x-inference-time-ms", String(Math.floor(responseTime * 0.7))],
                ["x-ratelimit-remaining", "497"],
                ["x-ratelimit-reset", new Date(Date.now() + 60000).toISOString()],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-primary">{k}:</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApiPlayground;
