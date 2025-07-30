import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Image, 
  Download, 
  Wand2, 
  Settings, 
  Palette,
  Sparkles,
  Eye,
  Share
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  style: string;
  timestamp: Date;
}

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [dimensions, setDimensions] = useState('1024x1024');
  const [steps, setSteps] = useState([20]);
  const [cfgScale, setCfgScale] = useState([7]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const styles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'anime', label: 'Anime' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'photographic', label: 'Photographic' }
  ];

  const dimensionOptions = [
    '512x512', '768x768', '1024x1024', '1024x768', '768x1024'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate image generation with a placeholder
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a placeholder image URL (in real implementation, this would be from Stable Diffusion)
      const placeholderUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        url: placeholderUrl,
        style,
        timestamp: new Date()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      toast.success('Image generated successfully!');
      setPrompt('');
    } catch (error) {
      toast.error('Failed to generate image. Please check your Stable Diffusion connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${image.id}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Create stunning images using AI-powered Stable Diffusion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Image Prompt</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Dimensions</label>
              <Select value={dimensions} onValueChange={setDimensions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensionOptions.map(dim => (
                    <SelectItem key={dim} value={dim}>
                      {dim}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Steps: {steps[0]}</label>
              <Slider
                value={steps}
                onValueChange={setSteps}
                max={50}
                min={10}
                step={1}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">CFG Scale: {cfgScale[0]}</label>
            <Slider
              value={cfgScale}
              onValueChange={setCfgScale}
              max={20}
              min={1}
              step={0.5}
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={generateImage} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
            <CardDescription>
              Your AI-generated image gallery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map(image => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.prompt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{image.style}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {image.timestamp.toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadImage(image)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIImageGenerator;