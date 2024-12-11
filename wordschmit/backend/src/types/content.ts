export interface GenerationSettings {
  type: 'blog' | 'linkedin' | 'twitter';
  tone: string;
  keywords: string[];
  length?: number;
  targetAudience: string;
  industry: string;
}

export interface ScheduleSettings {
  date: Date;
  time: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  platforms: string[];
} 