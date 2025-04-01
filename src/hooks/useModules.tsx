
import { useState, useEffect } from 'react';
import { Module } from '@/types/marketplace';
import { toast } from 'sonner';

export interface ModuleState {
  installedModules: Module[];
  availableModules: Module[];
  promotedModule: Module | null;
  isLoading: boolean;
}

export function useModules() {
  const [state, setState] = useState<ModuleState>({
    installedModules: [],
    availableModules: [],
    promotedModule: null,
    isLoading: true
  });
  
  // Load user's modules on mount
  useEffect(() => {
    loadModules();
  }, []);
  
  // Load modules from localStorage or API
  const loadModules = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would be an API call to your backend
      // For now, we'll use localStorage to simulate user purchases
      const installedModuleIds = JSON.parse(localStorage.getItem('installed-modules') || '[]');
      const allModules = await fetchAllModules();
      
      const installed = allModules.filter(module => installedModuleIds.includes(module.id));
      const available = allModules.filter(module => !installedModuleIds.includes(module.id));
      
      // Select a random module to promote
      const promotionCandidates = available.filter(m => !m.isInstalled);
      const promotedModule = promotionCandidates.length > 0 
        ? promotionCandidates[Math.floor(Math.random() * promotionCandidates.length)]
        : null;
      
      setState({
        installedModules: installed,
        availableModules: available,
        promotedModule,
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading modules:', error);
      toast.error('Failed to load modules');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };
  
  // Mock fetch all available modules
  // In production, this would be an API call
  const fetchAllModules = async (): Promise<Module[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'voice-module',
        name: 'Advanced Voice Controls',
        description: 'Premium voice settings with ElevenLabs integration',
        price: 9.99,
        category: 'productivity',
        featuredImage: '/placeholder.svg',
        rating: 4.8,
        sales: 128,
        isInstalled: false,
        isNew: false
      },
      {
        id: 'business-tools',
        name: 'Business Tools Suite',
        description: 'Access to all business tools and analytics',
        price: 19.99,
        category: 'business',
        featuredImage: '/placeholder.svg',
        rating: 4.9,
        sales: 256,
        isInstalled: false,
        isNew: false
      },
      {
        id: 'avatar-module',
        name: 'AI Avatar Customization',
        description: 'Customize your AI agent appearance',
        price: 4.99,
        category: 'personal',
        featuredImage: '/placeholder.svg',
        rating: 4.5,
        sales: 87,
        isInstalled: false,
        isNew: true
      },
      {
        id: 'image-generation',
        name: 'Image Generation',
        description: 'Generate images with your AI agent',
        price: 14.99,
        category: 'creative',
        featuredImage: '/placeholder.svg',
        rating: 4.7,
        sales: 103,
        isInstalled: false,
        isNew: true
      }
    ];
  };
  
  // Check if a feature is unlocked (either free or purchased)
  const isFeatureUnlocked = (featureId: string): boolean => {
    // Admin always has access to all features
    if (isAdminUser()) return true;
    
    // Check if this feature is free
    if (isFreeFeature(featureId)) return true;
    
    // Check if this feature is in installed modules
    return state.installedModules.some(module => module.id === featureId);
  };
  
  // Check if user is admin
  const isAdminUser = (): boolean => {
    // In a real app, this would check auth roles
    // For now, we use localStorage to simulate
    return localStorage.getItem('user-role') === 'admin';
  };
  
  // Set admin status (for demo purposes)
  const setAdminStatus = (isAdmin: boolean): void => {
    localStorage.setItem('user-role', isAdmin ? 'admin' : 'user');
    // Reload modules to refresh UI
    loadModules();
  };
  
  // Check if a feature is free
  const isFreeFeature = (featureId: string): boolean => {
    // Define your free features here
    const freeFeatures = ['basic-chat', 'basic-voice'];
    return freeFeatures.includes(featureId);
  };
  
  // Purchase a module
  const purchaseModule = async (moduleId: string): Promise<boolean> => {
    try {
      // In a real app, this would call your payment API
      // For demo, we'll just add to localStorage
      
      // Get the module details
      const moduleToPurchase = state.availableModules.find(m => m.id === moduleId);
      if (!moduleToPurchase) {
        toast.error('Module not found');
        return false;
      }
      
      // Simulate purchase process
      toast.loading(`Processing your purchase: ${moduleToPurchase.name}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get currently installed modules
      const installedModuleIds = JSON.parse(localStorage.getItem('installed-modules') || '[]');
      
      // Add the new module
      if (!installedModuleIds.includes(moduleId)) {
        installedModuleIds.push(moduleId);
        localStorage.setItem('installed-modules', JSON.stringify(installedModuleIds));
      }
      
      // Refresh modules
      await loadModules();
      
      toast.success(`Successfully purchased: ${moduleToPurchase.name}`);
      return true;
    } catch (error) {
      console.error('Error purchasing module:', error);
      toast.error('Failed to complete purchase');
      return false;
    }
  };
  
  // Reset all purchases (for demo purposes)
  const resetPurchases = () => {
    localStorage.setItem('installed-modules', '[]');
    loadModules();
    toast.success('All purchases have been reset');
  };
  
  return {
    ...state,
    isFeatureUnlocked,
    isAdminUser,
    setAdminStatus,
    purchaseModule,
    resetPurchases,
    refreshModules: loadModules
  };
}

export default useModules;
