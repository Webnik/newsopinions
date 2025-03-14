import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

interface FollowerCountProps {
  profileId: string;
  className?: string;
}

export function FollowerCount({ profileId, className }: FollowerCountProps) {
  const { data: followerCount = 0 } = useQuery({
    queryKey: ['followerCount', profileId],
    queryFn: async () => {
      // Don't query followers for empty profile IDs
      if (!profileId) return 0;
      
      const { count } = await supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', profileId);
      return count || 0;
    },
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ['followingCount', profileId],
    queryFn: async () => {
      // Don't query following for empty profile IDs
      if (!profileId) return 0;
      
      const { count } = await supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', profileId);
      return count || 0;
    },
  });

  // Don't show follower counts for anonymous/non-existent profiles
  if (!profileId) return null;

  return (
    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>{followerCount} followers</span>
      </div>
      <span>·</span>
      <span>{followingCount} following</span>
    </div>
  );
}