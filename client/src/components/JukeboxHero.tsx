
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { JukeboxTrack, ContentDeploymentSettings } from '@/types/modules';
import JukeboxUploader from './JukeboxUploader';
import JukeboxTrackList from './JukeboxTrackList';
import JukeboxTrackDetail from './JukeboxTrackDetail';
import JukeboxCampaigns from './JukeboxCampaigns';
import JukeboxAnalytics from './JukeboxAnalytics';
import JukeboxSettings from './JukeboxSettings';
import JukeboxPlayer from './JukeboxPlayer';
import JukeboxSalesPage from './JukeboxSalesPage';
import { toast } from 'sonner';
import { useModules } from '@/hooks/useModules';

// Mock data - would be replaced with actual data from backend
const MOCK_TRACKS: JukeboxTrack[] = [
  {
    id: '1',
    title: 'Kingdom Coming',
    artist: 'Elohim Network',
    audioUrl: '/placeholder.mp3',
    coverImageUrl: '/placeholder.svg',
    duration: 237,
    tags: ['worship', 'prophetic', 'kingdom'],
    emotionalPoints: [
      { timestamp: 45, emotion: 'joy', intensity: 0.8 },
      { timestamp: 120, emotion: 'awe', intensity: 0.9 }
    ],
    viralClipPoints: [
      { startTime: 42, endTime: 57, strength: 0.85, caption: "When His kingdom comes..." },
      { startTime: 118, endTime: 133, strength: 0.9, caption: "Declaring His glory..." }
    ],
    campaigns: [
      { id: 'c1', platform: 'tiktok', status: 'published', publishedAt: '2024-04-01T12:00:00Z', reach: 12500, plays: 8700, engagement: 1450, videoUrl: 'https://example.com/video1' },
      { id: 'c2', platform: 'instagram', status: 'scheduled', scheduledFor: '2024-04-05T15:30:00Z' }
    ],
    donations: [
      { id: 'd1', amount: 25, currency: 'USD', timestamp: '2024-04-01T14:23:00Z', donorName: 'Grace W.', message: 'This song touched my heart!' },
      { id: 'd2', amount: 10, currency: 'USD', timestamp: '2024-04-02T09:11:00Z' }
    ],
    createdAt: '2024-03-25T10:00:00Z',
    updatedAt: '2024-04-02T15:00:00Z'
  },
  {
    id: '2',
    title: 'Prepare the Way',
    artist: 'Elohim Sound',
    audioUrl: '/placeholder.mp3',
    coverImageUrl: '/placeholder.svg',
    duration: 195,
    tags: ['prophetic', 'declaration', 'revival'],
    emotionalPoints: [
      { timestamp: 30, emotion: 'determination', intensity: 0.75 },
      { timestamp: 90, emotion: 'hope', intensity: 0.95 }
    ],
    viralClipPoints: [
      { startTime: 28, endTime: 43, strength: 0.8, caption: "Preparing the way..." }
    ],
    campaigns: [
      { id: 'c3', platform: 'youtube', status: 'published', publishedAt: '2024-03-28T12:00:00Z', reach: 8200, plays: 5100, engagement: 920, videoUrl: 'https://example.com/video2' }
    ],
    donations: [
      { id: 'd3', amount: 15, currency: 'USD', timestamp: '2024-03-29T18:45:00Z', donorName: 'Daniel R.' }
    ],
    createdAt: '2024-03-20T09:30:00Z',
    updatedAt: '2024-03-29T19:00:00Z'
  }
];

const MOCK_SETTINGS: ContentDeploymentSettings = {
  platforms: [
    { platform: 'tiktok', enabled: true, accountId: 'elohimnetwork' },
    { platform: 'instagram', enabled: true, accountId: 'elohim.network' },
    { platform: 'youtube', enabled: true, accountId: 'ElohimNetwork' },
    { platform: 'facebook', enabled: false },
    { platform: 'x', enabled: true, accountId: 'ElohimNetwork' }
  ],
  captionTemplates: [
    "Experience the sound that's preparing the way for His return. #SOUND_TAG #EMOTION_TAG",
    "This is what the pre-second coming movement sounds like. #SOUND_TAG #EMOTION_TAG"
  ],
  hashtagSets: [
    ['#kingdomsound', '#prophetic', '#worship'],
    ['#jesusmusic', '#kingdomcome', '#soundmovement']
  ],
  ctaTemplates: [
    "Support this ministry and unlock the full track at jukeboxhero.elohimnetwork.com",
    "Donate any amount to unlock the full Kingdom sound experience!"
  ],
  schedulePreferences: {
    bestTimeOfDay: [9, 12, 18, 20],
    daysOfWeek: [true, false, true, false, true, true, false],
    frequency: 3
  }
};

const JukeboxHero: React.FC = () => {
  const [tracks, setTracks] = useState<JukeboxTrack[]>(MOCK_TRACKS);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [deploymentSettings, setDeploymentSettings] = useState<ContentDeploymentSettings>(MOCK_SETTINGS);
  const [currentTab, setCurrentTab] = useState('tracks');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<JukeboxTrack | null>(null);
  const [isWhiteLabeled, setIsWhiteLabeled] = useState(false);
  const { isAdminUser } = useModules();
  
  const selectedTrack = selectedTrackId 
    ? tracks.find(track => track.id === selectedTrackId) 
    : null;
  
  const handleTrackUpload = async (track: Omit<JukeboxTrack, 'id' | 'createdAt' | 'updatedAt' | 'campaigns' | 'donations' | 'emotionalPoints' | 'viralClipPoints'>) => {
    try {
      // In a real implementation, this would call an API to upload and process the track
      const newTrack: JukeboxTrack = {
        ...track,
        id: `track-${Date.now()}`,
        campaigns: [],
        donations: [],
        emotionalPoints: [],
        viralClipPoints: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTracks(prev => [newTrack, ...prev]);
      setSelectedTrackId(newTrack.id);
      setCurrentTab('detail');
      toast.success('Track uploaded successfully! AI analysis in progress...');
      
      // Simulate AI analysis completion after a delay
      setTimeout(() => {
        setTracks(prev => 
          prev.map(t => 
            t.id === newTrack.id 
              ? {
                  ...t,
                  emotionalPoints: [
                    { timestamp: Math.floor(t.duration * 0.2), emotion: 'joy', intensity: 0.8 },
                    { timestamp: Math.floor(t.duration * 0.5), emotion: 'awe', intensity: 0.9 }
                  ],
                  viralClipPoints: [
                    { startTime: Math.floor(t.duration * 0.18), endTime: Math.floor(t.duration * 0.25), strength: 0.85, caption: "Generated caption for viral moment..." }
                  ],
                }
              : t
          )
        );
        toast.success('AI analysis complete! Viral points identified.');
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading track:', error);
      toast.error('Failed to upload track. Please try again.');
    }
  };

  const handleGenerateContent = async (trackId: string) => {
    try {
      toast.loading('Generating content across platforms...');
      
      // Simulate content generation completion after a delay
      setTimeout(() => {
        setTracks(prev => 
          prev.map(t => 
            t.id === trackId 
              ? {
                  ...t,
                  campaigns: [
                    ...t.campaigns,
                    {
                      id: `campaign-${Date.now()}`,
                      platform: 'tiktok',
                      status: 'scheduled',
                      scheduledFor: new Date(Date.now() + 3600000).toISOString(),
                    },
                    {
                      id: `campaign-${Date.now() + 1}`,
                      platform: 'instagram',
                      status: 'scheduled',
                      scheduledFor: new Date(Date.now() + 7200000).toISOString(),
                    }
                  ]
                }
              : t
          )
        );
        toast.success('Content generated and scheduled successfully!');
        setCurrentTab('campaigns');
      }, 2500);
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    }
  };
  
  const handlePlayTrack = (track: JukeboxTrack) => {
    setCurrentlyPlaying(track);
  };
  
  const handleStopPlaying = () => {
    setCurrentlyPlaying(null);
  };
  
  const handleUpdateSettings = (newSettings: ContentDeploymentSettings) => {
    setDeploymentSettings(newSettings);
    toast.success('Settings updated successfully!');
  };
  
  const handleToggleWhiteLabel = () => {
    setIsWhiteLabeled(prev => !prev);
    toast.success(isWhiteLabeled ? 'Elohim Network branding restored' : 'White label mode activated');
  };
  
  // Check if user has permission to use this module
  useEffect(() => {
    if (!isAdminUser()) {
      toast.info("Jukebox Hero requires admin access or the Music Creator module");
    }
  }, [isAdminUser]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {!isWhiteLabeled && <span className="text-xl font-bold text-primary">Jukebox Hero</span>}
          {isWhiteLabeled && <span className="text-xl font-bold text-primary">Music Creator Studio</span>}
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Creator Edition</span>
        </div>
        
        {isAdminUser() && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleWhiteLabel}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {isWhiteLabeled ? 'Restore Elohim Branding' : 'Activate White Label Mode'}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab} 
          className="h-full flex flex-col"
        >
          <div className="px-4 pt-2">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="tracks">My Tracks</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              {selectedTrackId && <TabsTrigger value="detail">Track Details</TabsTrigger>}
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              {isAdminUser() && <TabsTrigger value="settings">Settings</TabsTrigger>}
              {isAdminUser() && <TabsTrigger value="sales">Sales Page</TabsTrigger>}
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="tracks" className="h-full m-0">
              <JukeboxTrackList 
                tracks={tracks}
                onSelectTrack={(id) => {
                  setSelectedTrackId(id);
                  setCurrentTab('detail');
                }}
                onPlayTrack={handlePlayTrack}
                isAdmin={isAdminUser()}
              />
            </TabsContent>
            
            <TabsContent value="upload" className="h-full m-0">
              <JukeboxUploader 
                onUploadComplete={handleTrackUpload}
                isAdmin={isAdminUser()}
              />
            </TabsContent>
            
            <TabsContent value="detail" className="h-full m-0">
              {selectedTrack ? (
                <JukeboxTrackDetail 
                  track={selectedTrack}
                  onPlay={() => handlePlayTrack(selectedTrack)}
                  onGenerateContent={() => handleGenerateContent(selectedTrack.id)}
                  isAdmin={isAdminUser()}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Select a track to view details</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="campaigns" className="h-full m-0">
              <JukeboxCampaigns 
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                onSelectTrack={setSelectedTrackId}
                isAdmin={isAdminUser()}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="h-full m-0">
              <JukeboxAnalytics 
                tracks={tracks}
                isAdmin={isAdminUser()}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="h-full m-0">
              {isAdminUser() && (
                <JukeboxSettings 
                  settings={deploymentSettings} 
                  onUpdateSettings={handleUpdateSettings}
                  onToggleWhiteLabel={handleToggleWhiteLabel}
                  isWhiteLabeled={isWhiteLabeled}
                />
              )}
            </TabsContent>
            
            <TabsContent value="sales" className="h-full m-0">
              {isAdminUser() && (
                <JukeboxSalesPage 
                  isWhiteLabeled={isWhiteLabeled}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {currentlyPlaying && (
        <JukeboxPlayer 
          track={currentlyPlaying}
          onClose={handleStopPlaying}
          showDonateButton={true}
        />
      )}
    </div>
  );
};

export default JukeboxHero;
