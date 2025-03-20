
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Cloud, Download, Upload, Check, X, ExternalLink, Loader2, FileText, Image, Mail, Calendar, Phone, ClipboardCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  authUrl?: string;
  apiKey?: string;
  webhook?: string;
  autoSync?: boolean;
  lastSync?: string;
}

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cloud');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved integrations from localStorage
    const savedIntegrations = localStorage.getItem('elohim-integrations');
    
    if (savedIntegrations) {
      try {
        setIntegrations(JSON.parse(savedIntegrations));
      } catch (e) {
        console.error('Error loading integrations:', e);
        initializeDefaultIntegrations();
      }
    } else {
      initializeDefaultIntegrations();
    }
  }, []);

  // Save to localStorage whenever integrations change
  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem('elohim-integrations', JSON.stringify(integrations));
    }
  }, [integrations]);

  const initializeDefaultIntegrations = () => {
    const defaultIntegrations: Integration[] = [
      {
        id: 'google-drive',
        name: 'Google Drive',
        description: 'Access and manage your Google Drive files',
        icon: <Cloud className="h-6 w-6 text-blue-500" />,
        connected: false,
        authUrl: 'https://accounts.google.com/o/oauth2/auth',
        autoSync: false
      },
      {
        id: 'google-docs',
        name: 'Google Docs',
        description: 'Create and edit documents with Google Docs',
        icon: <FileText className="h-6 w-6 text-blue-500" />,
        connected: false,
        authUrl: 'https://accounts.google.com/o/oauth2/auth',
        autoSync: false
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Sync your calendar events with Google Calendar',
        icon: <Calendar className="h-6 w-6 text-blue-500" />,
        connected: false,
        authUrl: 'https://accounts.google.com/o/oauth2/auth',
        autoSync: false
      },
      {
        id: 'icloud',
        name: 'iCloud',
        description: 'Access your files stored in iCloud',
        icon: <Cloud className="h-6 w-6 text-gray-500" />,
        connected: false,
        authUrl: 'https://appleid.apple.com/auth/authorize',
        autoSync: false
      },
      {
        id: 'dropbox',
        name: 'Dropbox',
        description: 'Store and share files with Dropbox',
        icon: <Cloud className="h-6 w-6 text-blue-700" />,
        connected: false,
        authUrl: 'https://www.dropbox.com/oauth2/authorize',
        autoSync: false
      },
      {
        id: 'onedrive',
        name: 'OneDrive',
        description: 'Access your Microsoft OneDrive files',
        icon: <Cloud className="h-6 w-6 text-blue-600" />,
        connected: false,
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        autoSync: false
      },
      {
        id: 'zapier',
        name: 'Zapier',
        description: 'Connect with 5,000+ apps using Zapier webhooks',
        icon: <Database className="h-6 w-6 text-orange-500" />,
        connected: false,
        webhook: '',
        autoSync: false
      },
      {
        id: 'make',
        name: 'Make (Integromat)',
        description: 'Create and automate workflows with Make',
        icon: <Database className="h-6 w-6 text-purple-600" />,
        connected: false,
        webhook: '',
        autoSync: false
      },
      {
        id: 'gmail',
        name: 'Gmail',
        description: 'Send and manage emails with Gmail',
        icon: <Mail className="h-6 w-6 text-red-500" />,
        connected: false,
        authUrl: 'https://accounts.google.com/o/oauth2/auth',
        autoSync: false
      },
      {
        id: 'trello',
        name: 'Trello',
        description: 'Manage projects and track tasks with Trello',
        icon: <ClipboardCheck className="h-6 w-6 text-blue-400" />,
        connected: false,
        apiKey: '',
        autoSync: false
      }
    ];
    
    setIntegrations(defaultIntegrations);
    localStorage.setItem('elohim-integrations', JSON.stringify(defaultIntegrations));
  };

  const handleConnectWithOAuth = (integration: Integration) => {
    const oauth = window.open(
      integration.authUrl,
      'oauth',
      'width=600,height=600,scrollbars=yes'
    );
    
    // In a real app, you'd implement proper OAuth handling
    // For this demo, we'll simulate connecting after a delay
    setIsLoading(true);
    setTimeout(() => {
      updateIntegrationStatus(integration.id, true);
      if (oauth) oauth.close();
      setIsLoading(false);
      toast.success(`Successfully connected to ${integration.name}`);
    }, 2000);
  };

  const handleAPIKeyConnect = (id: string, apiKey: string) => {
    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }
    
    setIsLoading(true);
    // Simulate API validation
    setTimeout(() => {
      updateIntegrationStatus(id, true, apiKey);
      setIsLoading(false);
      toast.success('API key validated and saved');
    }, 1500);
  };

  const handleWebhookUpdate = (id: string, webhook: string) => {
    if (!webhook) {
      toast.error('Please enter a webhook URL');
      return;
    }
    
    setIsLoading(true);
    // Simulate webhook validation
    setTimeout(() => {
      updateIntegrationStatus(id, true, undefined, webhook);
      setIsLoading(false);
      toast.success('Webhook URL saved');
    }, 1000);
  };

  const updateIntegrationStatus = (
    id: string, 
    connected: boolean, 
    apiKey?: string, 
    webhook?: string,
    autoSync?: boolean
  ) => {
    const updated = integrations.map(integration => {
      if (integration.id === id) {
        return {
          ...integration,
          connected,
          ...(apiKey !== undefined && { apiKey }),
          ...(webhook !== undefined && { webhook }),
          ...(autoSync !== undefined && { autoSync }),
          ...(connected && { lastSync: new Date().toISOString() })
        };
      }
      return integration;
    });
    
    setIntegrations(updated);
  };

  const handleDisconnect = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;
    
    if (window.confirm(`Are you sure you want to disconnect from ${integration.name}?`)) {
      const updated = integrations.map(item => {
        if (item.id === id) {
          return {
            ...item,
            connected: false,
            apiKey: '',
            webhook: '',
            lastSync: undefined,
            autoSync: false
          };
        }
        return item;
      });
      
      setIntegrations(updated);
      toast.success(`Disconnected from ${integration.name}`);
    }
  };

  const toggleAutoSync = (id: string, enabled: boolean) => {
    updateIntegrationStatus(id, true, undefined, undefined, enabled);
    const integration = integrations.find(i => i.id === id);
    
    if (enabled) {
      toast.success(`Auto-sync enabled for ${integration?.name}`);
    } else {
      toast.success(`Auto-sync disabled for ${integration?.name}`);
    }
  };

  const renderConnectionDetails = (integration: Integration) => {
    if (integration.connected) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-3 py-1 text-xs font-medium flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </div>
            {integration.lastSync && (
              <span className="text-xs text-muted-foreground">
                Last sync: {new Date(integration.lastSync).toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor={`auto-sync-${integration.id}`} className="text-sm">
              Auto-sync
            </Label>
            <Switch
              id={`auto-sync-${integration.id}`}
              checked={integration.autoSync}
              onCheckedChange={(checked) => toggleAutoSync(integration.id, checked)}
            />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full text-destructive hover:text-destructive"
            onClick={() => handleDisconnect(integration.id)}
          >
            <X className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      );
    }
    
    if (integration.apiKey !== undefined) {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`api-key-${integration.id}`}>API Key</Label>
            <div className="flex gap-2">
              <Input
                id={`api-key-${integration.id}`}
                type="password"
                placeholder="Enter API key"
                defaultValue={integration.apiKey}
                onChange={(e) => {
                  const updated = integrations.map(item => {
                    if (item.id === integration.id) {
                      return { ...item, apiKey: e.target.value };
                    }
                    return item;
                  });
                  setIntegrations(updated);
                }}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open(`https://docs.${integration.name.toLowerCase()}.com/api/getting-started`, '_blank')}
                title="Get API Key"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={() => handleAPIKeyConnect(integration.id, integration.apiKey || '')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Cloud className="h-4 w-4 mr-2" />
            )}
            Connect
          </Button>
        </div>
      );
    }
    
    if (integration.webhook !== undefined) {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`webhook-${integration.id}`}>Webhook URL</Label>
            <Input
              id={`webhook-${integration.id}`}
              placeholder="Enter webhook URL"
              defaultValue={integration.webhook}
              onChange={(e) => {
                const updated = integrations.map(item => {
                  if (item.id === integration.id) {
                    return { ...item, webhook: e.target.value };
                  }
                  return item;
                });
                setIntegrations(updated);
              }}
            />
          </div>
          <Button 
            onClick={() => handleWebhookUpdate(integration.id, integration.webhook || '')}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Cloud className="h-4 w-4 mr-2" />
            )}
            Save Webhook
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        <Button 
          onClick={() => handleConnectWithOAuth(integration)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Cloud className="h-4 w-4 mr-2" />
          )}
          Connect with {integration.name}
        </Button>
      </div>
    );
  };

  // Filter integrations based on active tab
  const filteredIntegrations = integrations.filter(integration => {
    switch (activeTab) {
      case 'cloud':
        return ['google-drive', 'icloud', 'dropbox', 'onedrive'].includes(integration.id);
      case 'productivity':
        return ['google-docs', 'google-calendar', 'trello'].includes(integration.id);
      case 'communication':
        return ['gmail'].includes(integration.id);
      case 'automation':
        return ['zapier', 'make'].includes(integration.id);
      default:
        return true;
    }
  });

  const getIntegrationInfo = (type: string) => {
    switch (type) {
      case 'cloud':
        return {
          title: 'Cloud Storage',
          description: 'Connect to your favorite cloud storage services.'
        };
      case 'productivity':
        return {
          title: 'Productivity Tools',
          description: 'Connect to tools that help you get work done.'
        };
      case 'communication':
        return {
          title: 'Communication',
          description: 'Connect to email and messaging services.'
        };
      case 'automation':
        return {
          title: 'Automation',
          description: 'Connect to services that help automate your workflow.'
        };
      default:
        return {
          title: 'All Integrations',
          description: 'Connect to your favorite services.'
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect Elohim with your favorite services to enhance your workflow.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cloud">Storage</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          {Object.keys(getIntegrationInfo).map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="my-4">
                <h2 className="text-xl font-medium">{getIntegrationInfo(tab).title}</h2>
                <p className="text-sm text-muted-foreground">
                  {getIntegrationInfo(tab).description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIntegrations.map(integration => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderConnectionDetails(integration)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
          <p>
            Note: These integrations are simulated for demonstration purposes. 
            In a production environment, proper OAuth flows and API authentication would be implemented.
          </p>
          <p className="mt-2">
            For a real implementation of these integrations, consider using libraries like oauth-pkce or SDK packages provided by each service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
