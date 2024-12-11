import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { GenerationForm } from '@/components/content/GenerationForm';
import { ContentPreview } from '@/components/content/ContentPreview';
import { ScheduleDialog } from '@/components/content/ScheduleDialog';
import { GenerationSettings, ScheduleSettings } from '@/types/content';
import { DEFAULT_SETTINGS } from '@/constants/content';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateContent() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [topic, setTopic] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const handleKeywordAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentKeyword.trim()) {
      e.preventDefault();
      setSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()],
      }));
      setCurrentKeyword('');
    }
  };

  const handleKeywordDelete = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
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

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      console.error('Error generating content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSchedule = async (scheduleSettings: ScheduleSettings) => {
    if (!generatedContent) return;

    try {
      setIsScheduling(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/content/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: generatedContent,
          type: settings.type,
          scheduleSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule content');
      }

      setScheduleSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule content');
      console.error('Error scheduling content:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create Content</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {scheduleSuccess && (
          <Alert className="mb-6">
            <AlertDescription>
              Content scheduled successfully! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          <GenerationForm
            topic={topic}
            settings={settings}
            currentKeyword={currentKeyword}
            isGenerating={isGenerating}
            error={error}
            onTopicChange={setTopic}
            onSettingsChange={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
            onKeywordChange={setCurrentKeyword}
            onKeywordAdd={handleKeywordAdd}
            onKeywordDelete={handleKeywordDelete}
            onGenerate={handleGenerate}
          />

          <div className="flex flex-col w-[65%]">
            <div className="flex justify-end mb-4 gap-2">
              {generatedContent && (
                <ScheduleDialog
                  onSchedule={handleSchedule}
                />
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
            <ContentPreview content={generatedContent} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 