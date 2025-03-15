
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageCircle, Trash2, Settings } from 'lucide-react';
import { ChatSession } from '@/types/chat';
import { cn } from '@/lib/utils';
import { createRipple } from '@/utils/animations';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  isCollapsed,
  onToggleSidebar
}) => {
  // Format date to show in a readable format
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
      
      <ScrollArea className="flex-1">
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
