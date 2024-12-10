import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Content
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
          {/* Settings Panel */}
          <Paper sx={{ p: 3, width: '35%' }}>
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom>
                Generation Settings
              </Typography>

              <TextField
                fullWidth
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                helperText="What would you like to write about?"
              />

              <FormControl fullWidth required>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={settings.type}
                  label="Content Type"
                  onChange={(e) => setSettings(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  {CONTENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={settings.tone}
                  label="Tone"
                  onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value }))}
                >
                  {TONES.map((tone) => (
                    <MenuItem key={tone} value={tone}>
                      {tone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {settings.type === 'blog' && (
                <TextField
                  fullWidth
                  type="number"
                  label="Length (words)"
                  value={settings.length}
                  onChange={(e) => setSettings(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                  InputProps={{ inputProps: { min: 100, max: 2000 } }}
                />
              )}

              <Box>
                <TextField
                  fullWidth
                  label="Keywords"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeywordAdd}
                  helperText="Press Enter to add keywords"
                />
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {settings.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      onDelete={() => handleKeywordDelete(keyword)}
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                startIcon={isGenerating ? <CircularProgress size={20} /> : null}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </Button>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
            </Stack>
          </Paper>

          {/* Content Preview */}
          <Paper sx={{ p: 3, width: '65%' }}>
            <Typography variant="h6" gutterBottom>
              Generated Content
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {generatedContent ? (
              <Box sx={{ whiteSpace: 'pre-wrap' }}>
                {generatedContent}
              </Box>
            ) : (
              <Box sx={{ 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}>
                <Typography color="text.secondary">
                  Generated content will appear here
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </DashboardLayout>
  );
} 