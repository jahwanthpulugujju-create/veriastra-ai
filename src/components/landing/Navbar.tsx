import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/veriastra-logo.png" alt="Veriastra logo" className="h-8 w-8 object-contain brightness-0 invert" />
          <span className="text-lg font-bold tracking-widest text-foreground uppercase">Veriastra</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Solutions", "Pricing", "Docs"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Sign in
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start free trial
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {["Platform", "Solutions", "Pricing", "Docs"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-muted-foreground py-2">
              {item}
            </a>
          ))}
          <Link to="/dashboard">
            <Button className="w-full bg-primary text-primary-foreground">Start free trial</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
