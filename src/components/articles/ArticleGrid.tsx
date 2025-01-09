import { Link } from "react-router-dom";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  author: Author | null;
  created_at: string;
}

interface ArticleGridProps {
  articles: Article[];
  isLoading: boolean;
}

export function ArticleGrid({ articles, isLoading }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
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

  if (!articles.length) {
    return (
      <p className="text-muted-foreground col-span-2 text-center py-8">
        No articles found
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Link key={article.id} to={`/article/${article.id}`}>
          <ArticleCard
            id={article.id}
            title={article.title}
            excerpt={article.excerpt || ''}
            author={{
              id: article.author?.id || 'anonymous',
              name: article.author?.full_name || article.author?.username || 'Anonymous',
              image: article.author?.avatar_url || '/placeholder.svg',
              role: article.author?.role || 'Contributor'
            }}
            date={new Date(article.created_at).toLocaleDateString()}
          />
        </Link>
      ))}
    </div>
  );
}