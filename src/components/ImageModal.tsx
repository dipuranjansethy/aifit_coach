import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  isLoading: boolean;
}

export const ImageModal = ({ isOpen, onClose, imageUrl, title, isLoading }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative min-h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
          {isLoading ? (
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground">Generating image...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={title} className="max-w-full max-h-[500px] object-contain rounded-lg" />
          ) : (
            <p className="text-muted-foreground">Failed to generate image</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
