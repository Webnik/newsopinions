import { Link } from "react-router-dom";
import { FeaturedOpinion } from "@/components/FeaturedOpinion";
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
}

const sampleFeaturedArticle = {
  id: "featured-1",
  title: "The Future of Democracy in the Digital Age",
  excerpt: "As technology reshapes our world, we must consider its impact on democratic institutions and civic engagement. This comprehensive analysis explores the challenges and opportunities ahead.",
  author: {
    name: "Dr. Sarah Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    role: "Political Analyst"
  },
  coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
};

export function FeaturedSection() {
  const { data: featuredArticle, isLoading } = useQuery({
    queryKey: ['featuredArticle'],
    queryFn: fetchFeaturedArticle
  });

  if (isLoading) {
    return (
      <div className="w-full h-[400px] rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (featuredArticle) {
    return (
      <Link to={`/article/${featuredArticle.id}`}>
        <FeaturedOpinion
          title={featuredArticle.title}
          excerpt={featuredArticle.excerpt || ''}
          author={{
            name: featuredArticle.author.full_name || featuredArticle.author.username || 'Anonymous',
            image: featuredArticle.author.avatar_url || '/placeholder.svg',
            role: featuredArticle.author.role || 'Contributor'
          }}
          coverImage={featuredArticle.cover_image || sampleFeaturedArticle.coverImage}
        />
      </Link>
    );
  }

  return (
    <Link to={`/article/${sampleFeaturedArticle.id}`}>
      <FeaturedOpinion {...sampleFeaturedArticle} />
    </Link>
  );
}

async function fetchFeaturedArticle() {
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
    .eq('featured', true)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching featured article:', error);
    return null;
  }

  return data as Article | null;
}