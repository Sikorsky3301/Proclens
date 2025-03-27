import React, { useState, useEffect } from 'react';
import { useProcesses } from './ProcessProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const OLLAMA_PORT = "11434";

// Function to check if Ollama is running
const isOllamaRunning = async (): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:${OLLAMA_PORT}/api/tags`, { 
      method: 'GET',
      timeout: 2000 
    });
    return response.status === 200;
  } catch (error) {
    console.error("Ollama connection error:", error);
    return false;
  }
};

// Function to query the Ollama API
const queryOllama = async (query: string, context: string): Promise<string> => {
  const apiUrl = `http://localhost:${OLLAMA_PORT}/api/generate`;
  const payload = {
    model: "phi",
    prompt: context + "\n" + query,
    stream: false,
    options: {
      temperature: 0.7,
      max_tokens: 256
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return data.response || "No response from Ollama.";
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Ollama API error:", error);
    throw error;
  }
};

export const QueryInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const { processes, addToChatHistory } = useProcesses();

  // Function to scroll to the AI interaction section
  const scrollToAI = () => {
    const aiSection = document.getElementById('ai-interaction');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check Ollama availability when component mounts
  useEffect(() => {
    const checkOllama = async () => {
      const available = await isOllamaRunning();
      setOllamaAvailable(available);
    };
    
    checkOllama();
  }, []);

  // Focus on the input field when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToAI();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Build context from processes
      const context = "System processes: " + processes.map(proc => 
        `PID: ${proc.pid}, Name: ${proc.name}, Status: ${proc.status}, CPU KB: ${proc.cpuKb}, Memory KB: ${proc.memoryKb}`
      ).join(", ");
      
      const response = await queryOllama(query, context);
      addToChatHistory(response);
      setQuery('');
      
      // Scroll to response after a short delay
      setTimeout(() => {
        scrollToAI();
      }, 100);
      
    } catch (error) {
      console.error('Error querying AI:', error);
      toast.error('Failed to get a response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 my-6 animate-fade-up">
      <h2 className="text-xl font-medium mb-4">Ask About System Processes</h2>
      
      {ollamaAvailable === false && (
        <div className="mb-4 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-800 dark:text-amber-200 text-sm">
          Ollama is not running. Start Ollama locally to enable AI responses.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to know about these processes?"
          className="glass-input flex-1"
          disabled={isLoading}
          autoFocus
        />
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};
