import { Link } from "react-router-dom";
import { ArticleCard } from "@/components/ArticleCard";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

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

const ITEMS_PER_PAGE = 6;

export function MainContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['latestArticles', currentPage, currentCategory, searchQuery],
    queryFn: () => fetchLatestArticles(currentPage, currentCategory, searchQuery)
  });

  const { data: totalCount } = useQuery({
    queryKey: ['articlesCount', currentCategory, searchQuery],
    queryFn: () => fetchArticlesCount(currentCategory, searchQuery)
  });

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchParams(prev => {
      prev.set("page", "1");
      return prev;
    });
  };

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-bold">Latest Opinions</h2>
          <Input
            type="search"
            placeholder="Search articles..."
            className="max-w-xs"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {articlesData?.articles.length ? (
            articlesData.articles.map((article) => (
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
            <p className="text-muted-foreground col-span-2 text-center py-8">No articles found</p>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
      
      <EditorsPicks />
      <RegionalPerspectives />
    </div>
  );
}

async function fetchLatestArticles(page: number, category: string, search: string) {
  let query = supabase
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
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  const { data, error } = await query
    .range(start, end);

  if (error) {
    console.error('Error fetching latest articles:', error);
    return { articles: [] };
  }

  return { articles: data as Article[] };
}

async function fetchArticlesCount(category: string, search: string) {
  let query = supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('published', true);

  if (category) {
    query = query.eq('category_id', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error fetching articles count:', error);
    return 0;
  }

  return count;
}