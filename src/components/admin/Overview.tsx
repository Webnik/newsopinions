import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Eye, Share2 } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const chartConfig = {
  views: {
    label: "Views",
    color: "#6366f1"
  }
};

export function Overview() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: userCount },
        { count: articleCount },
        { count: viewCount },
        { count: shareCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('article_views').select('*', { count: 'exact', head: true }),
        supabase.from('shares').select('*', { count: 'exact', head: true })
      ]);
      return { userCount, articleCount, viewCount, shareCount };
    }
  });

  const { data: viewsOverTime } = useQuery({
    queryKey: ['views-over-time'],
    queryFn: async () => {
      const { data } = await supabase
        .from('article_views')
        .select('created_at')
        .order('created_at', { ascending: true });
      
      // Group views by day
      const groupedViews = data?.reduce((acc: any, view) => {
        const date = new Date(view.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(groupedViews || {}).map(([date, views]) => ({
        date,
        views
      }));
    }
  });

  const statCards = [
    { title: "Total Users", value: stats?.userCount || 0, icon: Users },
    { title: "Total Articles", value: stats?.articleCount || 0, icon: FileText },
    { title: "Total Views", value: stats?.viewCount || 0, icon: Eye },
    { title: "Total Shares", value: stats?.shareCount || 0, icon: Share2 }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="views" fill="#6366f1" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}