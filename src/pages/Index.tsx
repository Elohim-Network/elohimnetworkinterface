
import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { toast } from 'sonner';

const Index = () => {
  // Load correct configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('local-ai-config');
    const correctMistralUrl = 'http://localhost:11434/v1/chat/completions';
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        
        // Check if the Mistral URL needs to be updated
        if (config.mistralUrl !== correctMistralUrl) {
          config.mistralUrl = correctMistralUrl;
          localStorage.setItem('local-ai-config', JSON.stringify(config));
          console.log('Updated Mistral URL to the correct endpoint:', correctMistralUrl);
          toast.success('AI model connection updated to the correct endpoint');
        }
      } catch (e) {
        console.error('Error parsing saved config:', e);
        
        // If there's an error, set the correct configuration
        const defaultConfig = {
          mistralUrl: correctMistralUrl,
          stableDiffusionUrl: 'http://localhost:7860/sdapi/v1/txt2img',
          mistralModel: 'mistral-7b',
          sdModel: 'stable-diffusion-v1-5'
        };
        localStorage.setItem('local-ai-config', JSON.stringify(defaultConfig));
      }
    } else {
      // If no saved config exists, create one with the correct URL
      const defaultConfig = {
        mistralUrl: correctMistralUrl,
        stableDiffusionUrl: 'http://localhost:7860/sdapi/v1/txt2img',
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
