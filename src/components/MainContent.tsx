import { Link } from "react-router-dom";
import { ArticleCard } from "@/components/ArticleCard";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: Author;
  cover_image: string | null;
  created_at: string;
}

export function MainContent() {
  const { data: latestArticles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['latestArticles'],
    queryFn: fetchLatestArticles
  });

  if (isArticlesLoading) {
    return (
      <div className="lg:col-span-2 space-y-12">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-12">
      <section>
        <h2 className="font-serif text-3xl font-bold mb-8">Latest Opinions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {latestArticles?.length ? (
            latestArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`}>
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  author={{
                    name: article.author.full_name || article.author.username || 'Anonymous',
                    image: article.author.avatar_url || '/placeholder.svg',
                    role: article.author.role || 'Contributor'
                  }}
                  date={new Date(article.created_at).toLocaleDateString()}
                />
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground">No articles available</p>
          )}
        </div>
      </section>
      
      <EditorsPicks />
      <RegionalPerspectives />
    </div>
  );
}

async function fetchLatestArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      content,
      cover_image,
      created_at,
      author:profiles(
        full_name,
        username,
        avatar_url,
        role
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }

  return data as Article[];
}