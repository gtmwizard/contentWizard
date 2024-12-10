import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  TextField,
  Paper,
} from '@mui/material';

interface ContentPreferencesProps {
  onNext: (data: ContentPreferencesData) => void;
  onBack: () => void;
  initialData: ContentPreferencesData;
}

interface ContentPreferencesData {
  contentTypes: {
    blog: boolean;
    linkedin: boolean;
    twitter: boolean;
  };
  topics: string[];
  tones: string[];
  goals: string[];
}

const SUGGESTED_TOPICS = [
  'Digital Transformation',
  'Software Development',
  'Business Automation',
  'Tech Innovation',
  'Project Management',
  'Industry Trends',
  'Best Practices',
  'Case Studies',
  'Product Updates',
  'Company Culture',
  'Leadership',
  'Customer Success',
];

const SUGGESTED_TONES = [
  'Professional',
  'Informative',
  'Engaging',
  'Authoritative',
  'Friendly',
  'Inspirational',
  'Educational',
  'Conversational',
];

const SUGGESTED_GOALS = [
  'Establish thought leadership',
  'Share industry insights',
  'Showcase expertise',
  'Drive engagement',
  'Generate leads',
  'Build brand awareness',
  'Educate audience',
  'Share company updates',
];

export default function ContentPreferences({ onNext, onBack, initialData }: ContentPreferencesProps) {
  const [preferences, setPreferences] = useState<ContentPreferencesData>(initialData);
  const [newTopic, setNewTopic] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const handleContentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPreferences(prev => ({
      ...prev,
      contentTypes: {
        ...prev.contentTypes,
        [name]: checked,
      },
    }));
  };

  const handleTopicClick = (topic: string) => {
    setPreferences(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleToneClick = (tone: string) => {
    setPreferences(prev => ({
      ...prev,
      tones: prev.tones.includes(tone)
        ? prev.tones.filter(t => t !== tone)
        : [...prev.tones, tone],
    }));
  };

  const handleGoalClick = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const addCustomTopic = () => {
    if (newTopic.trim() && !preferences.topics.includes(newTopic.trim())) {
      setPreferences(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic('');
    }
  };

  const addCustomGoal = () => {
    if (newGoal.trim() && !preferences.goals.includes(newGoal.trim())) {
      setPreferences(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal('');
    }
  };

  const isValid = () => {
    return (
      Object.values(preferences.contentTypes).some(Boolean) &&
      preferences.topics.length > 0 &&
      preferences.tones.length > 0 &&
      preferences.goals.length > 0
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Content Preferences
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content Types
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={preferences.contentTypes.blog}
                onChange={handleContentTypeChange}
                name="blog"
              />
            }
            label="Blog Posts"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={preferences.contentTypes.linkedin}
                onChange={handleContentTypeChange}
                name="linkedin"
              />
            }
            label="LinkedIn Posts"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={preferences.contentTypes.twitter}
                onChange={handleContentTypeChange}
                name="twitter"
              />
            }
            label="Twitter/X Posts"
          />
        </FormGroup>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content Topics
        </Typography>
        <Box sx={{ mb: 2 }}>
          {SUGGESTED_TOPICS.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              onClick={() => handleTopicClick(topic)}
              color={preferences.topics.includes(topic) ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Add custom topic"
            onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
          />
          <Button onClick={addCustomTopic} variant="outlined" size="small">
            Add
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content Tone
        </Typography>
        <Box>
          {SUGGESTED_TONES.map((tone) => (
            <Chip
              key={tone}
              label={tone}
              onClick={() => handleToneClick(tone)}
              color={preferences.tones.includes(tone) ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content Goals
        </Typography>
        <Box sx={{ mb: 2 }}>
          {SUGGESTED_GOALS.map((goal) => (
            <Chip
              key={goal}
              label={goal}
              onClick={() => handleGoalClick(goal)}
              color={preferences.goals.includes(goal) ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add custom goal"
            onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
          />
          <Button onClick={addCustomGoal} variant="outlined" size="small">
            Add
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => onNext(preferences)}
          disabled={!isValid()}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
} 