import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Settings, 
  MessageSquare,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: Date;
}

const LocalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your local AI assistant. I can help you with various tasks without sending data to external servers.',
      timestamp: new Date(),
      model: 'Local-Mistral-7B'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant running locally. Be concise and accurate in your responses.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const [isConnected, setIsConnected] = useState(false);
  
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      name: 'General Chat',
      messages: messages,
      lastActivity: new Date()
    }
  ]);
  
  const [currentSessionId, setCurrentSessionId] = useState('1');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check local AI connection
    const checkConnection = async () => {
      try {
        const response = await fetch('http://127.0.0.1:11434/api/tags', {
          method: 'GET',
        });
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!isConnected) {
        throw new Error('Local AI server is not connected');
      }

      // Mock local AI response - in real app, this would call the local Ollama API
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const responses = [
        "I understand your question and I'm processing it locally for privacy.",
        "Let me help you with that using my local knowledge base.",
        "As a local AI, I can assist you without sending your data anywhere.",
        "Based on my local processing, here's what I can help you with:",
        "Your privacy is protected as all processing happens locally on your machine."
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + " " + 
                "This is a demo response. In the full application, this would connect to your local Ollama instance.",
        timestamp: new Date(),
        model: 'Local-Mistral-7B'
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      
      // Update current session
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: updatedMessages, lastActivity: new Date() }
          : session
      ));
      
    } catch (error) {
      toast.error('Failed to get response from local AI. Please check your local server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Chat ${sessions.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hello! I\'m your local AI assistant.',
        timestamp: new Date(),
        model: 'Local-Mistral-7B'
      }],
      lastActivity: new Date()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (sessions.length > 1) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remainingSession = sessions.find(s => s.id !== sessionId);
        if (remainingSession) {
          switchSession(remainingSession.id);
        }
      }
      toast.success('Chat session deleted');
    }
  };

  const exportChat = () => {
    const chatData = {
      sessionName: sessions.find(s => s.id === currentSessionId)?.name,
      messages: messages,
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Local AI Chat
            <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Private AI chat running entirely on your local machine
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Sessions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Chat Sessions</CardTitle>
              <Button onClick={createNewSession} size="sm" className="w-full">
                New Chat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      currentSessionId === session.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => switchSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                    {sessions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {sessions.find(s => s.id === currentSessionId)?.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportChat}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col gap-4 p-0">
                  <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}
                          
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              {message.model && (
                                <Badge variant="outline" className="text-xs">
                                  {message.model}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Processing locally...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="px-6 pb-6">
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={isLoading || !isConnected}
                        className="flex-1 min-h-[44px] max-h-32 resize-none"
                        rows={1}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!input.trim() || isLoading || !isConnected}
                        size="icon"
                        className="h-11"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {!isConnected && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Local AI server not connected. Please start your Ollama instance.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Local AI Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Enter system prompt..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature: {temperature}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Tokens: {maxTokens}</label>
                    <input
                      type="range"
                      min="128"
                      max="2048"
                      step="128"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => toast.success('Settings saved locally')}
                    className="w-full"
                  >
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LocalChat;