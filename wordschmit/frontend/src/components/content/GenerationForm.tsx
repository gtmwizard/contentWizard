import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeywordInput } from "./KeywordInput";
import { CONTENT_TYPES, TONES } from "@/constants/content";
import { GenerationSettings } from "@/types/content";

interface GenerationFormProps {
  topic: string;
  settings: GenerationSettings;
  currentKeyword: string;
  isGenerating: boolean;
  error: string | null;
  onTopicChange: (value: string) => void;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onKeywordChange: (value: string) => void;
  onKeywordAdd: (e: React.KeyboardEvent) => void;
  onKeywordDelete: (keyword: string) => void;
  onGenerate: () => void;
}

export function GenerationForm({
  topic,
  settings,
  currentKeyword,
  isGenerating,
  error,
  onTopicChange,
  onSettingsChange,
  onKeywordChange,
  onKeywordAdd,
  onKeywordDelete,
  onGenerate,
}: GenerationFormProps) {
  return (
    <Card className="p-6 w-[35%]">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Generation Settings</h2>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="What would you like to write about?"
          />
        </div>

        <div className="space-y-2">
          <Label>Content Type</Label>
          <Select
            value={settings.type}
            onValueChange={(value) => onSettingsChange({ type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tone</Label>
          <Select
            value={settings.tone}
            onValueChange={(value) => onSettingsChange({ tone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {settings.type === 'blog' && (
          <div className="space-y-2">
            <Label htmlFor="length">Length (words)</Label>
            <Input
              id="length"
              type="number"
              value={settings.length}
              onChange={(e) => onSettingsChange({ length: parseInt(e.target.value) })}
              min={100}
              max={2000}
            />
          </div>
        )}

        <KeywordInput
          keywords={settings.keywords}
          currentKeyword={currentKeyword}
          onKeywordChange={onKeywordChange}
          onKeywordAdd={onKeywordAdd}
          onKeywordDelete={onKeywordDelete}
        />

        <Button
          className="w-full"
          onClick={onGenerate}
          disabled={isGenerating || !topic}
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
} 