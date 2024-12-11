import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProfileSummaryProps {
  onBack: () => void;
  onComplete: (data: {
    businessDetails: {
      businessName: string;
      industry: string;
      targetAudience: string;
      description: string;
    };
    contentPreferences: {
      contentTypes: {
        blog: boolean;
        linkedin: boolean;
        twitter: boolean;
      };
      topics: string[];
      tones: string[];
      goals: string[];
    };
    voiceProfile: {
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
    };
  }) => void;
  data: {
    businessDetails: {
      businessName: string;
      industry: string;
      targetAudience: string;
      description: string;
    };
    contentPreferences: {
      contentTypes: {
        blog: boolean;
        linkedin: boolean;
        twitter: boolean;
      };
      topics: string[];
      tones: string[];
      goals: string[];
    };
    voiceProfile: {
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
    };
  };
}

export default function ProfileSummary({ onBack, onComplete, data }: ProfileSummaryProps) {
  const { businessDetails, contentPreferences, voiceProfile } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Business Profile</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Name</h4>
              <p className="text-foreground">{businessDetails.businessName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
              <p className="text-foreground">{businessDetails.industry}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Target Audience</h4>
              <p className="text-foreground">{businessDetails.targetAudience}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p className="text-foreground">{businessDetails.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Preferences</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Content Types</h4>
              <div className="flex gap-2">
                {Object.entries(contentPreferences.contentTypes)
                  .filter(([_, enabled]) => enabled)
                  .map(([type]) => (
                    <Badge key={type} variant="secondary">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {contentPreferences.topics.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Tones</h4>
              <div className="flex flex-wrap gap-2">
                {contentPreferences.tones.map((tone) => (
                  <Badge key={tone} variant="outline">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Goals</h4>
              <div className="flex flex-wrap gap-2">
                {contentPreferences.goals.map((goal) => (
                  <Badge key={goal} variant="outline">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Voice Profile</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Writing Style</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Formality</p>
                  <p className="text-foreground capitalize">{voiceProfile.writingStyle.formality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  <p className="text-foreground capitalize">{voiceProfile.writingStyle.complexity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emotion</p>
                  <p className="text-foreground capitalize">{voiceProfile.writingStyle.emotion}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Writing Samples</h4>
              <div className="space-y-2">
                {voiceProfile.writingSamples.map((sample, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <Badge variant="secondary" className="mb-2">
                      {sample.type.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-card-foreground">{sample.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Influencers</h4>
              <div className="flex flex-wrap gap-2">
                {voiceProfile.influencers.map((influencer) => (
                  <Badge key={influencer} variant="outline">
                    {influencer}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onComplete(data)}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
} 