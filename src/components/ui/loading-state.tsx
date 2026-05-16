import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconClassName?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  className,
  iconClassName 
}: LoadingStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-700", 
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-center">
        {/* Decorative background glow */}
        <div className="absolute h-12 w-12 rounded-full bg-primary/10 blur-xl animate-pulse" />
        
        {/* Main Spinner */}
        <Loader2 
          className={cn(
            "h-10 w-10 animate-spin text-primary transition-all", 
            iconClassName
          )} 
        />
      </div>
      
      {message && (
        <p className="text-sm font-medium tracking-wide text-ink-muted/80 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
