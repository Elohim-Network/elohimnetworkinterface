
import React from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Tag, BarChart2, PieChart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface JukeboxTrackListProps {
  tracks: JukeboxTrack[];
  onSelectTrack: (id: string) => void;
  onPlayTrack: (track: JukeboxTrack) => void;
  isAdmin: boolean;
}

const JukeboxTrackList: React.FC<JukeboxTrackListProps> = ({
  tracks,
  onSelectTrack,
  onPlayTrack,
  isAdmin
}) => {
  if (tracks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <PieChart className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No tracks yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Start by uploading your first track to analyze and create content for social media.
        </p>
        <Button>Upload Your First Track</Button>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getTotalReach = (track: JukeboxTrack) => {
    return track.campaigns.reduce((sum, campaign) => sum + (campaign.reach || 0), 0);
  };
  
  const getTotalPlays = (track: JukeboxTrack) => {
    return track.campaigns.reduce((sum, campaign) => sum + (campaign.plays || 0), 0);
  };
  
  const getTotalDonations = (track: JukeboxTrack) => {
    return track.donations.reduce((sum, donation) => sum + donation.amount, 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Tracks</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{tracks.length} tracks</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <Card 
            key={track.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTrack(track.id)}
          >
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-24 h-24 bg-muted">
                  <img 
                    src={track.coverImageUrl} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(track);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-muted-foreground gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(track.duration)}</span>
                    </div>
                    
                    {track.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">
                          {track.tags.join(', ')}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      {formatDistanceToNow(new Date(track.updatedAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="mt-3 flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        <BarChart2 className="h-3 w-3 mr-1" />
                        {getTotalReach(track).toLocaleString()} reach
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        {getTotalPlays(track).toLocaleString()} plays
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${getTotalDonations(track).toFixed(2)} donations
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JukeboxTrackList;
