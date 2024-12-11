import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export default function Settings() {
  const { token } = useAuth();
  const [openAIKey, setOpenAIKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveAPIKey = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('http://localhost:3001/api/profile/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          openAIKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save API key');
      }

      setSuccess('API key saved successfully');
      
      // Clear the field after successful save
      setOpenAIKey('');
      setShowKey(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">API Configuration</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your API keys for content generation and other services.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1.5">OpenAI API Key</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your OpenAI API key is required for AI-powered content generation.
                    You can get your API key from the{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      OpenAI dashboard
                    </a>
                    .
                  </p>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKey ? 'text' : 'password'}
                        value={openAIKey}
                        onChange={(e) => setOpenAIKey(e.target.value)}
                        placeholder="sk-..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleSaveAPIKey}
                      disabled={!openAIKey || isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save API Key'}
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mt-4">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 