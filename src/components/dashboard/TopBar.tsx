import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <img
          src={theme === "dark" ? "/logo_green.png" : "/logo_dark.png"}
          alt="VentureMond"
          className="h-7 object-contain"
        />
      </div>

      <div className="flex items-center gap-2">

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
