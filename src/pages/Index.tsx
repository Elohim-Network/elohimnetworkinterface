
import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import BusinessTools from '@/components/BusinessTools';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, AlertCircle, Music, Settings, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { useExitIntent } from '@/hooks/useExitIntent';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useModules } from '@/hooks/useModules';
import ConnectionTester from '@/components/ConnectionTester';
import LocalChat from '@/components/LocalChat';

const API_ENDPOINTS = {
  CHAT_COMPLETIONS: "https://agentelohim.com/v1/chat/completions",
  API_GENERATE: "https://agentelohim.com/api/generate"
};

const Index = () => {
  const [activeView, setActiveView] = useState<'chat' | 'tools' | 'jukebox' | 'connections' | 'local-chat'>('chat');
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
  
  const { isFeatureUnlocked, isAdminUser, purchaseModule } = useModules();

  const handleAcceptOffer = () => {
    closeExitIntent();
    toast.success("Your free agent has been activated! Welcome to the Elohim Network.");
    localStorage.setItem('agent-activated', 'true');
  };
  
  const handleBusinessToolsClick = () => {
    if (!isFeatureUnlocked('business-tools') && !isAdminUser()) {
      toast.info("Business Tools require the Business Tools Suite module");
      
      if (confirm("Would you like to purchase the Business Tools Suite?")) {
        purchaseModule('business-tools').then(success => {
          if (success) {
            setActiveView('tools');
          }
        });
      }
      return;
    }
    
    setActiveView('tools');
  };
  
  const handleJukeboxClick = () => {
    if (!isFeatureUnlocked('jukebox-hero') && !isAdminUser()) {
      toast.info("Jukebox Hero requires the Jukebox Hero module");
      
      if (confirm("Would you like to purchase the Jukebox Hero module?")) {
        purchaseModule('jukebox-hero').then(success => {
          if (success) {
            setActiveView('jukebox');
          }
        });
      }
      return;
    }
    
    setActiveView('jukebox');
  };

  const checkBackendConnectivity = async () => {
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

  const getConfig = () => {
    const savedConfig = localStorage.getItem('local-ai-config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
    
    return {
      mistralUrl: API_ENDPOINTS.CHAT_COMPLETIONS,
      stableDiffusionUrl: 'http://127.0.0.1:8188',
      mistralModel: 'mistral-7b-instruct',
      sdModel: 'stable-diffusion-v1-5'
    };
  };

  const detectAndConfigureEndpoints = async () => {
    let config = getConfig();
    let updated = false;
    let mistralEndpoint = config.mistralUrl;
    
    try {
      const response = await fetch(API_ENDPOINTS.CHAT_COMPLETIONS, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);
      
      if (response && response.ok) {
        mistralEndpoint = API_ENDPOINTS.CHAT_COMPLETIONS;
        console.log("Chat completions endpoint is available");
      } else {
        try {
          const genResponse = await fetch(API_ENDPOINTS.API_GENERATE, {
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => null);
          
          if (genResponse && genResponse.ok) {
            mistralEndpoint = API_ENDPOINTS.API_GENERATE;
            console.log("API generate endpoint is available");
          }
        } catch (e) {
          console.log("API generate endpoint check failed:", e);
        }
      }
    } catch (e) {
      console.log("Chat completions endpoint check failed:", e);
      
      try {
        const genResponse = await fetch(API_ENDPOINTS.API_GENERATE, {
          method: 'OPTIONS',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => null);
        
        if (genResponse && genResponse.ok) {
          mistralEndpoint = API_ENDPOINTS.API_GENERATE;
          console.log("API generate endpoint is available");
        }
      } catch (e) {
        console.log("API generate endpoint check failed:", e);
      }
    }
    
    if (config.mistralUrl !== mistralEndpoint) {
      config.mistralUrl = mistralEndpoint;
      updated = true;
      console.log(`Updated Mistral endpoint to: ${mistralEndpoint}`);
    }
    
    if (updated) {
      localStorage.setItem('local-ai-config', JSON.stringify(config));
      toast.success(`AI model connection updated to: ${mistralEndpoint}`);
    }
    
    return config;
  };

  useEffect(() => {
    detectAndConfigureEndpoints().then(() => {
      checkBackendConnectivity();
    });
    
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
            onValueChange={(value) => {
              if (value === 'tools') {
                handleBusinessToolsClick();
              } else if (value === 'jukebox') {
                handleJukeboxClick();
              } else {
                setActiveView(value as 'chat' | 'tools' | 'jukebox' | 'connections' | 'local-chat');
              }
            }}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="chat">Chat Interface</TabsTrigger>
              <TabsTrigger value="tools">Business Tools</TabsTrigger>
              <TabsTrigger value="jukebox" className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                Jukebox Hero
              </TabsTrigger>
              <TabsTrigger value="local-chat" className="flex items-center gap-1">
                <Cpu className="h-4 w-4" />
                Local LLM
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Connections
              </TabsTrigger>
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
          ) : activeView === 'tools' ? (
            <BusinessTools />
          ) : activeView === 'local-chat' ? (
            <LocalChat />
          ) : activeView === 'connections' ? (
            <div className="p-6 overflow-auto h-full">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Connection Settings</h1>
                <p className="mb-6 text-muted-foreground">
                  Test your connections to the AI services used across all modules in Agent Elohim.
                </p>
                <ConnectionTester />
              </div>
            </div>
          ) : (
            <iframe 
              src="/jukebox" 
              className="w-full h-full border-none"
              title="Jukebox Hero"
            />
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
