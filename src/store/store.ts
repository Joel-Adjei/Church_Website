import type {
  Announcement,
  ChurchEvent,
  Devotion,
  GalleryProgram,
  Giving,
  LiveStatus,
  PrayerRequest,
  Resource,
  Sermon,
  SermonSeries,
  Settings,
} from "@/types";

const KEY = "church-mock-store-v3";

export type Store = {
  sermons: Sermon[];
  series: SermonSeries[];
  events: ChurchEvent[];
  announcements: Announcement[];
  gallery: GalleryProgram[];
  // devotions: Devotion[];
  givings: Giving[];
  prayerRequests: PrayerRequest[];
  resources: Resource[];
  settings: Settings;
  live: LiveStatus;
};

const seedSeries: SermonSeries[] = [
  {
    id: "series-1",
    title: "Romans: Reborn",
    description: "A nine-week walk through Paul's letter to the Romans.",
    image: "",
    thoughts: [],
    available_sermons: "",
  },
  {
    id: "series-2",
    title: "Foundations",
    description: "The bedrock practices of a thriving spiritual life.",
    image: "",
    thoughts: [],
    available_sermons: "",
  },
  {
    id: "series-3",
    title: "Parables",
    description: "The teaching stories of Jesus, retold for today.",
    image: "",
    thoughts: [],
    available_sermons: "",
  },
  {
    id: "series-4",
    title: "Sermon on the Mount",
    description: "A summer in Matthew 5–7.",
    image: "",
    thoughts: [],
    available_sermons: "",
  },
];

const seedSermons: Sermon[] = [
  {
    id: "1",
    title: "The Weight of Grace",
    description:
      "An exploration of unmerited favor and how it reshapes the way we live, love, and lead.",
    date: "2026-04-26T09:00:00Z",
    preacher: "Pastor David Whitfield",
    series: "series-1",
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
  {
    id: "2",
    title: "Rooted in the Word",
    description: "Why daily Scripture is the soil of a fruitful life.",
    date: "2026-04-19T09:00:00Z",
    preacher: "Pastor Anna Reyes",
    series: "series-2",
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
  {
    id: "3",
    title: "The Prodigal Heart",
    description: "Luke 15 through fresh eyes.",
    date: "2026-04-12T09:00:00Z",
    preacher: "Pastor David Whitfield",
    series: "series-3",
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
  {
    id: "4",
    title: "Blessed Are the Meek",
    description: "The third Beatitude.",
    date: "2026-04-05T09:00:00Z",
    preacher: "Pastor Marcus Hale",
    series: "series-4",
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
  {
    id: "5",
    title: "When Prayers Feel Unanswered",
    description: "On waiting, lament, and the God who hears the silence.",
    date: "2026-03-29T09:00:00Z",
    preacher: "Pastor Anna Reyes",
    series: null,
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
  {
    id: "6",
    title: "The Table We Share",
    description: "Communion as a radical act of belonging.",
    date: "2026-03-22T09:00:00Z",
    preacher: "Pastor David Whitfield",
    series: null,
    video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    podcast_link: "",
    likes: 0,
    comments: "",
    next_sermon: null,
    previous_sermon: null,
    resource: null,
    resource_details: null,
  },
];

const seedEvents: ChurchEvent[] = [
  {
    id: "1",
    name: "Spring Community Dinner",
    description: "An evening of shared food and shared stories.",
    flyer: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    location: "Fellowship Hall",
    date: "2026-05-15",
    end_date: "2026-05-15",
    days: 1,
    start_time: "18:00:00",
    end_time: "21:00:00",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Youth Retreat Weekend",
    description: "Three days at Lake Pinecrest.",
    flyer: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    location: "Lake Pinecrest Camp",
    date: "2026-05-22",
    end_date: "2026-05-24",
    days: 3,
    start_time: "16:00:00",
    end_time: "14:00:00",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Global Missions Sunday",
    description: "Highlighting the work of our partners.",
    flyer: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
    location: "Main Sanctuary",
    date: "2026-06-01",
    end_date: "2026-06-01",
    days: 1,
    start_time: "09:00:00",
    end_time: "12:00:00",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Summer Baptism Service",
    description: "Open-air baptism at the river.",
    flyer: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200&q=80",
    location: "Riverside Park",
    date: "2026-06-14",
    end_date: "2026-06-14",
    days: 1,
    start_time: "10:00:00",
    end_time: "12:00:00",
    created_at: new Date().toISOString(),
  },
];

const seedAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Easter Services — Thank You",
    content:
      "Over 1,800 of you joined across our four services. Photos and the message archive are now available.",
    date: "2026-04-22T08:00:00Z",
  },
  {
    id: "2",
    title: "Spring Small Groups Now Open",
    content: "Twelve new groups are forming this season. Sign up by May 1.",
    date: "2026-04-18T08:00:00Z",
  },
  {
    id: "3",
    title: "Sanctuary Renovation Update",
    content: "Phase one wraps up next month. Thank you for your patience.",
    date: "2026-04-10T08:00:00Z",
  },
  {
    id: "4",
    title: "Volunteer Appreciation Brunch",
    content: "Join us Sunday May 5 at 12:30 for brunch on the lawn.",
    date: "2026-04-03T08:00:00Z",
  },
];

const seedGallery: GalleryProgram[] = [
  {
    id: "1",
    title: "Easter 2026",
    description: "Sunrise service and the Easter brunch.",
    venue: "Main Sanctuary",
    likes: 0,
    date: "2026-04-05T09:00:00Z",
    images: [
      {
        id: "img-1",
        gallery: "1",
        title: "Sunrise service",
        image: "https://images.unsplash.com/photo-1521900444019-d3ff2ae65a52?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2026-04-05T09:00:00Z",
      },
      {
        id: "img-2",
        gallery: "1",
        title: "Choir rehearsal",
        image: "https://images.unsplash.com/photo-1490131784822-d7ddb4cfc11d?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2026-04-05T09:00:00Z",
      },
      {
        id: "img-3",
        gallery: "1",
        title: "",
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2026-04-05T09:00:00Z",
      },
      {
        id: "img-4",
        gallery: "1",
        title: "Easter brunch",
        image: "https://images.unsplash.com/photo-1586556830295-50a5d23ff7e3?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2026-04-05T09:00:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Youth Camp 2025",
    description: "Five days at Lake Pinecrest.",
    venue: "Lake Pinecrest",
    likes: 0,
    date: "2025-07-10T09:00:00Z",
    images: [
      {
        id: "img-5",
        gallery: "2",
        title: "",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2025-07-10T09:00:00Z",
      },
      {
        id: "img-6",
        gallery: "2",
        title: "",
        image: "https://images.unsplash.com/photo-1504718855392-c0fe7eee0a3e?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2025-07-10T09:00:00Z",
      },
      {
        id: "img-7",
        gallery: "2",
        title: "",
        image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2025-07-10T09:00:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Christmas Eve 2025",
    description: "Candlelight service.",
    venue: "Main Sanctuary",
    likes: 0,
    date: "2025-12-24T18:00:00Z",
    images: [
      {
        id: "img-8",
        gallery: "3",
        title: "",
        image: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2025-12-24T18:00:00Z",
      },
      {
        id: "img-9",
        gallery: "3",
        title: "",
        image: "https://images.unsplash.com/photo-1482330454287-3cf6469df49e?w=1200&q=80",
        description: "",
        venue: "",
        likes: 0,
        date: "2025-12-24T18:00:00Z",
      },
    ],
  },
];

const seedSettings: Settings = {
  churchName: "Grace Cathedral",
  tagline: "A community of faith, hope, and love in the heart of the city.",
  logoUrl: "",
  bannerImageUrl: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80",
  phone: "+1 (555) 123-4567",
  email: "hello@gracecathedral.org",
  address: "1200 Cathedral Lane, Springfield, IL 62701",
  serviceTimes: [
    "Sunday 9:00 AM — Worship",
    "Sunday 11:00 AM — Family Service",
    "Wednesday 7:00 PM — Bible Study",
  ],
  socials: { facebook: "", instagram: "", youtube: "", twitter: "" },
};

const seedGivings: Giving[] = [
  {
    id: "giv-1",
    name: "James Osei",
    email: "james.osei@email.com",
    phone: "+233 24 000 1111",
    amount: 500,
    currency: "GHS",
    category: "tithe",
    message: "Grateful for God's provision.",
    anonymous: false,
    status: "completed",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "giv-2",
    name: "Abena Mensah",
    email: "abena.mensah@email.com",
    amount: 200,
    currency: "GHS",
    category: "offering",
    anonymous: false,
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "giv-3",
    name: "Anonymous ",
    email: "anon@gracecathedral.org",
    amount: 1000,
    currency: "GHS",
    category: "building-fund",
    message: "For the sanctuary renovation.",
    anonymous: true,
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "giv-4",
    name: "Kwame Asante",
    email: "kwame.asante@email.com",
    amount: 150,
    currency: "GHS",
    category: "missions",
    anonymous: false,
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "giv-5",
    name: "Ama Darko",
    email: "ama.darko@email.com",
    amount: 75,
    currency: "GHS",
    category: "benevolence",
    message: "To help those in need.",
    anonymous: false,
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "giv-6",
    name: "Kofi Boateng",
    email: "kofi.boateng@email.com",
    amount: 300,
    currency: "GHS",
    category: "tithe",
    anonymous: false,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
];

const seedResources: Resource[] = [
  {
    id: "res-1",
    name: "The Purpose Driven Life",
    purchase_link: "https://www.amazon.com/dp/0310337508",
    price: "GH₵80",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    description: "Rick Warren's classic guide to discovering why you are alive. A transformative read for anyone searching for meaning and direction.",
  },
  {
    id: "res-3",
    name: "Children's Study Bible (NIV)",
    purchase_link: "https://www.amazon.com/dp/031075147X",
    price: "GH₵120",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    description: "Illustrated NIV Study Bibles for children ages 6–12. A wonderful gift for any young believer.",
  },
  {
    id: "res-4",
    name: "Worship Song Binder",
    purchase_link: "/contact",
    price: "Free",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    description: "Printed binders with hymns and contemporary worship songs used in our services. Great for home worship or small group practice.",
  },
  {
    id: "res-7",
    name: "Sermon Series DVD Set",
    purchase_link: "/contact",
    price: "Free",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    description: "Recorded DVD collections from our Romans: Reborn and Foundations sermon series. Perfect for small group studies.",
  },
];

const seedPrayerRequests: PrayerRequest[] = [
  {
    id: "pr-1",
    name: "Akosua Mensah",
    phone: "+233 24 111 2222",
    subject: "Recovery from surgery",
    request:
      "Please pray for my full recovery after my knee surgery last week. I trust God for healing.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pr-2",
    name: "Kwabena Asante",
    subject: "Restoration of my marriage",
    request:
      "My wife and I have been struggling for months. I believe God can restore what is broken. Please stand with me in prayer.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pr-3",
    name: "Anonymous",
    subject: "Financial breakthrough",
    request:
      "I am going through a very difficult financial season. Please pray for provision and wisdom.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pr-4",
    name: "Esi Darko",
    subject: "Prayer for my children",
    request:
      "My two teenagers have drifted from faith. I am asking for prayers that they would encounter God personally.",

    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "pr-5",
    name: "Emmanuel Ofori",
    subject: "Career decision",
    request:
      "I have a major career decision before me. Please pray that God guides me to the right path.",

    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "pr-6",
    name: "Abena Boateng",
    subject: "Praising God for a new baby",
    request:
      "After years of waiting, God blessed us with a baby girl. I want to give thanks and share this joy with the church family.",

    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const seedLive: LiveStatus = {
  isLive: false,
  streamUrl: "",
  nextService: "Sunday at 9:00 AM",
  stream: null,
};

const today = new Date();
const dayOffset = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

// const seedDevotions: Devotion[] = [
//   {
//     id: "dev-1",
//     title: "Anchored in Hope",
//     Bible_verse: "Hebrews 6:19 — We have this hope as an anchor for the soul, firm and secure.",
//     content:
//       "Hope is not a vague optimism. It is the steady weight that keeps the soul from drifting when storms rise. The writer of Hebrews chose his metaphor with care — an anchor does not stop the waves, it keeps the ship from being swept away.\n\nToday, whatever swirls around you, remember: the anchor is not in your circumstances. It is in the One who holds them.",
//     prayer:
//       "Father, when the waters around me are restless, anchor me in You. Let my soul find its rest in Your unchanging love. Amen.",
//     reflection:
//       "What 'storm' am I facing today, and where am I tempted to drop anchor instead of trusting God?",
//     thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80",
//     date: dayOffset(0),
//     reflections: [],
//   },
//   {
//     id: "dev-2",
//     title: "The Quiet Place",
//     Bible_verse:
//       "Mark 1:35 — Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
//     content:
//       "Even Jesus needed quiet. If the Son of God carved out time alone with the Father, what does that say about our need for stillness?\n\nThe noise of the world will gladly fill every hour. But the soul is shaped in silence.",
//     prayer:
//       "Lord, teach me to seek You in the quiet. Help me to value stillness more than productivity. Amen.",
//     reflection: "Where in my day could I create even ten minutes of silence with God?",
//     thumbnail: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1600&q=80",
//     date: dayOffset(1),
//     reflections: [],
//   },
//   {
//     id: "dev-3",
//     title: "Small Acts, Great Love",
//     Bible_verse:
//       "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
//     content:
//       "We often wait for the 'big moment' to serve God. But faith is mostly built in the small, unseen choices — the kind word, the patient reply, the quiet prayer for a stranger.\n\nLove is not measured by spectacle. It is measured by faithfulness.",
//     prayer:
//       "Jesus, give me eyes to see the small holy moments today. Let me serve You in them with joy. Amen.",
//     reflection: "What 'small' thing can I do today as an act of love for God?",
//     thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
//     date: dayOffset(2),
//     reflections: [],
//   },
//   {
//     id: "dev-4",
//     title: "Grace That Runs",
//     Bible_verse:
//       "Luke 15:20 — But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son.",
//     content:
//       "We picture God as patient — and He is. But the parable of the prodigal shows us a God who runs. Grace is not stoic. It is eager. It searches the horizon.\n\nWhatever you've done, however far you've wandered, the Father is already running.",
//     prayer: "Father, thank You for a love that runs to meet me. Help me to come home today. Amen.",
//     reflection: "Is there an area of my life where I've been afraid to come back to God?",
//     thumbnail: "https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=1600&q=80",
//     date: dayOffset(3),
//     reflections: [],
//   },
//   {
//     id: "dev-5",
//     title: "A Lamp to My Feet",
//     Bible_verse: "Psalm 119:105 — Your word is a lamp for my feet, a light on my path.",
//     content:
//       "Notice the scope of the light: a lamp for the feet, not a spotlight for the horizon. God rarely shows the whole journey. He shows the next step.\n\nFaithfulness is taking that step in the light He gives.",
//     prayer:
//       "Lord, give me the courage to walk in the light I have today, trusting You for tomorrow's. Amen.",
//     reflection: "What is the next faithful step in front of me right now?",
//     thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80",
//     date: dayOffset(4),
//     reflections: [],
//   },
//   {
//     id: "dev-6",
//     title: "Be Still",
//     Bible_verse: "Psalm 46:10 — Be still, and know that I am God.",
//     content:
//       "Stillness is not passivity. It is active trust. To be still is to stop trying to be God of your own life and to let Him be God.\n\nThis verse is an invitation, not a command to perform.",
//     prayer: "God, slow my racing heart. Help me to know You — not just about You — today. Amen.",
//     reflection: "What am I trying to control that I need to release into God's hands?",
//     thumbnail: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1600&q=80",
//     date: dayOffset(5),
//     reflections: [],
//   },
// ];

export const seed = (): Store => ({
  sermons: structuredClone(seedSermons),
  series: structuredClone(seedSeries),
  events: structuredClone(seedEvents),
  announcements: structuredClone(seedAnnouncements),
  gallery: structuredClone(seedGallery),
  // devotions: structuredClone(seedDevotions),
  givings: structuredClone(seedGivings),
  prayerRequests: structuredClone(seedPrayerRequests),
  resources: structuredClone(seedResources),
  settings: structuredClone(seedSettings),
  live: structuredClone(seedLive),
});

export function loadStore(): Store {
  if (typeof localStorage === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as Partial<Store>;
    const base = seed();
    const arr = <T>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) ? v : fallback);
    const merged: Store = {
      sermons: arr(parsed.sermons, base.sermons),
      series: arr(parsed.series, base.series),
      events: arr(parsed.events, base.events),
      announcements: arr(parsed.announcements, base.announcements),
      gallery: arr(parsed.gallery, base.gallery),
      // devotions: arr(parsed.devotions, base.devotions),
      givings: arr(parsed.givings, base.givings),
      prayerRequests: arr(parsed.prayerRequests, base.prayerRequests),
      resources: arr(parsed.resources, base.resources),
      settings: {
        ...base.settings,
        ...(parsed.settings ?? {}),
        socials: { ...base.settings.socials, ...(parsed.settings?.socials ?? {}) },
      },
      live: { ...base.live, ...(parsed.live ?? {}) },
    };
    return merged;
  } catch {
    return seed();
  }
}

export function saveStore(s: Store) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetStore() {
  if (typeof localStorage === "undefined") return seed();
  const s = seed();
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
