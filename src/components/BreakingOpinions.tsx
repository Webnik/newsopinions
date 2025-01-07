import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const breakingOpinions = [
  {
    id: "15",
    title: "Breaking: The Hidden Cost of Digital Privacy",
    author: "Alex Thompson",
    time: "10 minutes ago"
  }
];

export function BreakingOpinions() {
  return (
    <div className="bg-accent/10 rounded-lg p-4 animate-fade-up">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-accent h-5 w-5 animate-pulse" />
            <span className="font-bold text-accent">Breaking Opinion</span>
          </div>
          {breakingOpinions.map((opinion) => (
            <Link 
              key={opinion.id}
              to={`/article/${opinion.id}`}
              className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <span className="text-sm md:text-base font-medium hover:text-accent transition-colors">
                {opinion.title}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>by {opinion.author}</span>
                <span>•</span>
                <span>{opinion.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}