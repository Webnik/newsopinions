import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          author:profiles(
            full_name,
            username,
            avatar_url
          )
        `)
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-bold">
        Comments ({comments?.length || 0})
      </h2>

      {isAuthenticated && (
        <CommentForm articleId={articleId} userId={userId} />
      )}

      <CommentList comments={comments} isLoading={isLoading} />
    </div>
  );
}