import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export function CategorySection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data as Category[];
    }
  });

  const handleCategoryClick = (categoryId: string) => {
    setSearchParams(prev => {
      if (currentCategory === categoryId) {
        prev.delete("category");
      } else {
        prev.set("category", categoryId);
      }
      prev.set("page", "1");
      return prev;
    });
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories?.map((category) => (
          <Card 
            key={category.id}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              currentCategory === category.id ? 'border-accent' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}