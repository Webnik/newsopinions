import { Navigation } from "@/components/Navigation";
import { FeaturedOpinion } from "@/components/FeaturedOpinion";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingOpinions } from "@/components/TrendingOpinions";
import { CategorySection } from "@/components/CategorySection";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { MostDiscussed } from "@/components/MostDiscussed";
import { BreakingOpinions } from "@/components/BreakingOpinions";
import { WeeklyHighlights } from "@/components/WeeklyHighlights";
import { OpinionPolls } from "@/components/OpinionPolls";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchFeaturedArticle = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('featured', true)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data;
};

const fetchLatestArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data;
};

const Index = () => {
  const { data: featuredArticle, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredArticle'],
    queryFn: fetchFeaturedArticle
  });

  const { data: latestArticles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['latestArticles'],
    queryFn: fetchLatestArticles
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <BreakingOpinions />
        
        <section className="mb-12">
          {isFeaturedLoading ? (
            <div className="w-full h-[400px] rounded-lg">
              <Skeleton className="w-full h-full" />
            </div>
          ) : featuredArticle ? (
            <Link to={`/article/${featuredArticle.id}`}>
              <FeaturedOpinion
                title={featuredArticle.title}
                excerpt={featuredArticle.excerpt || ''}
                author={{
                  name: featuredArticle.author.full_name || featuredArticle.author.username || 'Anonymous',
                  image: featuredArticle.author.avatar_url || '/placeholder.svg',
                  role: featuredArticle.author.role || 'Contributor'
                }}
                coverImage={featuredArticle.cover_image || '/placeholder.svg'}
              />
            </Link>
          ) : null}
        </section>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-8">Latest Opinions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {isArticlesLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))
                ) : latestArticles?.map((article) => (
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
                ))}
              </div>
            </section>
            
            <EditorsPicks />
            <RegionalPerspectives />
          </div>
          
          <div className="space-y-8">
            <TrendingOpinions />
            <WeeklyHighlights />
            <OpinionPolls />
          </div>
        </div>

        <CategorySection />
        <MostDiscussed />
      </main>
      <Footer />
    </div>
  );
};

export default Index;