
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { testMistralConnection, testStableDiffusionConnection } from '@/services/ai';
import { Check, X, Loader2, Wrench, Shield, Activity, Sparkles } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getConfig, saveConfig } from '@/services/ai/config';
import { toast } from 'sonner';
import { LOCAL_ENDPOINTS } from '@/services/ai/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface EndpointTestResult {
  url: string;
  success: boolean;
  responseTime?: number;
  error?: string;
}

const ConnectionTester = () => {
  const [testingMistral, setTestingMistral] = useState(false);
  const [mistralStatus, setMistralStatus] = useState<{success: boolean, message: string} | null>(null);
  const [testingSD, setTestingSD] = useState(false);
  const [sdStatus, setSDStatus] = useState<{success: boolean, message: string} | null>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<EndpointTestResult[]>([]);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [autoFix, setAutoFix] = useState(false);
  
  const handleTestMistral = async () => {
    setTestingMistral(true);
    setMistralStatus(null);
    
    try {
      const result = await testMistralConnection();
      setMistralStatus(result);
      
      // Auto fix if enabled and test failed
      if (autoFix && !result.success) {
        handleFixMistral();
      }
    } catch (error: any) {
      setMistralStatus({
        success: false,
        message: `Error: ${error.message}`
      });
      
      // Auto fix if enabled
      if (autoFix) {
        handleFixMistral();
      }
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
      
      // Auto fix if enabled and test failed
      if (autoFix && !result.success) {
        handleFixSD();
      }
    } catch (error: any) {
      setSDStatus({
        success: false,
        message: `Error: ${error.message}`
      });
      
      // Auto fix if enabled
      if (autoFix) {
        handleFixSD();
      }
    } finally {
      setTestingSD(false);
    }
  };

  const testEndpoint = async (url: string): Promise<EndpointTestResult> => {
    const startTime = performance.now();
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (response && response.ok) {
        return { url, success: true, responseTime };
      }
      
      return { url, success: false, error: 'No response or error status' };
    } catch (error: any) {
      return { url, success: false, error: error.message };
    }
  };

  const runFullDiagnostics = async () => {
    setRunningDiagnostics(true);
    setDiagnosticResults([]);
    
    const endpoints = [
      // LLM endpoints
      "https://agentelohim.com/v1/chat/completions",
      "https://agentelohim.com/api/generate",
      "http://localhost:11434/api/generate",
      "http://localhost:11434/v1/chat/completions",
      "http://127.0.0.1:11434/api/generate",
      "http://127.0.0.1:11434/v1/chat/completions",
      "http://localhost:1234/v1/chat/completions",
      
      // Image generation endpoints
      "http://localhost:7860/sdapi/v1/txt2img",
      "http://127.0.0.1:7860/sdapi/v1/txt2img",
      "http://localhost:8188",
      "http://127.0.0.1:8188"
    ];
    
    const results: EndpointTestResult[] = [];
    
    for (const url of endpoints) {
      toast.info(`Testing endpoint: ${url}...`);
      const result = await testEndpoint(url);
      results.push(result);
      setDiagnosticResults(prev => [...prev, result]);
    }
    
    // Auto apply fixes if auto-fix is enabled
    if (autoFix) {
      applyDiagnosticFixes(results);
    }
    
    setRunningDiagnostics(false);
    toast.success("Diagnostics complete!");
  };
  
  const applyDiagnosticFixes = (results: EndpointTestResult[]) => {
    const config = getConfig();
    let updated = false;
    
    // Find working LLM endpoint
    const workingLlmEndpoint = results.find(r => 
      r.success && (
        r.url.includes("/api/generate") || 
        r.url.includes("/v1/chat/completions")
      )
    );
    
    if (workingLlmEndpoint) {
      config.mistralUrl = workingLlmEndpoint.url;
      updated = true;
      toast.success(`Applied fix: Updated LLM endpoint to ${workingLlmEndpoint.url}`);
    }
    
    // Find working SD endpoint
    const workingSdEndpoint = results.find(r => 
      r.success && (
        r.url.includes("7860") || 
        r.url.includes("8188")
      )
    );
    
    if (workingSdEndpoint) {
      config.stableDiffusionUrl = workingSdEndpoint.url;
      updated = true;
      toast.success(`Applied fix: Updated SD endpoint to ${workingSdEndpoint.url}`);
    }
    
    if (updated) {
      saveConfig(config);
      toast.success("Applied configuration fixes. Please test connection again.");
    } else {
      toast.warning("No working endpoints found for automatic fix.");
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
        "http://127.0.0.1:11434/api/generate", // Ollama alternative address
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
        toast.error("Automatic fix failed. Please start your local LLM service and configure manually.");
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
        "http://127.0.0.1:7860", // Automatic1111
        "http://127.0.0.1:8188", // ComfyUI
        "http://localhost:7860", // Automatic1111 alt
        "http://localhost:8188", // ComfyUI alt
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
  
  // Auto-test connections on mount
  useEffect(() => {
    handleTestMistral();
    handleTestStableDiffusion();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Connection Status</h3>
        <div className="flex gap-2">
          <Button 
            onClick={runFullDiagnostics}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={runningDiagnostics}
          >
            {runningDiagnostics ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Activity className="h-4 w-4 mr-1" />
            )}
            {runningDiagnostics ? "Running..." : "Full Diagnostics"}
          </Button>
          
          <Button
            onClick={() => setAutoFix(!autoFix)}
            variant={autoFix ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-1 ${autoFix ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {autoFix ? "Auto-Fix On" : "Auto-Fix Off"}
          </Button>
        </div>
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
        
        {diagnosticResults.length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="diagnostics">
              <AccordionTrigger>Diagnostic Results ({diagnosticResults.filter(r => r.success).length}/{diagnosticResults.length} endpoints accessible)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  {diagnosticResults.map((result, idx) => (
                    <div key={idx} className={`p-2 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {result.success ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-mono">{result.url}</span>
                        </div>
                        {result.success && result.responseTime && (
                          <span className="text-xs text-muted-foreground">{result.responseTime}ms</span>
                        )}
                      </div>
                      {!result.success && result.error && (
                        <div className="text-xs text-red-500 ml-5 mt-1">{result.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default ConnectionTester;
