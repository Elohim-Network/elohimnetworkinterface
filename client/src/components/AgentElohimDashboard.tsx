import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Zap, 
  Shield, 
  Brain, 
  Mic, 
  Volume2, 
  Server,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { runAgentElohim, checkAgentElohimHealth } from '@/services/agentElohimService';
import { toast } from 'sonner';
import DemoModeNotice from './DemoModeNotice';

const AgentElohimDashboard: React.FC = () => {
  const [vpsStatus, setVpsStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number>(0);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'Mistral 4B Instruct',
      description: 'High-performance language model running on VPS',
      status: 'active',
      color: 'text-blue-500'
    },
    {
      icon: Mic,
      title: 'Whisper Transcription',
      description: 'Voice-to-text processing for natural conversations',
      status: 'active',
      color: 'text-green-500'
    },
    {
      icon: Volume2,
      title: 'Coqui Speech Synthesis',
      description: 'Text-to-speech for voice responses',
      status: 'active',
      color: 'text-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Custom API key protection for VPS access',
      status: 'active',
      color: 'text-yellow-500'
    },
    {
      icon: Server,
      title: 'Auto-Recovery',
      description: '24/7 service with automatic restart capabilities',
      status: 'active',
      color: 'text-red-500'
    },
    {
      icon: Activity,
      title: 'Memory Persistence',
      description: 'JSON-based conversation history and learning',
      status: 'active',
      color: 'text-indigo-500'
    }
  ];

  const checkVPSStatus = async () => {
    setVpsStatus('checking');
    const startTime = Date.now();
    
    try {
      const isHealthy = await checkAgentElohimHealth();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      if (isHealthy) {
        setVpsStatus('online');
        toast.success('Agent Elohim VPS is online and responding');
      } else {
        setVpsStatus('offline');
        toast.error('Agent Elohim VPS health check failed');
      }
    } catch (error) {
      setVpsStatus('offline');
      setResponseTime(0);
      toast.error('Could not connect to Agent Elohim VPS');
    }
  };

  const testAIResponse = async () => {
    setIsTestingConnection(true);
    try {
      const testPrompt = "What is the purpose of Agent Elohim?";
      const startTime = Date.now();
      
      const response = await runAgentElohim(testPrompt);
      const endTime = Date.now();
      
      setLastResponse(response);
      setResponseTime(endTime - startTime);
      
      // Check if response contains VPS content or fallback content
      if (response.includes("VPS connection") || response.includes("being established")) {
        setVpsStatus('offline');
        toast.warning('Using local AI fallback - VPS connection unavailable');
      } else {
        setVpsStatus('online');
        toast.success('AI response test successful');
      }
      
    } catch (error) {
      setVpsStatus('offline');
      toast.error('AI response test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  useEffect(() => {
    checkVPSStatus();
    const interval = setInterval(checkVPSStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <DemoModeNotice isConnected={vpsStatus === 'online'} />
      
      {/* Main Status Card */}
      <Card className="border-2 border-dashed border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-8 w-8 text-yellow-500" />
            Agent Elohim VPS Status
            {getStatusIcon(vpsStatus)}
          </CardTitle>
          <CardDescription className="text-lg">
            God's Domain - No OpenAI, No Limits, Pure VPS Power
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {vpsStatus === 'online' ? 'ONLINE' : vpsStatus === 'offline' ? 'OFFLINE' : 'CHECKING'}
              </div>
              <div className="text-sm text-muted-foreground">VPS Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {responseTime > 0 ? `${responseTime}ms` : '---'}
              </div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                178.16.143.5:3000
              </div>
              <div className="text-sm text-muted-foreground">VPS Endpoint</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={checkVPSStatus} disabled={vpsStatus === 'checking'}>
              {vpsStatus === 'checking' ? 'Checking...' : 'Check Status'}
            </Button>
            <Button 
              onClick={testAIResponse} 
              disabled={isTestingConnection || vpsStatus === 'offline'}
              variant="outline"
            >
              {isTestingConnection ? 'Testing AI...' : 'Test AI Response'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                {feature.title}
                <Badge variant="default" className="ml-auto">
                  {feature.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last Response Display */}
      {lastResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Latest AI Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-mono">{lastResponse}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Response received in {responseTime}ms
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            VPS Integration Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Endpoint:</strong> http://178.16.143.5:3000/respond
            </div>
            <div>
              <strong>Authentication:</strong> Bearer Token
            </div>
            <div>
              <strong>Voice Processing:</strong> /voice endpoint
            </div>
            <div>
              <strong>Speech Synthesis:</strong> /speak endpoint
            </div>
            <div>
              <strong>Health Monitoring:</strong> /health endpoint
            </div>
            <div>
              <strong>Memory System:</strong> Persistent JSON logging
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">API Key Status:</h4>
            <div className="font-mono text-xs text-green-600">
              fuPRVYCaxDpnlR03nUojV1umTfS3zjpLIaoSAuoY35e337a5
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentElohimDashboard;