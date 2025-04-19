
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload, Download, HardDrive, Trash2, PlusCircle, KeyRound, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportChatsToFile, importChatsFromFile, setSaveLocation } from '@/utils/fileUtils';
import { VoiceInfo } from '@/hooks/useVoice';
import { Switch } from '@/components/ui/switch';
import VoiceRecorder from './VoiceRecorder';
import * as browserVoiceService from '@/services/browserVoiceService';
import { testMistralConnection, testStableDiffusionConnection, updateMistralApiKey } from '@/services/ai';
import ConnectionTester from './ConnectionTester';
import { ChatSession } from '@/types/chat';

interface ConnectionConfigProps {
  onUpdate: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => void;
  sessions?: ChatSession[];
  onExportChats?: () => void;
  onImportChats?: (sessions: ChatSession[], merge?: boolean) => void;
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
  sessions,
  onExportChats,
  onImportChats,
  availableVoices,
  currentVoiceId,
  elevenLabsApiKey,
  onUpdateApiKey,
  onUpdateVoice,
  onCloneVoice,
  onDeleteVoice,
  onRefreshVoices,
  useBrowserVoice,
  onToggleBrowserVoice
}) => {
  const [mistralUrl, setMistralUrl] = useState(localStorage.getItem('mistralUrl') || 'http://localhost:11434');
  const [stableDiffusionUrl, setStableDiffusionUrl] = useState(localStorage.getItem('stableDiffusionUrl') || 'http://localhost:7860');
  const [mistralModel, setMistralModel] = useState(localStorage.getItem('mistralModel') || 'mistral');
  const [sdModel, setSdModel] = useState(localStorage.getItem('sdModel') || 'sdxl');
  const [apiKey, setApiKey] = useState(elevenLabsApiKey || '');
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceDesc, setNewVoiceDesc] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState("connections");
  
  const handleSave = () => {
    localStorage.setItem('mistralUrl', mistralUrl);
    localStorage.setItem('stableDiffusionUrl', stableDiffusionUrl);
    localStorage.setItem('mistralModel', mistralModel);
    localStorage.setItem('sdModel', sdModel);
    
    onUpdate({
      mistralUrl,
      stableDiffusionUrl,
      mistralModel,
      sdModel
    });
    
    toast.success('Connection settings saved successfully');
  };

  const handleApiKeySave = () => {
    if (onUpdateApiKey) {
      onUpdateApiKey(apiKey);
      toast.success('API key saved successfully');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCloneVoice = async () => {
    if (!onCloneVoice) return;
    
    if (!newVoiceName.trim()) {
      toast.error('Please provide a name for your voice');
      return;
    }
    
    if (files.length === 0) {
      toast.error('Please upload at least one audio sample');
      return;
    }
    
    setIsCloning(true);
    try {
      const result = await onCloneVoice(newVoiceName, newVoiceDesc, files);
      if (result) {
        toast.success(`Voice "${newVoiceName}" created successfully`);
        setNewVoiceName('');
        setNewVoiceDesc('');
        setFiles([]);
      } else {
        toast.error('Failed to create voice');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsCloning(false);
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    if (!onDeleteVoice) return;
    
    setIsDeleting(true);
    try {
      const success = await onDeleteVoice(voiceId);
      if (success) {
        toast.success('Voice deleted successfully');
      } else {
        toast.error('Failed to delete voice');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefreshVoices = async () => {
    if (!onRefreshVoices) return;
    
    setIsRefreshing(true);
    try {
      await onRefreshVoices();
      toast.success('Voices refreshed successfully');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportChats = () => {
    if (onExportChats) {
      onExportChats();
    }
  };

  const handleImportChats = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        try {
          const importedSessions = await importChatsFromFile(file);
          if (onImportChats && importedSessions) {
            onImportChats(importedSessions, false);
            toast.success('Chats imported successfully');
          }
        } catch (error: any) {
          toast.error(`Import failed: ${error.message}`);
        }
      }
    };
    
    input.click();
  };

  const handleSetSaveLocation = async () => {
    try {
      await setSaveLocation();
      toast.success('Save location set successfully');
    } catch (error: any) {
      toast.error(`Failed to set save location: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your connections, voice settings, and manage your data
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mistralUrl">Mistral API URL</Label>
                <Input
                  id="mistralUrl"
                  value={mistralUrl}
                  onChange={(e) => setMistralUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="mistralModel">Mistral Model</Label>
                <Select value={mistralModel} onValueChange={setMistralModel}>
                  <SelectTrigger id="mistralModel" className="mt-1">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mistral">Mistral</SelectItem>
                    <SelectItem value="mixtral">Mixtral</SelectItem>
                    <SelectItem value="llama3">Llama 3</SelectItem>
                    <SelectItem value="codellama">Code Llama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sdUrl">Stable Diffusion API URL</Label>
                <Input
                  id="sdUrl"
                  value={stableDiffusionUrl}
                  onChange={(e) => setStableDiffusionUrl(e.target.value)}
                  placeholder="http://localhost:7860"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="sdModel">Stable Diffusion Model</Label>
                <Select value={sdModel} onValueChange={setSdModel}>
                  <SelectTrigger id="sdModel" className="mt-1">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sdxl">SDXL</SelectItem>
                    <SelectItem value="sd15">SD 1.5</SelectItem>
                    <SelectItem value="sd2">SD 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Connection Settings
              </Button>
              
              <ConnectionTester />
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="browser-voice" className="font-medium">Use Browser Voice</Label>
                  <Switch 
                    id="browser-voice" 
                    checked={useBrowserVoice} 
                    onCheckedChange={onToggleBrowserVoice}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Use your browser's built-in text-to-speech capabilities instead of ElevenLabs
                </p>
              </div>
              
              {!useBrowserVoice && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="eleven-labs-key">ElevenLabs API Key</Label>
                    <Input
                      id="eleven-labs-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your ElevenLabs API key"
                    />
                    <Button className="mt-2" onClick={handleApiKeySave} size="sm">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Save API Key
                    </Button>
                  </div>
                  
                  {availableVoices && availableVoices.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Select Voice</Label>
                        <Button size="sm" variant="outline" onClick={handleRefreshVoices} disabled={isRefreshing}>
                          {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          <span className="ml-2">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </Button>
                      </div>
                      <Select value={currentVoiceId} onValueChange={onUpdateVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.voice_id} value={voice.voice_id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {availableVoices.map((voice) => (
                        voice.voice_id === currentVoiceId && (
                          <div key={`info-${voice.voice_id}`} className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{voice.name}</h3>
                                {voice.description && (
                                  <p className="text-sm text-muted-foreground">{voice.description}</p>
                                )}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteVoice(voice.voice_id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Clone New Voice</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="voice-name">Voice Name</Label>
                        <Input
                          id="voice-name"
                          value={newVoiceName}
                          onChange={(e) => setNewVoiceName(e.target.value)}
                          placeholder="My Custom Voice"
                        />
                      </div>
                      <div>
                        <Label htmlFor="voice-desc">Voice Description (optional)</Label>
                        <Input
                          id="voice-desc"
                          value={newVoiceDesc}
                          onChange={(e) => setNewVoiceDesc(e.target.value)}
                          placeholder="Description of your custom voice"
                        />
                      </div>
                      <div>
                        <Label htmlFor="voice-samples">Audio Samples (MP3, WAV, M4A)</Label>
                        <Input
                          id="voice-samples"
                          type="file"
                          onChange={handleFileChange}
                          multiple
                          accept=".mp3,.wav,.m4a"
                          className="mt-1"
                        />
                        {files.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {files.length} file(s) selected
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={handleCloneVoice} 
                        disabled={isCloning || !newVoiceName || files.length === 0}
                        className="w-full"
                      >
                        {isCloning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {isCloning ? 'Creating Voice...' : 'Create Voice'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Test Voice</h3>
                    <VoiceRecorder onVoiceCreated={() => {
                      if (onRefreshVoices) {
                        onRefreshVoices();
                      }
                    }} />
                  </div>
                </>
              )}
              
              {useBrowserVoice && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Browser Voice Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="browser-voice-select">Select Voice</Label>
                      <Select
                        value={browserVoiceService.getCurrentVoiceId()}
                        onValueChange={(val) => {
                          browserVoiceService.setCurrentVoiceId(val);
                        }}
                      >
                        <SelectTrigger id="browser-voice-select" className="mt-1">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {browserVoiceService.getStoredVoices().map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Browser Speech Synthesis Voices</Label>
                      <div className="max-h-[150px] overflow-y-auto border rounded-md p-2 mt-1">
                        {window.speechSynthesis && window.speechSynthesis.getVoices().map((voice, index) => (
                          <div key={index} className="text-sm p-1 hover:bg-muted/50 rounded cursor-pointer" onClick={() => {
                            const utterance = new SpeechSynthesisUtterance("Test");
                            utterance.voice = voice;
                            window.speechSynthesis.speak(utterance);
                          }}>
                            {voice.name} ({voice.lang})
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={() => {
                      const utterance = new SpeechSynthesisUtterance("This is a test of the browser text-to-speech functionality");
                      window.speechSynthesis.speak(utterance);
                    }}>
                      Test Voice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Export & Import</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleExportChats} disabled={!sessions || sessions.length === 0} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Chats
                  </Button>
                  <Button onClick={handleImportChats} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Chats
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Storage Location</h3>
                <Button onClick={handleSetSaveLocation} className="w-full">
                  <HardDrive className="mr-2 h-4 w-4" />
                  Set Save Location
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionConfig;
