import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

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
  const [newTone, setNewTone] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const handleContentTypeChange = (type: keyof ContentPreferencesData['contentTypes']) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: {
        ...prev.contentTypes,
        [type]: !prev.contentTypes[type],
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

  const addCustomTone = () => {
    if (newTone.trim() && !preferences.tones.includes(newTone.trim())) {
      setPreferences(prev => ({
        ...prev,
        tones: [...prev.tones, newTone.trim()],
      }));
      setNewTone('');
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
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Types</h3>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="blog"
                checked={preferences.contentTypes.blog}
                onCheckedChange={() => handleContentTypeChange('blog')}
              />
              <Label htmlFor="blog">Blog Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="linkedin"
                checked={preferences.contentTypes.linkedin}
                onCheckedChange={() => handleContentTypeChange('linkedin')}
              />
              <Label htmlFor="linkedin">LinkedIn Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="twitter"
                checked={preferences.contentTypes.twitter}
                onCheckedChange={() => handleContentTypeChange('twitter')}
              />
              <Label htmlFor="twitter">Twitter/X Posts</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Topics</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_TOPICS.map((topic) => (
              <Badge
                key={topic}
                variant={preferences.topics.includes(topic) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add custom topic"
              onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
            />
            <Button onClick={addCustomTopic} variant="outline" size="sm">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Tone</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_TONES.map((tone) => (
              <Badge
                key={tone}
                variant={preferences.tones.includes(tone) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleToneClick(tone)}
              >
                {tone}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTone}
              onChange={(e) => setNewTone(e.target.value)}
              placeholder="Add custom tone"
              onKeyDown={(e) => e.key === 'Enter' && addCustomTone()}
            />
            <Button onClick={addCustomTone} variant="outline" size="sm">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Content Goals</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_GOALS.map((goal) => (
              <Badge
                key={goal}
                variant={preferences.goals.includes(goal) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleGoalClick(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add custom goal"
              onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
            />
            <Button onClick={addCustomGoal} variant="outline" size="sm">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          onClick={() => onNext(preferences)}
          disabled={!isValid()}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 