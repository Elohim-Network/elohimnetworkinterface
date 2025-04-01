
import React from 'react';
import { Module } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ShoppingCart } from 'lucide-react';

interface ModulePromotionProps {
  module: Module;
  onPurchase: (moduleId: string) => Promise<void>;
  className?: string;
}

const ModulePromotion: React.FC<ModulePromotionProps> = ({
  module,
  onPurchase,
  className
}) => {
  return (
    <Card className={`w-full overflow-hidden transition-all animate-fade-in ${className}`}>
      <CardHeader className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{module.name}</CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Unlock premium capabilities
            </CardDescription>
          </div>
          {module.isNew && (
            <Badge variant="secondary" className="bg-yellow-500 text-yellow-950">
              NEW
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
        
        <div className="flex items-center gap-2 mt-2 text-sm">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span>{module.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{module.sales}+ users</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="text-xl font-bold">
          ${module.price.toFixed(2)}
        </div>
        
        <Button
          variant="default"
          size="sm"
          onClick={() => onPurchase(module.id)}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Purchase</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModulePromotion;
