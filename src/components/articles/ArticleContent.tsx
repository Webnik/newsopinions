import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";

interface ArticleContentProps {
  content: string;
  onChange: (content: string) => void;
}

export function ArticleContent({ content, onChange }: ArticleContentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <ReactQuill
        id="content"
        theme="snow"
        value={content}
        onChange={onChange}
        className="h-[400px] mb-12"
      />
    </div>
  );
}