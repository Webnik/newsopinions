import { useSearchParams } from "react-router-dom";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { SearchBar } from "@/components/articles/SearchBar";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { PaginationControls } from "@/components/articles/PaginationControls";
import { useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MainContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const { articles, isLoading, totalPages } = useArticles({
    page: currentPage,
    category: currentCategory,
    search: searchQuery,
  });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Latest Opinions</h2>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <Alert className="bg-accent/5 border-accent">
            <AlertDescription className="text-center py-8">
              No articles found. Check back later for new content or try a different search.
            </AlertDescription>
          </Alert>
        ) : (
          <ArticleGrid 
            articles={articles}
            isLoading={isLoading}
          />
        )}
        
        {articles.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
      
      <EditorsPicks />
      <RegionalPerspectives />
    </div>
  );
}