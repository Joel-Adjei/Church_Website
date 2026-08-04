import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Radio, Heart, ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSettings } from "@/services/queries";
import { useLiveStore } from "@/store/live";
import { settings } from "@/utils/mockData";

type NavItem =
  | { type: "link"; to: string; label: string }
  | { type: "dropdown"; label: string; children: { to: string; label: string }[] };

const navItems: NavItem[] = [
  { type: "link", to: "/", label: "Home" },
  { type: "link", to: "/about", label: "Know Us" },

  {
    type: "dropdown",
    label: "Media",
    children: [
      { to: "/sermons", label: "Sermons" },
      { to: "/series", label: "Series" },
      // { to: "/devotions", label: "Devotions" },
      { to: "/gallery", label: "Gallery" },
    ],
  },
  {
    type: "dropdown",
    label: "Community",
    children: [
      { to: "/events", label: "Events" },
      { to: "/announcements", label: "News" },
      { to: "/prayer-request", label: "Prayer Requests" },
    ],
  },

  { to: "/devotions", type: "link", label: "Devotions" },
  // { type: "link", to: "/resources", label: "Resources" },
  { type: "link", to: "/contact", label: "Contact" },
];

function DropdownMenu({
  item,
  pathname,
}: {
  item: Extract<NavItem, { type: "dropdown" }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.children.some((c) => pathname.startsWith(c.to));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md",
          isActive ? "text-primary" : "text-ink-muted hover:text-primary",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[160px] rounded-lg border border-border bg-background shadow-lg py-1 z-50">
          {item.children.map((child) => {
            const active = pathname.startsWith(child.to);
            return (
              <Link
                key={child.to}
                to={child.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/5"
                    : "text-ink-muted hover:text-primary hover:bg-secondary",
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileDropdown({
  item,
  pathname,
  onNavigate,
}: {
  item: Extract<NavItem, { type: "dropdown" }>;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = item.children.some((c) => pathname.startsWith(c.to));

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between px-3 py-3 text-base font-medium rounded-md",
          isActive ? "text-primary" : "text-ink hover:bg-secondary",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-3 mb-1">
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className="px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-primary rounded-md hover:bg-secondary"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLive = useLiveStore((state) => state.isLive);
  const { data: siteSettings } = useSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 flex flex-col">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="h-16 border-b border-border flex items-center px-6">
                <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-primary text-primary-foreground font-display">
                    <img
                      src={siteSettings?.logo_url}
                      alt={siteSettings?.church_name}
                      className="size-full object-contain"
                    />
                  </div>
                  <span className="font-display text-md">
                    {siteSettings?.church_name ?? "Grace Cathedral"}
                  </span>
                </Link>
              </div>
              <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  if (item.type === "link") {
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="px-3 py-3 text-base font-medium text-ink hover:bg-secondary rounded-md"
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <MobileDropdown
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      onNavigate={() => setOpen(false)}
                    />
                  );
                })}
              </nav>
              <div className="border-t border-border p-4 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-1.5 border-primary text-primary"
                >
                  <Link to="/give" onClick={() => setOpen(false)}>
                    <Heart className="h-4 w-4" />
                    Give
                  </Link>
                </Button>
                {isLive && (
                  <Button asChild className="gap-1.5" size="lg">
                    <Link to="/live" onClick={() => setOpen(false)}>
                      <Radio className="h-4 w-4" />
                      Watch Live
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <div className="flex h-full w-19 rounded-full overflow-hidden items-center justify-center  ">
              <img
                src={siteSettings?.logo_url}
                alt={siteSettings?.church_name}
                className="size-full object-contain"
              />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight uppercase text-foreground group-hover:text-primary transition-colors">
              {siteSettings?.church_name ?? "Grace Cathedral"}
            </span>
          </Link>
        </div>
        <nav className="hidden h-full lg:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.type === "link") {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    active ? "text-primary" : "text-ink-muted hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            return <DropdownMenu key={item.label} item={item} pathname={pathname} />;
          })}
          <Button
            asChild
            size="sm"
            // variant=""
            className="ml-1 h-full! rounded-none gap-1.5 hover:bg-accent font-bold px-4 shadow-none  border-none hover:text-primary bg-primary text-primary-foreground"
          >
            <Link to="/give">
              <Heart className="h-3.5 w-3.5" />
              Give
            </Link>
          </Button>
          {isLive && (
            <Button asChild size="sm" className="hidden ml-1 gap-1.5">
              <Link to="/live">
                <Radio className="h-3.5 w-3.5" />
                Watch Live
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
