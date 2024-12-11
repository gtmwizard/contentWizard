export type ContentType = 'blog' | 'linkedin' | 'twitter';
export type ContentStatus = 'draft' | 'scheduled' | 'published';

export interface GenerationSettings {
  type: ContentType;
  tone: string;
  keywords: string[];
  length?: number;
  targetAudience: string;
  industry: string;
}

export interface ContentTypeOption {
  value: ContentType;
  label: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  status: ContentStatus;
  createdAt: string;
  scheduledFor?: string;
  metadata?: {
    platform?: string;
    tags?: string[];
    audience?: string;
  };
}

export interface ScheduleSettings {
  date: Date;
  time: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  platforms: string[];
} 