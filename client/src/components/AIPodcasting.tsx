
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Pause, PhoneCall, Upload, Book, BookOpen, PenTool, Sparkles, ArrowRight, Phone, BookText, BookmarkPlus, RefreshCw, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

const AIPodcasting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content-generation');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [voiceModel, setVoiceModel] = useState('browser-voice');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookKeywords, setBookKeywords] = useState('');
  const [bookCategory, setBookCategory] = useState('non-fiction');
  
  // Simulate content generation process
  const simulateGeneration = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Content generated successfully!');
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info('Recording started. Please speak into your microphone.');
    } else {
      toast.success('Recording saved!');
    }
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info('Playing audio...');
    } else {
      toast.info('Playback paused.');
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    }
  };
  
  const initiatePhoneCall = () => {
    toast.info('Initiating phone call simulation...', {
      description: 'This is a simulated feature. In a real application, this would connect to a VoIP service.'
    });
  };
  
  const publishContent = () => {
    toast.success('Content published successfully!', {
      description: 'Your podcast/book has been prepared for distribution.'
    });
  };
  
  const generateBook = () => {
    if (!bookTitle.trim()) {
      toast.error('Please enter a book title');
      return;
    }
    
    toast.info('Starting book generation process...', {
      description: 'This may take a few minutes. You can continue using other features while we work on your book.'
    });
    
    simulateGeneration();
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Podcasting & Publishing Studio</h1>
        <p className="text-muted-foreground">Create professional podcasts and books with AI assistance.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="content-generation">Content Generation</TabsTrigger>
          <TabsTrigger value="voice-studio">Voice Studio</TabsTrigger>
          <TabsTrigger value="recording-studio">Recording Studio</TabsTrigger>
          <TabsTrigger value="phone-integration">Phone Integration</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>
        
        {/* Content Generation Tab */}
        <TabsContent value="content-generation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Podcast Generator</CardTitle>
                <CardDescription>Create podcast episodes with AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="podcast-topic">Topic or Theme</Label>
                  <Input id="podcast-topic" placeholder="Enter the main topic of your podcast" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="podcast-style">Podcast Style</Label>
                  <Select defaultValue="conversational">
                    <SelectTrigger id="podcast-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="interview">Interview Style</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="debate">Debate Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="podcast-length">Episode Length (minutes)</Label>
                  <Slider defaultValue={[15]} max={60} step={5} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="podcast-notes">Additional Notes</Label>
                  <Textarea id="podcast-notes" placeholder="Enter any specific points you want to cover or special instructions" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={simulateGeneration}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Podcast Content
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>eBook Generator</CardTitle>
                <CardDescription>Create publishable ebooks with AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="book-title">Book Title</Label>
                  <Input 
                    id="book-title" 
                    placeholder="Enter your book title" 
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-category">Book Category</Label>
                  <Select 
                    value={bookCategory}
                    onValueChange={setBookCategory}
                  >
                    <SelectTrigger id="book-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="self-help">Self-Help</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technical">Technical/Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-description">Brief Description</Label>
                  <Textarea 
                    id="book-description" 
                    placeholder="What is your book about?" 
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-keywords">Keywords (comma separated)</Label>
                  <Input 
                    id="book-keywords" 
                    placeholder="Enter keywords for better results" 
                    value={bookKeywords}
                    onChange={(e) => setBookKeywords(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-format" />
                    <Label htmlFor="auto-format">Auto-format for KDP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="generate-cover" defaultChecked />
                    <Label htmlFor="generate-cover">Generate Cover</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={generateBook}>
                  <BookText className="h-4 w-4 mr-2" />
                  Generate eBook
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {generationProgress > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generation Progress</CardTitle>
                <CardDescription>Your content is being created</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={generationProgress} className="h-2" />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Processing...</span>
                  <span className="text-sm font-medium">{generationProgress}%</span>
                </div>
                
                {generationProgress === 100 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-green-600 font-medium">Content generation complete!</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Outline Created</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Chapters Generated</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Cover Designed</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">KDP Formatting</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {generationProgress === 100 && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Continue to Publishing
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>
        
        {/* Voice Studio Tab */}
        <TabsContent value="voice-studio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Selection</CardTitle>
                <CardDescription>Choose or create a voice for your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice-source">Voice Source</Label>
                  <Select 
                    value={voiceModel}
                    onValueChange={setVoiceModel}
                  >
                    <SelectTrigger id="voice-source">
                      <SelectValue placeholder="Select voice source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="browser-voice">Browser Voice (Free)</SelectItem>
                      <SelectItem value="elevenlabs">ElevenLabs (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {voiceModel === 'browser-voice' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="browser-voice">Browser Voice</Label>
                      <Select defaultValue="default">
                        <SelectTrigger id="browser-voice">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Voice</SelectItem>
                          <SelectItem value="custom-1">My Custom Voice 1</SelectItem>
                          <SelectItem value="custom-2">My Custom Voice 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-muted/30">
                      <h3 className="text-sm font-medium mb-2">Record New Voice</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Record your voice for use in podcasts. For best quality, use a quiet environment and good microphone.
                      </p>
                      <Button variant="outline" className="w-full" onClick={toggleRecording}>
                        <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {voiceModel === 'elevenlabs' && (
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 bg-amber-50/30">
                      <p className="text-xs text-amber-800">
                        ElevenLabs requires an API key. You can set this in the Settings menu.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="elevenlabs-voice">ElevenLabs Voice</Label>
                      <Select 
                        value={selectedVoice}
                        onValueChange={setSelectedVoice}
                      >
                        <SelectTrigger id="elevenlabs-voice">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarah">Sarah</SelectItem>
                          <SelectItem value="adam">Adam</SelectItem>
                          <SelectItem value="custom-cloned">My Cloned Voice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="voice-samples">Clone Your Voice</Label>
                      <Input 
                        id="voice-samples" 
                        type="file" 
                        accept=".mp3,.wav,.m4a" 
                        onChange={handleFileUpload}
                        multiple
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload 1-2 minutes of clear voice recordings for best results.
                      </p>
                      
                      <Button className="w-full mt-2" disabled={uploadedFiles.length === 0}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Create Voice Clone
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>Fine-tune your voice settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="voice-speed">Speaking Speed</Label>
                    <span className="text-xs text-muted-foreground">Normal</span>
                  </div>
                  <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="voice-pitch">Voice Pitch</Label>
                    <span className="text-xs text-muted-foreground">Normal</span>
                  </div>
                  <Slider defaultValue={[1]} min={0.5} max={1.5} step={0.1} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="voice-stability">Stability</Label>
                    <span className="text-xs text-muted-foreground">Medium</span>
                  </div>
                  <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} />
                  <p className="text-xs text-muted-foreground">
                    Higher stability makes voice more consistent but less expressive
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-text">Test Voice</Label>
                  <Textarea 
                    id="test-text" 
                    placeholder="Enter text to test the selected voice"
                    defaultValue="Hello! This is a test of my voice for podcasting."
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" onClick={togglePlayback}>
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play Test
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Recording Studio Tab */}
        <TabsContent value="recording-studio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Channel Recording Studio</CardTitle>
              <CardDescription>Professional-grade audio recording capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Microphone Input</h3>
                    <Badge>Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mic-input">Select Microphone</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="mic-input">
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Microphone</SelectItem>
                        <SelectItem value="airpods">AirPods Pro</SelectItem>
                        <SelectItem value="headset">External Headset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Input Volume</Label>
                      <span className="text-xs text-muted-foreground">75%</span>
                    </div>
                    <Slider defaultValue={[75]} max={100} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="noise-reduction-mic" defaultChecked />
                    <Label htmlFor="noise-reduction-mic">Noise Reduction</Label>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">AI Voice Output</h3>
                    <Badge variant="outline">Ready</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-voice">AI Voice</Label>
                    <Select defaultValue="custom">
                      <SelectTrigger id="ai-voice">
                        <SelectValue placeholder="Select AI voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">My Custom Voice</SelectItem>
                        <SelectItem value="sarah">Sarah</SelectItem>
                        <SelectItem value="adam">Adam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Output Volume</Label>
                      <span className="text-xs text-muted-foreground">65%</span>
                    </div>
                    <Slider defaultValue={[65]} max={100} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="emotion-detection" defaultChecked />
                    <Label htmlFor="emotion-detection">Emotion Detection</Label>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">System Audio</h3>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system-audio">System Audio Source</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="system-audio">
                        <SelectValue placeholder="Select audio source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All System Audio</SelectItem>
                        <SelectItem value="music">Music Player Only</SelectItem>
                        <SelectItem value="browser">Browser Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Background Level</Label>
                      <span className="text-xs text-muted-foreground">30%</span>
                    </div>
                    <Slider defaultValue={[30]} max={100} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-ducking" defaultChecked />
                    <Label htmlFor="auto-ducking">Auto Ducking</Label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 mt-4">
                <h3 className="font-medium mb-2">Recording Controls</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant={isRecording ? "destructive" : "default"} onClick={toggleRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  <Button variant="outline" disabled={!isRecording}>
                    Pause
                  </Button>
                  <Button variant="outline" disabled={isRecording}>
                    <Play className="h-4 w-4 mr-2" />
                    Play Last Recording
                  </Button>
                  <Button variant="outline" disabled={isRecording}>
                    <Save className="h-4 w-4 mr-2" />
                    Save as MP3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Phone Integration Tab */}
        <TabsContent value="phone-integration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Integration</CardTitle>
                <CardDescription>Conduct phone interviews for your podcast</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="call-type">Call Type</Label>
                  <Select defaultValue="simulated">
                    <SelectTrigger id="call-type">
                      <SelectValue placeholder="Select call type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simulated">Simulated Call (Free)</SelectItem>
                      <SelectItem value="voip">VoIP Call (Premium)</SelectItem>
                      <SelectItem value="twilio">Twilio Integration (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Simulated calls use browser audio and don't require phone integration
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number or Contact</Label>
                  <Input id="phone-number" placeholder="Enter phone number or contact name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="call-purpose">Call Purpose</Label>
                  <Select defaultValue="interview">
                    <SelectTrigger id="call-purpose">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interview">Podcast Interview</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="qa">Q&A Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="call-recording">Recording Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="record-call" defaultChecked />
                    <Label htmlFor="record-call">Record Call</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="transcribe-call" defaultChecked />
                    <Label htmlFor="transcribe-call">Auto-Transcribe</Label>
                  </div>
                </div>
                
                <Button onClick={initiatePhoneCall} className="w-full">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Initiate Call
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voicemail to Podcast</CardTitle>
                <CardDescription>Turn voicemails into podcast content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30 space-y-3">
                  <h3 className="text-sm font-medium">How It Works</h3>
                  <ol className="space-y-2 text-sm pl-5 list-decimal">
                    <li>Upload voicemail recordings or collect listener messages</li>
                    <li>AI analyzes content and prepares a response</li>
                    <li>Record your response or generate an AI response</li>
                    <li>Create a Q&A or discussion-style podcast automatically</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voicemail-files">Upload Voicemail Files</Label>
                  <Input 
                    id="voicemail-files" 
                    type="file" 
                    accept=".mp3,.wav,.m4a" 
                    onChange={handleFileUpload}
                    multiple 
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voicemail-format">Podcast Format</Label>
                  <Select defaultValue="qa">
                    <SelectTrigger id="voicemail-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qa">Q&A Style</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="interview">Interview Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response-type">Response Type</Label>
                  <Select defaultValue="ai">
                    <SelectTrigger id="response-type">
                      <SelectValue placeholder="Select response type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Generated</SelectItem>
                      <SelectItem value="record">Record Your Response</SelectItem>
                      <SelectItem value="mixed">Mixed (AI + Your Recording)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={uploadedFiles.length === 0}
                  onClick={simulateGeneration}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Create Voicemail Podcast
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Publishing Tab */}
        <TabsContent value="publishing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish Your Content</CardTitle>
              <CardDescription>Distribute your podcast or ebook to various platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Podcast Publishing</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="podcast-title">Podcast Title</Label>
                    <Input id="podcast-title" placeholder="Enter podcast title" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="podcast-description">Description</Label>
                    <Textarea id="podcast-description" placeholder="Enter podcast description" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="podcast-category">Category</Label>
                    <Select defaultValue="education">
                      <SelectTrigger id="podcast-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="news">News & Politics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Publish To</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="publish-spotify" defaultChecked />
                        <Label htmlFor="publish-spotify">Spotify</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="publish-apple" defaultChecked />
                        <Label htmlFor="publish-apple">Apple Podcasts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="publish-youtube" />
                        <Label htmlFor="publish-youtube">YouTube</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="publish-rss" defaultChecked />
                        <Label htmlFor="publish-rss">Generate RSS Feed</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Book Publishing</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="book-title-final">Book Title</Label>
                    <Input id="book-title-final" placeholder="Enter book title" value={bookTitle} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="book-subtitle">Subtitle (Optional)</Label>
                    <Input id="book-subtitle" placeholder="Enter book subtitle" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="book-formats">Book Formats</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="format-kindle" defaultChecked />
                        <Label htmlFor="format-kindle">Kindle eBook</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="format-pdf" defaultChecked />
                        <Label htmlFor="format-pdf">PDF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="format-paperback" />
                        <Label htmlFor="format-paperback">Paperback</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="format-audiobook" />
                        <Label htmlFor="format-audiobook">Audiobook</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Distribution Channels</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="dist-amazon" defaultChecked />
                        <Label htmlFor="dist-amazon">Amazon KDP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dist-ingramspark" />
                        <Label htmlFor="dist-ingramspark">IngramSpark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dist-direct" defaultChecked />
                        <Label htmlFor="dist-direct">Direct Download</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="generate-extras">Additional Outputs</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="gen-blog" defaultChecked />
                      <Label htmlFor="gen-blog">Generate Blog Post</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="gen-social" defaultChecked />
                      <Label htmlFor="gen-social">Social Media Posts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="gen-transcript" defaultChecked />
                      <Label htmlFor="gen-transcript">Full Transcript</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="gen-seo" defaultChecked />
                      <Label htmlFor="gen-seo">SEO Metadata</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={publishContent}>
                      <Upload className="h-4 w-4 mr-2" />
                      Publish Content
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Generate Landing Page</CardTitle>
              <CardDescription>Create a professional landing page for your book or podcast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="landing-style">Landing Page Style</Label>
                <Select defaultValue="modern">
                  <SelectTrigger id="landing-style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="bold">Bold & Dynamic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="landing-elements">Page Elements</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-hero" defaultChecked />
                    <Label htmlFor="elem-hero">Hero Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-about" defaultChecked />
                    <Label htmlFor="elem-about">About Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-chapters" defaultChecked />
                    <Label htmlFor="elem-chapters">Chapter Preview</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-author" defaultChecked />
                    <Label htmlFor="elem-author">Author Bio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-testimonials" />
                    <Label htmlFor="elem-testimonials">Testimonials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="elem-buy" defaultChecked />
                    <Label htmlFor="elem-buy">Buy Button</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="landing-domain">Domain Connection</Label>
                <Input id="landing-domain" placeholder="Enter domain (e.g., agentelohim.com)" defaultValue="agentelohim.com" />
                <p className="text-xs text-muted-foreground">
                  Your landing page will be hosted at the specified domain
                </p>
              </div>
              
              <Button onClick={simulateGeneration} className="w-full">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Generate Landing Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPodcasting;
