import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const discussions = [
  {
    id: "9",
    title: "The Ethics of AI in Healthcare",
    comments: 342,
    author: "Dr. Rachel Chen",
    excerpt: "When algorithms make life-or-death decisions"
  },
  {
    id: "10",
    title: "Cryptocurrency: A Democratic Revolution?",
    comments: 289,
    author: "Mark Stevens",
    excerpt: "Examining the claims of financial inclusivity"
  },
  {
    id: "11",
    title: "The Future of Urban Planning",
    comments: 245,
    author: "Sofia Patel",
    excerpt: "Rethinking cities in the post-pandemic era"
  }
];

export function MostDiscussed() {
  return (
    <section className="py-12 bg-accent/5 rounded-lg my-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <MessageSquare className="text-accent h-6 w-6" />
          <h2 className="font-serif text-2xl font-bold">Most Discussed</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {discussions.map((item) => (
            <Link key={item.id} to={`/article/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                    <span className="text-accent font-medium">
                      {item.comments}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <span className="text-sm text-muted-foreground">By {item.author}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}