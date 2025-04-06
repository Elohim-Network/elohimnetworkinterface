
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { testMistralConnection, testStableDiffusionConnection } from '@/services/localAiService';
import { Loader2, Check, X, Server, Image } from 'lucide-react';

const ConnectionTester = () => {
  const [isMistralTesting, setIsMistralTesting] = useState(false);
  const [mistralResult, setMistralResult] = useState<{success: boolean, message: string} | null>(null);
  
  const [isSDTesting, setIsSDTesting] = useState(false);
  const [sdResult, setSDResult] = useState<{success: boolean, message: string} | null>(null);
  
  const testMistral = async () => {
    setIsMistralTesting(true);
    try {
      const result = await testMistralConnection();
      setMistralResult(result);
    } catch (error) {
      setMistralResult({ success: false, message: `Test failed: ${error.message}` });
    } finally {
      setIsMistralTesting(false);
    }
  };
  
  const testStableDiffusion = async () => {
    setIsSDTesting(true);
    try {
      const result = await testStableDiffusionConnection();
      setSDResult(result);
    } catch (error) {
      setSDResult({ success: false, message: `Test failed: ${error.message}` });
    } finally {
      setIsSDTesting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Mistral AI Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to the Mistral API which powers the chat functionality across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mistralResult && (
            <Alert className={mistralResult.success ? "bg-green-500/10" : "bg-destructive/10"}>
              <div className="flex items-center gap-2">
                {mistralResult.success ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                )}
                <AlertTitle>{mistralResult.success ? "Success" : "Failed"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {mistralResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testMistral} disabled={isMistralTesting}>
            {isMistralTesting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isMistralTesting ? 'Testing...' : 'Test Mistral Connection'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Stable Diffusion Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to the Stable Diffusion API which powers image generation across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sdResult && (
            <Alert className={sdResult.success ? "bg-green-500/10" : "bg-destructive/10"}>
              <div className="flex items-center gap-2">
                {sdResult.success ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                )}
                <AlertTitle>{sdResult.success ? "Success" : "Failed"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {sdResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={testStableDiffusion} disabled={isSDTesting}>
            {isSDTesting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSDTesting ? 'Testing...' : 'Test Stable Diffusion Connection'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConnectionTester;
