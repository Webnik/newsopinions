import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageSquare, Calendar } from "lucide-react";

const article = {
  title: "The Real Impact of AI on Modern Journalism",
  author: {
    name: "Sarah Chen",
    image: "https://i.pravatar.cc/150?u=sarah",
    role: "Technology Analyst",
    bio: "Award-winning tech analyst covering AI and digital transformation"
  },
  date: "March 15, 2024",
  content: `
    As artificial intelligence continues to evolve, its influence on journalism raises important questions about authenticity and trust. The integration of AI tools in newsrooms has sparked debates about the future of human-written content and editorial judgment.

    While AI can process vast amounts of data and generate basic news reports, the nuanced understanding required for opinion pieces remains uniquely human. The ability to contextualize information, draw from personal experience, and craft compelling narratives is what sets opinion journalism apart.

    However, we cannot ignore the potential of AI to enhance opinion journalism. From research assistance to content optimization, AI tools can augment human capabilities without replacing the essential human element of opinion writing.
  `,
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80"
};

export default function ArticleDetail() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            <div className="flex items-center justify-between border-y py-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={article.author.image} alt={article.author.name} />
                  <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{article.author.name}</h4>
                  <p className="text-sm text-muted-foreground">{article.author.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Comment
                </Button>
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
            <div className="flex items-center space-x-2 text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              <time>{article.date}</time>
            </div>
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="mt-12 border-t pt-8">
            <div className="bg-accent/10 p-6 rounded-lg">
              <h3 className="font-medium mb-2">About the Author</h3>
              <p className="text-muted-foreground">{article.author.bio}</p>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}