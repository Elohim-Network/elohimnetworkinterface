
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testMistralConnection, testStableDiffusionConnection } from '@/services/ai';
import { Check, X, Loader2 } from 'lucide-react';

const ConnectionTester: React.FC = () => {
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
  
  return (
    <div className="space-y-4 border rounded-md p-4 mt-4">
      <h3 className="font-medium">Test Connections</h3>
      
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
        </div>
      </div>
    </div>
  );
};

export default ConnectionTester;
