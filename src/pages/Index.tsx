
import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { toast } from 'sonner';

const Index = () => {
  // Load correct configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('local-ai-config');
    const correctMistralUrl = 'http://localhost:11434/v1/chat/completions';
    const correctSdUrl = 'http://127.0.0.1:8188';
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        let updated = false;
        
        // Check if the Mistral URL needs to be updated
        if (config.mistralUrl !== correctMistralUrl) {
          config.mistralUrl = correctMistralUrl;
          updated = true;
        }
        
        // Check if the Stable Diffusion URL needs to be updated
        if (config.stableDiffusionUrl !== correctSdUrl) {
          config.stableDiffusionUrl = correctSdUrl;
          updated = true;
        }
        
        if (updated) {
          localStorage.setItem('local-ai-config', JSON.stringify(config));
          console.log('Updated API endpoints to the correct URLs:', correctMistralUrl, correctSdUrl);
          toast.success('AI model connections updated to the correct endpoints');
        }
      } catch (e) {
        console.error('Error parsing saved config:', e);
        
        // If there's an error, set the correct configuration
        const defaultConfig = {
          mistralUrl: correctMistralUrl,
          stableDiffusionUrl: correctSdUrl,
          mistralModel: 'mistral-7b',
          sdModel: 'stable-diffusion-v1-5'
        };
        localStorage.setItem('local-ai-config', JSON.stringify(defaultConfig));
      }
    } else {
      // If no saved config exists, create one with the correct URLs
      const defaultConfig = {
        mistralUrl: correctMistralUrl,
        stableDiffusionUrl: correctSdUrl,
        mistralModel: 'mistral-7b',
        sdModel: 'stable-diffusion-v1-5'
      };
      localStorage.setItem('local-ai-config', JSON.stringify(defaultConfig));
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ChatInterface />
    </div>
  );
};

export default Index;
