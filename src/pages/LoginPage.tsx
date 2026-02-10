import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.jpeg";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {}
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && email && password && !isLoading) {
        handleSubmit(e as any);
      }
    };
    return () => {};
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-10">
          <img src={logo} alt="VentureMond" className="w-14 h-14 rounded-xl mx-auto mb-4" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            VentureMond
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@venturemond.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card border-border focus:border-primary focus:ring-primary/20 h-11 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-card border-border focus:border-primary focus:ring-primary/20 h-11 transition-colors"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm animate-fade-in">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Internal use only • admin@venturemond.com / admin123
        </p>
      </div>
    </div>
  );
}
