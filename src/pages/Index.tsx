
import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import BusinessTools from '@/components/BusinessTools';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { useExitIntent } from '@/hooks/useExitIntent';
import ConnectionStatus from '@/components/ConnectionStatus';

// Define the new API endpoint
const API_URL = "https://mistral.yourdomain.com/v1/chat/completions";

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'tools'>('chat');
  const [backendStatus, setBackendStatus] = useState<{
    mistral: 'unknown' | 'connected' | 'disconnected';
    stableDiffusion: 'unknown' | 'connected' | 'disconnected';
  }>({
    mistral: 'unknown',
    stableDiffusion: 'unknown'
  });
  
  const { showExitIntent, closeExitIntent } = useExitIntent({
    threshold: 50,
    triggerOnIdle: true,
    idleTime: 30000, // 30 seconds
    cookieDuration: 7 // Remember for 7 days
  });

  const handleAcceptOffer = () => {
    closeExitIntent();
    toast.success("Your free agent has been activated! Welcome to the Elohim Network.");
    // Set a flag to indicate the user accepted the offer
    localStorage.setItem('agent-activated', 'true');
  };

  // Check backend connectivity
  const checkBackendConnectivity = async () => {
    // Check Mistral connectivity
    try {
      const response = await fetch(getConfig().mistralUrl, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);
      
      setBackendStatus(prev => ({
        ...prev,
        mistral: response && response.ok ? 'connected' : 'disconnected'
      }));
    } catch (e) {
      setBackendStatus(prev => ({...prev, mistral: 'disconnected'}));
    }
    
    // Check Stable Diffusion connectivity
    try {
      const response = await fetch(getConfig().stableDiffusionUrl, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);
      
      setBackendStatus(prev => ({
        ...prev,
        stableDiffusion: response && response.ok ? 'connected' : 'disconnected'
      }));
    } catch (e) {
      setBackendStatus(prev => ({...prev, stableDiffusion: 'disconnected'}));
    }
  };

  // Helper to get config
  const getConfig = () => {
    const savedConfig = localStorage.getItem('local-ai-config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
    
    // Default configuration with the updated URL
    return {
      mistralUrl: API_URL, // Use the new constant
      stableDiffusionUrl: 'http://127.0.0.1:8188',
      mistralModel: 'mistral-7b',
      sdModel: 'stable-diffusion-v1-5'
    };
  };

  // Load correct configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('local-ai-config');
    const correctMistralUrl = API_URL; // Use the new constant
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
    
    // Check backend connectivity
    checkBackendConnectivity();
    
    // Set up an interval to check connectivity periodically
    const intervalId = setInterval(checkBackendConnectivity, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between border-b py-1 px-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <Tabs 
            value={activeView} 
            onValueChange={(value) => setActiveView(value as 'chat' | 'tools')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="chat">Chat Interface</TabsTrigger>
              <TabsTrigger value="tools">Business Tools</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <ConnectionStatus status={backendStatus} />
            <Link to="/marketplace">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Marketplace</span>
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">Agent Elohim</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' ? (
            <ChatInterface />
          ) : (
            <BusinessTools />
          )}
        </div>
      </div>
      
      {showExitIntent && (
        <ExitIntentPopup onClose={closeExitIntent} onAccept={handleAcceptOffer} />
      )}
    </div>
  );
};

export default Index;
