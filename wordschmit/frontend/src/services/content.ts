import { ApiClient } from './api';
import { API_CONFIG } from '../config/api';
import type { ApiResponse } from '../types/api';
import type { GenerationSettings, ScheduleSettings, GeneratedContent } from '../types/content';

export class ContentService {
  private api: ApiClient;

  constructor() {
    this.api = ApiClient.getInstance();
  }

  async generateContent(topic: string, settings: GenerationSettings) {
    return this.api.post<ApiResponse<{ content: string }>>(
      API_CONFIG.endpoints.content.generate,
      { topic, settings }
    );
  }

  async scheduleContent(content: string, type: string, scheduleSettings: ScheduleSettings) {
    return this.api.post<ApiResponse<GeneratedContent>>(
      API_CONFIG.endpoints.content.schedule,
      { content, type, scheduleSettings }
    );
  }

  async getContents(params?: { status?: string }) {
    return this.api.get<ApiResponse<GeneratedContent[]>>(
      API_CONFIG.endpoints.content.list,
      { params }
    );
  }
}

// Create a singleton instance
export const contentService = new ContentService(); 