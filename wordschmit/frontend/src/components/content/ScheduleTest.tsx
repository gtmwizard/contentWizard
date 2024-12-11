import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScheduleDialog } from './ScheduleDialog';
import { ScheduleSettings } from '@/types/content';
import { CalendarDays, Plus } from 'lucide-react';

const TEST_CONTENT = {
  type: 'blog',
  content: `This is a test blog post.
It demonstrates the scheduling functionality.
We'll use this content to test scheduling across different platforms.`,
};

export function ScheduleTest() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const handleSchedule = async (settings: ScheduleSettings) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/content/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: TEST_CONTENT.content,
          type: TEST_CONTENT.type,
          scheduleSettings: settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule content');
      }

      const data = await response.json();
      setSuccess('Content scheduled successfully!');
      console.log('Scheduled content:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule content');
      console.error('Error scheduling content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Schedule</h1>
          <p className="text-muted-foreground">Schedule and manage your content across platforms</p>
        </div>
        <Button onClick={() => setShowTest(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Test Schedule
        </Button>
      </div>

      {!showTest ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No Scheduled Content</h2>
          <p className="text-muted-foreground mb-4">
            You haven't scheduled any content yet. Click 'Test Schedule' to try out the scheduling functionality.
          </p>
          <Button onClick={() => setShowTest(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Test Schedule
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Test Content:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {TEST_CONTENT.content}
              </pre>
            </div>

            <div className="flex items-center gap-4">
              <ScheduleDialog onSchedule={handleSchedule} />
              {isLoading && (
                <span className="text-sm text-muted-foreground">
                  Scheduling...
                </span>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 