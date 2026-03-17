import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area,
} from "recharts";

interface KPI {
  label: string;
  value: string;
  change: string;
  up: boolean;
  sparkline: number[];
}

const kpis: KPI[] = [
  { label: "Detection Accuracy", value: "97.4%", change: "+1.2%", up: true, sparkline: [91, 93, 94, 95, 96, 96.5, 97, 97.4] },
  { label: "False Positive Rate", value: "1.2%", change: "-0.3%", up: true, sparkline: [2.1, 1.9, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2] },
  { label: "False Negative Rate", value: "0.8%", change: "-0.1%", up: true, sparkline: [1.4, 1.3, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8] },
  { label: "Avg Verification Time", value: "1.8s", change: "-0.3s", up: true, sparkline: [2.8, 2.5, 2.3, 2.1, 2.0, 1.9, 1.8, 1.8] },
  { label: "Daily Volume", value: "12,843", change: "+8.4%", up: true, sparkline: [9200, 10100, 10800, 11200, 11600, 12100, 12500, 12843] },
];

const KPICards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
    {kpis.map((kpi, i) => {
      const sparkData = kpi.sparkline.map((v, j) => ({ v, i: j }));
      return (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-xl border border-border bg-card p-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground truncate">{kpi.label}</span>
            <span className={`flex items-center gap-0.5 text-[11px] font-mono-data ${kpi.up ? "text-success" : "text-destructive"}`}>
              {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {kpi.change}
            </span>
          </div>
          <div className="text-xl font-bold text-foreground font-mono-data">{kpi.value}</div>
          <div className="h-10 mt-2 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="hsl(217, 91%, 60%)" fill={`url(#spark-${i})`} strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default KPICards;
