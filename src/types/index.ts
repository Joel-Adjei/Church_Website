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
  end_date: string;
  days: number;
  start_time: string;
  end_time: string;
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
