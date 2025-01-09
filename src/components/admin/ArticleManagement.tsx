import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye, MessageSquare, Share2 } from "lucide-react";

export function ArticleManagement() {
  const [search, setSearch] = useState("");

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles', search],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id(username),
          article_views(count),
          comments(count),
          shares(count)
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(article => ({
        ...article,
        viewCount: article.article_views?.[0]?.count || 0,
        commentCount: article.comments?.[0]?.count || 0,
        shareCount: article.shares?.[0]?.count || 0
      }));
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Article Management</h1>
        <Input
          placeholder="Search articles..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : articles?.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.profiles?.username}</TableCell>
                <TableCell>
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {article.commentCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      {article.shareCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(article.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`/article/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link to={`/edit-article/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}