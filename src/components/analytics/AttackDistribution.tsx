import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Face Swap", value: 38, color: "hsl(347, 77%, 50%)" },
  { name: "Voice Clone", value: 24, color: "hsl(38, 92%, 50%)" },
  { name: "Synthetic Video", value: 21, color: "hsl(217, 91%, 60%)" },
  { name: "Replay Attack", value: 11, color: "hsl(160, 60%, 45%)" },
  { name: "Mask Spoof", value: 6, color: "hsl(280, 60%, 55%)" },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: "hsl(217, 33%, 13%)", border: "1px solid hsl(217, 33%, 20%)", borderRadius: "8px", fontSize: "12px", color: "hsl(210, 40%, 98%)" },
};

const AttackDistribution = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-sm font-semibold text-foreground mb-1">Deepfake Detection Distribution</h3>
    <p className="text-xs text-muted-foreground mb-6">Breakdown of detected attack types</p>
    <div className="flex items-center gap-8">
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((e) => <Cell key={e.name} fill={e.color} />)}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(val: number) => `${val}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 flex-1">
        {data.map((a) => (
          <div key={a.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
              {a.name}
            </span>
            <span className="text-sm font-mono-data text-foreground">{a.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default AttackDistribution;
