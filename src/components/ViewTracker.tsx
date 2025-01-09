import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ViewTrackerProps {
  articleId: string;
}

export function ViewTracker({ articleId }: ViewTrackerProps) {
  const { toast } = useToast();

  useEffect(() => {
    const trackView = async () => {
      try {
        const { error } = await supabase
          .from('article_views')
          .insert({
            article_id: articleId,
            ip_address: 'anonymous', // For privacy reasons, we're not tracking real IPs
            user_agent: navigator.userAgent
          });

        if (error) {
          console.error('Error tracking view:', error);
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        toast({
          variant: "destructive",
          title: "Error tracking view",
          description: "There was a problem tracking this article view."
        });
      }
    };

    trackView();
  }, [articleId]);

  return null;
}