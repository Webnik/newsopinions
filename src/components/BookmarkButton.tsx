import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookmarkButtonProps {
  articleId: string;
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: bookmark, isLoading } = useQuery({
    queryKey: ['bookmark', articleId, session?.user?.id],
    enabled: !!session?.user?.id && !!articleId,
    queryFn: async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', session?.user?.id)
        .single();
      return data;
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Not authenticated');

      if (bookmark) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            article_id: articleId,
            user_id: session.user.id,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', articleId] });
      toast({
        title: bookmark ? 'Removed from bookmarks' : 'Bookmarked',
        description: bookmark ? 'Article removed from bookmarks' : 'Article bookmarked',
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
      onClick={() => bookmarkMutation.mutate()}
      disabled={isLoading || bookmarkMutation.isPending}
    >
      <Bookmark
        className={`h-4 w-4 ${bookmark ? 'fill-current' : ''}`}
      />
    </Button>
  );
}