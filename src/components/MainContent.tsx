import { useSearchParams } from "react-router-dom";
import { EditorsPicks } from "@/components/EditorsPicks";
import { RegionalPerspectives } from "@/components/RegionalPerspectives";
import { SearchBar } from "@/components/articles/SearchBar";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { PaginationControls } from "@/components/articles/PaginationControls";
import { useState } from "react";
import { useArticles } from "@/hooks/useArticles";

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-bold">Latest Opinions</h2>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </div>
        
        <ArticleGrid 
          articles={articles}
          isLoading={isLoading}
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