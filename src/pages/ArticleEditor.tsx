import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { ArticleForm } from "@/components/articles/ArticleForm";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { useToast } from "@/hooks/use-toast";

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  const { data: article, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['article', id],
    enabled: !!id && !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (articleData: {
      title: string;
      excerpt: string;
      content: string;
      published: boolean;
      cover_image?: string;
    }) => {
      if (id) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([{ ...articleData, author_id: session?.user?.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Article ${id ? "updated" : "created"} successfully`,
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">
          {id ? "Edit Article" : "New Article"}
        </h1>
        <div className="max-w-4xl mx-auto space-y-8">
          {article && <ArticleContent content={article.content} onChange={(content) => {
            // Update content in form
          }} />}
          <ArticleForm
            initialData={article}
            onSubmit={(data) => mutation.mutate(data)}
            isLoading={mutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
