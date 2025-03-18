import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload, Download, HardDrive, Trash2, PlusCircle, KeyRound, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportChatsToFile, importChatsFromFile, setSaveLocation } from '@/utils/fileUtils';
import { VoiceInfo } from '@/hooks/useVoice';
import { Switch } from '@/components/ui/switch';
import VoiceRecorder from './VoiceRecorder';
import * as browserVoiceService from '@/services/browserVoiceService';

interface ConnectionConfigProps {
  onUpdate: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => void;
  onExportChats?: () => void;
  onImportChats?: (sessions: any[], merge?: boolean) => void;
  sessions?: any[];
  availableVoices?: VoiceInfo[];
  currentVoiceId?: string;
  elevenLabsApiKey?: string;
  onUpdateApiKey?: (apiKey: string) => void;
  onUpdateVoice?: (voiceId: string) => void;
  onCloneVoice?: (name: string, description: string, files: File[]) => Promise<VoiceInfo | null>;
  onDeleteVoice?: (voiceId: string) => Promise<boolean>;
  onRefreshVoices?: () => Promise<void>;
  useBrowserVoice?: boolean;
  onToggleBrowserVoice?: (use: boolean) => void;
}

const ConnectionConfig: React.FC<ConnectionConfigProps> = ({ 
  onUpdate,
  onExportChats,
  onImportChats,
  sessions = [],
  availableVoices = [],
  currentVoiceId = '',
  elevenLabsApiKey = '',
  onUpdateApiKey,
  onUpdateVoice,
  onCloneVoice,
  onDeleteVoice,
  onRefreshVoices,
  useBrowserVoice = false,
  onToggleBrowserVoice
}) => {
  const [mistralUrl, setMistralUrl] = useState('http://localhost:11434/v1/chat/completions');
  const [stableDiffusionUrl, setStableDiffusionUrl] = useState('http://localhost:7860/sdapi/v1/txt2img');
  const [mistralModel, setMistralModel] = useState('mistral-7b');
  const [sdModel, setSdModel] = useState('stable-diffusion-v1-5');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<{[key: string]: any}[]>([]);
  const [apiKey, setApiKey] = useState(elevenLabsApiKey);
  const [selectedVoiceId, setSelectedVoiceId] = useState(currentVoiceId);
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceDescription, setNewVoiceDescription] = useState('');
  const [voiceFiles, setVoiceFiles] = useState<File[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const [browserVoices, setBrowserVoices] = useState<any[]>([]);
  const [currentBrowserVoiceId, setCurrentBrowserVoiceId] = useState('');

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
    
    const savedPresets = localStorage.getItem('model-presets');
    if (savedPresets) {
      try {
        const parsedPresets = JSON.parse(savedPresets);
        const updatedPresets = parsedPresets.map((preset: any) => {
          if (preset.name === "Mac M1/M2 Default") {
            return {
              ...preset,
              mistralUrl: 'http://localhost:11434/v1/chat/completions'
            };
          }
          return preset;
        });
        setPresets(updatedPresets);
        localStorage.setItem('model-presets', JSON.stringify(updatedPresets));
      } catch (e) {
        console.error('Error parsing saved presets:', e);
      }
    } else {
      const defaultPresets = [
        {
          name: "Mac M1/M2 Default",
          mistralUrl: 'http://localhost:11434/v1/chat/completions',
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

    setApiKey(elevenLabsApiKey);
    setSelectedVoiceId(currentVoiceId);
    
    const storedBrowserVoices = browserVoiceService.getStoredVoices();
    setBrowserVoices(storedBrowserVoices);
    
    const currentBrowserVoice = browserVoiceService.getCurrentVoiceId();
    setCurrentBrowserVoiceId(currentBrowserVoice);
  }, [elevenLabsApiKey, currentVoiceId]);

  const saveSettings = () => {
    const config = {
      mistralUrl,
      stableDiffusionUrl,
      mistralModel,
      sdModel
    };
    
    localStorage.setItem('local-ai-config', JSON.stringify(config));
    onUpdate(config);
    
    if (onUpdateApiKey && apiKey !== elevenLabsApiKey) {
      onUpdateApiKey(apiKey);
    }
    
    if (onUpdateVoice && selectedVoiceId !== currentVoiceId) {
      onUpdateVoice(selectedVoiceId);
    }
    
    toast.success('Settings updated');
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
      const confirmMerge = window.confirm(
        "Would you like to add the imported conversations to your existing ones? " +
        "Click 'OK' to add/merge, or 'Cancel' to replace all current conversations."
      );
      
      const importResult = await importChatsFromFile(confirmMerge);
      
      if (onImportChats && importResult.sessions) {
        onImportChats(importResult.sessions, importResult.merged);
        toast.success(importResult.merged 
          ? 'Conversations merged successfully' 
          : 'Conversations imported successfully');
      }
    } catch (error) {
      toast.error('Failed to import conversations');
    }
  };

  const handleSetSaveLocation = () => {
    setSaveLocation();
  };

  const handleVoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setVoiceFiles(fileArray);
    }
  };

  const handleCloneVoice = async () => {
    if (!newVoiceName) {
      toast.error('Please enter a name for your voice');
      return;
    }

    if (voiceFiles.length === 0) {
      toast.error('Please select at least one audio file');
      return;
    }

    if (!onCloneVoice) {
      toast.error('Voice cloning is not available');
      return;
    }

    setIsCloning(true);
    try {
      const result = await onCloneVoice(newVoiceName, newVoiceDescription, voiceFiles);
      if (result) {
        setNewVoiceName('');
        setNewVoiceDescription('');
        setVoiceFiles([]);
      }
    } finally {
      setIsCloning(false);
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    if (!onDeleteVoice) return;
    
    if (window.confirm('Are you sure you want to delete this voice? This action cannot be undone.')) {
      await onDeleteVoice(voiceId);
    }
  };

  const refreshVoices = async () => {
    if (onRefreshVoices) {
      toast.loading('Refreshing voices...');
      await onRefreshVoices();
      toast.success('Voices refreshed');
    }
  };

  const handleToggleBrowserVoice = (checked: boolean) => {
    if (onToggleBrowserVoice) {
      onToggleBrowserVoice(checked);
    }
  };

  const handleSelectBrowserVoice = (voiceId: string) => {
    browserVoiceService.setCurrentVoiceId(voiceId);
    setCurrentBrowserVoiceId(voiceId);
    toast.success('Browser voice updated');
  };

  const refreshBrowserVoices = () => {
    const voices = browserVoiceService.getStoredVoices();
    setBrowserVoices(voices);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="text">Text AI</TabsTrigger>
            <TabsTrigger value="image">Image AI</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="myvoice">My Voice</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mistral-url">Text AI API URL</Label>
              <Input
                id="mistral-url"
                value={mistralUrl}
                onChange={(e) => setMistralUrl(e.target.value)}
                placeholder="http://localhost:11434/v1/chat/completions"
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

          <TabsContent value="voice" className="pt-4 space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <Switch 
                id="use-browser-voice" 
                checked={useBrowserVoice} 
                onCheckedChange={handleToggleBrowserVoice}
              />
              <Label htmlFor="use-browser-voice">
                Use my recorded voice (free) instead of ElevenLabs
              </Label>
            </div>

            {!useBrowserVoice && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-api-key">ElevenLabs API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="elevenlabs-api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your ElevenLabs API key"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => window.open('https://elevenlabs.io/app/account-settings', '_blank')}
                      title="Get an API key"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your ElevenLabs API key is required for voice synthesis and voice cloning
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="voice-select">Voice</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={refreshVoices}
                      disabled={!apiKey}
                      className="h-6 px-2"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                  </div>
                  <Select 
                    value={selectedVoiceId} 
                    onValueChange={setSelectedVoiceId}
                    disabled={!apiKey || availableVoices.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[200px] overflow-y-auto">
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.name} {voice.isCustom ? '(Custom)' : ''}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select a voice for text-to-speech synthesis
                  </p>
                </div>

                <div className="border rounded-md p-3 mt-4">
                  <h3 className="text-sm font-medium mb-2">Clone Your Voice</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new-voice-name">Voice Name</Label>
                      <Input
                        id="new-voice-name"
                        value={newVoiceName}
                        onChange={(e) => setNewVoiceName(e.target.value)}
                        placeholder="My Voice"
                        disabled={!apiKey || isCloning}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-voice-description">Description (optional)</Label>
                      <Input
                        id="new-voice-description"
                        value={newVoiceDescription}
                        onChange={(e) => setNewVoiceDescription(e.target.value)}
                        placeholder="Description of this voice"
                        disabled={!apiKey || isCloning}
                      />
                    </div>
                    <div>
                      <Label htmlFor="voice-samples">Voice Samples</Label>
                      <Input
                        id="voice-samples"
                        type="file"
                        accept=".mp3,.wav,.m4a"
                        onChange={handleVoiceFileChange}
                        multiple
                        disabled={!apiKey || isCloning}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload 1-10 high-quality audio samples (MP3, WAV, M4A)
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleCloneVoice}
                        disabled={!apiKey || !newVoiceName || voiceFiles.length === 0 || isCloning}
                        className="w-full"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Clone Voice
                      </Button>
                    </div>
                  </div>
                </div>

                {availableVoices.some(voice => voice.isCustom) && (
                  <div className="border rounded-md p-3">
                    <h3 className="text-sm font-medium mb-2">Your Custom Voices</h3>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {availableVoices
                        .filter(voice => voice.isCustom)
                        .map(voice => (
                          <div key={voice.voice_id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                            <div>
                              <div className="font-medium">{voice.name}</div>
                              {voice.description && (
                                <div className="text-xs text-muted-foreground">{voice.description}</div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteVoice(voice.voice_id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {useBrowserVoice && (
              <div className="p-4 border rounded-md bg-muted/30">
                <p className="text-sm">
                  You're using your own voice recordings instead of ElevenLabs. 
                  Go to the "My Voice" tab to record and manage your voice samples.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="myvoice" className="pt-4 space-y-4">
            <div className="border rounded-md p-3">
              <VoiceRecorder onVoiceCreated={refreshBrowserVoices} />
            </div>
            
            {browserVoices.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="browser-voice-select">Select Your Voice</Label>
                <Select 
                  value={currentBrowserVoiceId} 
                  onValueChange={handleSelectBrowserVoice}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {browserVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select which of your recorded voices to use for speech
                </p>
              </div>
            )}
            
            <div className="bg-muted/30 p-3 rounded-md">
              <h3 className="text-sm font-medium">Tips for better recordings:</h3>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                <li>Use a good microphone in a quiet environment</li>
                <li>Speak clearly at a consistent pace</li>
                <li>Record a few seconds of sample speech</li>
                <li>Try recording different phrases for better variety</li>
              </ul>
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
          {activeTab === 'voice' ? (
            <p className="text-xs text-amber-500">
              Note: Voice cloning requires clean audio samples of a single speaker.
            </p>
          ) : (
            <p className="text-xs text-amber-500">
              Note: Ensure your local models are running before connecting.
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {activeTab === 'voice' ? (
              <>For best results, provide 1-2 minute samples with no background noise.</>
            ) : (
              <>
                For text models: Use llama.cpp, Ollama, or LM Studio<br/>
                For image models: Use ComfyUI or AUTOMATIC1111
              </>
            )}
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
