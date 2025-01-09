import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShareModal } from "@/components/ShareModal";

interface ShareButtonProps {
  articleId: string;
  title: string;
}

export function ShareButton({ articleId, title }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsModalOpen(true)}
        aria-label="Share article"
      >
        <Share className="h-4 w-4" />
      </Button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articleId={articleId}
        articleTitle={title}
      />
    </>
  );
}