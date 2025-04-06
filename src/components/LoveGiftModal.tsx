
import React, { useState } from 'react';
import { JukeboxTrack } from '@/types/modules';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';

interface LoveGiftModalProps {
  track: JukeboxTrack;
  onClose: () => void;
}

const SUGGESTED_AMOUNTS = [5, 10, 25, 50];

const LoveGiftModal: React.FC<LoveGiftModalProps> = ({ track, onClose }) => {
  const [amount, setAmount] = useState<number | string>(10);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handleSelectAmount = (value: number) => {
    setAmount(value);
  };
  
  const incrementAmount = () => {
    setAmount(prev => Number(prev) + 1);
  };
  
  const decrementAmount = () => {
    setAmount(prev => Math.max(1, Number(prev) - 1));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call Stripe or another payment processor
      // Simulating a payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Thank you for your love gift! You now have access to the full track.');
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send a Love Gift</DialogTitle>
          <DialogDescription>
            Support the artist and unlock the full track and exclusive content
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Amount</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-1">$</span>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-24 text-center text-2xl font-bold pl-2 pr-8"
                    />
                    <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0" 
                        onClick={incrementAmount}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 p-0" 
                        onClick={decrementAmount}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-2">
              {SUGGESTED_AMOUNTS.map(suggestedAmount => (
                <Button
                  key={suggestedAmount}
                  type="button"
                  variant={Number(amount) === suggestedAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectAmount(suggestedAmount)}
                >
                  ${suggestedAmount}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Required for Download)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message to Artist (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what this music means to you..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !email}
              className="gap-2"
            >
              <Heart className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Send Love Gift'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoveGiftModal;
