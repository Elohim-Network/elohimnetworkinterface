
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Signal, SignalHigh, SignalMedium, SignalLow, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DiagnosticsTool from './DiagnosticsTool';

interface ConnectionStatusProps {
  status: {
    mistral: 'unknown' | 'connected' | 'disconnected';
    stableDiffusion: 'unknown' | 'connected' | 'disconnected';
  };
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  
  // Determine overall status
  const getOverallStatus = () => {
    if (status.mistral === 'connected' && status.stableDiffusion === 'connected') {
      return 'connected';
    }
    if (status.mistral === 'disconnected' && status.stableDiffusion === 'disconnected') {
      return 'disconnected';
    }
    if (status.mistral === 'unknown' && status.stableDiffusion === 'unknown') {
      return 'unknown';
    }
    return 'partial';
  };
  
  const overallStatus = getOverallStatus();
  
  // Get appropriate icon based on status
  const getIcon = () => {
    switch (overallStatus) {
      case 'connected':
        return <SignalHigh className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <SignalMedium className="h-4 w-4 text-yellow-500" />;
      case 'disconnected':
        return <SignalLow className="h-4 w-4 text-red-500" />;
      default:
        return <Signal className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const openDiagnostics = () => {
    setDiagnosticsOpen(true);
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 relative"
              onClick={openDiagnostics}
            >
              {getIcon()}
              {overallStatus !== 'connected' && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <h4 className="font-medium mb-2">Backend Status</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    status.mistral === 'connected' ? 'bg-green-500' : 
                    status.mistral === 'disconnected' ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <span>Mistral API: {status.mistral}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    status.stableDiffusion === 'connected' ? 'bg-green-500' : 
                    status.stableDiffusion === 'disconnected' ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <span>Stable Diffusion: {status.stableDiffusion}</span>
                </div>
              </div>
              
              {overallStatus !== 'connected' && (
                <div className="mt-2 text-xs text-amber-500 border-t pt-2">
                  <p>Click to open diagnostics and fix connection issues</p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Diagnostics
          </DialogTitle>
          <DiagnosticsTool />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectionStatus;
