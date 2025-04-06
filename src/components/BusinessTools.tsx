
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeadsManagement from './LeadsManagement';
import WebScraper from './WebScraper';
import EmailCampaign from './EmailCampaign';
import CalendarTasks from './CalendarTasks';
import Integrations from './Integrations';
import AIPodcasting from './AIPodcasting';

const BusinessTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b py-2 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Elohim Business Tools</h1>
        <Link to="/marketplace">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Module Marketplace</span>
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-4 py-2 border-b w-full justify-start">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="scraper">Web Scraper</TabsTrigger>
          <TabsTrigger value="email">Email Campaign</TabsTrigger>
          <TabsTrigger value="calendar">Calendar & Tasks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="podcasting">AI Podcasting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads" className="flex-1 overflow-auto">
          <LeadsManagement />
        </TabsContent>
        
        <TabsContent value="scraper" className="flex-1 overflow-auto">
          <WebScraper />
        </TabsContent>
        
        <TabsContent value="email" className="flex-1 overflow-auto">
          <EmailCampaign />
        </TabsContent>
        
        <TabsContent value="calendar" className="flex-1 overflow-auto">
          <CalendarTasks />
        </TabsContent>
        
        <TabsContent value="integrations" className="flex-1 overflow-auto">
          <Integrations />
        </TabsContent>
        
        <TabsContent value="podcasting" className="flex-1 overflow-auto">
          <AIPodcasting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessTools;
