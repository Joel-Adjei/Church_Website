import { PodcastIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LiveIndicator = () => {
  return (
    <Link 
      to="/live" 
      className="group relative flex items-center"
    >
      <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-2 rounded-l-full shadow-lg border border-red-500/20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:pl-5 group-hover:bg-red-600 animate-float-pulse">
        <div className="relative flex items-center justify-center">
          {/* Animated ping rings */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75"></span>
          <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-white/60 opacity-50 [animation-delay:0.5s]"></span>
          
          <PodcastIcon className="w-4 h-4 text-white relative z-10" />
        </div>
        
        <div className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:grid-cols-[1fr] overflow-hidden">
          <div className="min-w-0">
            <p className="text-white text-[10px] font-bold uppercase tracking-widest pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Live
            </p>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect behind */}
      <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-l-full scale-0 group-hover:scale-110 transition-transform duration-500 -z-10"></div>
    </Link>
  );
};

export default LiveIndicator;
