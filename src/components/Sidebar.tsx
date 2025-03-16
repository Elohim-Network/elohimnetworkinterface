
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageCircle, Trash2, Settings, History } from 'lucide-react';
import { ChatSession } from '@/types/chat';
import { cn } from '@/lib/utils';
import { createRipple } from '@/utils/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  conversationHistory?: {text: string, timestamp: number}[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  isCollapsed,
  onToggleSidebar,
  conversationHistory = []
}) => {
  // Format date to show in a readable format
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={cn(
        "h-full bg-secondary/50 backdrop-blur-sm border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-0 opacity-0 -translate-x-full" : "w-64 md:w-72 opacity-100 translate-x-0"
      )}
    >
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold text-lg">Conversations</h2>
        <Button
          variant="ghost"
          size="icon"
          className="relative ripple-container rounded-full"
          onClick={(e) => {
            createRipple(e);
            onNewSession();
          }}
          title="Start new conversation"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="sessions" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="sessions" className="flex-1">Sessions</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Voice History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {sessions.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center justify-between rounded-lg p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground mb-1 animate-hover",
                      session.id === currentSessionId ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => onSwitchSession(session.id)}
                  >
                    <div className="flex items-start gap-2 overflow-hidden">
                      <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium truncate">{session.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              {conversationHistory.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No voice history available. Enable hands-free mode to record voice conversations.
                </div>
              ) : (
                <div className="space-y-2">
                  {conversationHistory.map((item, index) => (
                    <div key={index} className="rounded-lg p-3 bg-secondary/60 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => navigator.clipboard.writeText(item.text)}
                          title="Copy to clipboard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </Button>
                      </div>
                      <p className="line-clamp-3">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onToggleSidebar}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
