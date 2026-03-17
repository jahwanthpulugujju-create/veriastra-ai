import { motion } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";

const data = [
  { day: "Day 1", video: 91.2, audio: 88.5, liveness: 90.1, overall: 94.1 },
  { day: "Day 2", video: 92.8, audio: 89.9, liveness: 91.5, overall: 95.3 },
  { day: "Day 3", video: 94.1, audio: 91.3, liveness: 93.2, overall: 96.8 },
  { day: "Day 4", video: 95.0, audio: 92.1, liveness: 94.0, overall: 97.2 },
  { day: "Day 5", video: 95.6, audio: 92.8, liveness: 94.8, overall: 97.4 },
  { day: "Day 6", video: 95.9, audio: 93.2, liveness: 95.1, overall: 97.6 },
  { day: "Day 7", video: 96.2, audio: 93.5, liveness: 95.4, overall: 97.8 },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: "hsl(217, 33%, 13%)", border: "1px solid hsl(217, 33%, 20%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 98%)" },
};

const lines = [
  { key: "overall", label: "Overall", color: "hsl(217, 91%, 60%)", width: 2.5 },
  { key: "video", label: "Video", color: "hsl(160, 60%, 45%)", width: 1.5 },
  { key: "audio", label: "Audio", color: "hsl(38, 92%, 50%)", width: 1.5 },
  { key: "liveness", label: "Liveness", color: "hsl(280, 60%, 55%)", width: 1.5 },
];

const AccuracyTrends = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-1">Detection Accuracy Over Time</h3>
    <p className="text-xs text-muted-foreground mb-6">Multi-modal model performance trending</p>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={l.width} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center justify-center gap-6 mt-4">
      {lines.map((l) => (
        <span key={l.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />{l.label}
        </span>
      ))}
    </div>
  </motion.div>
);

export default AccuracyTrends;
