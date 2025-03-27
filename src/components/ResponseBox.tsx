
import React from 'react';
import { useProcesses } from './ProcessProvider';

export const ResponseBox: React.FC = () => {
  const { chatHistory } = useProcesses();
  
  if (chatHistory.length === 0) return null;
  
  return (
    <div className="space-y-4 animate-fade-up">
      <h2 className="text-xl font-medium">AI Response</h2>
      
      {chatHistory.map((response, index) => (
        <div 
          key={index} 
          className="glass-card p-5 border-l-4 border-l-primary animate-fade-in" 
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <pre className="whitespace-pre-wrap leading-relaxed text-foreground">{response}</pre>
        </div>
      ))}
    </div>
  );
};
