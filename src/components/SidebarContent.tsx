import { TrendingOpinions } from "@/components/TrendingOpinions";
import { WeeklyHighlights } from "@/components/WeeklyHighlights";
import { OpinionPolls } from "@/components/OpinionPolls";

export function SidebarContent() {
  return (
    <div className="space-y-8">
      <TrendingOpinions />
      <WeeklyHighlights />
      <OpinionPolls />
    </div>
  );
}