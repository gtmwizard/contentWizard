import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card"
import { Stepper } from "@/components/ui/stepper"
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
    type: "blog" | "social" | "custom";
  }>;
  influencers: string[];
  writingStyle: {
    formality: "casual" | "neutral" | "formal";
    complexity: "simple" | "moderate" | "complex";
    emotion: "neutral" | "passionate" | "empathetic";
  };
}

interface OnboardingData {
  businessDetails: BusinessDetailsData;
  contentPreferences: ContentPreferencesData;
  voiceProfile: VoiceProfileData;
}

// Test data for development
const TEST_DATA: OnboardingData = {
  businessDetails: {
    businessName: "TechFlow Solutions",
    industry: "Software Development",
    targetAudience: "Small to medium-sized businesses looking to automate their workflows",
    description: "We provide innovative software solutions that help businesses streamline their operations and boost productivity through intelligent automation and user-friendly interfaces.",
  },
  contentPreferences: {
    contentTypes: {
      blog: true,
      linkedin: true,
      twitter: true,
    },
    topics: [
      "Digital Transformation",
      "Workflow Automation",
      "Software Development",
      "Tech Innovation",
      "Business Efficiency",
      "AI and Machine Learning"
    ],
    tones: [
      "Professional",
      "Informative",
      "Engaging",
      "Authoritative"
    ],
    goals: [
      "Establish thought leadership",
      "Share industry insights",
      "Showcase expertise",
      "Generate leads",
      "Build brand awareness"
    ],
  },
  voiceProfile: {
    writingSamples: [
      {
        text: "Discover how our latest workflow automation solution helped a growing e-commerce business reduce their order processing time by 75%. Through intelligent process mapping and custom integrations, we transformed their manual operations into a streamlined digital workflow.",
        type: "blog"
      },
      {
        text: "🚀 Excited to announce our new AI-powered automation suite! Helping businesses work smarter, not harder. #TechInnovation #Automation",
        type: "social"
      },
      {
        text: "Looking to scale your business operations without scaling your team size? Our latest case study shows how intelligent automation can help you achieve more with your existing resources. #ProductivityHacks #BusinessGrowth",
        type: "custom"
      }
    ],
    influencers: [
      "Satya Nadella",
      "Marc Benioff",
      "Simon Sinek",
      "Gary Vaynerchuk"
    ],
    writingStyle: {
      formality: "formal",
      complexity: "moderate",
      emotion: "passionate"
    },
  },
};

const steps = [
  "Business Details",
  "Content Preferences",
  "Voice Analysis",
  "Review & Complete"
];

export default function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(TEST_DATA); // Pre-filled with test data
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleNext = (data: Partial<OnboardingData>) => {
    const updatedData = {
      ...onboardingData,
      ...data,
    } as OnboardingData;
    setOnboardingData(updatedData);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = async (data: OnboardingData) => {
    try {
      await updateProfile({ 
        hasCompletedOnboarding: true,
        metadata: data,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            className="mb-12"
          />
          
          {activeStep === 0 && (
            <BusinessDetails
              onNext={(data) => handleNext({ businessDetails: data })}
              initialData={onboardingData?.businessDetails || {
                businessName: '',
                industry: '',
                targetAudience: '',
                description: '',
              }}
            />
          )}

          {activeStep === 1 && onboardingData && (
            <ContentPreferences
              onNext={(data) => handleNext({ contentPreferences: data })}
              onBack={handleBack}
              initialData={onboardingData?.contentPreferences || {
                contentTypes: {
                  blog: false,
                  linkedin: false,
                  twitter: false,
                },
                topics: [],
                tones: [],
                goals: [],
              }}
            />
          )}

          {activeStep === 2 && onboardingData && (
            <VoiceAnalysis
              onNext={(data) => handleNext({ voiceProfile: data })}
              onBack={handleBack}
              initialData={onboardingData?.voiceProfile || {
                writingSamples: [],
                influencers: [],
                writingStyle: {
                  formality: 'neutral',
                  complexity: 'moderate',
                  emotion: 'neutral',
                },
              }}
            />
          )}

          {activeStep === 3 && onboardingData && (
            <ProfileSummary
              data={onboardingData}
              onBack={handleBack}
              onComplete={handleComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 