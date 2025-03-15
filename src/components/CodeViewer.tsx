
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeViewerProps {
  code: string;
  diff?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, diff }) => {
  const [activeTab, setActiveTab] = useState<string>("raw");

  return (
    <div className="flex flex-col h-full glass-card rounded-lg overflow-hidden">
      <div className="p-2 border-b border-border">
        <Tabs defaultValue="raw" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="diff" disabled={!diff}>Diff</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1">
        <TabsContent value="raw" className="p-4 m-0 h-full">
          <pre className="text-sm font-mono whitespace-pre-wrap">{code}</pre>
        </TabsContent>
        
        <TabsContent value="diff" className="p-4 m-0 h-full">
          {diff ? (
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {diff.split('\n').map((line, index) => {
                if (line.startsWith('+')) {
                  return <div key={index} className="bg-green-500/20 text-green-700 dark:text-green-400">{line}</div>;
                } else if (line.startsWith('-')) {
                  return <div key={index} className="bg-red-500/20 text-red-700 dark:text-red-400">{line}</div>;
                } else if (line.startsWith('@')) {
                  return <div key={index} className="bg-blue-500/20 text-blue-700 dark:text-blue-400">{line}</div>;
                }
                return <div key={index}>{line}</div>;
              })}
            </pre>
          ) : (
            <div className="text-muted-foreground italic">No diff available</div>
          )}
        </TabsContent>
      </ScrollArea>
    </div>
  );
};

export default CodeViewer;
