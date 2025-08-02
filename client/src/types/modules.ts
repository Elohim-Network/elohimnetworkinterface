export type ModuleCategory = 'business' | 'personal' | 'creative' | 'productivity';

export interface ModuleFeature {
  id: string;
  name: string;
  category: ModuleCategory;
  enabled: boolean;
  price?: number;
}

export interface JukeboxTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  tags: string[];
  campaigns: Array<{
    id: string;
    platform: string;
    plays?: number;
    reach?: number;
    engagement?: number;
    status: string;
    publishedAt?: string;
    scheduledFor?: string;
    videoUrl?: string;
  }>;
  donations: Array<{
    id: string;
    amount: number;
    donor: string;
    donorName?: string;
    message?: string;
    timestamp: string;
  }>;
  emotionalPoints: Array<{
    time: number;
    timestamp: number;
    emotion: string;
    intensity: number;
    description: string;
  }>;
  viralClipPoints: Array<{
    startTime: number;
    endTime: number;
    description: string;
    virality: number;
    strength: number;
    caption?: string;
  }>;
  audioUrl?: string;
  coverUrl?: string;
  coverImageUrl?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ContentDeploymentSettings {
  platforms: Array<{
    name: string;
    platform: string;
    enabled: boolean;
    apiKey?: string;
    accountId?: string;
    settings?: Record<string, any>;
  }>;
  captionTemplates: Array<{
    name: string;
    template: string;
  }>;
  hashtagSets: Array<string[]>;
  ctaTemplates: Array<{
    name: string;
    text: string;
  }>;
  schedulePreferences: {
    bestTimeOfDay: number[];
    daysOfWeek: boolean[];
    frequency: string;
    timezone: string;
    autoSchedule: boolean;
  };
}