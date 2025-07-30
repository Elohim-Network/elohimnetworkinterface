import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Download,
  Activity,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceMessage {
  id: string;
  text: string;
  audioUrl: string;
  voice: string;
  timestamp: Date;
  duration: number;
}

const AIVoiceChat: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [speed, setSpeed] = useState([1]);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voices = [
    { value: 'alloy', label: 'Alloy (Neutral)' },
    { value: 'echo', label: 'Echo (Friendly)' },
    { value: 'fable', label: 'Fable (Expressive)' },
    { value: 'onyx', label: 'Onyx (Deep)' },
    { value: 'nova', label: 'Nova (Energetic)' },
    { value: 'shimmer', label: 'Shimmer (Warm)' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioMessage(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started...');
    } catch (error) {
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success('Recording stopped. Processing...');
    }
  };

  const processAudioMessage = async (audioBlob: Blob) => {
    setIsGenerating(true);
    try {
      // Simulate audio processing and transcription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transcribedText = "This is a simulated transcription of your voice message. In a real implementation, this would use speech-to-text AI.";
      
      // Simulate AI response generation
      const aiResponse = "Thank you for your message! This is an AI-generated voice response. In a real implementation, this would be synthesized speech.";
      
      // Create voice message
      const audioUrl = URL.createObjectURL(audioBlob);
      const newVoiceMessage: VoiceMessage = {
        id: Date.now().toString(),
        text: aiResponse,
        audioUrl,
        voice: selectedVoice,
        timestamp: new Date(),
        duration: 3.5
      };
      
      setVoiceMessages(prev => [newVoiceMessage, ...prev]);
      toast.success('Voice message processed!');
    } catch (error) {
      toast.error('Failed to process audio message');
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (message: VoiceMessage) => {
    if (isPlaying === message.id) {
      audioRef.current?.pause();
      setIsPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = message.audioUrl;
        audioRef.current.playbackRate = speed[0];
        audioRef.current.play();
        setIsPlaying(message.id);
        
        audioRef.current.onended = () => setIsPlaying(null);
      }
    }
  };

  const downloadAudio = (message: VoiceMessage) => {
    const a = document.createElement('a');
    a.href = message.audioUrl;
    a.download = `voice-message-${message.id}.wav`;
    a.click();
    toast.success('Audio downloaded!');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Voice Chat Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            AI Voice Chat
          </CardTitle>
          <CardDescription>
            Record voice messages and get AI responses with synthesized speech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Voice Style</label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(voice => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Speed: {speed[0]}x</label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={2}
                min={0.5}
                step={0.1}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isGenerating}
              className="w-32 h-32 rounded-full"
            >
              {isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : isGenerating ? (
                <Activity className="h-8 w-8 animate-pulse" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {isRecording ? 'Recording... Click to stop' : 
             isGenerating ? 'Processing your message...' : 
             'Click to start recording'}
          </div>
        </CardContent>
      </Card>

      {/* Voice Messages History */}
      {voiceMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Voice Messages</CardTitle>
            <CardDescription>
              Your voice conversation history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {voiceMessages.map(message => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{message.voice}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(message.duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playAudio(message)}
                      >
                        {isPlaying === message.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadAudio(message)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{message.text}</p>
                  <div className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AIVoiceChat;