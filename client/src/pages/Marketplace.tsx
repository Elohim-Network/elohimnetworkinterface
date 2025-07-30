
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ShoppingCart, Star, Filter, Plus, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Module interface
interface Module {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'business' | 'personal' | 'creative' | 'productivity';
  featuredImage: string;
  rating: number;
  sales: number;
  isInstalled: boolean;
  isNew: boolean;
}

// Mock modules data - would be fetched from API in production
const MOCK_MODULES: Module[] = [
  {
    id: '1',
    name: 'Business Intelligence Analyzer',
    description: 'Advanced data analysis for business metrics and KPI tracking. Automatically generates reports and identifies trends.',
    price: 29.99,
    category: 'business',
    featuredImage: '/placeholder.svg',
    rating: 4.7,
    sales: 234,
    isInstalled: false,
    isNew: false
  },
  {
    id: '2',
    name: 'Personal Finance Manager',
    description: 'Track your expenses, investments, and financial goals with AI-powered insights and recommendations.',
    price: 19.99,
    category: 'personal',
    featuredImage: '/placeholder.svg',
    rating: 4.8,
    sales: 345,
    isInstalled: true,
    isNew: false
  },
  {
    id: '3',
    name: 'Creative Content Generator',
    description: 'Generate unique content ideas, marketing copy, social media posts, and more with advanced AI assistance.',
    price: 24.99,
    category: 'creative',
    featuredImage: '/placeholder.svg',
    rating: 4.5,
    sales: 189,
    isInstalled: false,
    isNew: true
  },
  {
    id: '4',
    name: 'Task Automation Suite',
    description: 'Automate repetitive tasks, schedule appointments, and manage your workflow with smart AI capabilities.',
    price: 34.99,
    category: 'productivity',
    featuredImage: '/placeholder.svg',
    rating: 4.9,
    sales: 412,
    isInstalled: false,
    isNew: false
  },
  {
    id: '5',
    name: 'Market Research Assistant',
    description: 'Collect, analyze, and visualize market data to identify opportunities and track competitors.',
    price: 39.99,
    category: 'business',
    featuredImage: '/placeholder.svg',
    rating: 4.6,
    sales: 156,
    isInstalled: false,
    isNew: true
  }
];

const Marketplace: React.FC = () => {
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);
  const [cart, setCart] = useState<Module[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [purchaseHistory, setPurchaseHistory] = useState<{moduleId: string, date: Date, price: number}[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Filter modules based on active tab
  const filteredModules = activeTab === 'all' 
    ? modules 
    : modules.filter(module => module.category === activeTab);
  
  const handleAddToCart = (moduleId: string) => {
    const moduleToAdd = modules.find(m => m.id === moduleId);
    if (moduleToAdd) {
      setCart(prev => [...prev, moduleToAdd]);
      toast.success(`${moduleToAdd.name} added to cart`);
    }
  };
  
  const handleInstall = (moduleId: string) => {
    setModules(prev => 
      prev.map(mod => 
        mod.id === moduleId ? {...mod, isInstalled: true} : mod
      )
    );
    
    const purchasedModule = modules.find(m => m.id === moduleId);
    if (purchasedModule) {
      setPurchaseHistory(prev => [
        ...prev, 
        {
          moduleId: purchasedModule.id,
          date: new Date(),
          price: purchasedModule.price
        }
      ]);
      
      // Update module sales count
      setModules(prev => 
        prev.map(mod => 
          mod.id === moduleId ? {...mod, sales: mod.sales + 1} : mod
        )
      );
      
      toast.success(`${purchasedModule.name} has been installed`);
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-auto">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/app" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Agent Elohim</span>
          </Link>
          
          <h1 className="text-2xl font-bold">Elohim Network Marketplace</h1>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              onClick={() => toast.info("Shopping cart coming soon!")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>Cart</span>
              {cart.length > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 px-1">
                  {cart.length}
                </Badge>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              Admin Panel
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Modules</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => (
                <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={module.featuredImage} 
                      alt={module.name} 
                      className="w-full h-full object-cover"
                    />
                    {module.isNew && (
                      <Badge className="absolute top-2 right-2 bg-green-500">New</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{module.name}</CardTitle>
                      <Badge variant="outline">${module.price}</Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{module.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{module.sales} sales</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline">{module.category}</Badge>
                    {module.isInstalled ? (
                      <Button variant="secondary" disabled>Installed</Button>
                    ) : (
                      <Button onClick={() => handleInstall(module.id)}>Purchase & Install</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {showAdminPanel && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage modules and track sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules">
                <TabsList className="mb-4">
                  <TabsTrigger value="modules">Manage Modules</TabsTrigger>
                  <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules">
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => toast.info("Module creation form coming soon!")}>
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Add New Module</span>
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.name}</TableCell>
                          <TableCell>{module.category}</TableCell>
                          <TableCell>${module.price}</TableCell>
                          <TableCell>{module.sales}</TableCell>
                          <TableCell>${(module.sales * module.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => toast.info(`Edit ${module.name}`)}>
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => toast.info(`Delete ${module.name}`)}>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="sales">
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Revenue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${modules.reduce((total, mod) => total + (mod.sales * mod.price), 0).toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +{(Math.random() * 10).toFixed(2)}% from last month
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Sales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {modules.reduce((total, mod) => total + mod.sales, 0)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +{(Math.random() * 15).toFixed(2)}% from last month
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Active Modules
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {modules.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +{(Math.random() * 5).toFixed(0)} from last month
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="flex items-center justify-center gap-4 flex-col">
                          <BarChart className="h-16 w-16 text-muted-foreground" />
                          <p className="text-muted-foreground">Sales charts coming soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
