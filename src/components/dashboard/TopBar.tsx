import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.jpeg";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="VentureMond" className="w-7 h-7 rounded-lg" />
        <span className="font-semibold text-sm tracking-tight text-foreground">
          VentureMond
        </span>
        <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">Admin</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {user?.email}
        </span>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground h-8 px-2.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
