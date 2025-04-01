
import React from 'react';
import { Module } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PremiumFeaturePromptProps {
  featureName: string;
  module: Module;
  onPurchase: (moduleId: string) => Promise<void>;
  onCancel: () => void;
}

const PremiumFeaturePrompt: React.FC<PremiumFeaturePromptProps> = ({
  featureName,
  module,
  onPurchase,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>Premium Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            <span className="font-semibold">{featureName}</span> is a premium feature 
            available with the {module.name} module.
          </p>
          <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
            <div>
              <p className="font-medium">{module.name}</p>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
            <div className="text-lg font-bold">${module.price.toFixed(2)}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Not now
          </Button>
          <Button onClick={() => onPurchase(module.id)}>
            Unlock Feature
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PremiumFeaturePrompt;
