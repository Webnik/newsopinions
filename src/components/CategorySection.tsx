import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Politics",
    description: "Analysis of global political landscapes",
    count: 156
  },
  {
    name: "Technology",
    description: "Future trends and digital transformation",
    count: 98
  },
  {
    name: "Culture",
    description: "Society and cultural commentary",
    count: 124
  },
  {
    name: "Economics",
    description: "Market insights and financial analysis",
    count: 87
  }
];

export function CategorySection() {
  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
              <span className="text-sm text-accent">{category.count} articles</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}