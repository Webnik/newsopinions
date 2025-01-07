import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const editorsPicks = [
  {
    id: "4",
    title: "The Future of Work: A Critical Analysis",
    excerpt: "Remote work has changed everything - but what's next?",
    author: {
      name: "James Wilson",
      image: "https://i.pravatar.cc/150?u=james",
      role: "Future of Work Editor"
    },
    date: "March 13, 2024"
  },
  {
    id: "5",
    title: "Social Media's Impact on Democracy",
    excerpt: "Are we seeing the end of rational discourse?",
    author: {
      name: "Lisa Chen",
      image: "https://i.pravatar.cc/150?u=lisa",
      role: "Social Media Analyst"
    },
    date: "March 12, 2024"
  }
];

export function EditorsPicks() {
  return (
    <section className="py-12 bg-accent/5 rounded-lg my-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Star className="text-accent h-6 w-6" />
          <h2 className="font-serif text-2xl font-bold">Editor's Picks</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {editorsPicks.map((pick) => (
            <Link key={pick.id} to={`/article/${pick.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={pick.author.image} alt={pick.author.name} />
                      <AvatarFallback>{pick.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{pick.author.name}</h4>
                      <p className="text-sm text-muted-foreground">{pick.author.role}</p>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">{pick.title}</h3>
                  <p className="text-muted-foreground">{pick.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}