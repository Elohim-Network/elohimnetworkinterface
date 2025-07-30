
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Eye, Code, Copy, FileText, CheckCircle } from 'lucide-react';

interface JukeboxSalesPageProps {
  isWhiteLabeled: boolean;
}

const JukeboxSalesPage: React.FC<JukeboxSalesPageProps> = ({ isWhiteLabeled }) => {
  const [salesPageData, setSalesPageData] = useState({
    headline: 'Jukebox Hero: Amplify Your Music Ministry Through Social Media',
    subheading: 'Automated content creation and AI-powered social deployment for Kingdom artists',
    description: 'Take your worship music to new heights with state-of-the-art AI tools designed specifically for ministry-focused artists. Automatically create viral content, deploy to multiple platforms, and track your reach—all within one powerful tool.',
    bulletPoints: [
      'AI-powered viral clip detection finds your most impactful moments',
      'Automatic vertical video creation with captions and custom CTAs',
      'Multi-platform publishing to TikTok, Instagram, YouTube and more',
      'Built-in donation system to monetize your ministry',
      'Complete analytics dashboard to track your impact',
    ],
    ctaText: 'Add to Your Elohim Agent',
    ctaSecondaryText: 'Learn More',
    price: '39.99',
    testimonial: 'Jukebox Hero has completely transformed how I share my worship music online. What used to take hours now happens automatically, and my ministry reach has grown exponentially!',
    testimonialAuthor: 'David W., Worship Leader'
  });

  const [activeTab, setActiveTab] = useState('edit');
  const [customFunnelLink, setCustomFunnelLink] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  
  const handleInputChange = (field: string, value: string) => {
    setSalesPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...salesPageData.bulletPoints];
    newBullets[index] = value;
    setSalesPageData(prev => ({
      ...prev,
      bulletPoints: newBullets
    }));
  };
  
  const handleSave = () => {
    toast.success('Sales page content saved successfully!');
  };
  
  const handleGenerateEmbedCode = () => {
    const code = `<iframe src="${window.location.origin}/embed/jukebox-hero" width="100%" height="600" frameborder="0"></iframe>`;
    setEmbedCode(code);
    toast.success('Embed code generated!');
  };
  
  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };
  
  const handleGenerateFunnelLink = () => {
    const link = `${window.location.origin}/funnel/jukebox-hero/${Date.now()}`;
    setCustomFunnelLink(link);
    toast.success('Custom funnel link generated!');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sales & Marketing</h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab('preview')}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="embed">Embed & Share</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Page Content</CardTitle>
              <CardDescription>
                Edit the content of your Jukebox Hero sales page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input 
                  id="headline"
                  value={salesPageData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subheading">Subheading</Label>
                <Input 
                  id="subheading"
                  value={salesPageData.subheading}
                  onChange={(e) => handleInputChange('subheading', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={salesPageData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {salesPageData.bulletPoints.map((bullet, index) => (
                  <Input 
                    key={index}
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    className="mb-2"
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-text">Primary CTA Text</Label>
                  <Input 
                    id="cta-text"
                    value={salesPageData.ctaText}
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cta-secondary">Secondary CTA Text</Label>
                  <Input 
                    id="cta-secondary"
                    value={salesPageData.ctaSecondaryText}
                    onChange={(e) => handleInputChange('ctaSecondaryText', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input 
                  id="price"
                  value={salesPageData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testimonial">Featured Testimonial</Label>
                <Textarea 
                  id="testimonial"
                  value={salesPageData.testimonial}
                  onChange={(e) => handleInputChange('testimonial', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testimonial-author">Testimonial Author</Label>
                <Input 
                  id="testimonial-author"
                  value={salesPageData.testimonialAuthor}
                  onChange={(e) => handleInputChange('testimonialAuthor', e.target.value)}
                />
              </div>
              
              {isWhiteLabeled && (
                <div className="border-t pt-4 mt-6">
                  <div className="text-sm text-yellow-500 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>White label mode is active. Elohim branding will be hidden.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="w-full h-64 bg-gradient-to-r from-purple-700 to-blue-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h1 className="text-3xl font-bold mb-2">{salesPageData.headline}</h1>
                  <p className="text-xl">{salesPageData.subheading}</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  <p className="text-lg mb-6">{salesPageData.description}</p>
                  
                  <div className="bg-muted p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-semibold mb-4">Features:</h3>
                    <ul className="space-y-2">
                      {salesPageData.bulletPoints.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/40 p-6 rounded-lg border mb-8">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">${salesPageData.price}</div>
                      <div className="text-sm">One-time payment</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-10">
                    <Button size="lg" className="flex-1">
                      {salesPageData.ctaText}
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      {salesPageData.ctaSecondaryText}
                    </Button>
                  </div>
                  
                  <div className="border-t pt-8">
                    <div className="italic text-muted-foreground mb-2">"{salesPageData.testimonial}"</div>
                    <div className="font-medium">— {salesPageData.testimonialAuthor}</div>
                  </div>
                  
                  {!isWhiteLabeled && (
                    <div className="text-center mt-12 text-sm text-muted-foreground">
                      Powered by Elohim Network
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Embed & Share</CardTitle>
              <CardDescription>
                Share your Jukebox Hero sales page with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base mb-2 block">Generate Custom Funnel Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={customFunnelLink} 
                    readOnly
                    placeholder="Click 'Generate' to create a custom funnel link"
                  />
                  <Button onClick={handleGenerateFunnelLink} className="shrink-0">
                    <FileText className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                {customFunnelLink && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Share this link on your social media or website. Traffic will be tracked in your analytics.
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-base mb-2 block">Embed Code</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={embedCode}
                    rows={3}
                    readOnly
                    placeholder="Click 'Generate Code' to create embed code for your website"
                  />
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleGenerateEmbedCode}>
                    <Code className="h-4 w-4 mr-1" />
                    Generate Code
                  </Button>
                  
                  {embedCode && (
                    <Button variant="outline" onClick={handleCopyEmbedCode}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                
                {embedCode && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Add this code to your website to embed the Jukebox Hero sales page.
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Integration Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium">WordPress</div>
                    <p className="text-sm text-muted-foreground">
                      Embed on your WordPress site
                    </p>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium">ClickFunnels</div>
                    <p className="text-sm text-muted-foreground">
                      Add to your sales funnel
                    </p>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium">Email Campaigns</div>
                    <p className="text-sm text-muted-foreground">
                      Share in newsletters
                    </p>
                  </Card>
                </div>
              </div>
              
              {isWhiteLabeled && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm text-yellow-500 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>White label mode is active. Elohim branding will be hidden in all shared content.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JukeboxSalesPage;
