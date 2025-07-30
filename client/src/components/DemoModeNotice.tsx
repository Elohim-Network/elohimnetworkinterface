import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface DemoModeNoticeProps {
  isConnected: boolean;
}

const DemoModeNotice: React.FC<DemoModeNoticeProps> = ({ isConnected }) => {
  if (isConnected) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <span className="font-semibold">Demo Mode Active</span>
        </div>
        <p className="mt-1 text-sm">
          VPS connection to 178.16.143.5:3000 is unavailable. The platform is running with local AI fallback responses 
          to demonstrate functionality. All features work - they'll connect to your Mistral 4B VPS once it's accessible.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default DemoModeNotice;