import { PodcastIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LiveIndicator = () => {
  return (
    <Link to={"/live"}>
      <div className="bg-primary p-2 rounded-l-full group animate-in">
        <div className="flex items-center gap-1.5">
          <div>
            <PodcastIcon className="text-green-300 animate-pulse" />
          </div>
          <p className="hidden group-hover:block text-white text-xs ">Live</p>
        </div>
      </div>
    </Link>
  );
};

export default LiveIndicator;
