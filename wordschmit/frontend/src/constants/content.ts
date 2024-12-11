import { ContentTypeOption } from '@/types/content';

export const CONTENT_TYPES: ContentTypeOption[] = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'twitter', label: 'Twitter/X Post' },
];

export const TONES = [
  'Professional',
  'Conversational',
  'Informative',
  'Persuasive',
  'Inspiring',
  'Technical',
  'Friendly',
] as const;

export type ToneType = typeof TONES[number];

export const DEFAULT_SETTINGS = {
  type: 'blog' as const,
  tone: 'Professional' as ToneType,
  keywords: [],
  length: 500,
  targetAudience: 'Business Professionals',
  industry: 'Technology',
}; 