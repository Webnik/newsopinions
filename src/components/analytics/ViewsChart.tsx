import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewsChartProps {
  articleId: string;
  className?: string;
}

export function ViewsChart({ articleId, className }: ViewsChartProps) {
  const { data: viewsData, isLoading } = useQuery({
    queryKey: ["articleViewsTimeline", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_views')
        .select('created_at')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const chartData = useMemo(() => {
    if (!viewsData) return [];

    const viewsByDay = viewsData.reduce((acc: Record<string, number>, view) => {
      const date = new Date(view.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(viewsByDay).map(([date, views]) => ({
      date,
      views,
    }));
  }, [viewsData]);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Article Views Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            views: {
              theme: {
                light: "hsl(var(--primary))",
                dark: "hsl(var(--primary))",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="views"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}