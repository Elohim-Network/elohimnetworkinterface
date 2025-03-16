
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface ConnectionConfigProps {
  onUpdate: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => void;
}

const ConnectionConfig: React.FC<ConnectionConfigProps> = ({ onUpdate }) => {
  const [mistralUrl, setMistralUrl] = useState('http://localhost:8080/v1/chat/completions');
  const [stableDiffusionUrl, setStableDiffusionUrl] = useState('http://localhost:7860/sdapi/v1/txt2img');
  const [mistralModel, setMistralModel] = useState('mistral-7b');
  const [sdModel, setSdModel] = useState('stable-diffusion-v1-5');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedConfig = localStorage.getItem('local-ai-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setMistralUrl(config.mistralUrl || mistralUrl);
        setStableDiffusionUrl(config.stableDiffusionUrl || stableDiffusionUrl);
        setMistralModel(config.mistralModel || mistralModel);
        setSdModel(config.sdModel || sdModel);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
  }, []);

  const saveSettings = () => {
    const config = {
      mistralUrl,
      stableDiffusionUrl,
      mistralModel,
      sdModel
    };
    
    localStorage.setItem('local-ai-config', JSON.stringify(config));
    onUpdate(config);
    setIsOpen(false);
    toast.success('Connection settings updated');
  };

  const handleMacPresets = () => {
    // Set appropriate defaults for M1/M2 Mac
    setMistralUrl('http://localhost:8080/v1/chat/completions');
    setStableDiffusionUrl('http://localhost:7860/sdapi/v1/txt2img');
    setMistralModel('mistral-7b');
    setSdModel('stable-diffusion-v1-5');
    toast.success('Mac M1/M2 presets applied');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full h-8 w-8"
          title="Configure AI model connections"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Local AI Model Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text AI</TabsTrigger>
            <TabsTrigger value="image">Image AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mistral-url">Mistral 7B API URL</Label>
              <Input
                id="mistral-url"
                value={mistralUrl}
                onChange={(e) => setMistralUrl(e.target.value)}
                placeholder="http://localhost:8080/v1/chat/completions"
              />
              <p className="text-xs text-muted-foreground">
                The API endpoint for your local Mistral 7B model
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mistral-model">Mistral Model Name</Label>
              <Input
                id="mistral-model"
                value={mistralModel}
                onChange={(e) => setMistralModel(e.target.value)}
                placeholder="mistral-7b"
              />
              <p className="text-xs text-muted-foreground">
                The model identifier for Mistral (e.g., mistral-7b, mistral-7b-instruct)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sd-url">Stable Diffusion API URL</Label>
              <Input
                id="sd-url"
                value={stableDiffusionUrl}
                onChange={(e) => setStableDiffusionUrl(e.target.value)}
                placeholder="http://localhost:7860/sdapi/v1/txt2img"
              />
              <p className="text-xs text-muted-foreground">
                The API endpoint for your local Stable Diffusion model
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sd-model">Stable Diffusion Model</Label>
              <Input
                id="sd-model"
                value={sdModel}
                onChange={(e) => setSdModel(e.target.value)}
                placeholder="stable-diffusion-v1-5"
              />
              <p className="text-xs text-muted-foreground">
                The model name for Stable Diffusion
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4">
          <p className="text-xs text-amber-500">
            Note: Ensure your local models are running before connecting.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            For Mistral: Use llama.cpp, Ollama, or LM Studio<br/>
            For Stable Diffusion: Use ComfyUI or AUTOMATIC1111
          </p>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMacPresets}
            className="text-xs"
          >
            Set Mac M1/M2 Defaults
          </Button>
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionConfig;
