
import React, { useState } from 'react';
import { ContentDeploymentSettings } from '@/types/modules';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, X, Plus, Trash } from 'lucide-react';

interface JukeboxSettingsProps {
  settings: ContentDeploymentSettings;
  onUpdateSettings: (settings: ContentDeploymentSettings) => void;
  onToggleWhiteLabel: () => void;
  isWhiteLabeled: boolean;
}

const JukeboxSettings: React.FC<JukeboxSettingsProps> = ({
  settings,
  onUpdateSettings,
  onToggleWhiteLabel,
  isWhiteLabeled
}) => {
  const [localSettings, setLocalSettings] = useState<ContentDeploymentSettings>(settings);
  const [newCaption, setNewCaption] = useState('');
  const [newHashtagSet, setNewHashtagSet] = useState('');
  const [newCta, setNewCta] = useState('');
  
  const handleTogglePlatform = (platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'x', enabled: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      platforms: prev.platforms.map(p => 
        p.platform === platform ? {...p, enabled} : p
      )
    }));
  };
  
  const handleUpdatePlatformId = (platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'x', accountId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      platforms: prev.platforms.map(p => 
        p.platform === platform ? {...p, accountId} : p
      )
    }));
  };
  
  const handleAddCaption = () => {
    if (newCaption.trim()) {
      setLocalSettings(prev => ({
        ...prev,
        captionTemplates: [...prev.captionTemplates, newCaption.trim()]
      }));
      setNewCaption('');
    }
  };
  
  const handleRemoveCaption = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      captionTemplates: prev.captionTemplates.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddHashtagSet = () => {
    if (newHashtagSet.trim()) {
      const hashtags = newHashtagSet.trim()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
      
      if (hashtags.length > 0) {
        setLocalSettings(prev => ({
          ...prev,
          hashtagSets: [...prev.hashtagSets, hashtags]
        }));
        setNewHashtagSet('');
      }
    }
  };
  
  const handleRemoveHashtagSet = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      hashtagSets: prev.hashtagSets.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddCta = () => {
    if (newCta.trim()) {
      setLocalSettings(prev => ({
        ...prev,
        ctaTemplates: [...prev.ctaTemplates, newCta.trim()]
      }));
      setNewCta('');
    }
  };
  
  const handleRemoveCta = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      ctaTemplates: prev.ctaTemplates.filter((_, i) => i !== index)
    }));
  };
  
  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
  };
  
  const handleResetSettings = () => {
    setLocalSettings(settings);
    toast.info('Settings reset to previous values');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Jukebox Settings</h2>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleResetSettings}>Reset</Button>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>
      </div>
      
      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="platforms">Platform Connections</TabsTrigger>
          <TabsTrigger value="content">Content Templates</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platforms" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>
                Configure the social media platforms for your content deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {localSettings.platforms.map(platform => (
                <div key={platform.platform} className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <div className="font-medium capitalize">{platform.platform}</div>
                      {platform.enabled && platform.accountId && (
                        <Badge variant="outline" className="ml-2 text-xs">Connected</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {platform.platform === 'tiktok' && 'Share vertical format videos'}
                      {platform.platform === 'youtube' && 'Share videos as YouTube Shorts'}
                      {platform.platform === 'instagram' && 'Share videos as Instagram Reels'}
                      {platform.platform === 'facebook' && 'Share videos on your Facebook page'}
                      {platform.platform === 'x' && 'Share videos on X (formerly Twitter)'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div>
                      <Switch
                        checked={platform.enabled}
                        onCheckedChange={(checked) => 
                          handleTogglePlatform(platform.platform as any, checked)
                        }
                        id={`platform-${platform.platform}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Configure your account IDs for each platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localSettings.platforms.map(platform => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`account-${platform.platform}`} className="capitalize">
                      {platform.platform} Account ID
                    </Label>
                    {!platform.enabled && (
                      <Badge variant="outline" className="text-xs">
                        Platform disabled
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id={`account-${platform.platform}`}
                      value={platform.accountId || ''}
                      onChange={(e) => 
                        handleUpdatePlatformId(platform.platform as any, e.target.value)
                      }
                      placeholder={`Your ${platform.platform} username`}
                      disabled={!platform.enabled}
                    />
                    <Button variant="outline" className="shrink-0" disabled={!platform.enabled}>
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-sm text-muted-foreground mt-2">
                Note: In a production environment, this would use OAuth to authenticate with each platform.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Caption Templates</CardTitle>
              <CardDescription>
                Create templates for auto-generated captions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-caption">Add New Caption Template</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-caption"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Enter caption template... Use #SOUND_TAG #EMOTION_TAG as placeholders"
                  />
                  <Button onClick={handleAddCaption} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Use #SOUND_TAG, #EMOTION_TAG as placeholders that will be replaced with relevant values.
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Current Templates</Label>
                <div className="space-y-2">
                  {localSettings.captionTemplates.map((caption, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="text-sm">{caption}</div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCaption(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hashtag Sets</CardTitle>
              <CardDescription>
                Create sets of hashtags to use in your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-hashtags">Add New Hashtag Set</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-hashtags"
                    value={newHashtagSet}
                    onChange={(e) => setNewHashtagSet(e.target.value)}
                    placeholder="Enter hashtags separated by commas"
                  />
                  <Button onClick={handleAddHashtagSet} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Current Hashtag Sets</Label>
                <div className="space-y-2">
                  {localSettings.hashtagSets.map((hashtagSet, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex flex-wrap gap-1">
                        {hashtagSet.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveHashtagSet(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Templates</CardTitle>
              <CardDescription>
                Create templates for CTAs to use in your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-cta">Add New CTA</Label>
                <div className="flex gap-2">
                  <Input 
                    id="new-cta"
                    value={newCta}
                    onChange={(e) => setNewCta(e.target.value)}
                    placeholder="Enter call to action text"
                  />
                  <Button onClick={handleAddCta} className="shrink-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Current CTAs</Label>
                <div className="space-y-2">
                  {localSettings.ctaTemplates.map((cta, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="text-sm">{cta}</div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveCta(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduling" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Posting Schedule</CardTitle>
              <CardDescription>
                Configure your content posting schedule preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Best Times of Day</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({length: 24}).map((_, hour) => {
                      const isSelected = localSettings.schedulePreferences.bestTimeOfDay.includes(hour);
                      return (
                        <div 
                          key={hour}
                          className={`border rounded text-center p-1 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            const newTimes = isSelected 
                              ? localSettings.schedulePreferences.bestTimeOfDay.filter(h => h !== hour)
                              : [...localSettings.schedulePreferences.bestTimeOfDay, hour].sort((a, b) => a - b);
                            
                            setLocalSettings(prev => ({
                              ...prev,
                              schedulePreferences: {
                                ...prev.schedulePreferences,
                                bestTimeOfDay: newTimes
                              }
                            }));
                          }}
                        >
                          {hour === 0 ? '12am' : 
                           hour === 12 ? '12pm' : 
                           hour < 12 ? `${hour}am` : `${hour-12}pm`}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="flex gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                      const isSelected = localSettings.schedulePreferences.daysOfWeek[index];
                      return (
                        <div 
                          key={day}
                          className={`border rounded text-center p-1 cursor-pointer transition-colors flex-1 ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            const newDays = [...localSettings.schedulePreferences.daysOfWeek];
                            newDays[index] = !newDays[index];
                            
                            setLocalSettings(prev => ({
                              ...prev,
                              schedulePreferences: {
                                ...prev.schedulePreferences,
                                daysOfWeek: newDays
                              }
                            }));
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="posting-frequency">Posting Frequency (per week)</Label>
                  <Input 
                    id="posting-frequency"
                    type="number"
                    min="1"
                    max="21"
                    value={localSettings.schedulePreferences.frequency}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setLocalSettings(prev => ({
                          ...prev,
                          schedulePreferences: {
                            ...prev.schedulePreferences,
                            frequency: value
                          }
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>
                Configure the branding for your jukebox experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="white-label" className="text-base">White Label Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove Elohim Network branding from the jukebox experience
                  </p>
                </div>
                <Switch 
                  id="white-label"
                  checked={isWhiteLabeled}
                  onCheckedChange={onToggleWhiteLabel}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-title">Custom Jukebox Title</Label>
                <Input 
                  id="custom-title"
                  placeholder="Enter custom title"
                  defaultValue={isWhiteLabeled ? "Music Creator Studio" : ""}
                  disabled={!isWhiteLabeled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-description">Custom Description</Label>
                <Textarea 
                  id="custom-description"
                  placeholder="Enter custom description"
                  rows={3}
                  disabled={!isWhiteLabeled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Custom Color Theme</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                    <div 
                      key={color}
                      className={`h-10 rounded border-2 cursor-pointer ${
                        color === '#3b82f6' ? 'border-primary' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => toast.info('Color theme selection coming soon')}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
                className="ml-auto mr-2"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-1" />
                Save Branding
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JukeboxSettings;
