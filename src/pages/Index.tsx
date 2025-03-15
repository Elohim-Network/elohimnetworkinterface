
import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import CodeViewer from '@/components/CodeViewer';

const Index = () => {
  const [viewMode, setViewMode] = useState<'chat' | 'split'>('split');
  const [codeData, setCodeData] = useState({
    code: '// Your code will appear here',
    diff: '+ Added line\n- Removed line\n@@ Line info @@\n Unchanged line'
  });

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'chat' ? 'split' : 'chat');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-full flex">
        <div className={viewMode === 'chat' ? 'w-full' : 'w-1/2 border-r border-border'}>
          <ChatInterface />
        </div>
        
        {viewMode === 'split' && (
          <div className="w-1/2 p-4">
            <CodeViewer code={codeData.code} diff={codeData.diff} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
