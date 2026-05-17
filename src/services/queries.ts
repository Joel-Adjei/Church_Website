import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, BASE_URL } from "./api";
import type {
  Account,
  Announcement,
  ChurchEvent,
  Devotion,
  GalleryProgram,
  Giving,
  LiveStatus,
  LiveStream,
  PrayerRequest,
  Resource,
  Sermon,
  SermonSeries,
  Settings,
} from "@/types";

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export function useSermons() {
  return useQuery({
    queryKey: ["sermons"],
    queryFn: () => api<Paginated<Sermon>>(`${BASE_URL}/sermons/`).then((r) => r.results),
  });
}

export function useSermonById(id: string | undefined) {
  return useQuery({
    queryKey: ["sermons", id],
    queryFn: () => api<Sermon>(`${BASE_URL}/sermons/${id}/`),
    enabled: !!id,
  });
}

export function useCreateSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      body: Omit<
        Sermon,
        | "id"
        | "likes"
        | "comments"
        | "next_sermon"
        | "previous_sermon"
        | "resource"
        | "resource_details"
        | "date"
      >,
    ) =>
      api<Sermon>(`${BASE_URL}/sermons/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
  });
}

export function useUpdateSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: Partial<
      Omit<
        Sermon,
        "likes" | "comments" | "next_sermon" | "previous_sermon" | "resource" | "resource_details"
      >
    > & { id: string }) =>
      api<Sermon>(`${BASE_URL}/sermons/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
  });
}

export function useDeleteSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/sermons/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
  });
}

export function useSeries() {
  return useQuery({
    queryKey: ["series"],
    queryFn: () => api<Paginated<SermonSeries>>(`${BASE_URL}/series/`).then((r) => r.results),
  });
}

export function useSeriesById(id: string | undefined) {
  return useQuery({
    queryKey: ["series", id],
    queryFn: () => api<SermonSeries>(`${BASE_URL}/series/${id}/`),
    enabled: !!id,
  });
}

export function useCreateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Pick<SermonSeries, "title" | "description" | "image">) =>
      api<SermonSeries>(`${BASE_URL}/series/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

export function useUpdateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: Pick<SermonSeries, "title" | "description" | "image"> & { id: string }) =>
      api<SermonSeries>(`${BASE_URL}/series/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => api<Paginated<ChurchEvent>>(`${BASE_URL}/events/`).then((r) => r.results),
  });
}

export function useEventById(id: string | undefined) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => api<ChurchEvent>(`${BASE_URL}/events/${id}/`),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<ChurchEvent, "id" | "created_at">) =>
      api<ChurchEvent>(`${BASE_URL}/events/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Omit<ChurchEvent, "created_at">> & { id: string }) =>
      api<ChurchEvent>(`${BASE_URL}/events/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const r = await api<Paginated<Account>>(`${BASE_URL}/contributions/channels/`);
      return r.results;
    },
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Account, "id">) => {
      api<Account>(`${BASE_URL}/contributions/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useAccountById(id: string | undefined) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => api<Account>(`${BASE_URL}/contributions/channels/${id}/`),
    enabled: !!id,
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: Partial<Account> & { id: string }) => {
      api<Account>(`${BASE_URL}/contributions/channels/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      api<Account>(`${BASE_URL}/contributions/channels/${id}/update`, {
        method: "DELETE",
        auth: true,
      });
    },

    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () =>
      api<Paginated<GalleryProgram>>(`${BASE_URL}/gallery/albums/`).then((r) => r.results),
  });
}

export function useGalleryById(id: string | undefined) {
  return useQuery({
    queryKey: ["gallery", id],
    queryFn: () => api<GalleryProgram>(`${BASE_URL}/gallery/albums/${id}/`),
    enabled: !!id,
  });
}

type GalleryPayload = { title: string; description: string; venue: string; image_urls: string[] };

export function useCreateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GalleryPayload) =>
      api<GalleryProgram>(`${BASE_URL}/gallery/albums/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useUpdateGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: GalleryPayload & { id: string }) =>
      api<GalleryProgram>(`${BASE_URL}/gallery/albums/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/gallery/albums/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () =>
      api<Paginated<Announcement>>(`${BASE_URL}/announcements/`).then((r) => r.results),
  });
}

export function useAnnouncementById(id: string | undefined) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => api<Announcement>(`${BASE_URL}/announcements/${id}/`),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Pick<Announcement, "title" | "content">) =>
      api<Announcement>(`${BASE_URL}/announcements/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Pick<Announcement, "title" | "content"> & { id: string }) =>
      api<Announcement>(`${BASE_URL}/announcements/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/announcements/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDevotions() {
  return useQuery({
    queryKey: ["devotions"],
    queryFn: () => api<Paginated<Devotion>>(`${BASE_URL}/devotions/`).then((r) => r.results),
  });
}

export function useDevotionById(id: string | undefined) {
  return useQuery({
    queryKey: ["devotions", id],
    queryFn: () => api<Devotion>(`${BASE_URL}/devotions/${id}/`),
    enabled: !!id,
  });
}

type DevotionPayload = {
  title: string;
  Bible_verse: {
    reference: string;
    verse_content: string;
  };
  content: string;
  thumbnail?: string;
  prayer?: string;
  reflection?: string;
};

export function useCreateDevotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: DevotionPayload) =>
      api<Devotion>(`${BASE_URL}/devotions/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devotions"] }),
  });
}

export function useUpdateDevotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: DevotionPayload & { id: string }) =>
      api<Devotion>(`${BASE_URL}/devotions/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devotions"] }),
  });
}

export function useDeleteDevotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/devotions/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devotions"] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/events/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/series/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => api<Paginated<Resource>>(`${BASE_URL}/resources/`).then((r) => r.results),
  });
}

export function useResourceById(id: string | undefined) {
  return useQuery({
    queryKey: ["resources", id],
    queryFn: () => api<Resource>(`${BASE_URL}/resources/${id}/`),
    enabled: !!id,
  });
}

type ResourcePayload = {
  name: string;
  purchase_link: string;
  price: string;
  image?: string;
  description?: string;
};

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ResourcePayload) =>
      api<Resource>(`${BASE_URL}/resources/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: ResourcePayload & { id: string }) =>
      api<Resource>(`${BASE_URL}/resources/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/resources/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

type Resources = {
  sermons: Sermon;
  series: SermonSeries;
  events: ChurchEvent;
  announcements: Announcement;
  gallery: GalleryProgram;
  devotions: Devotion;
  resources: Resource;
};

export function useList<K extends keyof Resources>(key: K) {
  return useQuery({
    queryKey: [key],
    queryFn: () => api<Resources[K][]>(`/api/${key}`),
  });
}

export function useBySlug<K extends keyof Resources>(key: K, slug: string | undefined) {
  return useQuery({
    queryKey: [key, "slug", slug],
    queryFn: () => api<Resources[K]>(`/api/${key}/${slug}`),
    enabled: !!slug,
  });
}

export function useCreate<K extends keyof Resources>(key: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Resources[K]>) =>
      api<Resources[K]>(`/api/${key}`, { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useUpdate<K extends keyof Resources>(key: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Resources[K]> & { id: string }) =>
      api<Resources[K]>(`/api/${key}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useRemove<K extends keyof Resources>(key: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/${key}/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: () => api<Settings>("/api/settings") });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Settings>) =>
      api<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(body), auth: true }),
    onSuccess: (data) => {
      qc.setQueryData(["settings"], data);
    },
  });
}

export function useGivings() {
  return useQuery({
    queryKey: ["givings"],
    queryFn: () => api<Giving[]>("/api/givings", { auth: true }),
  });
}
export function useSubmitGiving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Giving, "id" | "status" | "createdAt" | "currency">) =>
      api<Giving>("/api/givings", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["givings"] }),
  });
}
export function useDeleteGiving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/givings/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["givings"] }),
  });
}

export function usePrayerRequests() {
  return useQuery({
    queryKey: ["prayer-requests"],
    queryFn: () =>
      api<Paginated<PrayerRequest>>(`${BASE_URL}/prayer-requests/`, { auth: true }).then(
        (r) => r.results,
      ),
  });
}
export function useSubmitPrayerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; subject: string; phone?: string; request?: string }) =>
      api<PrayerRequest>(`${BASE_URL}/prayer-requests/create/`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayer-requests"] }),
  });
}
export function useDeletePrayerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/prayer-requests/${id}/delete/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayer-requests"] }),
  });
}

export function useLiveStreams() {
  return useQuery({
    queryKey: ["live-streams"],
    queryFn: () => api<Paginated<LiveStream>>(`${BASE_URL}/live-streams/`).then((r) => r.results),
  });
}

export function useLiveStreamById(id: string | undefined) {
  return useQuery({
    queryKey: ["live-streams", id],
    queryFn: () => api<LiveStream>(`${BASE_URL}/live-streams/${id}/`),
    enabled: !!id,
  });
}

type LiveStreamPayload = {
  title: string;
  description: string;
  stream_link: string;
  status: string;
  date: string;
};

export function useCreateLiveStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LiveStreamPayload) =>
      api<LiveStream>(`${BASE_URL}/live-streams/create/`, {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["live-streams"] }),
  });
}

export function useUpdateLiveStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: LiveStreamPayload & { id: string }) =>
      api<LiveStream>(`${BASE_URL}/live-streams/${id}/update/`, {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["live-streams"] }),
  });
}

export function useDeleteLiveStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`${BASE_URL}/live-streams/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["live-streams"] }),
  });
}

export function useLive() {
  return useQuery({
    queryKey: ["live"],
    queryFn: async () => {
      const r = await api<Paginated<LiveStream>>(`${BASE_URL}/live-streams/`);
      const active = r.results.find((s) => s.status === "live") ?? null;
      return {
        isLive: !!active,
        streamUrl: active?.stream_link ?? "",
        nextService: active?.title ?? "",
        stream: active,
      } satisfies LiveStatus;
    },
  });
}
