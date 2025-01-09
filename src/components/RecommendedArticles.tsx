import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedArticles({ currentArticleId }: { currentArticleId?: string }) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', currentArticleId],
    queryFn: async () => {
      // Get the current article's category
      if (currentArticleId) {
        const { data: currentArticle } = await supabase
          .from('articles')
          .select('category_id')
          .eq('id', currentArticleId)
          .single();

        if (currentArticle?.category_id) {
          // Get articles in the same category
          const { data } = await supabase
            .from('articles')
            .select(`
              id,
              title,
              excerpt,
              cover_image,
              created_at,
              author:profiles(
                id,
                full_name,
                username,
                avatar_url,
                role
              )
            `)
            .eq('category_id', currentArticle.category_id)
            .eq('published', true)
            .neq('id', currentArticleId)
            .order('created_at', { ascending: false })
            .limit(3);

          return data;
        }
      }

      // Fallback to recent articles if no current article
      const { data } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          cover_image,
          created_at,
          author:profiles(
            id,
            full_name,
            username,
            avatar_url,
            role
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!recommendations?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recommended Articles</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {recommendations.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt || ''}
            author={{
              id: article.author.id,
              name: article.author.full_name || article.author.username || 'Anonymous',
              image: article.author.avatar_url || '',
              role: article.author.role || 'user'
            }}
            date={new Date(article.created_at).toLocaleDateString()}
            coverImage={article.cover_image || undefined}
          />
        ))}
      </div>
    </div>
  );
}