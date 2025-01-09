import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export function PerformanceMetrics() {
  const metrics = usePerformanceMonitor();

  const { data: totalViews } = useQuery({
    queryKey: ['total-views'],
    queryFn: async () => {
      const { count } = await supabase
        .from('article_views')
        .select('*', { count: 'exact', head: true });
      return count;
    }
  });

  const performanceMetrics = [
    {
      title: "Page Load Time",
      value: `${Math.round(metrics.pageLoadTime)}ms`,
      description: "Time to load the entire page"
    },
    {
      title: "First Paint",
      value: `${Math.round(metrics.firstContentfulPaint)}ms`,
      description: "Time until first meaningful content"
    },
    {
      title: "Time to Interactive",
      value: `${Math.round(metrics.timeToInteractive)}ms`,
      description: "Time until page becomes interactive"
    },
    {
      title: "Total Views",
      value: totalViews || 0,
      description: "Total article views across the platform"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {performanceMetrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}