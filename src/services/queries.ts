import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, BASE_URL } from "./api";
import type { Announcement, ChurchEvent, Devotion, GalleryProgram, Resource, Sermon, SermonSeries } from "@/types";

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
    mutationFn: (body: Omit<Sermon, "id" | "likes" | "comments" | "next_sermon" | "previous_sermon" | "resource" | "resource_details">) =>
      api<Sermon>(`${BASE_URL}/sermons/create/`, { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
  });
}

export function useUpdateSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Omit<Sermon, "likes" | "comments" | "next_sermon" | "previous_sermon" | "resource" | "resource_details">> & { id: string }) =>
      api<Sermon>(`${BASE_URL}/sermons/${id}/update/`, { method: "PUT", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
  });
}

export function useDeleteSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`${BASE_URL}/sermons/${id}/update/`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sermons"] }),
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
      api<Resources[K]>(`/api/${key}/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
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

import type { Giving, LiveStatus, PrayerRequest, Settings } from "@/types";

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: () => api<Settings>("/api/settings") });
}
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Settings>) =>
      api<Settings>("/api/settings", { method: "PUT", body: JSON.stringify(body), auth: true }),
    onSuccess: (data) => { qc.setQueryData(["settings"], data); },
  });
}

export function useGivings() {
  return useQuery({ queryKey: ["givings"], queryFn: () => api<Giving[]>("/api/givings", { auth: true }) });
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
  return useQuery({ queryKey: ["prayer-requests"], queryFn: () => api<PrayerRequest[]>("/api/prayer-requests", { auth: true }) });
}
export function useSubmitPrayerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<PrayerRequest, "id" | "status" | "createdAt">) =>
      api<PrayerRequest>("/api/prayer-requests", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayer-requests"] }),
  });
}
export function useUpdatePrayerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<PrayerRequest> & { id: string }) =>
      api<PrayerRequest>(`/api/prayer-requests/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayer-requests"] }),
  });
}
export function useDeletePrayerRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/prayer-requests/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayer-requests"] }),
  });
}

export function useLive() {
  return useQuery({ queryKey: ["live"], queryFn: () => api<LiveStatus>("/api/live") });
}
export function useUpdateLive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<LiveStatus>) =>
      api<LiveStatus>("/api/live", { method: "PUT", body: JSON.stringify(body), auth: true }),
    onSuccess: (data) => { qc.setQueryData(["live"], data); },
  });
}
