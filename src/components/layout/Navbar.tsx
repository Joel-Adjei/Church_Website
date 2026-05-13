import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Heart } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { settings } from "@/utils/mockData";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/sermons", label: "Sermons" },
  { to: "/devotions", label: "Devotions" },
  { to: "/events", label: "Events" },
  { to: "/announcements", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

const giveLink = { to: "/give", label: "Give" };

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">
            G
          </div>
          <span className="font-display text-xl tracking-tight text-ink">
            {settings.churchName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  active ? "text-primary" : "text-ink-muted hover:text-primary",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Button
            asChild
            size="sm"
            variant="outline"
            className="ml-1 gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/give">
              <Heart className="h-3.5 w-3.5" />
              Give
            </Link>
          </Button>
          <Button asChild size="sm" className="ml-1 gap-1.5">
            <Link to="/live">
              <Radio className="h-3.5 w-3.5" />
              Watch Live
            </Link>
          </Button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="absolute h-dvh w-full lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium text-ink hover:bg-secondary rounded-md"
              >
                {l.label}
              </Link>
            ))}
            <Button
              asChild
              variant="outline"
              size={"lg"}
              className="mt-3 gap-1.5 border-primary text-primary"
            >
              <Link to={giveLink.to} onClick={() => setOpen(false)}>
                <Heart className="h-4 w-4" />
                Give
              </Link>
            </Button>
            <Button asChild className="mt-2 gap-1.5" size={"lg"}>
              <Link to="/live" onClick={() => setOpen(false)}>
                <Radio className="h-4 w-4" />
                Watch Live
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
