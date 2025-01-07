import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

const regions = [
  {
    id: "6",
    region: "Asia Pacific",
    title: "China's Tech Regulations: A New Era",
    author: "Wei Zhang",
    excerpt: "Understanding the implications of recent policy changes"
  },
  {
    id: "7",
    region: "Europe",
    title: "Brexit's Long-Term Impact on EU Unity",
    author: "Marie Dubois",
    excerpt: "Analyzing the changing dynamics of European politics"
  },
  {
    id: "8",
    region: "Americas",
    title: "Latin America's Green Energy Revolution",
    author: "Carlos Rodriguez",
    excerpt: "How southern nations are leading in renewable adoption"
  }
];

export function RegionalPerspectives() {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Globe className="text-accent h-6 w-6" />
          <h2 className="font-serif text-2xl font-bold">Regional Perspectives</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {regions.map((item) => (
            <Link key={item.id} to={`/article/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <span className="text-sm font-medium text-accent mb-2 block">
                    {item.region}
                  </span>
                  <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                  <span className="text-sm text-muted-foreground">By {item.author}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}