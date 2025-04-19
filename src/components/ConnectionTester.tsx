import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { testMistralConnection, testStableDiffusionConnection } from '@/services/ai';
import { Check, X, Loader2, Wrench, Shield, Activity } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getConfig, saveConfig } from '@/services/ai/config';
import { toast } from 'sonner';

const ConnectionTester = () => {
  const [testingMistral, setTestingMistral] = useState(false);
  const [mistralStatus, setMistralStatus] = useState<{success: boolean, message: string} | null>(null);
  const [testingSD, setTestingSD] = useState(false);
  const [sdStatus, setSDStatus] = useState<{success: boolean, message: string} | null>(null);
  
  const handleTestMistral = async () => {
    setTestingMistral(true);
    setMistralStatus(null);
    
    try {
      const result = await testMistralConnection();
      setMistralStatus(result);
    } catch (error: any) {
      setMistralStatus({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setTestingMistral(false);
    }
  };
  
  const handleTestStableDiffusion = async () => {
    setTestingSD(true);
    setSDStatus(null);
    
    try {
      const result = await testStableDiffusionConnection();
      setSDStatus(result);
    } catch (error: any) {
      setSDStatus({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setTestingSD(false);
    }
  };

  const handleFixMistral = async () => {
    toast.info("Attempting to fix Mistral connection...");
    
    try {
      const config = getConfig();
      
      // Try different endpoint formats
      const endpoints = [
        "https://agentelohim.com/v1/chat/completions",
        "https://agentelohim.com/api/generate",
        "http://localhost:11434/api/generate", // Ollama default
        "http://localhost:1234/v1/chat/completions", // LM Studio default
      ];
      
      let foundWorkingEndpoint = false;
      
      for (const endpoint of endpoints) {
        toast.info(`Trying endpoint: ${endpoint}...`);
        
        try {
          // Check if endpoint is accessible
          const checkResponse = await fetch(endpoint, { 
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' }
          }).catch(() => null);
          
          if (checkResponse && checkResponse.ok) {
            // Update config with working endpoint
            config.mistralUrl = endpoint;
            saveConfig(config);
            
            toast.success(`Found working endpoint: ${endpoint}`);
            foundWorkingEndpoint = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to connect to ${endpoint}`);
        }
      }
      
      if (foundWorkingEndpoint) {
        // Test the connection again
        await handleTestMistral();
      } else {
        toast.error("Automatic fix failed. Please configure manually.");
      }
    } catch (error) {
      toast.error("Failed to fix connection. Please try manually.");
    }
  };
  
  const handleFixSD = async () => {
    toast.info("Attempting to fix Stable Diffusion connection...");
    
    try {
      const config = getConfig();
      
      // Try different endpoint formats
      const endpoints = [
        "http://127.0.0.1:7860/sdapi/v1/txt2img", // Automatic1111
        "http://127.0.0.1:8188",                  // ComfyUI
        "http://localhost:7860/sdapi/v1/txt2img", // Automatic1111 alt
        "http://localhost:8188",                  // ComfyUI alt
      ];
      
      let foundWorkingEndpoint = false;
      
      for (const endpoint of endpoints) {
        toast.info(`Trying endpoint: ${endpoint}...`);
        
        try {
          // Check if endpoint is accessible
          const checkResponse = await fetch(endpoint, { 
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' }
          }).catch(() => null);
          
          if (checkResponse && checkResponse.ok) {
            // Update config with working endpoint
            config.stableDiffusionUrl = endpoint;
            saveConfig(config);
            
            toast.success(`Found working endpoint: ${endpoint}`);
            foundWorkingEndpoint = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to connect to ${endpoint}`);
        }
      }
      
      if (foundWorkingEndpoint) {
        // Test the connection again
        await handleTestStableDiffusion();
      } else {
        toast.error("Automatic fix failed. Please start Stable Diffusion and configure manually.");
      }
    } catch (error) {
      toast.error("Failed to fix connection. Please try manually.");
    }
  };
  
  useEffect(() => {
    handleTestMistral();
    handleTestStableDiffusion();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Connection Status</h3>
        <Button 
          onClick={() => toast.info("Full diagnostics not available")}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Activity className="h-4 w-4" />
          Full Diagnostics
        </Button>
      </div>
      
      <div className="space-y-4 border rounded-md p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Mistral Connection</span>
              {mistralStatus && (
                <div className={`text-sm ${mistralStatus.success ? 'text-green-500' : 'text-red-500'} mt-1`}>
                  {mistralStatus.message}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleTestMistral} 
                disabled={testingMistral}
                variant={mistralStatus?.success ? "outline" : "default"}
                className={mistralStatus?.success ? "border-green-500 text-green-500" : ""}
              >
                {testingMistral ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mistralStatus?.success ? (
                  <Check className="h-4 w-4" />
                ) : mistralStatus?.success === false ? (
                  <X className="h-4 w-4" />
                ) : (
                  "Test Connection"
                )}
              </Button>
              
              {mistralStatus && !mistralStatus.success && (
                <Button
                  size="sm"
                  onClick={handleFixMistral}
                  disabled={testingMistral}
                  variant="default"
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix It
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Stable Diffusion Connection</span>
              {sdStatus && (
                <div className={`text-sm ${sdStatus.success ? 'text-green-500' : 'text-red-500'} mt-1`}>
                  {sdStatus.message}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleTestStableDiffusion} 
                disabled={testingSD}
                variant={sdStatus?.success ? "outline" : "default"}
                className={sdStatus?.success ? "border-green-500 text-green-500" : ""}
              >
                {testingSD ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : sdStatus?.success ? (
                  <Check className="h-4 w-4" />
                ) : sdStatus?.success === false ? (
                  <X className="h-4 w-4" />
                ) : (
                  "Test Connection"
                )}
              </Button>
              
              {sdStatus && !sdStatus.success && (
                <Button
                  size="sm"
                  onClick={handleFixSD}
                  disabled={testingSD}
                  variant="default"
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix It
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {(!mistralStatus?.success || !sdStatus?.success) && (
          <Alert className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertTitle>Connection Issues Detected</AlertTitle>
            <AlertDescription>
              Some AI services could not be connected. Use the "Fix It" buttons to automatically
              attempt connection repairs, or use Full Diagnostics for advanced troubleshooting.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ConnectionTester;
