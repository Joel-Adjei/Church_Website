export type ID = string;

export type Sermon = {
  id: ID;
  slug: string;
  title: string;
  description: string;
  sermonDate: string;
  speaker: string;
  seriesId?: ID | null;
  youtubeId: string;
  thumbnailUrl: string;
};

export type SermonSeries = {
  id: ID;
  slug: string;
  title: string;
  description: string;
};

export type ChurchEvent = {
  id: ID;
  slug: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
  bannerImageUrl: string;
};

export type Announcement = {
  id: ID;
  slug: string;
  title: string;
  body: string;
  imageUrl?: string;
  publishAt: string;
};

export type GalleryProgram = {
  id: ID;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  images: { url: string; caption?: string }[];
};

export type AdminUser = { id: ID; email: string; name: string };

export type Settings = {
  churchName: string;
  tagline: string;
  logoUrl: string;
  bannerImageUrl: string;
  phone: string;
  email: string;
  address: string;
  serviceTimes: string[];
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
};

export type LivePlatform = "youtube" | "vimeo" | "facebook" | "custom";

export type LiveStatus = {
  isLive: boolean;
  platform: LivePlatform;
  streamUrl: string;
  nextService: string;
};

export type DevotionStatus = "draft" | "published";

export type Devotion = {
  id: ID;
  slug: string;
  title: string;
  verseRef: string;
  verseText: string;
  content: string;
  prayer: string;
  reflection: string;
  author: string;
  imageUrl: string;
  devotionDate: string;
  category: string;
  status: DevotionStatus;
  featured: boolean;
  createdAt: string;
};

export type GivingCategory = "tithe" | "offering" | "missions" | "building-fund" | "benevolence" | "other";
export type GivingFrequency = "one-time" | "weekly" | "monthly";
export type GivingStatus = "completed" | "pending";

export type Giving = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  category: GivingCategory;
  frequency: GivingFrequency;
  message?: string;
  anonymous: boolean;
  status: GivingStatus;
  createdAt: string;
};
