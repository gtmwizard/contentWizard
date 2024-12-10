import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  IconButton,
  Chip,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';

interface BusinessDetailsData {
  businessName: string;
  industry: string;
  targetAudience: string;
  description: string;
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

interface VoiceProfileData {
  writingSamples: {
    text: string;
    type: 'blog' | 'social' | 'custom';
  }[];
  influencers: string[];
  writingStyle: {
    formality: 'casual' | 'neutral' | 'formal';
    complexity: 'simple' | 'moderate' | 'complex';
    emotion: 'neutral' | 'passionate' | 'empathetic';
  };
}

interface OnboardingData {
  businessDetails: BusinessDetailsData;
  contentPreferences: ContentPreferencesData;
  voiceProfile: VoiceProfileData;
}

interface ProfileSummaryProps {
  data: OnboardingData;
  onBack: () => void;
  onComplete: (data: OnboardingData) => void;
}

const StyledSummaryText = styled(Typography)(({ theme }) => ({
  '& .highlight': {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default function ProfileSummary({ data, onBack, onComplete }: ProfileSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<OnboardingData>(data);

  const getContentTypes = () => {
    const types = [];
    if (editedData.contentPreferences.contentTypes.blog) types.push('blog posts');
    if (editedData.contentPreferences.contentTypes.linkedin) types.push('LinkedIn posts');
    if (editedData.contentPreferences.contentTypes.twitter) types.push('Twitter/X posts');
    return types.join(', ');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Review Your Profile</Typography>
        <IconButton 
          size="small" 
          onClick={() => setIsEditing(!isEditing)}
          color={isEditing ? "primary" : "default"}
        >
          {isEditing ? <DoneIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {/* Business Profile */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          1. Business Profile
        </Typography>
        <StyledSummaryText variant="body1" paragraph>
          {isEditing ? (
            <TextField
              fullWidth
              value={editedData.businessDetails.businessName}
              onChange={(e) => setEditedData({
                ...editedData,
                businessDetails: {
                  ...editedData.businessDetails,
                  businessName: e.target.value,
                },
              })}
              sx={{ mb: 1 }}
            />
          ) : (
            <strong>{editedData.businessDetails.businessName}</strong>
          )}{' '}
          is a {editedData.businessDetails.industry} company focused on {editedData.businessDetails.targetAudience}.
        </StyledSummaryText>
        <StyledSummaryText variant="body1">
          {editedData.businessDetails.description}
        </StyledSummaryText>
      </Paper>

      {/* Content Strategy */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          2. Content Strategy
        </Typography>
        <StyledSummaryText variant="body1" paragraph>
          Planning to create <strong>{getContentTypes()}</strong>
        </StyledSummaryText>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Primary goals:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editedData.contentPreferences.goals.map((goal) => (
              <Chip 
                key={goal} 
                label={goal} 
                size="small"
                onDelete={isEditing ? () => {
                  const newGoals = editedData.contentPreferences.goals.filter(g => g !== goal);
                  setEditedData({
                    ...editedData,
                    contentPreferences: {
                      ...editedData.contentPreferences,
                      goals: newGoals,
                    },
                  });
                } : undefined}
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Content topics:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {editedData.contentPreferences.topics.map((topic) => (
              <Chip 
                key={topic} 
                label={topic} 
                size="small"
                onDelete={isEditing ? () => {
                  const newTopics = editedData.contentPreferences.topics.filter(t => t !== topic);
                  setEditedData({
                    ...editedData,
                    contentPreferences: {
                      ...editedData.contentPreferences,
                      topics: newTopics,
                    },
                  });
                } : undefined}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Voice and Style */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          3. Voice and Writing Style
        </Typography>
        <StyledSummaryText variant="body1" paragraph>
          Writing style is characterized as{' '}
          {isEditing ? (
            <Select
              size="small"
              value={editedData.voiceProfile.writingStyle.formality}
              onChange={(e) => setEditedData({
                ...editedData,
                voiceProfile: {
                  ...editedData.voiceProfile,
                  writingStyle: {
                    ...editedData.voiceProfile.writingStyle,
                    formality: e.target.value as 'casual' | 'neutral' | 'formal',
                  },
                },
              })}
              sx={{ mx: 1 }}
            >
              <MenuItem value="casual">casual</MenuItem>
              <MenuItem value="neutral">neutral</MenuItem>
              <MenuItem value="formal">formal</MenuItem>
            </Select>
          ) : (
            <span className="highlight">{editedData.voiceProfile.writingStyle.formality}</span>
          )}{' '}
          and{' '}
          {isEditing ? (
            <Select
              size="small"
              value={editedData.voiceProfile.writingStyle.complexity}
              onChange={(e) => setEditedData({
                ...editedData,
                voiceProfile: {
                  ...editedData.voiceProfile,
                  writingStyle: {
                    ...editedData.voiceProfile.writingStyle,
                    complexity: e.target.value as 'simple' | 'moderate' | 'complex',
                  },
                },
              })}
              sx={{ mx: 1 }}
            >
              <MenuItem value="simple">simple</MenuItem>
              <MenuItem value="moderate">moderate</MenuItem>
              <MenuItem value="complex">complex</MenuItem>
            </Select>
          ) : (
            <span className="highlight">{editedData.voiceProfile.writingStyle.complexity}</span>
          )}{' '}
          with a{' '}
          {isEditing ? (
            <Select
              size="small"
              value={editedData.voiceProfile.writingStyle.emotion}
              onChange={(e) => setEditedData({
                ...editedData,
                voiceProfile: {
                  ...editedData.voiceProfile,
                  writingStyle: {
                    ...editedData.voiceProfile.writingStyle,
                    emotion: e.target.value as 'neutral' | 'passionate' | 'empathetic',
                  },
                },
              })}
              sx={{ mx: 1 }}
            >
              <MenuItem value="neutral">neutral</MenuItem>
              <MenuItem value="passionate">passionate</MenuItem>
              <MenuItem value="empathetic">empathetic</MenuItem>
            </Select>
          ) : (
            <span className="highlight">{editedData.voiceProfile.writingStyle.emotion}</span>
          )}{' '}
          tone.
        </StyledSummaryText>
      </Paper>

      {/* Navigation */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => onComplete(editedData)}
          color="primary"
        >
          Complete Setup
        </Button>
      </Box>
    </Box>
  );
} 