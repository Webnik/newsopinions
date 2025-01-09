import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { SearchBar } from "@/components/articles/SearchBar";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { PaginationControls } from "@/components/articles/PaginationControls";
import { useState } from "react";

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setSearchParams(prev => {
      prev.set("page", "1");
      return prev;
    });
  };

  return (
    <div className="lg:col-span-2 space-y-12">
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-bold">Latest Opinions</h2>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </div>
        
        <ArticleGrid 
          articles={articlesData?.articles || []}
          isLoading={isArticlesLoading}
        />
        
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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

  const { data, error } = await query.range(start, end);

  if (error) {
    console.error('Error fetching latest articles:', error);
    return { articles: [] };
  }

  return { articles: data };
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