import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface CommentListProps {
  comments?: Comment[];
  isLoading: boolean;
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar>
            <AvatarImage src={comment.author.avatar_url || undefined} />
            <AvatarFallback>
              {(comment.author.full_name?.[0] || comment.author.username?.[0] || "?").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {comment.author.full_name || comment.author.username || "Anonymous"}
            </div>
            <time className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </time>
            <p className="mt-2">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}