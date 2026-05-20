import { Link } from "react-router-dom";
import {
  useSermons,
  useSeries,
  useEvents,
  useAnnouncements,
  useGallery,
  useDevotions,
  useLive,
} from "@/services/queries";
import {
  Mic,
  BookMarked,
  CalendarDays,
  Megaphone,
  Images,
  Radio,
  Settings as SettingsIcon,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const sermons = useSermons();
  const series = useSeries();
  const events = useEvents();
  const announcements = useAnnouncements();
  const gallery = useGallery();
  const devotions = useDevotions();
  const live = useLive();

  const cards = [
    {
      to: "/admin/sermons",
      label: "Sermons",
      icon: Mic,
      count: sermons.data?.length || 0,
      isLoading: sermons.isLoading,
    },
    {
      to: "/admin/series",
      label: "Series",
      icon: BookMarked,
      count: series.data?.length || 0,
      isLoading: series.isLoading,
    },
    {
      to: "/admin/devotions",
      label: "Devotions",
      icon: BookOpen,
      count: devotions.data?.length || 0,
      isLoading: devotions.isLoading,
    },
    {
      to: "/admin/events",
      label: "Events",
      icon: CalendarDays,
      count: events.data?.length || 0,
      isLoading: events.isLoading,
    },
    {
      to: "/admin/announcements",
      label: "Announcements",
      icon: Megaphone,
      count: announcements.data?.length || 0,
      isLoading: announcements.isLoading,
    },
    {
      to: "/admin/gallery",
      label: "Gallery",
      icon: Images,
      count: gallery.data?.length || 0,
      isLoading: gallery.isLoading,
    },
    {
      to: "/admin/live",
      label: "Live stream",
      icon: Radio,
      count: live.data?.isLive ? "ON" : "OFF",
      isLoading: live.isLoading,
    },
    { to: "/admin/settings", label: "Settings", icon: SettingsIcon, count: "—", isLoading: false },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">Dashboard</h1>
      <p className="mt-2 text-ink-muted">Manage church content.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="block bg-background rounded-2xl border border-border p-6 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-primary" />
                {c.isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <span className="font-display text-3xl text-ink">{c.count}</span>
                )}
              </div>
              <div className="mt-4 font-medium text-ink">{c.label}</div>
              <div className="text-xs text-ink-muted mt-1">Manage →</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
