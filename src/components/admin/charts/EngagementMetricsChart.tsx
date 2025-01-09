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
  Legend,
  ResponsiveContainer
} from "recharts";

const chartConfig = {
  likes: {
    label: "Likes",
    color: "#ec4899"
  },
  bookmarks: {
    label: "Bookmarks",
    color: "#14b8a6"
  },
  shares: {
    label: "Shares",
    color: "#6366f1"
  }
};

export function EngagementMetricsChart() {
  const { data: metricsData } = useQuery({
    queryKey: ['engagement-metrics'],
    queryFn: async () => {
      const [
        { data: likes },
        { data: bookmarks },
        { data: shares }
      ] = await Promise.all([
        supabase.from('likes').select('created_at'),
        supabase.from('bookmarks').select('created_at'),
        supabase.from('shares').select('created_at')
      ]);

      const last30Days = [...Array(30)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      return last30Days.map(date => ({
        date,
        likes: likes?.filter(l => 
          l.created_at.startsWith(date)
        ).length || 0,
        bookmarks: bookmarks?.filter(b => 
          b.created_at.startsWith(date)
        ).length || 0,
        shares: shares?.filter(s => 
          s.created_at.startsWith(date)
        ).length || 0
      }));
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#ec4899" 
                  name="Likes"
                />
                <Line 
                  type="monotone" 
                  dataKey="bookmarks" 
                  stroke="#14b8a6" 
                  name="Bookmarks"
                />
                <Line 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#6366f1" 
                  name="Shares"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}