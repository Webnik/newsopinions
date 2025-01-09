import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'];

const chartConfig = {
  views: {
    label: "Views",
    color: "#6366f1"
  },
  comments: {
    label: "Comments",
    color: "#ec4899"
  },
  shares: {
    label: "Shares",
    color: "#14b8a6"
  },
  categories: {
    label: "Categories",
    color: "#f59e0b"
  }
};

export function Analytics() {
  const { data: viewsData } = useQuery({
    queryKey: ['analytics-views'],
    queryFn: async () => {
      const { data } = await supabase
        .from('article_views')
        .select('created_at')
        .order('created_at', { ascending: true });
      
      // Group by day
      const grouped = data?.reduce((acc: any, view) => {
        const date = new Date(view.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(grouped || {}).map(([date, views]) => ({
        date,
        views
      }));
    }
  });

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
      
      // Manual grouping
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

  const { data: engagementData } = useQuery({
    queryKey: ['analytics-engagement'],
    queryFn: async () => {
      const [
        { data: views },
        { data: comments },
        { data: shares }
      ] = await Promise.all([
        supabase.from('article_views').select('created_at'),
        supabase.from('comments').select('created_at'),
        supabase.from('shares').select('created_at')
      ]);

      // Group by month
      const months = [...Array(12)].map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      return months.map(month => ({
        month,
        views: views?.filter(v => 
          new Date(v.created_at).toLocaleString('default', { month: 'short' }) === month
        ).length || 0,
        comments: comments?.filter(c =>
          new Date(c.created_at).toLocaleString('default', { month: 'short' }) === month
        ).length || 0,
        shares: shares?.filter(s =>
          new Date(s.created_at).toLocaleString('default', { month: 'short' }) === month
        ).length || 0
      }));
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daily Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="views" stroke="#6366f1" />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Monthly Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar dataKey="views" fill="#6366f1" />
                  <Bar dataKey="comments" fill="#ec4899" />
                  <Bar dataKey="shares" fill="#14b8a6" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}