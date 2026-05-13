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

export type ResourceCategory =
  | "books"
  | "clothing"
  | "food"
  | "equipment"
  | "digital"
  | "stationery"
  | "other";
export type ResourceCondition = "new" | "like-new" | "good" | "fair";
export type ResourceAvailability = "available" | "limited" | "claimed";

export type Resource = {
  id: ID;
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  condition: ResourceCondition;
  availability: ResourceAvailability;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  pickupLocation?: string;
  quantity?: number;
  featured: boolean;
  createdAt: string;
};

export type PrayerCategory =
  | "healing"
  | "family"
  | "finances"
  | "guidance"
  | "salvation"
  | "relationships"
  | "thanksgiving"
  | "other";
export type PrayerPrivacy = "public" | "private" | "anonymous";
export type PrayerStatus = "new" | "praying" | "answered";

export type PrayerRequest = {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: PrayerCategory;
  subject: string;
  request: string;
  privacy: PrayerPrivacy;
  status: PrayerStatus;
  adminNote?: string;
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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  category: GivingCategory;
  message?: string;
  anonymous: boolean;
  status: GivingStatus;
  createdAt: string;
};
