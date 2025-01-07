import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    id: "16",
    title: "The Week in Tech: AI's Ethical Boundaries",
    reads: "25.3K",
    author: "Maya Patel",
    excerpt: "Exploring the moral implications of AI development and deployment",
    date: "March 15, 2024"
  },
  {
    id: "17",
    title: "Global Markets: A Week of Uncertainty",
    reads: "18.7K",
    author: "Robert Chen",
    excerpt: "Analysis of market trends and economic indicators",
    date: "March 14, 2024"
  }
];

export function WeeklyHighlights() {
  return (
    <section className="bg-background rounded-lg p-6 border">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-accent h-5 w-5" />
        <h2 className="font-serif text-xl font-bold">Weekly Highlights</h2>
      </div>
      <div className="space-y-4">
        {highlights.map((highlight) => (
          <Link key={highlight.id} to={`/article/${highlight.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{highlight.excerpt}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span>{highlight.author}</span>
                  <span>•</span>
                  <span>{highlight.reads} reads</span>
                  <span>•</span>
                  <span>{highlight.date}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}