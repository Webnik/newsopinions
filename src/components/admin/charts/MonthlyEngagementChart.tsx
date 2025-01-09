import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

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
  }
};

export function MonthlyEngagementChart() {
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
  );
}