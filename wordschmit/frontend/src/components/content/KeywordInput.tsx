import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface KeywordInputProps {
  keywords: string[];
  currentKeyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordAdd: (e: React.KeyboardEvent) => void;
  onKeywordDelete: (keyword: string) => void;
}

export function KeywordInput({
  keywords,
  currentKeyword,
  onKeywordChange,
  onKeywordAdd,
  onKeywordDelete,
}: KeywordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="keywords">Keywords</Label>
      <Input
        id="keywords"
        value={currentKeyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onKeyPress={onKeywordAdd}
        placeholder="Press Enter to add keywords"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {keywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onKeywordDelete(keyword)}
          >
            {keyword}
            <Plus className="w-3 h-3 ml-1 rotate-45" />
          </Badge>
        ))}
      </div>
    </div>
  );
} 