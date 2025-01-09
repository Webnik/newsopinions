import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];

const chartConfig = {
  categories: {
    label: "Categories",
    color: "#f59e0b"
  }
};

export function CategoryDistributionChart() {
  const { data: categoryData } = useQuery({
    queryKey: ['analytics-categories'],
    queryFn: async () => {
      const { data: articles } = await supabase
        .from('articles')
        .select(`
          categories (
            name
          )
        `)
        .not('category_id', 'is', null);
      
      const categoryCounts = articles?.reduce((acc: Record<string, number>, article: any) => {
        const categoryName = article.categories?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCounts || {}).map(([name, value]) => ({
        name,
        value
      }));
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}