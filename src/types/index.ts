export type ID = string;

export type Sermon = {
  id: ID;
  title: string;
  description: string;
  date: string;
  preacher: string;
  series: ID | null;
  video_link: string;
  podcast_link: string;
  likes: number;
  comments: string;
  next_sermon: ID | null;
  previous_sermon: ID | null;
  resource: ID | null;
  resource_details: unknown | null;
};

export type SermonSeries = {
  id: ID;
  title: string;
  description: string;
  image: string;
  thoughts: ID[];
  available_sermons: string;
};

export type ChurchEvent = {
  id: ID;
  name: string;
  description: string;
  flyer: string;
  location: string;
  date: string;
  end_date?: string;
  days: number;
  start_time: string;
  end_time?: string;
  created_at: string;
};

export type Announcement = {
  id: ID;
  title: string;
  content: string;
  date: string;
};

export type GalleryImage = {
  id: ID;
  gallery: ID;
  title: string;
  image: string;
  description: string;
  venue: string;
  likes: number;
  date: string;
};

export type GalleryProgram = {
  id: ID;
  title: string;
  description: string;
  venue: string;
  likes: number;
  date: string;
  images: GalleryImage[];
};

export type AdminUser = { id: ID; name: string };

export type Settings = {
  id: number;
  church_name: string;
  tagline: string;
  logo_url: string;
  banner_image_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  service_times: string[];
  social_links?: Record<string, string>;
  footer_note?: string;
  default_seo_title?: string;
  default_seo_description?: string;
  default_og_image_url?: string;
  show_announcements?: boolean;
  show_gallery?: boolean;
  show_resources?: boolean;
  show_prayer_request?: boolean;
  show_live_badge?: boolean;
  updated_at: string;
};

export type LiveStream = {
  id: ID;
  title: string;
  description: string;
  stream_link: string;
  status: string;
  reactions: number;
  comments: string;
  date: string;
};

export type LiveStatus = {
  isLive: boolean;
  streamUrl: string;
  nextService: string;
  stream: LiveStream | null;
};

export type DevotionReflection = {
  id: ID;
  name: string;
  likes: number;
  comments: string;
  content: string;
  devotion: ID;
  date: string;
};

export type Devotion = {
  id: ID;
  title: string;
  Bible_verse: {
    reference: string;
    verse_content: string;
  };
  content: string;
  thumbnail: string;
  date: string;
  reflections: DevotionReflection[];
  prayer?: string;
  reflection?: string;
};

export type Resource = {
  id: ID;
  name: string;
  purchase_link: string;
  price: string;
  image?: string;
  description?: string;
};

export type PrayerPrivacy = "private" | "anonymous";

export type PrayerRequest = {
  id: ID;
  name: string;
  phone?: string;
  subject: string;
  request?: string;
  date?: string;
  createdAt: string;
};

export type GivingCategory =
  | "tithe"
  | "offering"
  | "missions"
  | "building-fund"
  | "benevolence"
  | "other";
export type GivingStatus = "completed" | "pending";

export type Giving = {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  currency: string;
  category: GivingCategory;
  message?: string;
  anonymous: boolean;
  status: GivingStatus;
  createdAt: string;
};

export type Account = {
  id: ID;
  name: string;
  channel_type: "momo" | "bank" | "card" | "other";
  account_name: string;
  account_number: string;
  bank_name: string;
  branch: string;
  network: string;
  currency: string;
  instructions: string;
  is_active: true;
  display_order: number;
};
