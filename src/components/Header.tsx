
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft, X } from 'lucide-react';
import { createRipple } from '@/utils/animations';
import ConnectionConfig from './ConnectionConfig';

interface HeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onUpdateConnectionConfig?: (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
  }) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  isCollapsed, 
  onToggleSidebar,
  onUpdateConnectionConfig
}) => {
  const handleUpdateConfig = (config: {
    mistralUrl: string;
    stableDiffusionUrl: string;
  }) => {
    if (onUpdateConnectionConfig) {
      onUpdateConnectionConfig(config);
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
        {onUpdateConnectionConfig && <ConnectionConfig onUpdate={handleUpdateConfig} />}
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium">AE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
