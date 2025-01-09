import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Author {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  created_at: string;
  author: Author;
}

interface UseArticlesProps {
  page: number;
  category: string;
  search: string;
}

export function useArticles({ page, category, search }: UseArticlesProps) {
  const ITEMS_PER_PAGE = 6;

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['latestArticles', page, category, search],
    queryFn: () => fetchLatestArticles(page, category, search)
  });

  const { data: totalCount } = useQuery({
    queryKey: ['articlesCount', category, search],
    queryFn: () => fetchArticlesCount(category, search)
  });

  return {
    articles: articlesData?.articles || [],
    isLoading: isArticlesLoading,
    totalCount: totalCount || 0,
    totalPages: Math.ceil((totalCount || 0) / ITEMS_PER_PAGE),
  };
}

async function fetchLatestArticles(page: number, category: string, search: string) {
  const ITEMS_PER_PAGE = 6;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

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
        id,
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