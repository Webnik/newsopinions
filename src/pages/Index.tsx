import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BreakingOpinions } from "@/components/BreakingOpinions";
import { CategorySection } from "@/components/CategorySection";
import { MostDiscussed } from "@/components/MostDiscussed";
import { FeaturedSection } from "@/components/FeaturedSection";
import { MainContent } from "@/components/MainContent";
import { SidebarContent } from "@/components/SidebarContent";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PerformanceMonitor />
      <Navigation />
      <main className="flex-grow">
        <div className="w-full bg-gradient-to-b from-accent/5 to-background/0 py-8">
          <div className="container mx-auto px-4">
            <BreakingOpinions />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 space-y-12">
          <section className="mb-12">
            <FeaturedSection />
          </section>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <MainContent />
            <SidebarContent />
          </div>

          <CategorySection />
          <MostDiscussed />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;