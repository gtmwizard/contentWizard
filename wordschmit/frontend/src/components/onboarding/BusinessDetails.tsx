import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface BusinessDetailsProps {
  onNext: (data: BusinessDetailsData) => void;
  initialData: BusinessDetailsData;
}

interface BusinessDetailsData {
  businessName: string;
  industry: string;
  targetAudience: string;
  description: string;
}

const INDUSTRIES = [
  'Software Development',
  'E-commerce',
  'Healthcare',
  'Financial Services',
  'Education',
  'Marketing & Advertising',
  'Real Estate',
  'Manufacturing',
  'Consulting',
  'Retail',
  'Technology',
  'Other',
];

export default function BusinessDetails({ onNext, initialData }: BusinessDetailsProps) {
  const [formData, setFormData] = useState<BusinessDetailsData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isValid = () => {
    return (
      formData.businessName.trim() !== '' &&
      formData.industry !== '' &&
      formData.targetAudience.trim() !== '' &&
      formData.description.trim() !== ''
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="businessName" className="text-sm font-medium">
          Business Name
        </label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          placeholder="Enter your business name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="industry" className="text-sm font-medium">
          Industry
        </label>
        <Select
          value={formData.industry}
          onValueChange={(value) =>
            setFormData({ ...formData, industry: value })
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="targetAudience" className="text-sm font-medium">
          Target Audience
        </label>
        <Input
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(e) =>
            setFormData({ ...formData, targetAudience: e.target.value })
          }
          placeholder="Describe your target audience"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Business Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe what your business does"
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={!isValid()}>
          Next
        </Button>
      </div>
    </form>
  );
} 