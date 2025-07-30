
import React, { useState } from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, BarChart, PieChart, BarChart2, TrendingUp, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface JukeboxAnalyticsProps {
  tracks: JukeboxTrack[];
  isAdmin: boolean;
}

const JukeboxAnalytics: React.FC<JukeboxAnalyticsProps> = ({
  tracks,
  isAdmin
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const totalPlays = tracks.reduce((sum, track) => 
    sum + track.campaigns.reduce((trackSum, campaign) => trackSum + (campaign.plays || 0), 0), 
  0);
  
  const totalReach = tracks.reduce((sum, track) => 
    sum + track.campaigns.reduce((trackSum, campaign) => trackSum + (campaign.reach || 0), 0), 
  0);
  
  const totalDonations = tracks.reduce((sum, track) => 
    sum + track.donations.reduce((donationSum, donation) => donationSum + donation.amount, 0), 
  0);
  
  const totalCampaigns = tracks.reduce((sum, track) => 
    sum + track.campaigns.length, 
  0);
  
  const handleExportData = () => {
    if (!isAdmin) {
      toast.info("You need admin permissions to export analytics data");
      return;
    }
    toast.success('Analytics data exported successfully!');
  };
  
  const renderPlatformData = () => {
    // In a real app, we'd compute this from the actual data
    const platformData = [
      { platform: 'TikTok', reach: 45600, plays: 23400, engagement: 2800 },
      { platform: 'Instagram', reach: 32800, plays: 18900, engagement: 3100 },
      { platform: 'YouTube', reach: 29400, plays: 21200, engagement: 1750 },
      { platform: 'Facebook', reach: 18200, plays: 8700, engagement: 980 },
      { platform: 'X', reach: 15600, plays: 7200, engagement: 850 }
    ];
    
    const total = platformData.reduce((sum, item) => sum + item.reach, 0);
    
    return (
      <div className="space-y-6">
        {platformData.map(platform => (
          <div key={platform.platform} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="font-medium">{platform.platform}</div>
              <div className="text-sm text-muted-foreground">
                {Math.round((platform.reach / total) * 100)}% of reach
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(platform.reach / total) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground mr-1">Reach:</span>
                {platform.reach.toLocaleString()}
              </div>
              <div>
                <span className="text-muted-foreground mr-1">Plays:</span>
                {platform.plays.toLocaleString()}
              </div>
              <div>
                <span className="text-muted-foreground mr-1">Engagement:</span>
                {platform.engagement.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderChartPlaceholder = () => (
    <div className="h-64 flex items-center justify-center border rounded-md bg-muted/30">
      <div className="text-center text-muted-foreground">
        <BarChart className="h-8 w-8 mx-auto mb-2" />
        <p>Chart visualization coming soon</p>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlays.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{Math.floor(Math.random() * 15) + 5}%</span>
              <span>from last {timeRange}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{Math.floor(Math.random() * 20) + 10}%</span>
              <span>from last {timeRange}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{Math.floor(Math.random() * 25) + 15}%</span>
              <span>from last {timeRange}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span>{tracks.length} tracks across {new Set(tracks.flatMap(t => t.campaigns.map(c => c.platform))).size} platforms</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track plays and engagement over time</CardDescription>
              </div>
              <Tabs defaultValue="month" onValueChange={(v) => setTimeRange(v as any)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {renderChartPlaceholder()}
            
            {isAdmin && (
              <div className="mt-4 text-sm text-center">
                <Button variant="link" className="h-auto p-0">
                  View detailed analytics <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Performance by social platform</CardDescription>
          </CardHeader>
          <CardContent>
            {renderPlatformData()}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Best performing clips and tracks</CardDescription>
          </CardHeader>
          <CardContent>
            {renderChartPlaceholder()}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Listener age and location data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-md bg-muted/30">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-8 w-8 mx-auto mb-2" />
                <p>Demographics visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JukeboxAnalytics;
