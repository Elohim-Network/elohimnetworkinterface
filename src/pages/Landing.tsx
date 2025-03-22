import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Bot, CheckCheck, Rocket, Shield, Sparkles, Star, Zap } from 'lucide-react';
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Meet Agent Elohim
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-muted-foreground">
            The AI delivering <span className="font-bold text-primary">god-like results</span> for your digital business
          </p>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            First-to-market platform designed to dominate the digital entrepreneurship space. 
            Get your Digital Vending Machine Business in a Box today.
          </p>
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="group text-lg px-8 py-6 rounded-full animate-hover shadow-lg"
          >
            Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Transform Your Business</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Bot className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Harness the power of Mistral 7B model to automate your business processes and chat with clients.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Rocket className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium Modules</h3>
              <p className="text-muted-foreground">
                Scale your business with modular features, each designed to drive revenue and enhance user experience.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-scale">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <Shield className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Open Source Core</h3>
              <p className="text-muted-foreground">
                Built on reliable, cutting-edge open source tools with optional premium integrations like 11 Labs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <h2 className="text-4xl font-bold text-center mb-4">Pricing Plans</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          From startup to enterprise, we have plans to scale with your business.
          Move from a $100,000-level website to $1 million company status.
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
                  <h3 className="text-2xl font-bold">Startup</h3>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">Popular</span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$97</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>All core features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>AI Chat Assistant</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic integrations</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale relative overflow-hidden">
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 rotate-12 z-10">
                Best Value
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <Star className="text-yellow-400 h-6 w-6" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$297</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>All Startup features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>11 Labs voice integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced business modules</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>White-label options</span>
                  </li>
                </ul>
                <Button className="w-full" variant="secondary">
                  <Zap className="mr-2 h-4 w-4" /> Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="yearly" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card hover-scale">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Startup</h3>
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">Popular</span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$77</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>All core features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>AI Chat Assistant</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic integrations</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-scale relative overflow-hidden">
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 rotate-12 z-10">
                Best Value
              </div>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <Star className="text-yellow-400 h-6 w-6" />
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$237</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>All Startup features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>11 Labs voice integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced business modules</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>White-label options</span>
                  </li>
                </ul>
                <Button className="w-full" variant="secondary">
                  <Zap className="mr-2 h-4 w-4" /> Upgrade Now
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
                <p className="italic">"The Digital Vending Machine revolutionized my online business. Revenue up 340% in just 2 months!"</p>
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
                <p className="italic">"Agent Elohim feels like having a business partner who never sleeps. Best investment of the year."</p>
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
                <p className="italic">"From struggling solopreneur to managing a team of 5 in just 6 months. The modules pay for themselves."</p>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join thousands of entrepreneurs who are leveraging Agent Elohim to create digital vending machines that work 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
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

export default Landing;
