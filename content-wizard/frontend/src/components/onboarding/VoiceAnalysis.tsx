import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SelectEnhanced } from "@/components/ui/select-enhanced"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { X, Upload } from "lucide-react"

interface VoiceAnalysisProps {
  onNext: (data: VoiceProfileData) => void;
  onBack: () => void;
  initialData: VoiceProfileData;
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

type SampleType = "blog" | "social" | "custom";
const SAMPLE_TYPES: SampleType[] = ['blog', 'social', 'custom'];

const WRITING_STYLES = {
  formality: [
    { value: 'casual', label: 'Casual and Relaxed' },
    { value: 'neutral', label: 'Neutral and Balanced' },
    { value: 'formal', label: 'Formal and Professional' },
  ],
  complexity: [
    { value: 'simple', label: 'Simple and Clear' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'complex', label: 'Complex and Sophisticated' },
  ],
  emotion: [
    { value: 'neutral', label: 'Neutral and Objective' },
    { value: 'passionate', label: 'Passionate and Energetic' },
    { value: 'empathetic', label: 'Empathetic and Understanding' },
  ],
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
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfileData>(initialData);
  const [newSample, setNewSample] = useState<{ text: string; type: SampleType }>({ text: '', type: 'blog' });
  const [newInfluencer, setNewInfluencer] = useState('');

  const handleAddSample = () => {
    if (newSample.text.trim()) {
      setVoiceProfile(prev => ({
        ...prev,
        writingSamples: [...prev.writingSamples, { ...newSample, text: newSample.text.trim() }],
      }));
      setNewSample({ text: '', type: 'blog' });
    }
  };

  const handleRemoveSample = (index: number) => {
    setVoiceProfile(prev => ({
      ...prev,
      writingSamples: prev.writingSamples.filter((_, i) => i !== index),
    }));
  };

  const handleInfluencerClick = (influencer: string) => {
    setVoiceProfile(prev => ({
      ...prev,
      influencers: prev.influencers.includes(influencer)
        ? prev.influencers.filter(i => i !== influencer)
        : [...prev.influencers, influencer],
    }));
  };

  const handleStyleChange = (
    key: keyof VoiceProfileData['writingStyle'],
    value: string
  ) => {
    setVoiceProfile(prev => ({
      ...prev,
      writingStyle: {
        ...prev.writingStyle,
        [key]: value,
      },
    }));
  };

  const isValid = () => {
    return (
      voiceProfile.writingSamples.length > 0 &&
      voiceProfile.influencers.length > 0
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Writing Samples</h3>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Textarea
                value={newSample.text}
                onChange={(e) => setNewSample({ ...newSample, text: e.target.value })}
                placeholder="Enter a sample of your writing..."
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <SelectEnhanced
                  label="Sample Type"
                  options={SAMPLE_TYPES.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))}
                  value={newSample.type}
                  onChange={(value) => setNewSample({ ...newSample, type: value as SampleType })}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddSample}
                  disabled={!newSample.text.trim()}
                  className="self-end"
                >
                  Add Sample
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {voiceProfile.writingSamples.map((sample, index) => (
                <div
                  key={index}
                  className="relative p-4 rounded-lg border bg-card"
                >
                  <Badge variant="secondary" className="mb-2">
                    {sample.type.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-card-foreground">
                    {sample.text}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveSample(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Writing Style</h3>
          <div className="space-y-4">
            <SelectEnhanced
              label="Formality Level"
              options={WRITING_STYLES.formality}
              value={voiceProfile.writingStyle.formality}
              onChange={(value) => handleStyleChange('formality', value as VoiceProfileData['writingStyle']['formality'])}
            />
            <SelectEnhanced
              label="Language Complexity"
              options={WRITING_STYLES.complexity}
              value={voiceProfile.writingStyle.complexity}
              onChange={(value) => handleStyleChange('complexity', value as VoiceProfileData['writingStyle']['complexity'])}
            />
            <SelectEnhanced
              label="Emotional Tone"
              options={WRITING_STYLES.emotion}
              value={voiceProfile.writingStyle.emotion}
              onChange={(value) => handleStyleChange('emotion', value as VoiceProfileData['writingStyle']['emotion'])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Influencers</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select content creators or thought leaders whose writing style you admire
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {INFLUENCERS.map((influencer) => (
              <Badge
                key={influencer}
                variant={voiceProfile.influencers.includes(influencer) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleInfluencerClick(influencer)}
              >
                {influencer}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInfluencer}
              onChange={(e) => setNewInfluencer(e.target.value)}
              placeholder="Add custom influencer"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newInfluencer.trim()) {
                  handleInfluencerClick(newInfluencer.trim());
                  setNewInfluencer('');
                }
              }}
            />
            <Button
              onClick={() => {
                if (newInfluencer.trim()) {
                  handleInfluencerClick(newInfluencer.trim());
                  setNewInfluencer('');
                }
              }}
              variant="outline"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onNext(voiceProfile)} disabled={!isValid()}>
          Next
        </Button>
      </div>
    </div>
  );
} 