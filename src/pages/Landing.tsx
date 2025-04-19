
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Music, BriefcaseBusiness, MessageSquare, ImageIcon, Mic, Bot, ArrowRight, Check } from 'lucide-react';
import AppConfig from '@/config/deployment';

const Landing = () => {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to a backend
    alert(`Thanks for subscribing with ${email}! We'll be in touch soon.`);
    setEmail('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{AppConfig.appName}</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
        </nav>
        <div className="flex gap-4">
          <Link to="/app">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/app">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Unlock the Power of AI for Your <span className="text-primary">Creative</span> and <span className="text-primary">Business</span> Journey
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
          {AppConfig.appDescription} - Empowering creators, businesses, and ministries with cutting-edge AI technology.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/app">
            <Button size="lg" className="gap-2">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline">
              Explore Features
            </Button>
          </a>
        </div>
        
        <div className="mt-16 relative w-full max-w-4xl">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/agent-elohim.png" 
              alt="Agent Elohim Interface" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
            Powered by Mistral AI & Stable Diffusion
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features to Elevate Your Work</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Agent Elohim combines multiple AI capabilities into one seamless experience
          </p>
        </div>
        
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="ai">AI Chat</TabsTrigger>
            <TabsTrigger value="creative">Creative Tools</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Intelligent AI Assistant</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Natural Conversations</span>
                      <p className="text-muted-foreground">Engage in fluid, human-like conversations with our advanced AI model</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Knowledge Integration</span>
                      <p className="text-muted-foreground">Access information from your documents, websites, and databases</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Multi-task Assistant</span>
                      <p className="text-muted-foreground">Get help with writing, research, creative ideation, and problem-solving</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Check className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Local AI Integration</span>
                      <p className="text-muted-foreground">Connect to Mistral, Ollama and other open source models for privacy and customization</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg overflow-hidden shadow-lg p-2">
                <div className="bg-background rounded-md p-4 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                      <p>Hello! I'm Agent Elohim. How can I assist you today with your creative or business needs?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mt-4 justify-end">
                    <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none">
                      <p>Can you help me create a social media campaign for my new music release?</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm">You</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mt-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                      <p>I'd be happy to help with your social media campaign! Let's create a comprehensive strategy:</p>
                      <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Pre-release teasers with audio snippets</li>
                        <li>Behind-the-scenes content showcasing your creative process</li>
                        <li>Countdown graphics to build anticipation</li>
                        <li>Platform-specific content optimized for each network</li>
                      </ol>
                      <p className="mt-2">Would you like me to generate sample content for any of these elements?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="creative" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Creative Content Generation</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <ImageIcon className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Image Generation</span>
                      <p className="text-muted-foreground">Create stunning visuals with Stable Diffusion integration</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Music className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Music Promotion</span>
                      <p className="text-muted-foreground">Analyze, market, and distribute your music content effectively</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MessageSquare className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Content Writing</span>
                      <p className="text-muted-foreground">Generate blog posts, social media content, and marketing copy</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Generated Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Generated Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Generated Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Generated Image" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Business Productivity</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <BriefcaseBusiness className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Lead Management</span>
                      <p className="text-muted-foreground">Organize and nurture your business leads effectively</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MessageSquare className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Email Campaigns</span>
                      <p className="text-muted-foreground">Create and manage professional email marketing campaigns</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <BrainCircuit className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">AI-Powered Research</span>
                      <p className="text-muted-foreground">Extract insights from web content and documents automatically</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg shadow-lg p-6">
                <h4 className="font-medium text-lg mb-3">Lead Management Dashboard</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-background rounded-md">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">Interested in music promotion</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Hot Lead</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-md">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Requested podcast consultation</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs">New</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background rounded-md">
                    <div>
                      <p className="font-medium">Community Church</p>
                      <p className="text-sm text-muted-foreground">Social media management</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs">Follow Up</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Voice Technologies</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Mic className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Speech Recognition</span>
                      <p className="text-muted-foreground">Talk to Agent Elohim naturally with advanced voice recognition</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Music className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Custom Voice Cloning</span>
                      <p className="text-muted-foreground">Create a digital version of your voice for content creation</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MessageSquare className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Audio Transcription</span>
                      <p className="text-muted-foreground">Convert voice recordings to text with high accuracy</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-lg overflow-hidden shadow-lg p-6">
                <div className="bg-background rounded-md p-4 flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center mb-4">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <div className="h-8 w-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-1 w-full bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-2/3" />
                      </div>
                    </div>
                  </div>
                  <p className="text-center mt-4 text-muted-foreground">
                    "Agent Elohim can understand your voice commands and respond with natural-sounding speech using ElevenLabs integration."
                  </p>
                  <div className="mt-4 space-x-2">
                    <Button size="sm" variant="outline">
                      <Mic className="h-4 w-4 mr-2" />
                      Record
                    </Button>
                    <Button size="sm" variant="secondary">
                      Clone Voice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-24 bg-muted/30 rounded-lg">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you or your organization
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">Perfect for individual creators and small ministries</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited AI chat conversations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>50 image generations per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>1 custom voice clone</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic music promotion tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Free Trial</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">For creators and businesses with growing needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited AI chat conversations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>200 image generations per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>3 custom voice clones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced Jukebox Hero features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Business tools suite</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Free Trial</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <CardDescription className="mt-2">For organizations with advanced AI needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited image generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>10 custom voice clones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Full Jukebox Hero platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Complete business suite</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Custom integrations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Stay Updated with Agent Elohim</h2>
          <p className="mt-4 text-muted-foreground">
            Subscribe to our newsletter to receive product updates, AI news, and creative tips
          </p>
          <form onSubmit={handleSubscribe} className="mt-8 flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">{AppConfig.appName}</span>
              </div>
              <p className="text-muted-foreground">
                Empowering creators and businesses with cutting-edge AI technology.
              </p>
              <div className="flex gap-4 mt-4">
                <a href={AppConfig.social.twitter} className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href={AppConfig.social.facebook} className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href={AppConfig.social.instagram} className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href={AppConfig.social.youtube} className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">AI Chat</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Image Generation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Voice Technology</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Jukebox Hero</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Business Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Tutorials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Community Forum</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href={`mailto:${AppConfig.social.supportEmail}`} className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} {AppConfig.appName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
