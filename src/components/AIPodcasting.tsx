
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mic, Play, Pause, Phone, Upload, RefreshCw, Save, FileAudio, Sparkles, Radio, Headphones, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import VoiceRecorder from './VoiceRecorder';
import { useVoice } from '@/hooks/useVoice';

const AIPodcasting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [podcastTopic, setPodcastTopic] = useState('');
  const [podcastDuration, setPodcastDuration] = useState(15); // minutes
  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const { availableVoices, speak, stopSpeaking } = useVoice();

  // Sample podcast templates
  const podcastTemplates = [
    { id: 'interview', name: 'Interview Style', description: 'Q&A format with host and guest' },
    { id: 'debate', name: 'Debate Format', description: 'Two opposing viewpoints with moderation' },
    { id: 'storytelling', name: 'Narrative Storytelling', description: 'Immersive story-based podcast' },
    { id: 'news', name: 'News Roundup', description: 'Current events with analysis' },
    { id: 'educational', name: 'Educational Content', description: 'In-depth exploration of a topic' }
  ];

  // Sample AI personalities
  const aiPersonalities = [
    { id: 'expert', name: 'Industry Expert', voice: 'Roger' },
    { id: 'journalist', name: 'Investigative Journalist', voice: 'Sarah' },
    { id: 'comedian', name: 'Comedian', voice: 'Charlie' },
    { id: 'historian', name: 'Historian', voice: 'George' },
    { id: 'scientist', name: 'Scientist', voice: 'Laura' }
  ];

  const handleGeneratePodcast = () => {
    if (!podcastTopic) {
      toast.error('Please enter a podcast topic');
      return;
    }

    toast.info('Generating podcast content...');
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setGeneratedContent(`# AI-Generated Podcast: ${podcastTopic}

## Introduction (2 minutes)
- Welcome to this episode about "${podcastTopic}"
- Brief overview of what we'll cover today
- Introduction of today's guests and their expertise

## Main Discussion (${podcastDuration - 5} minutes)
- Key points about ${podcastTopic}
- Current trends and developments
- Expert insights and analysis
- Real-world examples and case studies

## Conclusion (3 minutes)
- Summary of key takeaways
- Call to action for listeners
- Preview of upcoming episodes

*This is a generated script outline that can be customized further or used for recording.*`);
      
      toast.success('Podcast content generated successfully!');
    }, 2000);
  };

  const handleRecordToggle = () => {
    if (recording) {
      setRecording(false);
      toast.success('Recording stopped. Audio saved to your library.');
    } else {
      setRecording(true);
      toast.info('Recording started. Speak into your microphone.');
    }
  };

  const handlePlayToggle = () => {
    if (playing) {
      setPlaying(false);
      stopSpeaking();
      toast.info('Playback stopped');
    } else {
      setPlaying(true);
      speak(generatedContent);
      toast.info('Playing generated podcast...');
      
      // Simulate ending after some time
      setTimeout(() => {
        setPlaying(false);
      }, 5000);
    }
  };

  const handlePublish = () => {
    toast.info('Preparing podcast for publishing...');
    
    setTimeout(() => {
      toast.success('Podcast published successfully to your selected platforms!');
    }, 2000);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">AI Podcasting Studio</h2>
        <p className="text-muted-foreground">Create professional podcasts with AI-powered tools</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="generator">
            <Sparkles className="h-4 w-4 mr-2" />
            Content Generator
          </TabsTrigger>
          <TabsTrigger value="voices">
            <Headphones className="h-4 w-4 mr-2" />
            Voice Studio
          </TabsTrigger>
          <TabsTrigger value="recording">
            <Radio className="h-4 w-4 mr-2" />
            Recording Studio
          </TabsTrigger>
          <TabsTrigger value="calls">
            <Phone className="h-4 w-4 mr-2" />
            Phone Integration
          </TabsTrigger>
          <TabsTrigger value="publishing">
            <Share2 className="h-4 w-4 mr-2" />
            Publishing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="flex-1 space-y-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Podcast Generator</CardTitle>
              <CardDescription>Generate AI-powered podcast content based on your topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="podcast-topic">Podcast Topic</Label>
                <Input 
                  id="podcast-topic" 
                  placeholder="Enter your podcast topic or theme" 
                  value={podcastTopic}
                  onChange={(e) => setPodcastTopic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Podcast Duration (minutes)</Label>
                <div className="flex items-center space-x-4">
                  <Slider 
                    value={[podcastDuration]} 
                    min={5} 
                    max={60} 
                    step={5}
                    onValueChange={(values) => setPodcastDuration(values[0])}
                    className="flex-1" 
                  />
                  <span className="w-12 text-center">{podcastDuration}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Podcast Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  {podcastTemplates.map(template => (
                    <Card key={template.id} className="cursor-pointer hover:bg-muted/50">
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>AI Personalities</Label>
                <div className="flex flex-wrap gap-2">
                  {aiPersonalities.map(personality => (
                    <Badge 
                      key={personality.id} 
                      variant={selectedVoices.includes(personality.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedVoices.includes(personality.id)) {
                          setSelectedVoices(selectedVoices.filter(id => id !== personality.id));
                        } else {
                          setSelectedVoices([...selectedVoices, personality.id]);
                        }
                      }}
                    >
                      {personality.name} ({personality.voice})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGeneratePodcast} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Podcast Content
              </Button>
            </CardFooter>
          </Card>
          
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Your AI-generated podcast script</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[200px] font-mono text-sm"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePlayToggle}>
                  {playing ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Audio Preview
                    </>
                  )}
                </Button>
                <Button onClick={() => toast.success('Content saved as draft')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="voices" className="flex-1 space-y-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Voice Studio</CardTitle>
              <CardDescription>Customize AI voices and record your own voice samples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VoiceRecorder onVoiceCreated={() => toast.success('Voice recorded successfully')} />
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Available Voices</h3>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Refreshing voices...')}>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableVoices.slice(0, 6).map((voice) => (
                    <Card key={voice.voice_id} className="cursor-pointer hover:bg-muted/50">
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm">{voice.name}</CardTitle>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                        <CardDescription className="text-xs">{voice.category || "Standard Voice"}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recording" className="flex-1 space-y-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Recording Studio</CardTitle>
              <CardDescription>Professional-grade multi-channel recording with AI enhancements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-md flex flex-col items-center justify-center">
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-4 ${recording ? 'border-red-500 animate-pulse' : 'border-muted-foreground'}`}>
                  <Button 
                    variant={recording ? "destructive" : "default"}
                    size="icon"
                    className="h-20 w-20 rounded-full"
                    onClick={handleRecordToggle}
                  >
                    {recording ? (
                      <Pause className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  {recording ? (
                    <p className="text-red-500 font-medium">Recording in progress...</p>
                  ) : (
                    <p className="text-muted-foreground">Press to start recording</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 bg-card border rounded-md p-4">
                <h3 className="font-medium">Recording Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Record Microphone</Label>
                      <p className="text-xs text-muted-foreground">Your voice input</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Record AI Voices</Label>
                      <p className="text-xs text-muted-foreground">Generated AI speech</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Record System Audio</Label>
                      <p className="text-xs text-muted-foreground">Music and sound effects</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Noise Reduction</Label>
                      <p className="text-xs text-muted-foreground">Automatically clean audio</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileAudio className="h-4 w-4 mr-2" />
                View Recordings
              </Button>
              <Button onClick={() => toast.success('Settings saved')}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="flex-1 space-y-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Phone Integration</CardTitle>
              <CardDescription>Make and receive calls for podcast interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-dashed rounded-md flex flex-col items-center justify-center">
                <Phone className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-center">Phone Integration</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Make AI-powered calls for interviews or voicemail-to-podcast conversion
                </p>
                <Button className="mt-4" onClick={() => toast.info('This feature requires additional setup')}>
                  Set Up Phone Integration
                </Button>
              </div>
              
              <div className="space-y-4 mt-4">
                <h3 className="font-medium">Call Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Call Phone Number</Label>
                  <Input id="phone-number" placeholder="Enter phone number to call" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="call-script">AI Call Script</Label>
                  <Textarea id="call-script" placeholder="What should the AI say when the call connects?" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Record Call</Label>
                    <p className="text-xs text-muted-foreground">Save call audio for podcast</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Transcribe Call</Label>
                    <p className="text-xs text-muted-foreground">Convert to text automatically</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => toast.info('Calling feature coming soon')}>
                <Phone className="h-4 w-4 mr-2" />
                Start AI Phone Call
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="publishing" className="flex-1 space-y-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Publishing & Distribution</CardTitle>
              <CardDescription>Publish your podcast to multiple platforms with one click</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="podcast-title">Podcast Title</Label>
                <Input id="podcast-title" placeholder="Enter your podcast title" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="podcast-description">Podcast Description</Label>
                <Textarea 
                  id="podcast-description" 
                  placeholder="Enter your podcast description or use AI to generate one"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Publishing Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'spotify', name: 'Spotify' },
                    { id: 'apple', name: 'Apple Podcasts' },
                    { id: 'youtube', name: 'YouTube' },
                    { id: 'private', name: 'Private Hosting' }
                  ].map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Switch id={platform.id} />
                      <Label htmlFor={platform.id}>{platform.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Auto-Generate</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'desc', name: 'Description' },
                    { id: 'tags', name: 'SEO Tags' },
                    { id: 'timestamps', name: 'Timestamps' },
                    { id: 'blog', name: 'Blog Post' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Switch id={option.id} checked={option.id === 'desc' || option.id === 'tags'} />
                      <Label htmlFor={option.id}>{option.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePublish}>
                <Upload className="h-4 w-4 mr-2" />
                Publish Podcast
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPodcasting;
