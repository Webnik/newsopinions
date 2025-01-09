import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowerCount } from "@/components/FollowerCount";
import { BookmarkButton } from "@/components/BookmarkButton";
import { LikeButton } from "@/components/LikeButton";
import { ShareButton } from "@/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface Author {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  category?: string;
  coverImage?: string;
  className?: string;
}

// Placeholder images from Unsplash for consistent fallbacks
const PLACEHOLDER_IMAGES = {
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  cover: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
};

export function ArticleCard({
  id,
  title,
  excerpt,
  author,
  date,
  category,
  coverImage,
  className = "",
}: ArticleCardProps) {
  // Only show follower count if we have a valid UUID for the author
  const showFollowerCount = author.id && author.id !== 'anonymous' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(author.id);

  return (
    <Card className={`overflow-hidden ${className}`}>
      {(coverImage || PLACEHOLDER_IMAGES.cover) && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={coverImage || PLACEHOLDER_IMAGES.cover}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={author.image || PLACEHOLDER_IMAGES.avatar} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{author.name}</div>
              {author.role && (
                <div className="text-sm text-muted-foreground">{author.role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <CalendarDays className="mr-1 h-4 w-4" />
            {date}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
        {category && (
          <Badge variant="secondary" className="mt-4">
            {category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showFollowerCount && <FollowerCount profileId={author.id} />}
        </div>
        <div className="flex items-center space-x-2">
          <LikeButton articleId={id} />
          <BookmarkButton articleId={id} />
          <ShareButton articleId={id} title={title} />
        </div>
      </CardFooter>
    </Card>
  );
}