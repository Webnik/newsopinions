import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { ShareModal } from "@/components/ShareModal";

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

export function ArticleCard({ id, title, excerpt, author, date }: ArticleCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-up">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={author.image} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-sm">{author.name}</h4>
              <p className="text-sm text-muted-foreground">{author.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setIsShareModalOpen(true);
            }}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="font-serif text-2xl font-bold hover:text-accent transition-colors">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <time className="text-sm text-muted-foreground">{date}</time>
      </CardContent>
      {id && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          articleId={id}
          articleTitle={title}
        />
      )}
    </Card>
  );
}