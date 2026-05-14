import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist. Head back to Grace Cathedral's home page." />
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="mt-4 font-display text-2xl text-ink">Page not found</h2>
        <p className="mt-2 text-ink-muted">The page you're looking for has wandered off.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Return home
        </Link>
      </div>
    </div>
  );
}
