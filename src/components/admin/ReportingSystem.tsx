import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export function ReportingSystem() {
  const { data: reportStats } = useQuery({
    queryKey: ['report-stats'],
    queryFn: async () => {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('created_at, reported')
        .eq('reported', true);

      if (error) throw error;

      // Group reports by month
      const reportsByMonth = articles.reduce((acc: Record<string, number>, article) => {
        const month = new Date(article.created_at).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(reportsByMonth).map(([month, count]) => ({
        month,
        reports: count,
      }));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Reports Overview</CardTitle>
        <CardDescription>
          Monthly breakdown of reported content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer>
            <BarChart data={reportStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar dataKey="reports" fill="#ef4444" name="Reports" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}