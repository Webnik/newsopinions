import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArticleCardProps {
  id?: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    image: string;
    role: string;
  };
  date: string;
}

export function ArticleCard({ title, excerpt, author, date }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-up">
      <CardHeader className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{author.name}</h4>
            <p className="text-sm text-muted-foreground">{author.role}</p>
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold hover:text-accent transition-colors">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <time className="text-sm text-muted-foreground">{date}</time>
      </CardContent>
    </Card>
  );
}