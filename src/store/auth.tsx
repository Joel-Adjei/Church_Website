import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken, getRefreshToken, setRefreshToken } from "@/services/api";
import type { AdminUser } from "@/types";

type AuthCtx = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const t = getToken();
    if (!t) {
      setLoading(false);
      return;
    }
    api<AdminUser>(`${BASE_URL}/auth/users/me/`, { auth: true })
      .then((u) => setUser(u))
      .catch(() => {
        setToken(null);
        setRefreshToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const { access, refresh } = await api<{ access: string; refresh: string }>(
      `${BASE_URL}/auth/jwt/create/`,
      { method: "POST", body: JSON.stringify({ username, password }) },
    );
    setToken(access);
    setRefreshToken(refresh);
    const u = await api<AdminUser>(`${BASE_URL}/auth/users/me/`, { auth: true });
    setUser(u);
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
