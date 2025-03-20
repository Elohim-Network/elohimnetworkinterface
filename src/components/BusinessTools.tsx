
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadsManagement from './LeadsManagement';
import WebScraper from './WebScraper';
import EmailCampaign from './EmailCampaign';
import CalendarTasks from './CalendarTasks';
import Integrations from './Integrations';

const BusinessTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b py-2 px-4">
        <h1 className="text-xl font-bold">Elohim Business Tools</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-4 py-2 border-b w-full justify-start">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="scraper">Web Scraper</TabsTrigger>
          <TabsTrigger value="email">Email Campaign</TabsTrigger>
          <TabsTrigger value="calendar">Calendar & Tasks</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default BusinessTools;
