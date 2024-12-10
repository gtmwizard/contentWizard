import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            API Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure your API keys for content generation and other services.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ maxWidth: 'sm' }}>
            <Typography variant="subtitle1" gutterBottom>
              OpenAI API Key
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your OpenAI API key is required for AI-powered content generation.
              You can get your API key from the{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit' }}
              >
                OpenAI dashboard
              </a>
              .
            </Typography>

            <TextField
              fullWidth
              type={showKey ? 'text' : 'password'}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowKey(!showKey)}
                      edge="end"
                    >
                      {showKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleSaveAPIKey}
              disabled={!openAIKey || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save API Key'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
} 