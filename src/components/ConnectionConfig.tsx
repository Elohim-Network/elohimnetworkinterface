
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload, Download, HardDrive } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportChatsToFile, importChatsFromFile, setSaveLocation } from '@/utils/fileUtils';

interface ConnectionConfigProps {
  onUpdate: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => void;
  onExportChats?: () => void;
  onImportChats?: (sessions: any[]) => void;
  sessions?: any[];
}

const ConnectionConfig: React.FC<ConnectionConfigProps> = ({ 
  onUpdate,
  onExportChats,
  onImportChats,
  sessions = []
}) => {
  const [mistralUrl, setMistralUrl] = useState('http://localhost:8080/v1/chat/completions');
  const [stableDiffusionUrl, setStableDiffusionUrl] = useState('http://localhost:7860/sdapi/v1/txt2img');
  const [mistralModel, setMistralModel] = useState('mistral-7b');
  const [sdModel, setSdModel] = useState('stable-diffusion-v1-5');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<{[key: string]: any}[]>([]);

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
    
    // Load saved presets
    const savedPresets = localStorage.getItem('model-presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Error parsing saved presets:', e);
      }
    } else {
      // Initialize with default presets
      const defaultPresets = [
        {
          name: "Mac M1/M2 Default",
          mistralUrl: 'http://localhost:8080/v1/chat/completions',
          stableDiffusionUrl: 'http://localhost:7860/sdapi/v1/txt2img',
          mistralModel: 'mistral-7b',
          sdModel: 'stable-diffusion-v1-5'
        },
        {
          name: "Ollama/Automatic1111",
          mistralUrl: 'http://localhost:11434/api/chat',
          stableDiffusionUrl: 'http://localhost:7860/sdapi/v1/txt2img',
          mistralModel: 'llama3',
          sdModel: 'sdxl'
        }
      ];
      setPresets(defaultPresets);
      localStorage.setItem('model-presets', JSON.stringify(defaultPresets));
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

  const handlePresetApply = (preset: any) => {
    setMistralUrl(preset.mistralUrl);
    setStableDiffusionUrl(preset.stableDiffusionUrl);
    setMistralModel(preset.mistralModel);
    setSdModel(preset.sdModel);
    toast.success(`Applied "${preset.name}" preset`);
  };

  const saveAsPreset = () => {
    if (!presetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }
    
    const newPreset = {
      name: presetName,
      mistralUrl,
      stableDiffusionUrl,
      mistralModel,
      sdModel
    };
    
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('model-presets', JSON.stringify(updatedPresets));
    setPresetName("");
    toast.success(`Saved preset: ${presetName}`);
  };

  const handleExportChats = async () => {
    try {
      if (onExportChats) {
        onExportChats();
      } else if (sessions && sessions.length > 0) {
        await exportChatsToFile(sessions);
        toast.success('Conversations exported successfully');
      } else {
        toast.error('No conversations to export');
      }
    } catch (error) {
      toast.error('Failed to export conversations');
    }
  };

  const handleImportChats = async () => {
    try {
      const importedSessions = await importChatsFromFile();
      if (onImportChats && importedSessions) {
        onImportChats(importedSessions);
        toast.success('Conversations imported successfully');
      }
    } catch (error) {
      toast.error('Failed to import conversations');
    }
  };

  const handleSetSaveLocation = () => {
    setSaveLocation();
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure model connections and manage your conversations
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text AI</TabsTrigger>
            <TabsTrigger value="image">Image AI</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mistral-url">Text AI API URL</Label>
              <Input
                id="mistral-url"
                value={mistralUrl}
                onChange={(e) => setMistralUrl(e.target.value)}
                placeholder="http://localhost:8080/v1/chat/completions"
              />
              <p className="text-xs text-muted-foreground">
                The API endpoint for your local text AI model (Mistral, Llama, etc.)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mistral-model">Text Model Name</Label>
              <Input
                id="mistral-model"
                value={mistralModel}
                onChange={(e) => setMistralModel(e.target.value)}
                placeholder="mistral-7b"
              />
              <p className="text-xs text-muted-foreground">
                The model identifier for your text AI (e.g., mistral-7b, llama3, vicuna)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sd-url">Image AI API URL</Label>
              <Input
                id="sd-url"
                value={stableDiffusionUrl}
                onChange={(e) => setStableDiffusionUrl(e.target.value)}
                placeholder="http://localhost:7860/sdapi/v1/txt2img"
              />
              <p className="text-xs text-muted-foreground">
                The API endpoint for your image generation model (Stable Diffusion, etc.)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sd-model">Image Model Name</Label>
              <Input
                id="sd-model"
                value={sdModel}
                onChange={(e) => setSdModel(e.target.value)}
                placeholder="stable-diffusion-v1-5"
              />
              <p className="text-xs text-muted-foreground">
                The model name for your image generation AI
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="pt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Conversation Data</h3>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center" 
                  onClick={handleExportChats}
                >
                  <span>Export Conversations</span>
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center" 
                  onClick={handleImportChats}
                >
                  <span>Import Conversations</span>
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center" 
                  onClick={handleSetSaveLocation}
                >
                  <span>Set Save Location</span>
                  <HardDrive className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Export or import your conversation history as JSON files
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="preset-select">Model Presets</Label>
            <Select onValueChange={(value) => {
              const preset = presets.find(p => p.name === value);
              if (preset) handlePresetApply(preset);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset configuration" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset, index) => (
                  <SelectItem key={index} value={preset.name}>{preset.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Input
              placeholder="New preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={saveAsPreset}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-xs text-amber-500">
            Note: Ensure your local models are running before connecting.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            For text models: Use llama.cpp, Ollama, or LM Studio<br/>
            For image models: Use ComfyUI or AUTOMATIC1111
          </p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionConfig;
