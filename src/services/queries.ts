import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Announcement, ChurchEvent, Devotion, GalleryProgram, Sermon, SermonSeries } from "@/types";

type Resources = {
  sermons: Sermon;
  series: SermonSeries;
  events: ChurchEvent;
  announcements: Announcement;
  gallery: GalleryProgram;
  devotions: Devotion;
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

import type { Giving, LiveStatus, Settings } from "@/types";

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
