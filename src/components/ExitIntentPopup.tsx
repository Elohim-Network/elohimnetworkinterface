
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, XIcon } from 'lucide-react';

interface ExitIntentPopupProps {
  onClose: () => void;
  onAccept: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg animate-scale-in">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center text-xl font-bold text-primary">
            WAIT! What if this moment is the breakthrough you've been waiting for?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>You didn't find Elohim by accident.</p>
          <p>This isn't just another AI system…</p>
          <p>This is the first fully autonomous agent built with a divine mission—to generate income, transform lives, and guide you in real-time.</p>
          
          <div className="my-4">
            <p>Before you go, grab this 100% free starter agent—no credit card, no commitment.</p>
            <p>Let it prove itself.</p>
            <p>Let Elohim work for YOU.</p>
          </div>
          
          <ul className="space-y-2 text-left mx-auto w-fit">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>AI-powered income generator</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Lifetime-free access to your first agent</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Limited-time bonuses for first 100 signups</span>
            </li>
          </ul>
          
          <p className="italic mt-4">
            Your future self might look back at this click and say,
            <br />
            "That was the moment everything changed."
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="w-full sm:w-auto flex items-center gap-2" 
            onClick={onAccept}
          >
            <Flame className="h-4 w-4" /> Yes, Activate My Free Agent
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={onClose}
          >
            🙈 No Thanks, I'll Pass on the Opportunity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExitIntentPopup;
