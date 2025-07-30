
import React, { useState } from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Share2, Download, BarChart2, Video, Clock, Wand2, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface JukeboxTrackDetailProps {
  track: JukeboxTrack;
  onPlay: () => void;
  onGenerateContent: () => void;
  isAdmin: boolean;
}

const JukeboxTrackDetail: React.FC<JukeboxTrackDetailProps> = ({
  track,
  onPlay,
  onGenerateContent,
  isAdmin
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      onPlay();
    }
  };
  
  const handleShareTrack = () => {
    // In a real app, this would use the Web Share API or copy a link
    toast.success('Share link copied to clipboard!');
  };
  
  const handleDownload = () => {
    toast.info('Downloading track...');
    // In a real app, this would initiate a download
  };
  
  const handlePreviewClip = (startTime: number) => {
    toast.info(`Playing clip from ${formatTime(startTime)}...`);
    // In a real app, this would play the audio from the clip start time
    onPlay();
  };
  
  const getTotalEngagement = () => {
    return track.campaigns.reduce((sum, campaign) => sum + (campaign.engagement || 0), 0);
  };
  
  const getTotalRevenue = () => {
    return track.donations.reduce((sum, donation) => sum + donation.amount, 0);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-muted rounded-md overflow-hidden mb-4">
              <img 
                src={track.coverImageUrl} 
                alt={track.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-bold">{track.title}</h2>
            <p className="text-muted-foreground">{track.artist}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {track.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Button 
                className="flex-1"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" onClick={handleShareTrack} />
              </Button>
              
              {isAdmin && (
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" onClick={handleDownload} />
                </Button>
              )}
            </div>
            
            {isAdmin && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Card className="p-3 text-center">
                  <h4 className="text-xs text-muted-foreground">Plays</h4>
                  <p className="text-lg font-bold mt-1">
                    {track.campaigns.reduce((sum, c) => sum + (c.plays || 0), 0).toLocaleString()}
                  </p>
                </Card>
                <Card className="p-3 text-center">
                  <h4 className="text-xs text-muted-foreground">Donations</h4>
                  <p className="text-lg font-bold mt-1">
                    ${track.donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                  </p>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics">Track Analytics</TabsTrigger>
            <TabsTrigger value="viral-clips">Viral Clips</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            {isAdmin && <TabsTrigger value="donations">Donations</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Emotional Intensity Analysis</CardTitle>
                <CardDescription>
                  AI-detected emotional high points in your track
                </CardDescription>
              </CardHeader>
              <CardContent>
                {track.emotionalPoints.length > 0 ? (
                  <div className="relative h-16 w-full bg-muted/30 rounded-md mt-2">
                    {track.emotionalPoints.map((point, index) => (
                      <div
                        key={index}
                        className="absolute bottom-0 w-1 bg-primary cursor-pointer hover:bg-primary/70"
                        style={{
                          left: `${(point.timestamp / track.duration) * 100}%`,
                          height: `${point.intensity * 100}%`,
                        }}
                        title={`${point.emotion} (${formatTime(point.timestamp)})`}
                        onClick={() => handlePreviewClip(point.timestamp)}
                      />
                    ))}
                    
                    <div className="absolute bottom-0 w-full h-0.5 bg-border" />
                    
                    {/* Time markers */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pos) => (
                      <div 
                        key={pos}
                        className="absolute bottom-0 text-xs text-muted-foreground"
                        style={{ left: `${pos * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        {formatTime(Math.floor(track.duration * pos))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Analysis in progress...</p>
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Detected Emotions</h4>
                  <div className="flex flex-wrap gap-2">
                    {track.emotionalPoints.map((point, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handlePreviewClip(point.timestamp)}>
                        <Clock className="h-3 w-3 mr-1" />
                        {point.emotion} at {formatTime(point.timestamp)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {isAdmin && track.viralClipPoints.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Content Generation</CardTitle>
                  <CardDescription>
                    Generate social media content from viral points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      AI has identified {track.viralClipPoints.length} potential viral clip{track.viralClipPoints.length !== 1 && 's'} in your track.
                      Generate optimized content for all major platforms.
                    </p>
                    
                    <Button 
                      onClick={onGenerateContent} 
                      className="w-full"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Content for All Platforms
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getTotalEngagement().toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {track.campaigns.length} campaigns
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${getTotalRevenue().toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {track.donations.length} donations
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="viral-clips" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Detected Viral Clips</CardTitle>
                <CardDescription>
                  Highest potential sections for social media sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {track.viralClipPoints.length > 0 ? (
                  track.viralClipPoints.map((clip, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Clip {index + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(clip.startTime)} - {formatTime(clip.endTime)} 
                            <span className="ml-2">({formatTime(clip.endTime - clip.startTime)})</span>
                          </p>
                        </div>
                        <Badge variant={clip.strength > 0.8 ? "default" : "outline"}>
                          {Math.round(clip.strength * 100)}% viral potential
                        </Badge>
                      </div>
                      
                      <p className="text-sm mt-2 italic">"{clip.caption}"</p>
                      
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePreviewClip(clip.startTime)}
                        >
                          <Play className="h-3 w-3 mr-1" /> 
                          Preview
                        </Button>
                        
                        {isAdmin && (
                          <Button size="sm" onClick={() => onGenerateContent()}>
                            <Video className="h-3 w-3 mr-1" />
                            Generate Video
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No viral clips detected yet. Analysis in progress...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Campaigns</CardTitle>
                <CardDescription>
                  Track your content across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {track.campaigns.length > 0 ? (
                  <div className="space-y-4">
                    {track.campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center border-b pb-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                          <span className="uppercase font-bold text-xs">
                            {campaign.platform.slice(0, 2)}
                          </span>
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium capitalize">{campaign.platform}</h4>
                            <Badge variant={campaign.status === 'published' ? 'default' : 'outline'}>
                              {campaign.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {campaign.publishedAt ? (
                              <>Published on {new Date(campaign.publishedAt).toLocaleDateString()}</>
                            ) : campaign.scheduledFor ? (
                              <>Scheduled for {new Date(campaign.scheduledFor).toLocaleDateString()}</>
                            ) : (
                              <>Processing</>
                            )}
                          </div>
                          
                          {campaign.status === 'published' && campaign.videoUrl && (
                            <div className="mt-1">
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on {campaign.platform}
                              </Button>
                              
                              {isAdmin && (
                                <div className="flex mt-1 text-xs text-muted-foreground">
                                  <span className="mr-3">{campaign.reach?.toLocaleString()} reach</span>
                                  <span className="mr-3">{campaign.plays?.toLocaleString()} plays</span>
                                  <span>{campaign.engagement?.toLocaleString()} engagements</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No campaigns created yet.</p>
                    {isAdmin && (
                      <Button className="mt-2" onClick={onGenerateContent}>
                        Generate Content Now
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="donations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donations Received</CardTitle>
                  <CardDescription>
                    Track love gifts from your listeners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {track.donations.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-right mb-4">
                        <div className="text-sm text-muted-foreground">Total Received</div>
                        <div className="text-2xl font-bold">
                          ${track.donations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </div>
                      </div>
                      
                      {track.donations.map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <div className="font-medium">
                              {donation.donorName || 'Anonymous'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(donation.timestamp).toLocaleDateString()}
                            </div>
                            {donation.message && (
                              <div className="text-sm italic mt-1">
                                "{donation.message}"
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${donation.amount.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No donations received yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default JukeboxTrackDetail;
