import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface VoiceAnalysisProps {
  onNext: (data: VoiceProfileData) => void;
  onBack: () => void;
  initialData: VoiceProfileData;
}

interface VoiceProfileData {
  writingSamples: Array<{
    text: string;
    type: string;
  }>;
  influencers: string[];
  writingStyle: {
    formality: string;
    complexity: string;
    emotion: string;
  };
}

const SAMPLE_TYPES = ['blog', 'social', 'custom'];

const WRITING_STYLES = {
  formality: ['casual', 'neutral', 'formal'],
  complexity: ['simple', 'moderate', 'complex'],
  emotion: ['neutral', 'passionate', 'empathetic'],
};

const INFLUENCERS = [
  'Satya Nadella',
  'Marc Benioff',
  'Jeff Weiner',
  'Steve Jobs',
  'Brené Brown',
  'Simon Sinek',
  'Gary Vaynerchuk',
  'Seth Godin',
  'Marie Forleo',
  'Tony Robbins',
  'Malcolm Gladwell',
];

export default function VoiceAnalysis({ onNext, onBack, initialData }: VoiceAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfileData>(initialData);
  const [currentSample, setCurrentSample] = useState('');
  const [sampleType, setSampleType] = useState<'blog' | 'social' | 'custom'>('blog');

  const handleAddSample = () => {
    if (currentSample.trim()) {
      setVoiceProfile(prev => ({
        ...prev,
        writingSamples: [
          ...prev.writingSamples,
          { text: currentSample.trim(), type: sampleType },
        ],
      }));
      setCurrentSample('');
    }
  };

  const handleRemoveSample = (index: number) => {
    setVoiceProfile(prev => ({
      ...prev,
      writingSamples: prev.writingSamples.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setVoiceProfile(prev => ({
          ...prev,
          writingSamples: [
            ...prev.writingSamples,
            { text: text.slice(0, 1000), type: 'custom' },
          ],
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleInfluencersChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setVoiceProfile(prev => ({
      ...prev,
      influencers: value,
    }));
  };

  const handleStyleChange = (
    aspect: keyof VoiceProfileData['writingStyle'],
    value: string
  ) => {
    setVoiceProfile(prev => ({
      ...prev,
      writingStyle: {
        ...prev.writingStyle,
        [aspect]: value,
      },
    }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Voice Analysis
      </Typography>

      {/* Writing Samples Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add writing samples that best represent your style
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Sample Type</InputLabel>
              <Select
                value={sampleType}
                label="Sample Type"
                onChange={(e) => setSampleType(e.target.value as typeof sampleType)}
              >
                <MenuItem value="blog">Blog Post</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ height: 56 }}
            >
              Upload File
              <input
                type="file"
                hidden
                accept=".txt,.md"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Paste or type your writing sample here..."
            value={currentSample}
            onChange={(e) => setCurrentSample(e.target.value)}
          />
          
          <Button
            variant="contained"
            onClick={handleAddSample}
            disabled={!currentSample.trim()}
          >
            Add Sample
          </Button>
        </Stack>

        {/* Display Samples */}
        <Stack spacing={2} sx={{ mt: 2 }}>
          {voiceProfile.writingSamples.map((sample, index) => (
            <Paper key={index} sx={{ p: 2, position: 'relative' }}>
              <Box>
                <Chip
                  label={sample.type.toUpperCase()}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" component="span">
                  {sample.text.slice(0, 100)}...
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveSample(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Writing Style Preferences */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Writing Style Preferences
        </Typography>
        
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Formality Level</InputLabel>
            <Select
              value={voiceProfile.writingStyle.formality}
              label="Formality Level"
              onChange={(e) => handleStyleChange('formality', e.target.value)}
            >
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Language Complexity</InputLabel>
            <Select
              value={voiceProfile.writingStyle.complexity}
              label="Language Complexity"
              onChange={(e) => handleStyleChange('complexity', e.target.value)}
            >
              <MenuItem value="simple">Simple and Clear</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="complex">Complex and Sophisticated</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Emotional Tone</InputLabel>
            <Select
              value={voiceProfile.writingStyle.emotion}
              label="Emotional Tone"
              onChange={(e) => handleStyleChange('emotion', e.target.value)}
            >
              <MenuItem value="neutral">Neutral and Balanced</MenuItem>
              <MenuItem value="passionate">Passionate and Energetic</MenuItem>
              <MenuItem value="empathetic">Empathetic and Understanding</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Navigation */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => onNext(voiceProfile)}
          color="primary"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
} 