import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";

const data = [
  { week: "W1", real: 8200, faceSwap: 320, voiceClone: 180, spoof: 95 },
  { week: "W2", real: 9100, faceSwap: 380, voiceClone: 210, spoof: 110 },
  { week: "W3", real: 10400, faceSwap: 410, voiceClone: 240, spoof: 125 },
  { week: "W4", real: 11200, faceSwap: 450, voiceClone: 260, spoof: 140 },
  { week: "W5", real: 12000, faceSwap: 480, voiceClone: 280, spoof: 155 },
  { week: "W6", real: 12843, faceSwap: 520, voiceClone: 310, spoof: 170 },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: "hsl(217, 33%, 13%)", border: "1px solid hsl(217, 33%, 20%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 98%)" },
};

const bars = [
  { key: "real", label: "Real Users", color: "hsl(160, 60%, 45%)" },
  { key: "faceSwap", label: "Face Swap", color: "hsl(347, 77%, 50%)" },
  { key: "voiceClone", label: "Voice Clone", color: "hsl(38, 92%, 50%)" },
  { key: "spoof", label: "Spoof Attacks", color: "hsl(280, 60%, 55%)" },
];

const VerificationVolume = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-1">Verification Volume</h3>
    <p className="text-xs text-muted-foreground mb-6">Weekly verification sessions and attack distribution</p>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center justify-center gap-6 mt-4">
      {bars.map((b) => (
        <span key={b.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />{b.label}
        </span>
      ))}
    </div>
  </motion.div>
);

export default VerificationVolume;
