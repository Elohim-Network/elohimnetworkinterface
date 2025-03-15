
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectionConfigProps {
  onUpdate: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
  }) => void;
}

const ConnectionConfig: React.FC<ConnectionConfigProps> = ({ onUpdate }) => {
  const [mistralUrl, setMistralUrl] = useState('http://localhost:8080/v1/chat/completions');
  const [stableDiffusionUrl, setStableDiffusionUrl] = useState('http://localhost:7860/sdapi/v1/txt2img');
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedConfig = localStorage.getItem('local-ai-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setMistralUrl(config.mistralUrl || mistralUrl);
        setStableDiffusionUrl(config.stableDiffusionUrl || stableDiffusionUrl);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
  }, []);

  const saveSettings = () => {
    const config = {
      mistralUrl,
      stableDiffusionUrl
    };
    
    localStorage.setItem('local-ai-config', JSON.stringify(config));
    onUpdate(config);
    setIsOpen(false);
    toast.success('Connection settings updated');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative ripple-container rounded-full"
          title="Configure local AI model connections"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Local AI Model Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mistral-url">Mistral 7B API URL</Label>
            <Input
              id="mistral-url"
              value={mistralUrl}
              onChange={(e) => setMistralUrl(e.target.value)}
              placeholder="http://localhost:8080/v1/chat/completions"
            />
            <p className="text-sm text-muted-foreground">
              The API endpoint for your local Mistral 7B model
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sd-url">Stable Diffusion API URL</Label>
            <Input
              id="sd-url"
              value={stableDiffusionUrl}
              onChange={(e) => setStableDiffusionUrl(e.target.value)}
              placeholder="http://localhost:7860/sdapi/v1/txt2img"
            />
            <p className="text-sm text-muted-foreground">
              The API endpoint for your local Stable Diffusion model
            </p>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-amber-500">
              Note: Ensure your local models are running before connecting.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For Mistral: Use llama.cpp, Ollama, or LM Studio<br/>
              For Stable Diffusion: Use ComfyUI or AUTOMATIC1111
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionConfig;
