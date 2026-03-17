import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await signUp(name, email, password, org || "Independent");
    setLoading(false);
    if (res.ok) {
      navigate("/dashboard", { replace: true });
    } else {
      toast({ title: "Sign up failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src="/veriastra-logo.png" alt="Veriastra" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold tracking-widest uppercase text-foreground">Veriastra</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Start verifying identities in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">Full name</Label>
                <Input id="name" placeholder="Alex Morgan" value={name} onChange={e => setName(e.target.value)} required className="bg-secondary/50 border-border h-10" data-testid="input-name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="org" className="text-sm">Organization</Label>
                <Input id="org" placeholder="Acme Corp" value={org} onChange={e => setOrg(e.target.value)} className="bg-secondary/50 border-border h-10" data-testid="input-org" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email address</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="bg-secondary/50 border-border h-10" data-testid="input-email" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50 border-border h-10 pr-10"
                  data-testid="input-password"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">At least 8 characters</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10" data-testid="button-signup">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          <span>Secured by Veriastra · Trust, Verified in Real Time.</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
