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

const featuredArticle = {
  title: "The Real Impact of AI on Modern Journalism",
  excerpt: "As artificial intelligence continues to evolve, its influence on journalism raises important questions about authenticity and trust.",
  author: {
    name: "Sarah Chen",
    image: "/placeholder.svg", // Using local placeholder image
    role: "Technology Analyst"
  },
  coverImage: "/placeholder.svg" // Using local placeholder image
};

const articles = [
  {
    id: "1",
    title: "Democracy's Digital Dilemma",
    excerpt: "How social media shapes political discourse in unexpected ways",
    author: {
      name: "Michael Roberts",
      image: "/placeholder.svg", // Using local placeholder image
      role: "Political Correspondent"
    },
    date: "March 15, 2024"
  },
  {
    id: "2",
    title: "The Economics of Innovation",
    excerpt: "Why some breakthrough technologies fail to reach mass adoption",
    author: {
      name: "Elena Martinez",
      image: "/placeholder.svg", // Using local placeholder image
      role: "Economics Editor"
    },
    date: "March 14, 2024"
  },
  {
    id: "3",
    title: "Climate Change: Beyond the Headlines",
    excerpt: "A deeper look at environmental policy and its real-world impact",
    author: {
      name: "David Kim",
      image: "/placeholder.svg", // Using local placeholder image
      role: "Environmental Analyst"
    },
    date: "March 14, 2024"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <BreakingOpinions />
        
        <section className="mb-12">
          <Link to="/article/featured">
            <FeaturedOpinion {...featuredArticle} />
          </Link>
        </section>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-8">Latest Opinions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} to={`/article/${article.id}`}>
                    <ArticleCard {...article} />
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