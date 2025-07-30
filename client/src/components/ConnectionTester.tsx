import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectionConfig {
  mistralUrl: string;
  stableDiffusionUrl: string;
  mistralModel: string;
  sdModel: string;
}

const ConnectionTester: React.FC = () => {
  const [config, setConfig] = useState<ConnectionConfig>({
    mistralUrl: 'https://agentelohim.com/v1/chat/completions',
    stableDiffusionUrl: 'http://127.0.0.1:8188',
    mistralModel: 'mistral-7b-instruct',
    sdModel: 'stable-diffusion-v1-5'
  });

  const [testing, setTesting] = useState(false);
  const [connections, setConnections] = useState<{
    mistral: 'idle' | 'testing' | 'connected' | 'failed';
    stableDiffusion: 'idle' | 'testing' | 'connected' | 'failed';
  }>({
    mistral: 'idle',
    stableDiffusion: 'idle'
  });

  const testConnection = async (service: 'mistral' | 'stableDiffusion') => {
    setConnections(prev => ({ ...prev, [service]: 'testing' }));
    
    try {
      const url = service === 'mistral' ? config.mistralUrl : config.stableDiffusionUrl;
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setConnections(prev => ({ ...prev, [service]: 'connected' }));
        toast.success(`${service} connection successful`);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setConnections(prev => ({ ...prev, [service]: 'failed' }));
      toast.error(`${service} connection failed`);
    }
  };

  const testAllConnections = async () => {
    setTesting(true);
    await Promise.all([
      testConnection('mistral'),
      testConnection('stableDiffusion')
    ]);
    setTesting(false);
  };

  const saveConfig = () => {
    localStorage.setItem('local-ai-config', JSON.stringify(config));
    toast.success('Configuration saved');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Local AI Configuration
        </CardTitle>
        <CardDescription>
          Configure and test connections to your local AI services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="mistral" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mistral" className="flex items-center gap-2">
              {getStatusIcon(connections.mistral)}
              Mistral
            </TabsTrigger>
            <TabsTrigger value="stable-diffusion" className="flex items-center gap-2">
              {getStatusIcon(connections.stableDiffusion)}
              Stable Diffusion
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mistral" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mistral-url">API URL</Label>
              <Input
                id="mistral-url"
                value={config.mistralUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, mistralUrl: e.target.value }))}
                placeholder="http://127.0.0.1:11434/v1/chat/completions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mistral-model">Model</Label>
              <Input
                id="mistral-model"
                value={config.mistralModel}
                onChange={(e) => setConfig(prev => ({ ...prev, mistralModel: e.target.value }))}
                placeholder="mistral-7b-instruct"
              />
            </div>
            <Button 
              onClick={() => testConnection('mistral')} 
              disabled={connections.mistral === 'testing'}
              className="w-full"
            >
              {connections.mistral === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
          </TabsContent>
          
          <TabsContent value="stable-diffusion" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sd-url">API URL</Label>
              <Input
                id="sd-url"
                value={config.stableDiffusionUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, stableDiffusionUrl: e.target.value }))}
                placeholder="http://127.0.0.1:8188"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sd-model">Model</Label>
              <Input
                id="sd-model"
                value={config.sdModel}
                onChange={(e) => setConfig(prev => ({ ...prev, sdModel: e.target.value }))}
                placeholder="stable-diffusion-v1-5"
              />
            </div>
            <Button 
              onClick={() => testConnection('stableDiffusion')} 
              disabled={connections.stableDiffusion === 'testing'}
              className="w-full"
            >
              {connections.stableDiffusion === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-6">
          <Button 
            onClick={testAllConnections} 
            disabled={testing}
            variant="outline"
            className="flex-1"
          >
            {testing ? 'Testing All...' : 'Test All Connections'}
          </Button>
          <Button onClick={saveConfig} className="flex-1">
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;