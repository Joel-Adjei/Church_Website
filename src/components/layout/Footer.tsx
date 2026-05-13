import { Link } from "react-router-dom";
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { settings } from "@/utils/mockData";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">G</div>
            <span className="font-display text-xl text-ink">{settings.churchName}</span>
          </div>
          <p className="text-ink-muted max-w-md leading-relaxed">{settings.tagline}</p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Youtube, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border text-ink-muted hover:text-primary hover:border-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base mb-4 text-ink">Visit</h4>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{settings.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" />{settings.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" />{settings.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-4 text-ink">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[["/sermons","Sermons"],["/events","Events"],["/gallery","Gallery"],["/live","Live Service"],["/contact","Contact"]].map(([to,label]) => (
              <li key={to}><Link to={to} className="text-ink-muted hover:text-primary">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-muted">
          <span>© {new Date().getFullYear()} {settings.churchName}. All rights reserved.</span>
          <span>Made with care for our community.</span>
        </div>
      </div>
    </footer>
  );
}
