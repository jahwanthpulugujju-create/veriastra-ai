import { RefreshCw, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLive: boolean;
  onToggleLive: () => void;
}

const ranges = ["24h", "7d", "30d", "90d"];

const AnalyticsFilters = ({ dateRange, onDateRangeChange, onRefresh, onExport, isLive, onToggleLive }: Props) => (
  <div className="flex items-center justify-between flex-wrap gap-3">
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-lg border border-border overflow-hidden">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => onDateRangeChange(r)}
            className={`px-3 py-1.5 text-xs font-mono-data transition-colors ${
              dateRange === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleLive}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-data border transition-colors ${
          isLive ? "border-success/50 bg-success/10 text-success" : "border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
        {isLive ? "Live" : "Paused"}
      </button>
      <Button variant="outline" size="sm" className="h-8 text-xs border-border text-muted-foreground hover:text-foreground" onClick={onRefresh}>
        <RefreshCw className="h-3 w-3 mr-1" /> Refresh
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs border-border text-muted-foreground hover:text-foreground" onClick={onExport}>
        <Download className="h-3 w-3 mr-1" /> Export Report
      </Button>
    </div>
  </div>
);

export default AnalyticsFilters;
