import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
}

export function ShareModal({ isOpen, onClose, articleId, articleTitle }: ShareModalProps) {
  const { toast } = useToast();
  const currentUrl = window.location.href;

  const handleShare = async (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(articleTitle);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
        });
        onClose();
        return;
    }

    // Track share in database
    const { error } = await supabase
      .from('shares')
      .insert({
        article_id: articleId,
        platform,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error tracking share:', error);
    }

    // Open share URL in new window
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Article</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('copy')}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}