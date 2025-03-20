
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { scrapeUrl, bulkScrape } from '@/utils/webScraper';

interface ScrapedContact {
  emails: Array<{
    email: string;
    source: string;
    foundAt: string;
  }>;
  phones: string[];
  url: string;
  title: string;
  description: string;
}

const WebScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedResults, setScrapedResults] = useState<ScrapedContact[]>([]);
  
  const handleSingleScrape = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to scrape');
      return;
    }
    
    setIsLoading(true);
    setProgress(25);
    
    try {
      const result = await scrapeUrl(url);
      setProgress(100);
      
      if (result) {
        toast.success('Scraping complete');
        setScrapedResults([result]);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBulkScrape = async () => {
    if (!bulkUrls.trim()) {
      toast.error('Please enter URLs to scrape');
      return;
    }
    
    const urls = bulkUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);
    
    if (urls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }
    
    setIsLoading(true);
    setProgress(5);
    toast.info(`Starting to scrape ${urls.length} URLs`);
    
    try {
      const results = await bulkScrape(urls);
      setProgress(100);
      
      if (results.length > 0) {
        toast.success(`Scraping complete. Found ${results.length} results`);
        setScrapedResults(results);
      } else {
        toast.warning('Scraping complete, but no valid data was found');
      }
    } catch (error) {
      console.error('Bulk scraping error:', error);
      toast.error(`Bulk scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportToCSV = () => {
    if (scrapedResults.length === 0) {
      toast.error('No results to export');
      return;
    }
    
    // Flatten all emails from all results
    const allEmails = scrapedResults.flatMap(result => 
      result.emails.map(e => ({
        email: e.email,
        source: e.source,
        foundAt: e.foundAt,
        title: result.title,
        phones: result.phones.join(', ')
      }))
    );
    
    // Create CSV content
    let csvContent = 'Email,Source,Found At,Page Title,Phones\n';
    csvContent += allEmails.map(item => 
      `"${item.email}","${item.source}","${item.foundAt}","${item.title.replace(/"/g, '""')}","${item.phones}"`
    ).join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scraped_emails_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exported results to CSV');
  };
  
  const saveToLeads = () => {
    if (scrapedResults.length === 0) {
      toast.error('No results to save');
      return;
    }
    
    try {
      // Get existing leads
      const savedLeadsStr = localStorage.getItem('elohim-leads');
      const savedLeads = savedLeadsStr ? JSON.parse(savedLeadsStr) : [];
      
      // Prepare new leads from scraped results
      const newLeads = scrapedResults.flatMap(result => 
        result.emails.map(emailObj => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          name: emailObj.email.split('@')[0].replace(/[._-]/g, ' '),
          email: emailObj.email,
          phone: result.phones[0] || '',
          company: result.title.split(' - ')[1] || result.title.split(' | ')[1] || '',
          source: 'web-scraper',
          notes: `Scraped from ${result.url}\nPage title: ${result.title}\nDescription: ${result.description}`,
          status: 'new',
          createdAt: Date.now()
        }))
      );
      
      // Save combined leads
      localStorage.setItem('elohim-leads', JSON.stringify([...newLeads, ...savedLeads]));
      
      toast.success(`Added ${newLeads.length} new leads to your leads database`);
    } catch (error) {
      console.error('Error saving to leads:', error);
      toast.error('Failed to save to leads database');
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Web Scraper</h2>
      
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Single URL Scraper</h3>
          <div className="flex space-x-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL to scrape (e.g., https://example.com)"
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSingleScrape} disabled={isLoading}>
              {isLoading ? 'Scraping...' : 'Scrape'}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Bulk URL Scraper</h3>
          <Textarea
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder="Enter multiple URLs to scrape (one per line)"
            rows={5}
            className="mb-2"
            disabled={isLoading}
          />
          <Button onClick={handleBulkScrape} disabled={isLoading} className="w-full">
            {isLoading ? 'Bulk Scraping...' : 'Bulk Scrape'}
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="mb-6">
          <p className="text-sm mb-1">Scraping in progress...</p>
          <Progress value={progress} className="w-full" />
        </div>
      )}
      
      {scrapedResults.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Results</h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToCSV}>
                Export to CSV
              </Button>
              <Button onClick={saveToLeads}>
                Save to Leads
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scrapedResults.flatMap((result, index) => 
                  result.emails.map((email, emailIndex) => (
                    <tr key={`${index}-${emailIndex}`}>
                      <td className="px-6 py-4 whitespace-nowrap">{email.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {result.title || result.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.phones.length > 0 ? result.phones[0] : 'None found'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
        <h4 className="font-medium mb-2">Important Notice:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>This web scraper has limitations due to browser CORS policies. Many websites will block scraping attempts.</li>
          <li>For more effective scraping, consider implementing a server-side solution or using specialized services.</li>
          <li>Always respect website terms of service and robots.txt files when scraping.</li>
          <li>Consider using the ChatGPT API or OpenAI API to extract leads from search engines instead.</li>
        </ul>
      </div>
    </div>
  );
};

export default WebScraper;
