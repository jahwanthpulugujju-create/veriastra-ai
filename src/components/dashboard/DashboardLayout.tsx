import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, Settings, LogOut,
  Search, Bell, ChevronDown, Radio, Code2, ShieldCheck, Scan, ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Radio, label: "Live Monitor", path: "/dashboard/live" },
  { icon: Code2, label: "API Playground", path: "/dashboard/api" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-border bg-navy-deep flex flex-col">
        <Link to="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <img src="/veriastra-logo.png" alt="Veriastra logo" className="h-6 w-6 object-contain" />
          <span className="font-bold text-foreground text-sm tracking-widest uppercase">Veriastra</span>
        </Link>

        {/* New Verification CTA */}
        <div className="px-4 pt-4 pb-2">
          <Link to="/verify" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors w-full text-sm font-semibold">
            <Scan className="h-4 w-4" />
            New Verification
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary border-l-2 border-l-primary ml-0 pl-[10px]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + sign out */}
        <div className="p-4 border-t border-border space-y-2">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                <p className="text-[9px] text-primary font-mono-data mt-0.5">Owner</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 bg-secondary rounded-lg px-3 py-1.5 w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search verifications…</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono-data">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Systems nominal</span>
            </div>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                {initials}
              </div>
              <span className="text-sm text-foreground">{user?.name || "User"}</span>
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
