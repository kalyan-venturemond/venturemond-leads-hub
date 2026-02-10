import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("vm_auth") === "true"
  );
  const [user, setUser] = useState<{ email: string } | null>(
    () => {
      const stored = localStorage.getItem("vm_user");
      return stored ? JSON.parse(stored) : null;
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    if (email === "admin@venturemond.com" && password === "admin123") {
      const u = { email };
      setUser(u);
      setIsAuthenticated(true);
      localStorage.setItem("vm_auth", "true");
      localStorage.setItem("vm_user", JSON.stringify(u));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError("Invalid credentials. Please try again.");
      throw new Error("Invalid credentials");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("vm_auth");
    localStorage.removeItem("vm_user");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
