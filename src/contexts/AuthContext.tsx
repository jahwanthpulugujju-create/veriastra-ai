import { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
  org: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string, org: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "veriastra_users";
const SESSION_KEY = "veriastra_session";

interface StoredUser extends User {
  passwordHash: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function simpleHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Seed demo account if no users exist
    const users = getStoredUsers();
    if (users.length === 0) {
      const demo: StoredUser = {
        id: "usr_demo_001",
        name: "Alex Morgan",
        email: "demo@veriastra.ai",
        passwordHash: simpleHash("demo1234"),
        role: "admin",
        org: "Veriastra Demo",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([demo]));
    }

    // Restore session
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session) as User;
        setUser(parsed);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === simpleHash(password));
    if (!match) return { ok: false, error: "Invalid email or password" };
    const { passwordHash: _, ...userData } = match;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return { ok: true };
  };

  const signUp = async (name: string, email: string, password: string, org: string) => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists" };
    }
    const newUser: StoredUser = {
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      name,
      email,
      passwordHash: simpleHash(password),
      role: "admin",
      org,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const { passwordHash: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return { ok: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
