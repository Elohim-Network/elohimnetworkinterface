
import React, { useState } from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, BarChart2, RefreshCw, Calendar, Check, X, Clock, Play, ExternalLink } from 'lucide-react';

interface JukeboxCampaignsProps {
  tracks: JukeboxTrack[];
  selectedTrackId: string | null;
  onSelectTrack: (id: string) => void;
  isAdmin: boolean;
}

const JukeboxCampaigns: React.FC<JukeboxCampaignsProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  isAdmin
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'published' | 'failed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get all campaigns from all tracks
  const allCampaigns = tracks.flatMap(track => 
    track.campaigns.map(campaign => ({
      ...campaign,
      trackId: track.id,
      trackTitle: track.title,
      trackArtist: track.artist
    }))
  );
  
  // Filter campaigns based on selected track and status filter
  const filteredCampaigns = allCampaigns.filter(campaign => 
    (selectedTrackId ? campaign.trackId === selectedTrackId : true) && 
    (filter === 'all' ? true : campaign.status === filter)
  );
  
  const handleRefreshStats = async () => {
    if (!isAdmin) {
      toast.info("You need admin permissions to refresh stats");
      return;
    }
    
    setIsRefreshing(true);
    toast.loading('Refreshing campaign stats...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Campaign stats updated successfully!');
    setIsRefreshing(false);
  };
  
  const handleViewCampaign = (videoUrl?: string) => {
    if (videoUrl) {
      // In a real app, this would open the URL in a new tab
      toast.success('Opening campaign...');
    } else {
      toast.info('Campaign URL not available');
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'youtube':
        return '🎬';
      case 'instagram':
        return '📸';
      case 'facebook':
        return '👍';
      case 'x':
        return '𝕏';
      default:
        return '🔗';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content Campaigns</h2>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshStats}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Stats
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Track and manage your cross-platform content
              </CardDescription>
            </div>
            
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    {isAdmin && <TableHead className="text-right">Metrics</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        <div className="line-clamp-1">{campaign.trackTitle}</div>
                        <div className="text-xs text-muted-foreground">{campaign.trackArtist}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getPlatformIcon(campaign.platform)}</span>
                          <span className="capitalize">{campaign.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            campaign.status === 'published' ? 'default' :
                            campaign.status === 'scheduled' ? 'outline' :
                            'destructive'
                          }
                        >
                          {campaign.status === 'published' && <Check className="h-3 w-3 mr-1" />}
                          {campaign.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                          {campaign.status === 'failed' && <X className="h-3 w-3 mr-1" />}
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.status === 'published' ? 
                          formatDate(campaign.publishedAt) : 
                          formatDate(campaign.scheduledFor)
                        }
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          {campaign.status === 'published' && campaign.reach !== undefined ? (
                            <div className="flex justify-end gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{campaign.reach.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                <span>{campaign.plays?.toLocaleString() || 0}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCampaign(campaign.videoUrl)}
                          disabled={!campaign.videoUrl}
                          className="h-7 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No campaigns found for the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Calendar</CardTitle>
            <CardDescription>
              View and manage your scheduled content calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p>Calendar view coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JukeboxCampaigns;
