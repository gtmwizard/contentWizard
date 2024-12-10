import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import BusinessDetails from '../components/onboarding/BusinessDetails';
import ContentPreferences from '../components/onboarding/ContentPreferences';
import VoiceAnalysis from '../components/onboarding/VoiceAnalysis';
import ProfileSummary from '../components/onboarding/ProfileSummary';

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

interface OnboardingData {
  businessDetails: BusinessDetailsData;
  contentPreferences: ContentPreferencesData;
  voiceProfile: VoiceProfileData;
}

const steps = ['Business Details', 'Content Preferences', 'Voice Analysis', 'Summary'];

const SAMPLE_DATA: OnboardingData = {
  businessDetails: {
    businessName: "TechFlow Solutions",
    industry: "Software Development",
    targetAudience: "Small to medium-sized businesses looking to digitize their operations",
    description: "We create intuitive software solutions that help businesses streamline their workflows and improve productivity. Our focus is on delivering user-friendly applications that solve real business problems.",
  },
  contentPreferences: {
    contentTypes: {
      blog: true,
      linkedin: true,
      twitter: true,
    },
    topics: [
      "Digital Transformation",
      "Software Development",
      "Business Automation",
      "Tech Innovation",
      "Project Management",
    ],
    tones: [
      "Professional",
      "Informative",
      "Engaging",
    ],
    goals: [
      "Establish thought leadership",
      "Share industry insights",
      "Showcase expertise",
      "Drive engagement",
    ],
  },
  voiceProfile: {
    writingSamples: [
      {
        text: "Digital transformation is not just about adopting new technologies - it is about reimagining how your business operates in the digital age. At TechFlow, we believe that successful transformation starts with understanding your unique business needs and challenges.",
        type: "blog",
      },
      {
        text: "Excited to announce our latest case study! See how we helped ABC Corp reduce their processing time by 75% through smart automation. #TechInnovation #BusinessEfficiency",
        type: "social",
      },
    ],
    influencers: [
      "Satya Nadella",
      "Marc Benioff",
      "Jeff Weiner",
    ],
    writingStyle: {
      formality: "neutral",
      complexity: "moderate",
      emotion: "passionate",
    },
  },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, user, checkOnboardingStatus } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(SAMPLE_DATA);

  const handleNext = (stepData: Partial<OnboardingData>) => {
    const updatedData = {
      ...onboardingData,
      ...stepData,
    };
    setOnboardingData(updatedData);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = async (finalData: Partial<OnboardingData>) => {
    try {
      const updatedData = {
        ...onboardingData,
        ...finalData,
      };
      setOnboardingData(updatedData);

      // Update profile with complete onboarding data
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessDetails: updatedData.businessDetails,
          contentPrefs: updatedData.contentPreferences,
          voiceProfile: updatedData.voiceProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Check onboarding status after profile update
      await checkOnboardingStatus();
      
      // Navigate to dashboard after successful profile update
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Welcome to Content Wizard
          </Typography>
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mt: 3, 
              mb: 5,
              width: '100%',
              maxWidth: 600
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            {activeStep === 0 && (
              <BusinessDetails 
                onNext={(data: BusinessDetailsData) => handleNext({ businessDetails: data })}
                initialData={onboardingData.businessDetails}
              />
            )}
            {activeStep === 1 && (
              <ContentPreferences 
                onNext={(data: ContentPreferencesData) => handleNext({ contentPreferences: data })}
                onBack={handleBack}
                initialData={onboardingData.contentPreferences}
              />
            )}
            {activeStep === 2 && (
              <VoiceAnalysis
                onNext={(data: VoiceProfileData) => handleNext({ voiceProfile: data })}
                onBack={handleBack}
                initialData={onboardingData.voiceProfile}
              />
            )}
            {activeStep === 3 && onboardingData && (
              <ProfileSummary
                data={onboardingData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 