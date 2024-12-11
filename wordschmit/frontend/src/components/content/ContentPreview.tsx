import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ContentPreviewProps {
  content: string | null;
}

export function ContentPreview({ content }: ContentPreviewProps) {
  return (
    <Card className="p-6 w-[65%]">
      <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
      <Separator className="mb-4" />
      
      {content ? (
        <div className="whitespace-pre-wrap">
          {content}
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
          <span className="text-muted-foreground">
            Generated content will appear here
          </span>
        </div>
      )}
    </Card>
  );
} 