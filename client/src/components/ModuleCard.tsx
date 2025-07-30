
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ModuleProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featuredImage: string;
  rating: number;
  sales: number;
  isInstalled: boolean;
  isNew: boolean;
  onInstall: (id: string) => void;
  onAddToCart: (id: string) => void;
  connectionStatus?: 'connected' | 'disconnected' | 'unknown';
}

const ModuleCard: React.FC<ModuleProps> = ({
  id,
  name,
  description,
  price,
  category,
  featuredImage,
  rating,
  sales,
  isInstalled,
  isNew,
  onInstall,
  onAddToCart,
  connectionStatus = 'unknown'
}) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img 
          src={featuredImage} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500">New</Badge>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`absolute top-2 left-2 h-3 w-3 rounded-full ${getConnectionStatusColor()}`}></div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                {connectionStatus === 'connected' ? 'Backend Connected' : 
                 connectionStatus === 'disconnected' ? 'Backend Disconnected' : 
                 'Connection Status Unknown'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          <Badge variant="outline">${price}</Badge>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span>{rating}</span>
          <span className="mx-2">•</span>
          <span>{sales} sales</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant="outline">{category}</Badge>
        <div className="flex gap-2">
          {!isInstalled && (
            <Button variant="outline" size="sm" onClick={() => onAddToCart(id)}>
              Add to Cart
            </Button>
          )}
          {isInstalled ? (
            <Button variant="secondary" disabled>Installed</Button>
          ) : (
            <Button onClick={() => onInstall(id)}>
              {price === 0 ? 'Install Free' : 'Purchase'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
