import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'unknown';
  service: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, service }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'disconnected':
        return {
          icon: XCircle,
          text: 'Disconnected',
          variant: 'destructive' as const,
          className: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          icon: Clock,
          text: 'Checking...',
          variant: 'secondary' as const,
          className: 'bg-yellow-500 hover:bg-yellow-600'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {service}: {config.text}
    </Badge>
  );
};

export default ConnectionStatus;