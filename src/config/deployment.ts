
/**
 * Deployment configuration for the application
 * This file contains settings that help prepare the app for market release
 */

export const AppConfig = {
  // Application name and branding
  appName: 'Agent Elohim',
  appDescription: 'Your personal AI assistant for content creation and business productivity',
  appVersion: '1.0.0',
  
  // Default AI model settings
  defaultMistralModel: 'mistral-7b-instruct',
  defaultSdModel: 'stable-diffusion-v1-5',
  
  // Analytics and tracking (if implemented)
  enableAnalytics: false,
  analyticsProvider: 'none', // 'none', 'ga4', 'plausible', etc.
  
  // Feature flags for gradual rollout
  features: {
    voiceEnabled: true,
    imageGeneration: true,
    jukeboxModule: true,
    businessTools: true,
    elevenLabsIntegration: true,
    localAiModels: true,
  },
  
  // Deployment environment
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // External service endpoints
  endpoints: {
    mistralCloud: 'https://agentelohim.com/v1/chat/completions',
    backendApi: '', // Add your backend API URL if applicable
  },
  
  // Social media and contact links
  social: {
    twitter: 'https://twitter.com/ElohimNetwork',
    facebook: 'https://facebook.com/ElohimNetwork',
    instagram: 'https://instagram.com/ElohimNetwork',
    youtube: 'https://youtube.com/ElohimNetwork',
    website: 'https://elohimnetwork.com',
    supportEmail: 'support@elohimnetwork.com',
  },
  
  // Marketplace configuration
  marketplace: {
    enabled: true,
    showPricing: true,
    allowModuleInstall: true,
  }
};

export default AppConfig;
