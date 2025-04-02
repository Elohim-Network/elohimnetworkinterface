
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Module } from '@/types/marketplace';
import { ModuleCategory } from '@/types/modules';
import { toast } from 'sonner';

// Mock sales data
const mockSalesData = {
  totalRevenue: 3249.97,
  activeCustomers: 87,
  conversions: 0.032,
  monthlySales: [
    { month: 'Jan', revenue: 345.99 },
    { month: 'Feb', revenue: 489.97 },
    { month: 'Mar', revenue: 678.52 },
    { month: 'Apr', revenue: 842.75 },
    { month: 'May', revenue: 892.74 }
  ]
};

const AdminDashboard = () => {
  const { isAdminUser, isFeatureUnlocked } = useModules();
  const [activeTab, setActiveTab] = useState('overview');
  const [salesData, setSalesData] = useState(mockSalesData);
  const [modules, setModules] = useState<Module[]>([]);
  
  // Redirect to home if not admin
  useEffect(() => {
    if (!isAdminUser()) {
      toast.error("You don't have permission to access the admin dashboard");
      // In a real app, we would redirect
      // window.location.href = '/'; 
    }
    
    // Fetch modules data
    const fetchModules = async () => {
      // This would be an API call in a real app
      const mods: Module[] = [
        {
          id: 'voice-module',
          name: 'Advanced Voice Controls',
          description: 'Premium voice settings with ElevenLabs integration',
          price: 9.99,
          category: 'productivity',
          featuredImage: '/placeholder.svg',
          rating: 4.8,
          sales: 128,
          isInstalled: false,
          isNew: false
        },
        {
          id: 'business-tools',
          name: 'Business Tools Suite',
          description: 'Access to all business tools and analytics',
          price: 19.99,
          category: 'business',
          featuredImage: '/placeholder.svg',
          rating: 4.9,
          sales: 256,
          isInstalled: false,
          isNew: false
        },
        {
          id: 'avatar-module',
          name: 'AI Avatar Customization',
          description: 'Customize your AI agent appearance',
          price: 4.99,
          category: 'personal',
          featuredImage: '/placeholder.svg',
          rating: 4.5,
          sales: 87,
          isInstalled: false,
          isNew: false
        },
        {
          id: 'image-generation',
          name: 'Image Generation',
          description: 'Generate images with your AI agent',
          price: 14.99,
          category: 'creative',
          featuredImage: '/placeholder.svg',
          rating: 4.7,
          sales: 103,
          isInstalled: false,
          isNew: true
        }
      ];
      
      setModules(mods);
    };
    
    fetchModules();
  }, [isAdminUser]);
  
  if (!isAdminUser()) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
        <Button asChild className="mt-4">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="default" size="sm">
              <Link to="/app">Return to App</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-3xl">${salesData.totalRevenue.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Customers</CardDescription>
                  <CardTitle className="text-3xl">{salesData.activeCustomers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+7 new this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Conversion Rate</CardDescription>
                  <CardTitle className="text-3xl">{(salesData.conversions * 100).toFixed(1)}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Modules</CardDescription>
                  <CardTitle className="text-3xl">{modules.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">2 new modules this month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue by month for all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-2">
                  {salesData.monthlySales.map((month) => (
                    <div key={month.month} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-primary/80 rounded-t w-full"
                        style={{
                          height: `${(month.revenue / 1000) * 100}%`,
                          maxHeight: '90%',
                          minHeight: '10%'
                        }}
                      />
                      <div className="mt-2 text-xs">{month.month}</div>
                      <div className="text-xs text-muted-foreground">${month.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules" className="space-y-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Modules</h2>
              <Button size="sm">Create New Module</Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle>{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span>Price:</span>
                      <span className="font-semibold">${module.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Sales:</span>
                      <span className="font-semibold">{module.sales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-semibold">
                        ${(module.sales * module.price).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Client Management</h2>
              <Button size="sm">Export Client Data</Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
                <CardDescription>Manage your client accounts and activations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-5 py-2 px-4 font-medium border-b">
                    <div>Client ID</div>
                    <div>Name</div>
                    <div>Status</div>
                    <div>Purchases</div>
                    <div>Actions</div>
                  </div>
                  
                  <div className="py-4 px-4 text-muted-foreground text-center">
                    Client data will appear here when you have active clients
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Connect to a CRM or database to enable client management
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
