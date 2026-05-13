import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Give from "@/pages/Give";
import Live from "@/pages/Live";
import NotFound from "@/pages/NotFound";

import SermonsIndex from "@/pages/sermons/Index";
import SermonDetail from "@/pages/sermons/Detail";
import EventsIndex from "@/pages/events/Index";
import EventDetail from "@/pages/events/Detail";
import AnnouncementsIndex from "@/pages/announcements/Index";
import AnnouncementDetail from "@/pages/announcements/Detail";
import GalleryIndex from "@/pages/gallery/Index";
import GalleryDetail from "@/pages/gallery/Detail";
import DevotionsIndex from "@/pages/devotions/Index";
import DevotionDetail from "@/pages/devotions/Detail";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSermons from "@/pages/admin/Sermons";
import AdminSermonNew from "@/pages/admin/SermonNew";
import AdminSermonEdit from "@/pages/admin/SermonEdit";
import AdminSeries from "@/pages/admin/Series";
import AdminSeriesNew from "@/pages/admin/SeriesNew";
import AdminSeriesEdit from "@/pages/admin/SeriesEdit";
import AdminEvents from "@/pages/admin/Events";
import AdminEventNew from "@/pages/admin/EventNew";
import AdminEventEdit from "@/pages/admin/EventEdit";
import AdminAnnouncements from "@/pages/admin/Announcements";
import AdminAnnouncementNew from "@/pages/admin/AnnouncementNew";
import AdminAnnouncementEdit from "@/pages/admin/AnnouncementEdit";
import AdminGallery from "@/pages/admin/Gallery";
import AdminGalleryNew from "@/pages/admin/GalleryNew";
import AdminGalleryEdit from "@/pages/admin/GalleryEdit";
import AdminDevotions from "@/pages/admin/Devotions";
import AdminDevotionNew from "@/pages/admin/DevotionNew";
import AdminDevotionEdit from "@/pages/admin/DevotionEdit";
import AdminGivings from "@/pages/admin/Givings";
import AdminLive from "@/pages/admin/LiveStream";
import AdminSettings from "@/pages/admin/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "live", element: <Live /> },
      { path: "sermons", element: <SermonsIndex /> },
      { path: "sermons/:slug", element: <SermonDetail /> },
      { path: "events", element: <EventsIndex /> },
      { path: "events/:slug", element: <EventDetail /> },
      { path: "announcements", element: <AnnouncementsIndex /> },
      { path: "announcements/:slug", element: <AnnouncementDetail /> },
      { path: "gallery", element: <GalleryIndex /> },
      { path: "gallery/:slug", element: <GalleryDetail /> },
      { path: "devotions", element: <DevotionsIndex /> },
      { path: "devotions/:slug", element: <DevotionDetail /> },
      { path: "give", element: <Give /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "login", element: <AdminLogin /> },
      { path: "sermons", element: <AdminSermons /> },
      { path: "sermons/new", element: <AdminSermonNew /> },
      { path: "sermons/:id", element: <AdminSermonEdit /> },
      { path: "series", element: <AdminSeries /> },
      { path: "series/new", element: <AdminSeriesNew /> },
      { path: "series/:id", element: <AdminSeriesEdit /> },
      { path: "events", element: <AdminEvents /> },
      { path: "events/new", element: <AdminEventNew /> },
      { path: "events/:id", element: <AdminEventEdit /> },
      { path: "announcements", element: <AdminAnnouncements /> },
      { path: "announcements/new", element: <AdminAnnouncementNew /> },
      { path: "announcements/:id", element: <AdminAnnouncementEdit /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "gallery/new", element: <AdminGalleryNew /> },
      { path: "gallery/:id", element: <AdminGalleryEdit /> },
      { path: "devotions", element: <AdminDevotions /> },
      { path: "devotions/new", element: <AdminDevotionNew /> },
      { path: "devotions/:id", element: <AdminDevotionEdit /> },
      { path: "givings", element: <AdminGivings /> },
      { path: "live", element: <AdminLive /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
