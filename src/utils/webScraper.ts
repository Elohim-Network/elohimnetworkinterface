
/**
 * Basic web scraping utility that uses the browser's fetch API.
 * Note: This has limitations due to CORS and will only work for 
 * websites that allow cross-origin requests.
 * 
 * For production use, you should implement server-side scraping or use
 * services like Apify, ScrapingBee, or SerpApi (some have free tiers).
 */

import { toast } from 'sonner';

interface ScrapedEmail {
  email: string;
  source: string;
  foundAt: string;
}

interface ScrapedContact {
  emails: ScrapedEmail[];
  phones: string[];
  url: string;
  title: string;
  description: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedContact | null> {
  try {
    // This may fail due to CORS if the website doesn't allow it
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract page title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract meta description
    const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract emails with regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const foundEmails = html.match(emailRegex) || [];
    
    // Extract phones with regex (simple pattern, will miss some formats)
    const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
    const foundPhones = html.match(phoneRegex) || [];
    
    // Format emails with context
    const emails: ScrapedEmail[] = [...new Set(foundEmails)].map(email => ({
      email,
      source: url,
      foundAt: new Date().toISOString()
    }));
    
    // Remove duplicates from phones
    const phones = [...new Set(foundPhones)];
    
    return {
      emails,
      phones,
      url,
      title,
      description
    };
  } catch (error) {
    console.error('Scraping error:', error);
    toast.error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// More realistic approach - use a proxy service
export async function proxyScrapedUrl(url: string): Promise<ScrapedContact | null> {
  // Replace this URL with a real proxy service or your own server endpoint
  const proxyUrl = 'https://your-proxy-service.com/api/scrape';
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetUrl: url }),
    });
    
    if (!response.ok) {
      throw new Error(`Proxy server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Proxy scraping error:', error);
    toast.error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// For bulk URL scraping with rate limiting
export async function bulkScrape(urls: string[], delayMs: number = 1000): Promise<ScrapedContact[]> {
  const results: ScrapedContact[] = [];
  let completedCount = 0;
  
  for (const url of urls) {
    // Add a delay to avoid overwhelming the target server
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const result = await scrapeUrl(url);
    if (result) results.push(result);
    
    completedCount++;
    // Update progress
    const progressPercent = Math.round((completedCount / urls.length) * 100);
    toast.info(`Scraping progress: ${progressPercent}%`, { id: 'scrape-progress' });
  }
  
  return results;
}
