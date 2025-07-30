export type ModuleCategory = 'business' | 'personal' | 'creative' | 'productivity';

export interface ModuleFeature {
  id: string;
  name: string;
  category: ModuleCategory;
  enabled: boolean;
  price?: number;
}