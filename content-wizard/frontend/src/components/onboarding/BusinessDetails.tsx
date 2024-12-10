import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() !== '' &&
      formData.industry !== '' &&
      formData.targetAudience.trim() !== '' &&
      formData.description.trim() !== ''
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tell us about your business
      </Typography>
      
      <TextField
        fullWidth
        label="Business Name"
        name="businessName"
        value={formData.businessName}
        onChange={handleTextChange}
        margin="normal"
        required
        helperText="Enter your company or brand name"
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Industry</InputLabel>
        <Select
          name="industry"
          value={formData.industry}
          label="Industry"
          onChange={handleSelectChange}
        >
          {INDUSTRIES.map((industry) => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Target Audience"
        name="targetAudience"
        value={formData.targetAudience}
        onChange={handleTextChange}
        margin="normal"
        required
        multiline
        rows={2}
        helperText="Describe your ideal customer or audience (e.g., 'Small business owners in the tech industry')"
      />

      <TextField
        fullWidth
        label="Business Description"
        name="description"
        value={formData.description}
        onChange={handleTextChange}
        margin="normal"
        required
        multiline
        rows={4}
        helperText="Provide a brief description of what your business does and its unique value proposition"
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={!isFormValid()}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
} 