
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft, X } from 'lucide-react';
import { createRipple } from '@/utils/animations';
import ConnectionConfig from './ConnectionConfig';
import { ThemeToggle } from './theme-toggle';
import { ChatSession } from '@/types/chat';
import { VoiceInfo } from '@/hooks/useVoice';

interface HeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onUpdateConnectionConfig?: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => void;
  sessions?: ChatSession[];
  onExportChats?: () => void;
  onImportChats?: (sessions: ChatSession[], merge?: boolean) => void;
  // Voice related props
  availableVoices?: VoiceInfo[];
  currentVoiceId?: string;
  elevenLabsApiKey?: string;
  onUpdateVoiceApiKey?: (apiKey: string) => void;
  onUpdateVoice?: (voiceId: string) => void;
  onCloneVoice?: (name: string, description: string, files: File[]) => Promise<VoiceInfo | null>;
  onDeleteVoice?: (voiceId: string) => Promise<boolean>;
  onRefreshVoices?: () => Promise<void>;
  // Browser voice props
  useBrowserVoice?: boolean;
  onToggleBrowserVoice?: (use: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  isCollapsed, 
  onToggleSidebar,
  onUpdateConnectionConfig,
  sessions,
  onExportChats,
  onImportChats,
  availableVoices,
  currentVoiceId,
  elevenLabsApiKey,
  onUpdateVoiceApiKey,
  onUpdateVoice,
  onCloneVoice,
  onDeleteVoice,
  onRefreshVoices,
  useBrowserVoice,
  onToggleBrowserVoice
}) => {
  const handleUpdateConfig = (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
    mistralModel: string;
    sdModel: string;
  }) => {
    if (onUpdateConnectionConfig) {
      onUpdateConnectionConfig(config);
    }
  };

  const handleImportChats = (importedSessions: ChatSession[]) => {
    if (onImportChats) {
      // The merge parameter comes from the importChatsFromFile result
      const result = importedSessions as unknown as { sessions: ChatSession[], merged: boolean };
      if ('merged' in result) {
        onImportChats(result.sessions, result.merged);
      } else {
        // Backward compatibility
        onImportChats(importedSessions, false);
      }
    }
  };

  return (
    <header className="glass h-16 border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 relative ripple-container rounded-full"
          onClick={(e) => {
            createRipple(e);
            onToggleSidebar();
          }}
        >
          {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {onUpdateConnectionConfig && (
          <ConnectionConfig 
            onUpdate={handleUpdateConfig} 
            sessions={sessions}
            onExportChats={onExportChats}
            onImportChats={handleImportChats}
            // Voice related props
            availableVoices={availableVoices}
            currentVoiceId={currentVoiceId}
            elevenLabsApiKey={elevenLabsApiKey}
            onUpdateApiKey={onUpdateVoiceApiKey}
            onUpdateVoice={onUpdateVoice}
            onCloneVoice={onCloneVoice}
            onDeleteVoice={onDeleteVoice}
            onRefreshVoices={onRefreshVoices}
            // Browser voice props
            useBrowserVoice={useBrowserVoice}
            onToggleBrowserVoice={onToggleBrowserVoice}
          />
        )}
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium">AE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
