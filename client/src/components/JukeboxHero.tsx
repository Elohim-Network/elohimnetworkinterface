import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Shuffle, 
  Repeat,
  Music,
  Search,
  Heart,
  Share
} from 'lucide-react';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  isLiked: boolean;
}

const JukeboxHero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([75]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const [tracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Digital Dreams',
      artist: 'AI Symphony',
      duration: '3:42',
      genre: 'Electronic',
      isLiked: true
    },
    {
      id: '2',
      title: 'Quantum Melodies',
      artist: 'Neural Network',
      duration: '4:15',
      genre: 'Ambient',
      isLiked: false
    },
    {
      id: '3',
      title: 'Binary Beats',
      artist: 'Algorithm Artist',
      duration: '3:28',
      genre: 'Techno',
      isLiked: true
    },
    {
      id: '4',
      title: 'Synthesized Soul',
      artist: 'Deep Learning',
      duration: '5:03',
      genre: 'Jazz Fusion',
      isLiked: false
    }
  ]);

  const [playlists] = useState([
    { id: '1', name: 'AI Favorites', trackCount: 12 },
    { id: '2', name: 'Coding Sessions', trackCount: 8 },
    { id: '3', name: 'Relaxing Algorithms', trackCount: 15 }
  ]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    toast.success(`Now playing: ${track.title} by ${track.artist}`);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (currentTrack) {
      toast.info(isPlaying ? 'Music paused' : 'Music resumed');
    }
  };

  const toggleLike = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      track.isLiked = !track.isLiked;
      toast.success(track.isLiked ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const shareTrack = (track: Track) => {
    navigator.clipboard.writeText(`Check out ${track.title} by ${track.artist}!`);
    toast.success('Track info copied to clipboard');
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Now Playing */}
      {currentTrack && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>
              <Badge variant="secondary">{currentTrack.genre}</Badge>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="icon" onClick={() => setIsShuffleOn(!isShuffleOn)}>
                <Shuffle className={`h-4 w-4 ${isShuffleOn ? 'text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
              >
                <Repeat className={`h-4 w-4 ${repeatMode !== 'off' ? 'text-primary' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12">{volume[0]}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Music Library
              </CardTitle>
              <CardDescription>
                Your collection of AI-generated music
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracks, artists, or genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                      currentTrack?.id === track.id ? 'bg-muted border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playTrack(track)}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {track.artist} • {track.duration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {track.genre}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLike(track.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${track.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => shareTrack(track)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
              <CardDescription>
                Organize your favorite AI-generated music
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Music className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {playlist.trackCount} tracks
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                Create New Playlist
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discover New Music</CardTitle>
              <CardDescription>
                AI-powered music recommendations just for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Weekly AI Mix</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fresh AI-generated tracks curated for your taste
                  </p>
                  <Button>Listen Now</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Genre Explorer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Discover new genres with AI-powered recommendations
                  </p>
                  <Button variant="outline">Explore</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Mood-Based Playlists</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Music that matches your current mood and energy
                  </p>
                  <Button variant="outline">Find My Mood</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JukeboxHero;