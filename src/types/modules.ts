
import { Module } from './marketplace';

export interface UserModuleSettings {
  moduleId: string;
  enabled: boolean;
  settings: Record<string, any>;
}

export interface AdminStats {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  monthlyData: {
    month: string;
    revenue: number;
    users: number;
  }[];
}

// Define the module category type to match the Module interface
export type ModuleCategory = "productivity" | "business" | "personal" | "creative" | "music";

// Define JukeboxTrack interface
export interface JukeboxTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImageUrl: string;
  duration: number;
  tags: string[];
  emotionalPoints: {
    timestamp: number;
    emotion: string;
    intensity: number;
  }[];
  viralClipPoints: {
    startTime: number;
    endTime: number;
    strength: number;
    caption: string;
  }[];
  campaigns: {
    id: string;
    platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'x';
    status: 'scheduled' | 'published' | 'failed';
    scheduledFor?: string;
    publishedAt?: string;
    reach?: number;
    plays?: number;
    engagement?: number;
    videoUrl?: string;
  }[];
  donations: {
    id: string;
    amount: number;
    currency: string;
    timestamp: string;
    donorName?: string;
    donorEmail?: string;
    message?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Define content deployment settings
export interface ContentDeploymentSettings {
  platforms: {
    platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'x';
    enabled: boolean;
    accessToken?: string;
    refreshToken?: string;
    accountId?: string;
  }[];
  captionTemplates: string[];
  hashtagSets: string[][];
  ctaTemplates: string[];
  schedulePreferences: {
    bestTimeOfDay: number[];
    daysOfWeek: boolean[];
    frequency: number;
  };
}
