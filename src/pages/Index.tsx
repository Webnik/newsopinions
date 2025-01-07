import { Navigation } from "@/components/Navigation";
import { FeaturedOpinion } from "@/components/FeaturedOpinion";
import { ArticleCard } from "@/components/ArticleCard";
import { TrendingOpinions } from "@/components/TrendingOpinions";
import { CategorySection } from "@/components/CategorySection";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { MostDiscussed } from "@/components/MostDiscussed";
import { Link } from "react-router-dom";

const featuredArticle = {
  title: "The Real Impact of AI on Modern Journalism",
  excerpt: "As artificial intelligence continues to evolve, its influence on journalism raises important questions about authenticity and trust.",
  author: {
    name: "Sarah Chen",
    image: "https://i.pravatar.cc/150?u=sarah",
    role: "Technology Analyst"
  },
  coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80"
};

const articles = [
  {
    id: "1",
    title: "Democracy's Digital Dilemma",
    excerpt: "How social media shapes political discourse in unexpected ways",
    author: {
      name: "Michael Roberts",
      image: "https://i.pravatar.cc/150?u=michael",
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
      image: "https://i.pravatar.cc/150?u=elena",
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
      image: "https://i.pravatar.cc/150?u=david",
      role: "Environmental Analyst"
    },
    date: "March 14, 2024"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <Link to="/article/featured">
            <FeaturedOpinion {...featuredArticle} />
          </Link>
        </section>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-8">Latest Opinions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/article/${article.id}`}>
                  <ArticleCard {...article} />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <TrendingOpinions />
          </div>
        </div>

        <CategorySection />
        <EditorsPicks />
        <RegionalPerspectives />
        <MostDiscussed />
      </main>
    </div>
  );
};

export default Index;