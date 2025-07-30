import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Image, 
  Mail, 
  MessageSquare, 
  Wand2, 
  Copy, 
  Download,
  Sparkles,
  PenTool,
  Globe,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { runAgentElohim } from '@/services/agentElohimService';

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: Date;
}

const AIContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const contentTypes = [
    { value: 'blog', label: 'Blog Post', icon: FileText },
    { value: 'email', label: 'Email Campaign', icon: Mail },
    { value: 'social', label: 'Social Media', icon: MessageSquare },
    { value: 'product', label: 'Product Description', icon: PenTool },
    { value: 'website', label: 'Website Copy', icon: Globe },
    { value: 'ad', label: 'Advertisement', icon: Users }
  ];

  const tones = ['professional', 'casual', 'friendly', 'authoritative', 'creative', 'humorous'];
  const lengths = ['short', 'medium', 'long'];

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for content generation');
      return;
    }

    setIsGenerating(true);
    try {
      const enhancedPrompt = `Generate ${contentType} content with a ${tone} tone and ${length} length about: ${prompt}. 
      Make it engaging, well-structured, and ready to use.`;
      
      const content = await runAgentElohim(enhancedPrompt);
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType,
        title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
        content,
        timestamp: new Date()
      };

      setGeneratedContent(prev => [newContent, ...prev]);
      toast.success('Content generated successfully!');
      setPrompt('');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const downloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.type}-${content.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Content Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate high-quality content using Agent Elohim's AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Length</label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map(l => (
                    <SelectItem key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Content Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create content about..."
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content History */}
      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Your recent AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map(content => (
                <div key={content.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{content.type}</Badge>
                      <h3 className="font-medium">{content.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(content.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadContent(content)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted rounded p-3 text-sm">
                    <div className="whitespace-pre-wrap">{content.content}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Generated on {content.timestamp.toLocaleString()}
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

export default AIContentGenerator;