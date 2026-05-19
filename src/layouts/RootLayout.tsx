import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LiveIndicator from "@/components/LiveIndicator";
import { useLive } from "@/services/queries";
import { use, useEffect, useState } from "react";
import { useLiveStore } from "@/store/live";
import PageLoad from "@/components/PageLoad";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { data: live } = useLive();
  const [loadingPage, setLoadingPage] = useState(true);
  const setLiveStatus = useLiveStore((state) => state.setLiveStatus);
  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 1200);
  }, []);

  useEffect(() => {
    if (live) {
      setLiveStatus(live);
    }
  }, [live, setLiveStatus]);

  if (loadingPage) {
    return <PageLoad />;
  }

  return (
    <div className="min-h-screen relative  flex flex-col bg-background">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && live?.isLive && (
        <div className="fixed top-1/5 right-0">
          <LiveIndicator />
        </div>
      )}
      <ScrollRestoration />
    </div>
  );
}
