import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LiveIndicator from "@/components/LiveIndicator";
import { useLive, useSettings } from "@/services/queries";
import { use, useEffect, useState } from "react";
import { useLiveStore } from "@/store/live";
import PageLoad from "@/components/PageLoad";
import { useSiteSetting } from "@/store/setting";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const { data: live } = useLive();
  const [loadingPage, setLoadingPage] = useState(true);
  const {data: settings} = useSettings()
  const setSettingsData = useSiteSetting(store => store.setData)
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
  if (settings) {
    setSettingsData(settings);
  }
}, [live, setLiveStatus, settings]);

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
    </div>
  );
}
