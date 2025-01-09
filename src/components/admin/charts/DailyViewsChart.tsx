import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const chartConfig = {
  views: {
    label: "Views",
    color: "#6366f1"
  }
};

export function DailyViewsChart() {
  const { data: viewsData } = useQuery({
    queryKey: ['analytics-views'],
    queryFn: async () => {
      const { data } = await supabase
        .from('article_views')
        .select('created_at')
        .order('created_at', { ascending: true });
      
      const grouped = data?.reduce((acc: Record<string, number>, view) => {
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

  return (
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
  );
}