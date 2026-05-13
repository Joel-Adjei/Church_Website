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
  devotions: Devotion[];
  givings: Giving[];
  prayerRequests: PrayerRequest[];
  resources: Resource[];
  settings: Settings;
  live: LiveStatus;
};

const seedSeries: SermonSeries[] = [
  {
    id: "series-1",
    slug: "romans-reborn",
    title: "Romans: Reborn",
    description: "A nine-week walk through Paul's letter to the Romans.",
  },
  {
    id: "series-2",
    slug: "foundations",
    title: "Foundations",
    description: "The bedrock practices of a thriving spiritual life.",
  },
  {
    id: "series-3",
    slug: "parables",
    title: "Parables",
    description: "The teaching stories of Jesus, retold for today.",
  },
  {
    id: "series-4",
    slug: "sermon-on-the-mount",
    title: "Sermon on the Mount",
    description: "A summer in Matthew 5–7.",
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
    slug: "spring-community-dinner",
    title: "Spring Community Dinner",
    description: "An evening of shared food and shared stories.",
    startAt: "2026-05-15T18:00:00",
    endAt: "2026-05-15T21:00:00",
    location: "Fellowship Hall",
    bannerImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  },
  {
    id: "2",
    slug: "youth-retreat-weekend",
    title: "Youth Retreat Weekend",
    description: "Three days at Lake Pinecrest.",
    startAt: "2026-05-22T16:00:00",
    endAt: "2026-05-24T14:00:00",
    location: "Lake Pinecrest Camp",
    bannerImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
  },
  {
    id: "3",
    slug: "global-missions-sunday",
    title: "Global Missions Sunday",
    description: "Highlighting the work of our partners.",
    startAt: "2026-06-01T09:00:00",
    endAt: "2026-06-01T12:00:00",
    location: "Main Sanctuary",
    bannerImageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
  },
  {
    id: "4",
    slug: "summer-baptism-service",
    title: "Summer Baptism Service",
    description: "Open-air baptism at the river.",
    startAt: "2026-06-14T10:00:00",
    endAt: "2026-06-14T12:00:00",
    location: "Riverside Park",
    bannerImageUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200&q=80",
  },
];

const seedAnnouncements: Announcement[] = [
  {
    id: "1",
    slug: "easter-services-recap",
    title: "Easter Services — Thank You",
    body: "Over 1,800 of you joined across our four services. Photos and the message archive are now available.",
    imageUrl: "https://images.unsplash.com/photo-1586556830295-50a5d23ff7e3?w=1200&q=80",
    publishAt: "2026-04-22",
  },
  {
    id: "2",
    slug: "new-small-groups-spring",
    title: "Spring Small Groups Now Open",
    body: "Twelve new groups are forming this season. Sign up by May 1.",
    publishAt: "2026-04-18",
  },
  {
    id: "3",
    slug: "building-renovations-update",
    title: "Sanctuary Renovation Update",
    body: "Phase one wraps up next month. Thank you for your patience.",
    imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=1200&q=80",
    publishAt: "2026-04-10",
  },
  {
    id: "4",
    slug: "volunteer-appreciation",
    title: "Volunteer Appreciation Brunch",
    body: "Join us Sunday May 5 at 12:30 for brunch on the lawn.",
    publishAt: "2026-04-03",
  },
];

const seedGallery: GalleryProgram[] = [
  {
    id: "1",
    slug: "easter-2026",
    title: "Easter 2026",
    description: "Sunrise service and the Easter brunch.",
    coverImageUrl: "https://images.unsplash.com/photo-1521900444019-d3ff2ae65a52?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521900444019-d3ff2ae65a52?w=1200&q=80",
        caption: "Sunrise service",
      },
      {
        url: "https://images.unsplash.com/photo-1490131784822-d7ddb4cfc11d?w=1200&q=80",
        caption: "Choir rehearsal",
      },
      { url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80" },
      {
        url: "https://images.unsplash.com/photo-1586556830295-50a5d23ff7e3?w=1200&q=80",
        caption: "Easter brunch",
      },
    ],
  },
  {
    id: "2",
    slug: "youth-camp-2025",
    title: "Youth Camp 2025",
    description: "Five days at Lake Pinecrest.",
    coverImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1504718855392-c0fe7eee0a3e?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=1200&q=80" },
    ],
  },
  {
    id: "3",
    slug: "christmas-eve-2025",
    title: "Christmas Eve 2025",
    description: "Candlelight service.",
    coverImageUrl: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1482330454287-3cf6469df49e?w=1200&q=80" },
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
    firstName: "James",
    lastName: "Osei",
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
    firstName: "Abena",
    lastName: "Mensah",
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
    firstName: "Anonymous",
    lastName: "",
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
    firstName: "Kwame",
    lastName: "Asante",
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
    firstName: "Ama",
    lastName: "Darko",
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
    firstName: "Kofi",
    lastName: "Boateng",
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
    slug: "purpose-driven-life",
    title: "The Purpose Driven Life",
    description:
      "Rick Warren's classic guide to discovering why you are alive. Gently used, in great condition. A transformative read for anyone searching for meaning and direction.",
    category: "books",
    condition: "like-new",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    contactEmail: "library@gracecathedral.org",
    pickupLocation: "Church Library – Room 12",
    quantity: 3,
    featured: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "res-2",
    slug: "mens-suits-collection",
    title: "Men's Suits & Formal Wear",
    description:
      "A curated collection of gently used men's suits, dress shirts, and ties donated by church members. Available in various sizes (S–XL). Perfect for job interviews or special occasions.",
    category: "clothing",
    condition: "good",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    contactEmail: "benevolence@gracecathedral.org",
    pickupLocation: "Fellowship Hall – Donation Corner",
    quantity: 12,
    featured: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "res-3",
    slug: "childrens-study-bibles",
    title: "Children's Study Bibles",
    description:
      "Illustrated NIV Study Bibles for children ages 6–12. Donated by our Sunday School ministry. A wonderful gift for any young believer.",
    category: "books",
    condition: "good",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    pickupLocation: "Children's Ministry Office",
    quantity: 8,
    featured: false,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "res-4",
    slug: "worship-songbooks",
    title: "Worship Song Binders",
    description:
      "Printed binders with hymns and contemporary worship songs used in our services. Great for home worship or small group practice.",
    category: "stationery",
    condition: "good",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    pickupLocation: "Music Ministry – Sanctuary",
    quantity: 5,
    featured: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "res-5",
    slug: "laptop-for-ministry",
    title: "Laptop for Ministry Use",
    description:
      "A refurbished Dell laptop available on loan for church members needing computer access for job applications, school assignments, or ministry work. Must be returned within 2 weeks.",
    category: "equipment",
    condition: "fair",
    availability: "limited",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    contactEmail: "tech@gracecathedral.org",
    contactPhone: "+233 20 000 9999",
    pickupLocation: "Tech Ministry – Room 7",
    quantity: 1,
    featured: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "res-6",
    slug: "ladies-outfits",
    title: "Ladies' Outfits & Accessories",
    description:
      "Donated women's clothing including church dresses, blouses, and accessories. Sizes S–2XL. All items cleaned and ready to wear.",
    category: "clothing",
    condition: "good",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    contactEmail: "benevolence@gracecathedral.org",
    pickupLocation: "Fellowship Hall – Donation Corner",
    quantity: 20,
    featured: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "res-7",
    slug: "sermon-series-dvds",
    title: "Sermon Series DVD Set",
    description:
      "Recorded DVD collections from our Romans: Reborn and Foundations sermon series. Perfect for small group studies or personal use.",
    category: "digital",
    condition: "new",
    availability: "available",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    pickupLocation: "Church Office",
    quantity: 6,
    featured: false,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "res-8",
    slug: "non-perishable-food-hampers",
    title: "Non-Perishable Food Hampers",
    description:
      "Food hampers assembled by our benevolence team. Each hamper contains rice, canned goods, cooking oil, and other essentials. Available to families in need — please contact us.",
    category: "food",
    condition: "new",
    availability: "limited",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    contactEmail: "benevolence@gracecathedral.org",
    contactPhone: "+233 24 000 5555",
    pickupLocation: "Benevolence Office – Ground Floor",
    quantity: 4,
    featured: true,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

const seedPrayerRequests: PrayerRequest[] = [
  {
    id: "pr-1",
    firstName: "Akosua",
    lastName: "Mensah",
    email: "akosua@email.com",
    phone: "+233 24 111 2222",
    category: "healing",
    subject: "Recovery from surgery",
    request:
      "Please pray for my full recovery after my knee surgery last week. I trust God for healing.",
    privacy: "public",
    status: "praying",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pr-2",
    firstName: "Kwabena",
    lastName: "Asante",
    email: "kwabena@email.com",
    category: "family",
    subject: "Restoration of my marriage",
    request:
      "My wife and I have been struggling for months. I believe God can restore what is broken. Please stand with me in prayer.",
    privacy: "private",
    status: "new",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pr-3",
    firstName: "Anonymous",
    lastName: "",
    email: "anon@gracecathedral.org",
    category: "finances",
    subject: "Financial breakthrough",
    request:
      "I am going through a very difficult financial season. Please pray for provision and wisdom.",
    privacy: "anonymous",
    status: "new",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pr-4",
    firstName: "Esi",
    lastName: "Darko",
    email: "esi.darko@email.com",
    category: "salvation",
    subject: "Prayer for my children",
    request:
      "My two teenagers have drifted from faith. I am asking for prayers that they would encounter God personally.",
    privacy: "public",
    status: "praying",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "pr-5",
    firstName: "Emmanuel",
    lastName: "Ofori",
    email: "emmanuel@email.com",
    category: "guidance",
    subject: "Career decision",
    request:
      "I have a major career decision before me. Please pray that God guides me to the right path.",
    privacy: "public",
    status: "answered",
    adminNote: "Reached out and prayed with Emmanuel on May 10.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "pr-6",
    firstName: "Abena",
    lastName: "Boateng",
    email: "abena.b@email.com",
    category: "thanksgiving",
    subject: "Praising God for a new baby",
    request:
      "After years of waiting, God blessed us with a baby girl. I want to give thanks and share this joy with the church family.",
    privacy: "public",
    status: "answered",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

const seedLive: LiveStatus = {
  isLive: false,
  platform: "youtube",
  streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  nextService: "Sunday at 9:00 AM",
};

const today = new Date();
const dayOffset = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const seedDevotions: Devotion[] = [
  {
    id: "dev-1",
    slug: "anchored-in-hope",
    title: "Anchored in Hope",
    verseRef: "Hebrews 6:19",
    verseText: "We have this hope as an anchor for the soul, firm and secure.",
    content:
      "Hope is not a vague optimism. It is the steady weight that keeps the soul from drifting when storms rise. The writer of Hebrews chose his metaphor with care — an anchor does not stop the waves, it keeps the ship from being swept away.\n\nToday, whatever swirls around you, remember: the anchor is not in your circumstances. It is in the One who holds them.",
    prayer:
      "Father, when the waters around me are restless, anchor me in You. Let my soul find its rest in Your unchanging love. Amen.",
    reflection:
      "What 'storm' am I facing today, and where am I tempted to drop anchor instead of trusting God?",
    author: "Pastor Anna Reyes",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80",
    devotionDate: dayOffset(0),
    category: "Faith",
    status: "published",
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dev-2",
    slug: "the-quiet-place",
    title: "The Quiet Place",
    verseRef: "Mark 1:35",
    verseText:
      "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.",
    content:
      "Even Jesus needed quiet. If the Son of God carved out time alone with the Father, what does that say about our need for stillness?\n\nThe noise of the world will gladly fill every hour. But the soul is shaped in silence.",
    prayer:
      "Lord, teach me to seek You in the quiet. Help me to value stillness more than productivity. Amen.",
    reflection: "Where in my day could I create even ten minutes of silence with God?",
    author: "Pastor David Whitfield",
    imageUrl: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1600&q=80",
    devotionDate: dayOffset(1),
    category: "Prayer",
    status: "published",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dev-3",
    slug: "small-acts-great-love",
    title: "Small Acts, Great Love",
    verseRef: "Colossians 3:23",
    verseText:
      "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    content:
      "We often wait for the 'big moment' to serve God. But faith is mostly built in the small, unseen choices — the kind word, the patient reply, the quiet prayer for a stranger.\n\nLove is not measured by spectacle. It is measured by faithfulness.",
    prayer:
      "Jesus, give me eyes to see the small holy moments today. Let me serve You in them with joy. Amen.",
    reflection: "What 'small' thing can I do today as an act of love for God?",
    author: "Pastor Marcus Hale",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
    devotionDate: dayOffset(2),
    category: "Service",
    status: "published",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dev-4",
    slug: "grace-that-runs",
    title: "Grace That Runs",
    verseRef: "Luke 15:20",
    verseText:
      "But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son.",
    content:
      "We picture God as patient — and He is. But the parable of the prodigal shows us a God who runs. Grace is not stoic. It is eager. It searches the horizon.\n\nWhatever you've done, however far you've wandered, the Father is already running.",
    prayer: "Father, thank You for a love that runs to meet me. Help me to come home today. Amen.",
    reflection: "Is there an area of my life where I've been afraid to come back to God?",
    author: "Pastor Anna Reyes",
    imageUrl: "https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=1600&q=80",
    devotionDate: dayOffset(3),
    category: "Grace",
    status: "published",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dev-5",
    slug: "lamp-to-my-feet",
    title: "A Lamp to My Feet",
    verseRef: "Psalm 119:105",
    verseText: "Your word is a lamp for my feet, a light on my path.",
    content:
      "Notice the scope of the light: a lamp for the feet, not a spotlight for the horizon. God rarely shows the whole journey. He shows the next step.\n\nFaithfulness is taking that step in the light He gives.",
    prayer:
      "Lord, give me the courage to walk in the light I have today, trusting You for tomorrow's. Amen.",
    reflection: "What is the next faithful step in front of me right now?",
    author: "Pastor David Whitfield",
    imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80",
    devotionDate: dayOffset(4),
    category: "Scripture",
    status: "published",
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "dev-6",
    slug: "be-still",
    title: "Be Still",
    verseRef: "Psalm 46:10",
    verseText: "Be still, and know that I am God.",
    content:
      "Stillness is not passivity. It is active trust. To be still is to stop trying to be God of your own life and to let Him be God.\n\nThis verse is an invitation, not a command to perform.",
    prayer: "God, slow my racing heart. Help me to know You — not just about You — today. Amen.",
    reflection: "What am I trying to control that I need to release into God's hands?",
    author: "Pastor Anna Reyes",
    imageUrl: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1600&q=80",
    devotionDate: dayOffset(5),
    category: "Faith",
    status: "published",
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export const seed = (): Store => ({
  sermons: structuredClone(seedSermons),
  series: structuredClone(seedSeries),
  events: structuredClone(seedEvents),
  announcements: structuredClone(seedAnnouncements),
  gallery: structuredClone(seedGallery),
  devotions: structuredClone(seedDevotions),
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
      devotions: arr(parsed.devotions, base.devotions),
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
