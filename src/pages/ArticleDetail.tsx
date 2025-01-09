import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comments } from "@/components/Comments";
import { ShareAnalytics } from "@/components/ShareAnalytics";
import { ViewTracker } from "@/components/ViewTracker";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          author:profiles(
            full_name,
            username,
            avatar_url,
            role
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: viewCount } = useQuery({
    queryKey: ["articleViews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_article_view_count', { article_id: id });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {id && <ViewTracker articleId={id} />}
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl font-bold">{article.title}</h1>
        <div className="text-sm text-muted-foreground">
          {viewCount !== null && (
            <p>{viewCount} view{viewCount === 1 ? '' : 's'}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <Avatar>
          <AvatarImage src={article.author.avatar_url || undefined} />
          <AvatarFallback>
            {(article.author.full_name?.[0] || article.author.username?.[0] || "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">
            {article.author.full_name || article.author.username || "Anonymous"}
          </div>
          <div className="text-sm text-muted-foreground">{article.author.role}</div>
        </div>
      </div>

      {article.cover_image && (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />
      )}

      <div
        className="prose max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <ShareAnalytics articleId={article.id} />
      </div>

      <hr className="my-12" />

      <Comments articleId={article.id} />
    </div>
  );
}