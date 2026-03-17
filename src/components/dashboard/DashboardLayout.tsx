import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart3, Settings, LogOut,
  Search, Bell, ChevronDown, Radio, Code2
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Users, label: "Verifications", path: "/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Radio, label: "Live Monitor", path: "/dashboard/live" },
  { icon: Code2, label: "API Playground", path: "/dashboard/api" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-border bg-navy-deep flex flex-col">
        <Link to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <img src="/veriastra-logo.png" alt="Veriastra logo" className="h-6 w-6 object-contain" />
          <span className="font-bold text-foreground text-sm tracking-widest uppercase">Veriastra</span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <LogOut className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 bg-secondary rounded-lg px-3 py-1.5 w-80">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search verifications...</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">A</div>
              <span>Admin</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
