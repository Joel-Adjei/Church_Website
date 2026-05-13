import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import { api, getToken, setToken } from "@/services/api";

function LoginHarness() {
  return null;
}

describe("auth API", () => {
  it("rejects invalid credentials", async () => {
    await expect(api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "x@x.com", password: "wrong" }) }))
      .rejects.toThrow(/invalid/i);
  });

  it("issues a token for valid credentials", async () => {
    const res = await api<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@gracecathedral.org", password: "password123" }),
    });
    expect(res.token).toMatch(/mock-admin-token/);
  });

  it("blocks unauthenticated mutations", async () => {
    await expect(api("/api/sermons", { method: "POST", body: JSON.stringify({ title: "x" }) }))
      .rejects.toThrow(/unauthorized/i);
  });

  it("allows mutations with bearer token", async () => {
    setToken("mock-admin-token-abc123");
    const created = await api<{ id: string; title: string }>("/api/sermons", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        title: "Test sermon", slug: "test-sermon", speaker: "Test", description: "x",
        sermonDate: "2026-01-01", youtubeId: "abc", thumbnailUrl: "https://example.com/t.jpg",
      }),
    });
    expect(created.id).toBeTruthy();
    setToken(null);
  });
});

// Suppress unused warning
void LoginHarness;
void screen; void waitFor; void userEvent; void renderWithProviders;
