import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  profileId: string;
  className?: string;
}

export function FollowButton({ profileId, className }: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: isFollowing } = useQuery({
    queryKey: ['following', profileId],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', session?.user?.id)
        .eq('following_id', profileId)
        .single();
      return !!data;
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: session?.user?.id,
          following_id: profileId,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', profileId] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', profileId] });
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
      console.error('Follow error:', error);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', session?.user?.id)
        .eq('following_id', profileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', profileId] });
      queryClient.invalidateQueries({ queryKey: ['followerCount', profileId] });
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
      console.error('Unfollow error:', error);
    },
  });

  if (!session?.user || session.user.id === profileId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={className}
      onClick={() => {
        if (isFollowing) {
          unfollowMutation.mutate();
        } else {
          followMutation.mutate();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={followMutation.isPending || unfollowMutation.isPending}
    >
      {isFollowing ? (
        <>
          {isHovered ? <UserMinus className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
          {isHovered ? "Unfollow" : "Following"}
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}