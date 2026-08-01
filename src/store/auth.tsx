import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken, getRefreshToken, setRefreshToken } from "@/services/api";
import type { AdminUser } from "@/types";

type AuthCtx = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  async function login(email: string, password: string) {
    setLoading(true);
    const { access, refresh } = await api<{ access: string; refresh: string }>(
      `${BASE_URL}/auth/jwt/create/`,
      { method: "POST", body: JSON.stringify({ email, password }) },
    );
    setToken(access);
    setRefreshToken(refresh);
    setUser({
      id: "admin001",
      name: "Admin",
    });
    setLoading(false);
  }

  function logout() {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be inside AuthProvider");
  return v;
}
