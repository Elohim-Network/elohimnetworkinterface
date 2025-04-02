
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
export type ModuleCategory = "productivity" | "business" | "personal" | "creative";
