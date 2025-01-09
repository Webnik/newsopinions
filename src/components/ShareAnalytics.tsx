import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ShareCount {
  platform: string;
  count: number;
}

export function ShareAnalytics({ articleId }: { articleId: string }) {
  const { data: shareCounts } = useQuery({
    queryKey: ['shareAnalytics', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shares')
        .select('platform')
        .eq('article_id', articleId)
        .then(({ data }) => {
          if (!data) return [];
          
          const counts: ShareCount[] = [];
          const platforms = [...new Set(data.map(share => share.platform))];
          
          platforms.forEach(platform => {
            counts.push({
              platform,
              count: data.filter(share => share.platform === platform).length
            });
          });
          
          return counts;
        });

      if (error) throw error;
      return data;
    }
  });

  if (!shareCounts?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Analytics</CardTitle>
        <CardDescription>Track how this article is being shared</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {shareCounts.map((share) => (
            <div key={share.platform} className="flex justify-between items-center">
              <span className="capitalize">{share.platform}</span>
              <span className="font-medium">{share.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}