import { useState, useCallback } from 'react';

export interface ModuleFeature {
  id: string;
  name: string;
  enabled: boolean;
}

export const useModules = () => {
  const [modules] = useState<string[]>([
    'business-tools',
    'jukebox-hero',
    'voice-module',
    'avatar-module',
    'image-generation'
  ]);

  const isAdminUser = useCallback(() => {
    // For demo purposes, return true. In a real app, this would check user permissions
    return true;
  }, []);

  const isFeatureUnlocked = useCallback((featureId: string) => {
    // For demo purposes, return true. In a real app, this would check feature permissions
    return true;
  }, []);

  const purchaseModule = useCallback(async (moduleId: string) => {
    // Mock purchase logic
    console.log(`Purchasing module: ${moduleId}`);
    return Promise.resolve(true);
  }, []);

  return {
    modules,
    isAdminUser,
    isFeatureUnlocked,
    purchaseModule
  };
};