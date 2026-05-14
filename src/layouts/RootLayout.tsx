import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LiveIndicator from "@/components/LiveIndicator";
import { useLive } from "@/services/queries";
import { use, useEffect } from "react";
import { useLiveStore } from "@/store/live";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { data: live } = useLive();
  const setLiveStatus = useLiveStore((state) => state.setLiveStatus);

  useEffect(() => {
    if (live) {
      setLiveStatus(live);
    }
  }, [live, setLiveStatus]);

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
