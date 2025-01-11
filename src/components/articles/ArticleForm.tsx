import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ArticleFormProps {
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    published: boolean;
    cover_image?: string;
  };
  onSubmit: (data: {
    title: string;
    excerpt: string;
    content: string;
    published: boolean;
    cover_image?: string;
  }) => void;
  isLoading: boolean;
}

export function ArticleForm({ initialData, onSubmit, isLoading }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ title, excerpt, content, published, cover_image: coverImage });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Enter article excerpt"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload
            onUploadComplete={(url) => setCoverImage(url)}
            currentImage={coverImage}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="min-h-[400px]">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-[350px]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publish article</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Article"}
      </Button>
    </form>
  );
}