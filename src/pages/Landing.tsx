
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Bot, BarChart, CheckCheck, Gift, Mic, Rocket, Shield, Sparkles, Star, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ElohimIntroduction from '@/components/ElohimIntroduction';

const Landing = () => {
  const navigate = useNavigate();
  const [showIntroduction, setShowIntroduction] = useState(false);
  
  useEffect(() => {
    // Show introduction on first visit to landing page
    const hasSeenLandingIntro = localStorage.getItem('elohim-landing-intro-seen');
    if (!hasSeenLandingIntro) {
      setTimeout(() => setShowIntroduction(true), 1500);
    }
  }, []);
  
  const handleIntroductionComplete = () => {
    setShowIntroduction(false);
    localStorage.setItem('elohim-landing-intro-seen', 'true');
  };
  
  const handleIntroductionSkip = () => {
    setShowIntroduction(false);
    localStorage.setItem('elohim-landing-intro-seen', 'true');
  };

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleViewModules = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-900">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Elohim Network</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="animate-fade-in max-w-4xl">
          <div className="mb-6 inline-block px-6 py-2 bg-primary/10 rounded-full text-primary font-semibold">
            <Gift className="inline mr-2 h-5 w-5" /> Free Base Agent + Premium Modules
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Meet Agent Elohim
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-muted-foreground">
            Start <span className="font-bold text-primary">100% free</span>, then scale with premium modules
          </p>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Your AI business companion that grows with you. Get the base agent free, then upgrade with plug-and-play modules that deliver revenue-generating superpowers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="group text-lg px-8 py-6 rounded-full animate-hover shadow-lg"
            >
              Get Your Free Agent <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={handleViewModules} 
              size="lg" 
              variant="outline"
              className="group text-lg px-8 py-6 rounded-full"
            >
              Explore Premium Modules
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section - NEW */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto bg-card rounded-lg p-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start Free</h3>
              <p className="text-muted-foreground">
                Get your powerful base agent at zero cost. No credit card required.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upgrade Anytime</h3>
              <p className="text-muted-foreground">
                Add powerful modules as you need them. Pay only for what you use.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Generate Revenue</h3>
              <p className="text-muted-foreground">
                Turn your free agent into a revenue-generating digital business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Free Base Agent + Premium Superpowers</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Start with a powerful free base agent, then supercharge with plug-and-play premium modules
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Bot className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Free AI Core</h3>
              <p className="text-muted-foreground">
                Your base agent comes with the Mistral 7B model, ready to automate tasks and chat with clients.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Rocket className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium Modules</h3>
              <p className="text-muted-foreground">
                Scale your business with revenue-generating modules that integrate seamlessly with your base agent.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Shield className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Expandable System</h3>
              <p className="text-muted-foreground">
                Your agent grows with your business. Add new capabilities as you need them, without rebuilding.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Module Showcase - NEW */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Premium Modules Marketplace</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expand your agent's capabilities with these powerful plug-and-play modules
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Module Preview Cards - Just display 3 popular ones */}
          <ModulePreviewCard 
            title="Business Intelligence"
            description="Advanced analytics and reporting for your business metrics"
            price={29.99}
            icon={<BarChart className="h-10 w-10 text-primary" />}
          />
          
          <ModulePreviewCard 
            title="AI Podcasting"
            description="Create professional podcasts with AI voices and content generation"
            price={39.99}
            icon={<Mic className="h-10 w-10 text-primary" />}
            isNew={true}
          />
          
          <ModulePreviewCard 
            title="Lead Generator"
            description="Automatically generate and qualify leads for your business"
            price={24.99}
            icon={<Users className="h-10 w-10 text-primary" />}
            isPopular={true}
          />
        </div>
        
        <div className="text-center mt-12">
          <Button onClick={handleViewModules} size="lg" className="px-8">
            View All Modules <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <h2 className="text-4xl font-bold text-center mb-4">Start Free, Scale with Modules</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Get your base agent at no cost, then add premium modules to grow your digital business.
        </p>
        
        <Tabs defaultValue="monthly" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card hover-scale">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Base Agent</h3>
                  <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium">Free Forever</span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Core AI agent features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic chat capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Simple automation tasks</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale relative overflow-hidden">
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 rotate-12 z-10">
                Most Popular
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Premium Bundle</h3>
                  <Star className="text-yellow-400 h-6 w-6" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$97</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Everything in Base Agent</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 Premium Modules Included</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced AI capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="secondary" onClick={handleViewModules}>
                  <Zap className="mr-2 h-4 w-4" /> Upgrade Your Agent
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card hover-scale">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Base Agent</h3>
                  <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-medium">Free Forever</span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Core AI agent features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic chat capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Simple automation tasks</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale relative overflow-hidden">
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 rotate-12 z-10">
                Best Value
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Premium Bundle</h3>
                  <Star className="text-yellow-400 h-6 w-6" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$77</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Everything in Base Agent</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 Premium Modules Included</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced AI capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support + 2 months free</span>
                  </li>
                </ul>
                <Button className="w-full" variant="secondary" onClick={handleViewModules}>
                  <Zap className="mr-2 h-4 w-4" /> Upgrade Your Agent
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-slate-900 to-background">
        <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="italic">"I started with the free agent and added just one premium module. Now my digital business is generating $3,400/month on autopilot!"</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">Digital Entrepreneur</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="italic">"Started with the free agent last month. Added two premium modules and already seeing ROI. Best business decision I've made this year."</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Marketing Agency Owner</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="italic">"The free agent alone was impressive, but adding the premium modules took my business to a whole new level. Now I have a team of 5!"</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">MT</span>
                  </div>
                  <div>
                    <p className="font-semibold">Michael Thompson</p>
                    <p className="text-sm text-muted-foreground">eCommerce Specialist</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Limited Time Offer</span>
          <h2 className="text-4xl font-bold mb-6">Get Your Free AI Agent Today</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of entrepreneurs who started with a free agent and built profitable digital businesses with premium modules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Claim Your Free Agent
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={handleViewModules}>
              Explore Premium Modules
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Elohim Network</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Elohim Network. All rights reserved.
          </div>
        </div>
      </footer>

      {showIntroduction && (
        <ElohimIntroduction 
          onComplete={handleIntroductionComplete}
          onSkip={handleIntroductionSkip}
        />
      )}
    </div>
  );
};

// Module Preview Card Component for the new section
const ModulePreviewCard = ({ 
  title, 
  description, 
  price, 
  icon, 
  isNew = false, 
  isPopular = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div className="flex flex-col items-end">
            {isNew && (
              <Badge className="bg-green-500 mb-2">New</Badge>
            )}
            {isPopular && (
              <Badge className="bg-amber-500 mb-2">Popular</Badge>
            )}
            <Badge variant="outline" className="text-lg font-semibold">${price}</Badge>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default Landing;
