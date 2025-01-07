import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const trendingOpinions = [
  {
    title: "Why AI Won't Replace Human Creativity",
    author: "Dr. Emma Chen",
    reads: "12.5K"
  },
  {
    title: "The Real Cost of Green Energy Transition",
    author: "Michael Rodriguez",
    reads: "10.2K"
  },
  {
    title: "Democracy's Digital Future",
    author: "Sarah Williams",
    reads: "8.7K"
  }
];

export function TrendingOpinions() {
  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl font-bold mb-6">Trending Opinions</h2>
      <div className="space-y-4">
        {trendingOpinions.map((opinion, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-2">{opinion.title}</h3>
                  <p className="text-sm text-muted-foreground">{opinion.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{opinion.reads} reads</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}