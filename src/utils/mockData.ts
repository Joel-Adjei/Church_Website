export const settings = {
  churchName: "Grace Cathedral",
  tagline: "A community of faith, hope, and love in the heart of the city.",
  serviceTimes: ["Sunday 9:00 AM — Worship", "Sunday 11:00 AM — Family Service", "Wednesday 7:00 PM — Bible Study"],
  phone: "+1 (555) 123-4567",
  email: "hello@gracecathedral.org",
  address: "1200 Cathedral Lane, Springfield, IL 62701",
  bannerImageUrl: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80",
};

export const liveStatus = {
  isLive: false,
  nextService: "Sunday at 9:00 AM",
  streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
};

export type { Sermon, SermonSeries, ChurchEvent, Announcement, GalleryProgram } from "@/types";
