import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, XCircle, RefreshCw, Wrench, Server, Cpu, Database } from 'lucide-react';
import { toast } from 'sonner';
import { getConfig, saveConfig } from '@/services/ai/config';
import { testMistralConnection } from '@/services/ai/textService';
import { testStableDiffusionConnection } from '@/services/ai/imageService';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { detectLlmBackend } from '@/services/ai/utils';
import { StatusType, StorageStatusType } from '@/services/ai/types';

interface SystemStatus {
  mistralApi: {
    status: StatusType;
    message: string;
  };
  stableDiffusion: {
    status: StatusType;
    message: string;
  };
  elementLabs: {
    status: StatusType;
    message: string;
  };
  localStorage: {
    status: StorageStatusType;
    message: string;
  };
}

const DiagnosticsTool: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    mistralApi: { status: 'unknown', message: 'Not tested yet' },
    stableDiffusion: { status: 'unknown', message: 'Not tested yet' },
    elementLabs: { status: 'unknown', message: 'Not tested yet' },
    localStorage: { status: 'unknown', message: 'Not tested yet' },
  });
  
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("diagnostics");
  const [availableModels, setAvailableModels] = useState<string[]>([
    'mistral-7b-instruct', 
    'mixtral-8x7b-32768', 
    'llama-2-70b-chat', 
    'llama-3-70b',
    'codellama-34b'
  ]);
  
  const overallStatus = (): 'success' | 'error' | 'warning' | 'unknown' => {
    const statuses = [
      systemStatus.mistralApi.status,
      systemStatus.stableDiffusion.status,
      systemStatus.localStorage.status
    ];
    
    if (statuses.some(s => s === 'disconnected')) return 'error';
    if (statuses.some(s => s === 'fixing')) return 'warning';
    if (statuses.every(s => s === 'connected' || s === 'available')) return 'success';
    return 'unknown';
  };
  
  const isFixingAny = (): boolean => {
    return Object.values(systemStatus).some(
      system => system.status === 'fixing'
    );
  };
  
  const runFullDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    toast.info("Running system diagnostics...");
    
    await testMistralConnection();
    await testStableDiffusionStorage();
    await testLocalStorage();
    
    setIsRunningDiagnostics(false);
    
    const status = overallStatus();
    if (status === 'success') {
      toast.success("All systems are operational!");
    } else if (status === 'error') {
      toast.error("Some systems are not operational. Click 'Fix Issues' to attempt automatic repairs.");
    } else if (status === 'unknown') {
      toast.warning("System status is incomplete. Please run diagnostics again.");
    }
  };
  
  const testMistralConnection = async () => {
    setSystemStatus(prev => ({
      ...prev,
      mistralApi: { status: 'unknown', message: 'Testing connection...' }
    }));
    
    try {
      const result = await testMistralConnection();
      
      setSystemStatus(prev => ({
        ...prev,
        mistralApi: { 
          status: result.success ? 'connected' : 'disconnected',
          message: result.message
        }
      }));
      
      return result.success;
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        mistralApi: { 
          status: 'disconnected', 
          message: `Connection error: ${error.message || 'Unknown error'}` 
        }
      }));
      
      return false;
    }
  };
  
  const testStableDiffusionStorage = async () => {
    setSystemStatus(prev => ({
      ...prev,
      stableDiffusion: { status: 'unknown', message: 'Testing connection...' }
    }));
    
    try {
      const result = await testStableDiffusionConnection();
      
      setSystemStatus(prev => ({
        ...prev,
        stableDiffusion: { 
          status: result.success ? 'connected' : 'disconnected',
          message: result.message
        }
      }));
      
      return result.success;
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        stableDiffusion: { 
          status: 'disconnected', 
          message: `Connection error: ${error.message || 'Unknown error'}` 
        }
      }));
      
      return false;
    }
  };
  
  const testLocalStorage = async () => {
    setSystemStatus(prev => ({
      ...prev,
      localStorage: { status: 'unknown', message: 'Testing local storage...' }
    }));
    
    try {
      const testKey = '_test_storage_';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const isAvailable = value === 'test';
      
      setSystemStatus(prev => ({
        ...prev,
        localStorage: { 
          status: isAvailable ? 'available' : 'unavailable',
          message: isAvailable ? 'Local storage is working properly' : 'Local storage test failed'
        }
      }));
      
      return isAvailable;
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        localStorage: { 
          status: 'unavailable', 
          message: `Local storage error: ${error.message || 'Unknown error'}` 
        }
      }));
      
      return false;
    }
  };
  
  const fixMistralConnection = async () => {
    toast.info("Attempting to fix Mistral API connection...");
    
    setSystemStatus(prev => ({
      ...prev,
      mistralApi: { status: 'fixing', message: 'Attempting to fix connection...' }
    }));
    
    try {
      const config = getConfig();
      
      const endpoints = [
        "https://agentelohim.com/v1/chat/completions",
        "https://agentelohim.com/api/generate",
        "http://localhost:11434/api/generate",
        "http://localhost:1234/v1/chat/completions",
      ];
      
      let foundWorkingEndpoint = false;
      
      for (const endpoint of endpoints) {
        setSystemStatus(prev => ({
          ...prev,
          mistralApi: { status: 'fixing', message: `Trying endpoint: ${endpoint}...` }
        }));
        
        try {
          const checkResponse = await fetch(endpoint, { 
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' }
          }).catch(() => null);
          
          if (checkResponse && checkResponse.ok) {
            config.mistralUrl = endpoint;
            saveConfig(config);
            
            const backendType = detectLlmBackend(endpoint);
            toast.success(`Found working endpoint (${backendType}): ${endpoint}`);
            
            foundWorkingEndpoint = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to connect to ${endpoint}`);
        }
      }
      
      if (foundWorkingEndpoint) {
        await testMistralConnection();
      } else {
        setSystemStatus(prev => ({
          ...prev,
          mistralApi: { 
            status: 'disconnected', 
            message: 'Could not find a working endpoint. Please configure manually in settings.' 
          }
        }));
        
        toast.error("Automatic fix failed. Please configure API endpoint manually.");
      }
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        mistralApi: { 
          status: 'disconnected', 
          message: `Fix attempt failed: ${error.message || 'Unknown error'}` 
        }
      }));
      
      toast.error("Failed to fix Mistral API connection.");
    }
  };
  
  const fixStableDiffusionConnection = async () => {
    toast.info("Attempting to fix Stable Diffusion connection...");
    
    setSystemStatus(prev => ({
      ...prev,
      stableDiffusion: { status: 'fixing', message: 'Attempting to fix connection...' }
    }));
    
    try {
      const config = getConfig();
      
      const endpoints = [
        "http://127.0.0.1:7860/sdapi/v1/txt2img",
        "http://127.0.0.1:8188",
        "http://localhost:7860/sdapi/v1/txt2img",
        "http://localhost:8188",
      ];
      
      let foundWorkingEndpoint = false;
      
      for (const endpoint of endpoints) {
        setSystemStatus(prev => ({
          ...prev,
          stableDiffusion: { status: 'fixing', message: `Trying endpoint: ${endpoint}...` }
        }));
        
        try {
          const checkResponse = await fetch(endpoint, { 
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' }
          }).catch(() => null);
          
          if (checkResponse && checkResponse.ok) {
            config.stableDiffusionUrl = endpoint;
            saveConfig(config);
            
            toast.success(`Found working Stable Diffusion endpoint: ${endpoint}`);
            
            foundWorkingEndpoint = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to connect to ${endpoint}`);
        }
      }
      
      if (foundWorkingEndpoint) {
        await testStableDiffusionStorage();
      } else {
        setSystemStatus(prev => ({
          ...prev,
          stableDiffusion: { 
            status: 'disconnected', 
            message: 'Could not find a working Stable Diffusion endpoint. Please ensure it is running and configure manually.' 
          }
        }));
        
        toast.error("Automatic fix failed. Please start Stable Diffusion and configure manually.");
      }
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        stableDiffusion: { 
          status: 'disconnected', 
          message: `Fix attempt failed: ${error.message || 'Unknown error'}` 
        }
      }));
      
      toast.error("Failed to fix Stable Diffusion connection.");
    }
  };
  
  const fixLocalStorage = async () => {
    toast.info("Attempting to fix local storage...");
    
    setSystemStatus(prev => ({
      ...prev,
      localStorage: { status: 'fixing', message: 'Attempting to fix local storage...' }
    }));
    
    try {
      const configBackup = getConfig();
      
      try {
        localStorage.clear();
        saveConfig(configBackup);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
      
      const result = await testLocalStorage();
      
      if (!result) {
        toast.error("Could not fix local storage. Your browser may have restrictions or is in private mode.");
      } else {
        toast.success("Local storage has been fixed!");
      }
    } catch (error: any) {
      setSystemStatus(prev => ({
        ...prev,
        localStorage: { 
          status: 'unavailable', 
          message: `Fix attempt failed: ${error.message || 'Unknown error'}` 
        }
      }));
      
      toast.error("Failed to fix local storage issues.");
    }
  };
  
  const fixAllIssues = async () => {
    toast.info("Attempting to fix all detected issues...");
    
    if (systemStatus.mistralApi.status === 'disconnected') {
      await fixMistralConnection();
    }
    
    if (systemStatus.stableDiffusion.status === 'disconnected') {
      await fixStableDiffusionConnection();
    }
    
    if (systemStatus.localStorage.status === 'unavailable') {
      await fixLocalStorage();
    }
    
    runFullDiagnostics();
  };
  
  useEffect(() => {
    runFullDiagnostics();
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          System Diagnostics
        </h1>
        
        <Button
          variant={
            overallStatus() === 'success' ? 'outline' :
            overallStatus() === 'error' ? 'destructive' :
            overallStatus() === 'warning' ? 'default' : 'secondary'
          }
          className={`
            ${overallStatus() === 'success' ? 'border-green-500 text-green-500' : ''}
            ${overallStatus() === 'error' ? '' : ''}
            ${overallStatus() === 'warning' ? 'bg-amber-500' : ''}
          `}
          onClick={runFullDiagnostics}
          disabled={isRunningDiagnostics || isFixingAny()}
        >
          {isRunningDiagnostics ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Running Diagnostics...
            </>
          ) : (
            <>
              {overallStatus() === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  All Systems Operational
                </>
              ) : overallStatus() === 'error' ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  System Issues Detected
                </>
              ) : overallStatus() === 'warning' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fixing Issues...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  System Status Unknown
                </>
              )}
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="diagnostics" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="diagnostics" className="mt-4 space-y-4">
          {overallStatus() === 'error' && (
            <Button 
              className="w-full" 
              onClick={fixAllIssues}
              disabled={isRunningDiagnostics || isFixingAny()}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Fix All Issues
            </Button>
          )}
          
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <h3 className="text-lg font-medium">Mistral API Connection</h3>
              </div>
              <div className="flex items-center gap-2">
                {systemStatus.mistralApi.status === 'connected' ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                ) : systemStatus.mistralApi.status === 'disconnected' ? (
                  <div className="flex items-center text-red-500">
                    <XCircle className="h-4 w-4 mr-1" />
                    Disconnected
                  </div>
                ) : systemStatus.mistralApi.status === 'fixing' ? (
                  <div className="flex items-center text-amber-500">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Fixing...
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Unknown
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">{systemStatus.mistralApi.message}</p>
            
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline"
                onClick={testMistralConnection}
                disabled={isRunningDiagnostics || systemStatus.mistralApi.status === 'fixing'}
              >
                Test Connection
              </Button>
              
              {systemStatus.mistralApi.status === 'disconnected' && (
                <Button 
                  size="sm" 
                  onClick={fixMistralConnection}
                  disabled={isRunningDiagnostics || systemStatus.mistralApi.status === 'fixing'}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix Connection
                </Button>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                <h3 className="text-lg font-medium">Stable Diffusion Connection</h3>
              </div>
              <div className="flex items-center gap-2">
                {systemStatus.stableDiffusion.status === 'connected' ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                ) : systemStatus.stableDiffusion.status === 'disconnected' ? (
                  <div className="flex items-center text-red-500">
                    <XCircle className="h-4 w-4 mr-1" />
                    Disconnected
                  </div>
                ) : systemStatus.stableDiffusion.status === 'fixing' ? (
                  <div className="flex items-center text-amber-500">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Fixing...
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Unknown
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">{systemStatus.stableDiffusion.message}</p>
            
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline"
                onClick={testStableDiffusionStorage}
                disabled={isRunningDiagnostics || systemStatus.stableDiffusion.status === 'fixing'}
              >
                Test Connection
              </Button>
              
              {systemStatus.stableDiffusion.status === 'disconnected' && (
                <Button 
                  size="sm" 
                  onClick={fixStableDiffusionConnection}
                  disabled={isRunningDiagnostics || systemStatus.stableDiffusion.status === 'fixing'}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix Connection
                </Button>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <h3 className="text-lg font-medium">Local Storage</h3>
              </div>
              <div className="flex items-center gap-2">
                {systemStatus.localStorage.status === 'available' ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Available
                  </div>
                ) : systemStatus.localStorage.status === 'unavailable' ? (
                  <div className="flex items-center text-red-500">
                    <XCircle className="h-4 w-4 mr-1" />
                    Unavailable
                  </div>
                ) : systemStatus.localStorage.status === 'fixing' ? (
                  <div className="flex items-center text-amber-500">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Fixing...
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Unknown
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">{systemStatus.localStorage.message}</p>
            
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline"
                onClick={testLocalStorage}
                disabled={isRunningDiagnostics || systemStatus.localStorage.status === 'fixing'}
              >
                Test Storage
              </Button>
              
              {systemStatus.localStorage.status === 'unavailable' && (
                <Button 
                  size="sm" 
                  onClick={fixLocalStorage}
                  disabled={isRunningDiagnostics || systemStatus.localStorage.status === 'fixing'}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Fix Storage
                </Button>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="text-lg font-medium">System Information</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Browser:</span> {navigator.userAgent}
              </div>
              <div>
                <span className="font-medium">Platform:</span> {navigator.platform}
              </div>
              <div>
                <span className="font-medium">Language:</span> {navigator.language}
              </div>
              <div>
                <span className="font-medium">Online:</span> {navigator.onLine ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4 space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Model Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Available Models:</label>
                <div className="bg-secondary/20 p-2 rounded-md overflow-y-auto max-h-32">
                  <ul className="list-disc list-inside">
                    {availableModels.map((model, index) => (
                      <li key={index} className="text-sm my-1">{model}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Alert>
                <AlertTitle>Running Local Models</AlertTitle>
                <AlertDescription>
                  For unrestricted, uncensored models:
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Install Ollama (recommended) or LM Studio</li>
                    <li>Run your preferred model locally</li>
                    <li>Use diagnostics to auto-detect the endpoint</li>
                    <li>Set the model name in your settings to match the local model</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="border-t pt-2">
                <h4 className="font-medium mb-2">Quick Configurations:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const config = getConfig();
                      config.mistralUrl = "http://localhost:11434/api/generate";
                      config.mistralModel = "llama3";
                      saveConfig(config);
                      toast.success("Configured for Ollama with Llama 3");
                      testMistralConnection();
                    }}
                  >
                    Configure for Ollama
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const config = getConfig();
                      config.mistralUrl = "http://localhost:1234/v1/chat/completions";
                      config.mistralModel = "llama-3-8b-instruct.Q5_K_M";
                      saveConfig(config);
                      toast.success("Configured for LM Studio with Llama 3");
                      testMistralConnection();
                    }}
                  >
                    Configure for LM Studio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticsTool;
