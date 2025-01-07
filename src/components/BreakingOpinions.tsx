import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const breakingOpinions = [
  {
    id: "15",
    title: "Breaking: The Hidden Cost of Digital Privacy",
    author: "Alex Thompson"
  }
];

export function BreakingOpinions() {
  return (
    <div className="bg-accent/10 rounded-lg p-4 animate-fade-up">
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-accent h-5 w-5 animate-pulse" />
          {breakingOpinions.map((opinion) => (
            <Link 
              key={opinion.id}
              to={`/article/${opinion.id}`}
              className="text-sm md:text-base font-medium hover:text-accent transition-colors"
            >
              {opinion.title} - by {opinion.author}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}