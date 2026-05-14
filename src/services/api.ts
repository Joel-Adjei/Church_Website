export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://elevation-church-1.onrender.com/api";

const ACCESS_KEY = "church-admin-token";
const REFRESH_KEY = "church-admin-refresh";

export function getToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}
export function setToken(t: string | null) {
  if (typeof localStorage === "undefined") return;
  if (t) localStorage.setItem(ACCESS_KEY, t);
  else localStorage.removeItem(ACCESS_KEY);
}
export function getRefreshToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}
export function setRefreshToken(t: string | null) {
  if (typeof localStorage === "undefined") return;
  if (t) localStorage.setItem(REFRESH_KEY, t);
  else localStorage.removeItem(REFRESH_KEY);
}

async function tryRefresh(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) { setRefreshToken(null); setToken(null); return null; }
    const { access } = await res.json() as { access: string };
    setToken(access);
    return access;
  } catch {
    return null;
  }
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean; _retry?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (init.auth) {
    const t = getToken();
    if (t) headers.set("Authorization", `Bearer ${t}`);
  }
  const res = await fetch(path, { ...init, headers });

  // Auto-refresh on 401 (once)
  if (res.status === 401 && init.auth && !init._retry) {
    const newToken = await tryRefresh();
    if (newToken) {
      return api<T>(path, { ...init, _retry: true });
    }
  }

  if (res.status === 204) return undefined as T;
  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "detail" in data && typeof (data as Record<string, unknown>).detail === "string"
        ? (data as { detail: string }).detail
        : null) ||
      (data && typeof data === "object" && "error" in data && (data as { error: string }).error) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}
