import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Flag, CheckCircle, XCircle } from "lucide-react";

export function ContentModeration() {
  const { toast } = useToast();

  const { data: reportedContent, refetch } = useQuery({
    queryKey: ['reported-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          author_id,
          profiles (
            username,
            full_name
          )
        `)
        .eq('reported', true);

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .update({ reported: false, moderated: true })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not approve content",
      });
      return;
    }

    toast({
      title: "Content approved",
      description: "The content has been approved and is now visible",
    });
    refetch();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .update({ published: false, reported: false, moderated: true })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reject content",
      });
      return;
    }

    toast({
      title: "Content rejected",
      description: "The content has been rejected and is no longer visible",
    });
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Content Moderation
        </CardTitle>
        <CardDescription>
          Review and moderate reported content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedContent?.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.title}</TableCell>
                <TableCell>
                  {content.profiles.full_name || content.profiles.username}
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">Reported</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(content.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(content.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}