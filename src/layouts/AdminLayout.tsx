import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { getToken } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import {
  LogOut,
  LayoutDashboard,
  Mic,
  BookMarked,
  CalendarDays,
  Megaphone,
  Images,
  Settings as SettingsIcon,
  Radio,
  Menu,
  BookOpen,
  HandCoins,
  HeartHandshake,
  Package,
} from "lucide-react";
import { cn } from "@/utils/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/sermons", label: "Sermons", icon: Mic },
  { to: "/admin/series", label: "Series", icon: BookMarked },
  { to: "/admin/devotions", label: "Devotions", icon: BookOpen },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/givings", label: "Givings", icon: HandCoins },
  { to: "/admin/prayer-requests", label: "Prayer Requests", icon: HeartHandshake },
  { to: "/admin/resources", label: "Resources", icon: Package },
  { to: "/admin/live", label: "Live stream", icon: Radio },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-ink-muted hover:bg-secondary hover:text-ink",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!getToken() && pathname !== "/admin/login") {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(pathname)}`} replace />;
  }

  if (pathname === "/admin/login") return <Outlet />;

  const sidebarInner = (onNav?: () => void) => (
    <>
      <div className="h-16 border-b border-border flex items-center px-6">
        <Link to="/" className="flex items-center gap-2" onClick={onNav}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display">
            G
          </div>
          <span className="font-display text-lg">Admin</span>
        </Link>
      </div>
      <NavList pathname={pathname} onNavigate={onNav} />
      <div className="border-t border-border p-3">
        <div className="px-3 py-2 text-xs text-ink-muted truncate">{user?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen relative lg:flex bg-surface-elevated">
      <aside className="hidden h-screen fixed lg:flex w-64 shrink-0 border-r border-border bg-background flex-col">
        {sidebarInner()}
      </aside>

      <header className="lg:hidden sticky top-0 z-30 h-14 border-b border-border bg-background flex items-center gap-2 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 flex flex-col">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin navigation</SheetTitle>
            </SheetHeader>
            {sidebarInner(() => setOpen(false))}
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-sm">
            G
          </div>
          <span className="font-display">Admin</span>
        </Link>
      </header>

      <div className="flex-1 lg:pl-64  min-w-0">
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
