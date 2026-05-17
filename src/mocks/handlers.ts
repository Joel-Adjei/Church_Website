import { http, HttpResponse } from "msw";
import { loadStore, saveStore, slugify, newId, type Store } from "@/store/store";

const TOKEN = "mock-admin-token-abc123";
const ADMIN = { email: "admin@gracecathedral.org", password: "password123" };

function auth(req: Request) {
  const h = req.headers.get("authorization") || "";
  return h === `Bearer ${TOKEN}`;
}

function unauth() {
  return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type Key = keyof Pick<
  Store,
  | "sermons"
  | "series"
  | "events"
  | "announcements"
  | "gallery"
  | "givings"
  | "prayerRequests"
  | "resources"
>;

function listHandler(key: Key) {
  return http.get(`/api/${key}`, () => {
    const s = loadStore();
    return HttpResponse.json(s[key]);
  });
}

// function getBySlug(key: Key) {
//   return http.get(`/api/${key}/:slug`, ({ params }) => {
//     const s = loadStore();
//     const item = (s[key] as Array<{ slug: string }>).find((i) => i.slug === params.slug);
//     if (!item) return HttpResponse.json({ error: "Not found" }, { status: 404 });
//     return HttpResponse.json(item);
//   });
// }

function createHandler(key: Key) {
  return http.post(`/api/${key}`, async ({ request }) => {
    if (!auth(request)) return unauth();
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    const item = {
      id: newId(),
      slug: (body.slug as string) || slugify((body.title as string) || newId()),
      ...body,
    };
    (s[key] as unknown[]).unshift(item);
    saveStore(s);
    return HttpResponse.json(item, { status: 201 });
  });
}

function updateHandler(key: Key) {
  return http.put(`/api/${key}/:id`, async ({ request, params }) => {
    if (!auth(request)) return unauth();
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    const arr = s[key] as Array<{ id: string }>;
    const idx = arr.findIndex((i) => i.id === params.id);
    if (idx === -1) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    arr[idx] = { ...arr[idx], ...body, id: arr[idx].id } as never;
    saveStore(s);
    return HttpResponse.json(arr[idx]);
  });
}

function deleteHandler(key: Key) {
  return http.delete(`/api/${key}/:id`, ({ request, params }) => {
    if (!auth(request)) return unauth();
    const s = loadStore();
    const arr = s[key] as Array<{ id: string }>;
    const idx = arr.findIndex((i) => i.id === params.id);
    if (idx === -1) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    arr.splice(idx, 1);
    saveStore(s);
    return new HttpResponse(null, { status: 204 });
  });
}

function crud(key: Key) {
  return [
    listHandler(key),
    // getBySlug(key),
    createHandler(key),
    updateHandler(key),
    deleteHandler(key),
  ];
}

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email === ADMIN.email && password === ADMIN.password) {
      return HttpResponse.json({
        token: TOKEN,
        user: { id: "u1", email: ADMIN.email, name: "Admin" },
      });
    }
    return HttpResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }),
  http.get("/api/auth/me", ({ request }) => {
    if (!auth(request)) return unauth();
    return HttpResponse.json({ user: { id: "u1", email: ADMIN.email, name: "Admin" } });
  }),
  http.post("/api/auth/logout", () => HttpResponse.json({ ok: true })),

  http.get("/api/settings", () => HttpResponse.json(loadStore().settings)),
  http.put("/api/settings", async ({ request }) => {
    if (!auth(request)) return unauth();
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    s.settings = {
      ...s.settings,
      ...body,
      socials: { ...s.settings.socials, ...((body.socials as object) ?? {}) },
    } as typeof s.settings;
    saveStore(s);
    return HttpResponse.json(s.settings);
  }),

  http.get("/api/live", () => HttpResponse.json(loadStore().live)),
  http.put("/api/live", async ({ request }) => {
    if (!auth(request)) return unauth();
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    s.live = { ...s.live, ...body } as typeof s.live;
    saveStore(s);
    return HttpResponse.json(s.live);
  }),

  ...crud("sermons"),
  ...crud("series"),
  ...crud("events"),
  ...crud("announcements"),
  ...crud("gallery"),
  // ...crud("devotions"),
  ...crud("resources"),

  // Prayer Requests — public POST (no auth), admin GET (auth), admin PUT for status, admin DELETE
  http.get("/api/prayer-requests", ({ request }) => {
    if (!auth(request)) return unauth();
    const s = loadStore();
    const sorted = [...s.prayerRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return HttpResponse.json(sorted);
  }),
  http.post("/api/prayer-requests", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    const item = { id: newId(), status: "new", createdAt: new Date().toISOString(), ...body };
    s.prayerRequests.unshift(item as never);
    saveStore(s);
    return HttpResponse.json(item, { status: 201 });
  }),
  http.put("/api/prayer-requests/:id", async ({ request, params }) => {
    if (!auth(request)) return unauth();
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    const idx = s.prayerRequests.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    s.prayerRequests[idx] = {
      ...s.prayerRequests[idx],
      ...body,
      id: s.prayerRequests[idx].id,
    } as never;
    saveStore(s);
    return HttpResponse.json(s.prayerRequests[idx]);
  }),
  http.delete("/api/prayer-requests/:id", ({ request, params }) => {
    if (!auth(request)) return unauth();
    const s = loadStore();
    const idx = s.prayerRequests.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    s.prayerRequests.splice(idx, 1);
    saveStore(s);
    return new HttpResponse(null, { status: 204 });
  }),

  // Givings — public POST (no auth), admin GET (auth), admin DELETE
  http.get("/api/givings", ({ request }) => {
    if (!auth(request)) return unauth();
    const s = loadStore();
    const sorted = [...s.givings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return HttpResponse.json(sorted);
  }),
  http.post("/api/givings", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const s = loadStore();
    const item = {
      id: newId(),
      status: "completed",
      createdAt: new Date().toISOString(),
      currency: "GHS",
      ...body,
    };
    s.givings.unshift(item as never);
    saveStore(s);
    return HttpResponse.json(item, { status: 201 });
  }),
  http.delete("/api/givings/:id", ({ request, params }) => {
    if (!auth(request)) return unauth();
    const s = loadStore();
    const idx = s.givings.findIndex((g) => g.id === params.id);
    if (idx === -1) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    s.givings.splice(idx, 1);
    saveStore(s);
    return new HttpResponse(null, { status: 204 });
  }),
];

export const MOCK_CREDENTIALS = ADMIN;
