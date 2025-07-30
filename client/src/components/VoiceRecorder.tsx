
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Square, Play, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';
import * as browserVoiceService from '@/services/browserVoiceService';

interface VoiceRecorderProps {
  onVoiceCreated?: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceName, setVoiceName] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [savedVoices, setSavedVoices] = useState<any[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    loadSavedVoices();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  const loadSavedVoices = () => {
    const voices = browserVoiceService.getStoredVoices();
    setSavedVoices(voices);
  };

  const startRecording = async () => {
    try {
      setRecordedChunks([]);
      setAudioUrl(null);
      
      const mediaRecorder = await browserVoiceService.recordAudio();
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (recordedChunks.length > 0) {
          const blob = new Blob(recordedChunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
        
        setIsRecording(false);
        setRecordingTime(0);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      toast.info('Recording started...');
    } catch (error) {
      toast.error('Failed to start recording. Please ensure you have granted microphone permissions.');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      toast.success('Recording completed');
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveRecording = async () => {
    if (!audioUrl || !voiceName.trim()) {
      toast.error('Please provide a name for your voice sample');
      return;
    }
    
    try {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const dataUrl = await browserVoiceService.blobToDataUrl(blob);
      
      const voiceId = browserVoiceService.generateVoiceId();
      const voiceData = {
        id: voiceId,
        name: voiceName,
        timestamp: Date.now(),
        audioUrl: dataUrl,
        samples: [dataUrl]
      };
      
      browserVoiceService.saveVoice(voiceData);
      browserVoiceService.setCurrentVoiceId(voiceId);
      
      toast.success('Voice sample saved successfully');
      setVoiceName('');
      setAudioUrl(null);
      setRecordedChunks([]);
      
      if (onVoiceCreated) {
        onVoiceCreated();
      }
      loadSavedVoices();
    } catch (error) {
      toast.error('Failed to save voice sample');
      console.error('Save error:', error);
    }
  };

  const deleteRecordedVoice = (voiceId: string) => {
    if (window.confirm('Are you sure you want to delete this voice sample?')) {
      const success = browserVoiceService.deleteVoice(voiceId);
      
      if (success) {
        toast.success('Voice sample deleted');
        loadSavedVoices();
        if (onVoiceCreated) {
          onVoiceCreated();
        }
      } else {
        toast.error('Failed to delete voice sample');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Record Your Own Voice</h3>
      
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <Button 
            onClick={startRecording} 
            variant="outline" 
            size="sm"
            className="flex gap-2 items-center"
          >
            <Mic className="h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button 
            onClick={stopRecording} 
            variant="destructive" 
            size="sm"
            className="flex gap-2 items-center"
          >
            <Square className="h-4 w-4" />
            Stop ({formatTime(recordingTime)})
          </Button>
        )}
        
        {audioUrl && (
          <Button 
            onClick={playRecording} 
            variant="ghost"
            size="sm"
            className="flex gap-2 items-center"
          >
            <Play className="h-4 w-4" />
            Play
          </Button>
        )}
      </div>
      
      {audioUrl && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="voice-name">Voice Name</Label>
              <Input
                id="voice-name"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="My Voice"
              />
            </div>
            <div className="pt-6">
              <Button 
                onClick={saveRecording} 
                disabled={!voiceName.trim()}
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {savedVoices.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Your Saved Voices</h4>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {savedVoices.map((voice) => (
              <div key={voice.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                <div>
                  <div className="font-medium">{voice.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(voice.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const audio = new Audio(voice.audioUrl);
                      audio.play();
                    }}
                    className="h-7 w-7"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRecordedVoice(voice.id)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
