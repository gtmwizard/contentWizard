import { useState } from 'react';
import { Loader2, Plus } from "lucide-react";
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenerationSettings {
  type: 'blog' | 'linkedin' | 'twitter';
  tone: string;
  keywords: string[];
  length?: number;
  targetAudience: string;
  industry: string;
}

const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'twitter', label: 'Twitter/X Post' },
];

const TONES = [
  'Professional',
  'Conversational',
  'Informative',
  'Persuasive',
  'Inspiring',
  'Technical',
  'Friendly',
];

export default function CreateContent() {
  const { token } = useAuth();
  const [topic, setTopic] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    type: 'blog',
    tone: 'Professional',
    keywords: [],
    length: 500,
    targetAudience: 'Business Professionals',
    industry: 'Technology',
  });
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleKeywordAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      if (!settings.keywords.includes(currentKeyword.trim())) {
        setSettings(prev => ({
          ...prev,
          keywords: [...prev.keywords, currentKeyword.trim()],
        }));
      }
      setCurrentKeyword('');
    }
  };

  const handleKeywordDelete = (keywordToDelete: string) => {
    setSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToDelete),
    }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate content');
      }

      setGeneratedContent(data.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Create Content</h1>

        <div className="flex gap-6">
          {/* Settings Panel */}
          <Card className="p-6 w-[35%]">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Generation Settings</h2>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like to write about?"
                />
              </div>

              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={settings.type}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, type: value as any }))}
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
                  onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}
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
                    onChange={(e) => setSettings(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                    min={100}
                    max={2000}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeywordAdd}
                  placeholder="Press Enter to add keywords"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {settings.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleKeywordDelete(keyword)}
                    >
                      {keyword}
                      <Plus className="w-3 h-3 ml-1 rotate-45" />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
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

          {/* Content Preview */}
          <Card className="p-6 w-[65%]">
            <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
            <Separator className="mb-4" />
            
            {generatedContent ? (
              <div className="whitespace-pre-wrap">
                {generatedContent}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-md">
                <span className="text-muted-foreground">
                  Generated content will appear here
                </span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 