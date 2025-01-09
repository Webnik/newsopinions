import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LikeButtonProps {
  articleId: string;
}

export function LikeButton({ articleId }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: like, isLoading } = useQuery({
    queryKey: ['like', articleId, session?.user?.id],
    enabled: !!session?.user?.id && !!articleId,
    queryFn: async () => {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', session?.user?.id)
        .single();
      return data;
    },
  });

  const { data: likeCount } = useQuery({
    queryKey: ['likeCount', articleId],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('article_id', articleId);
      return count;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      if (like) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            article_id: articleId,
            user_id: session.user.id,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['like', articleId] });
      queryClient.invalidateQueries({ queryKey: ['likeCount', articleId] });
      toast({
        title: like ? 'Unliked' : 'Liked',
        description: like ? 'Article unliked' : 'Article liked',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (!session) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => likeMutation.mutate()}
      disabled={isLoading || likeMutation.isPending}
    >
      <Heart
        className={`h-4 w-4 ${like ? 'fill-current text-red-500' : ''}`}
      />
      <span>{likeCount || 0}</span>
    </Button>
  );
}