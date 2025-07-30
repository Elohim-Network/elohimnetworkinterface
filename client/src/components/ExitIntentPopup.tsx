import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Gift } from 'lucide-react';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ isOpen, onAccept, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Wait! Don't leave yet!</CardTitle>
          <CardDescription>
            Get a free AI agent to help with your projects
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Join thousands of users who are already using Agent Elohim to boost their productivity.
          </p>
          <ul className="text-sm space-y-2 text-left">
            <li className="flex items-center gap-2">
              ✓ Advanced AI conversations
            </li>
            <li className="flex items-center gap-2">
              ✓ Image generation capabilities
            </li>
            <li className="flex items-center gap-2">
              ✓ Business tools and analytics
            </li>
            <li className="flex items-center gap-2">
              ✓ Free to get started
            </li>
          </ul>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            No, thanks
          </Button>
          <Button onClick={onAccept} className="flex-1">
            Get Free Agent
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExitIntentPopup;