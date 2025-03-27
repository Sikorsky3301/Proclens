import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface Process {
  pid: number;
  name: string;
  status: string;
  cpuKb: number;
  memoryKb: number;
  user: string;
  startTime: string;
  threads: number;
  priority: number;
}

interface SystemResources {
  totalCpuUsage: number;
  totalMemoryUsage: number;
  totalMemory: number;
  diskUsage: number;
  totalDisk: number;
  networkUsage: number;
}

interface ProcessContextType {
  processes: Process[];
  systemResources: SystemResources;
  loading: boolean;
  error: string | null;
  refreshProcesses: () => void;
  chatHistory: string[];
  addToChatHistory: (response: string) => void;
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export const useProcesses = () => {
  const context = useContext(ProcessContext);
  if (!context) {
    throw new Error('useProcesses must be used within a ProcessProvider');
  }
  return context;
};




// IMPORTANT /////////////////////////////////////////////////////////////////////
// API URL for fetching system data
const API_BASE_URL = 'http://localhost:3002';

// Fetch real process data from the backend API
const fetchProcesses = async (): Promise<Process[]> => {
  try {
    // Try to fetch real data from backend
    const response = await fetch(`${API_BASE_URL}/processes`, { timeout: 5000 });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.log('Server responded with error, falling back to mock data');
      return generateMockProcesses();
    }
  } catch (error) {
    console.log('Error fetching real process data:', error);
    console.log('Falling back to mock data');
    // Fall back to mock data if API is unavailable
    return generateMockProcesses();
  }
};

// Fetch system resource data from the backend API
const fetchSystemResources = async (): Promise<SystemResources> => {
  try {
    // Try to fetch real data from backend
    const response = await fetch(`${API_BASE_URL}/system-resources`, { timeout: 5000 });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.log('Server responded with error, falling back to mock resource data');
      return generateMockSystemResources();
    }
  } catch (error) {
    console.log('Error fetching real system resource data:', error);
    console.log('Falling back to mock resource data');
    // Fall back to mock data if API is unavailable
    return generateMockSystemResources();
  }
};

// Generate mock process data as a fallback
const generateMockProcesses = (): Process[] => {
  // Common process names with more realistic variations
  const processNames = [
    'chrome', 'firefox', 'safari', 'edge', 'brave',  // Browsers
    'node', 'npm', 'yarn', 'python', 'python3', 'java', 'javaw', 'dotnet', 'gcc', 'clang', // Dev tools
    'vscode', 'code', 'idea', 'eclipse', 'atom', 'sublime_text', 'notepad++', // Editors
    'terminal', 'cmd', 'powershell', 'bash', 'zsh', 'iTerm', 'hyper', // Terminals
    'spotify', 'spotify.exe', 'music', 'itunes', 'vlc', 'mplayer', // Media
    'slack', 'discord', 'teams', 'zoom', 'skype', 'telegram', 'signal', // Communication
    'explorer', 'finder', 'nautilus', 'dolphin', // File managers
    'systemd', 'launchd', 'svchost', 'services', 'wininit', 'lsass', 'ntoskrnl', // System
    'docker', 'containerd', 'kubelet', 'kube-proxy', // Container
    'mysqld', 'postgres', 'mongod', 'redis-server', 'elasticsearch', // Databases
    'nginx', 'apache2', 'httpd', 'iis', // Web servers
    'photoshop', 'illustrator', 'gimp', 'inkscape', 'blender', // Creative
    'antivirus', 'defender', 'avast', 'norton', 'mcafee', // Security
    'dropbox', 'onedrive', 'gdrive', // Cloud storage
    'steam', 'epic', 'battle.net', 'origin', // Gaming platforms
  ];
  
  const users = ['system', 'root', 'admin', 'user', 'guest', 'service', 'daemon', 'www-data', 'nobody'];
  const statuses = ['running', 'sleeping', 'stopped', 'zombie', 'waiting', 'locked'];
  const priorities = [0, 1, 2, 5, 10, 15, 20];
  
  // Generate a timestamp between 5 minutes and 30 days ago
  const generateStartTime = () => {
    const now = new Date();
    const randomMinutes = Math.floor(Math.random() * (30 * 24 * 60 - 5) + 5);
    const date = new Date(now.getTime() - randomMinutes * 60000);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  // Generate approximately 100 processes
  return Array.from({ length: 100 }, (_, i) => {
    const name = processNames[Math.floor(Math.random() * processNames.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    return {
      pid: 1000 + i,
      name,
      status,
      cpuKb: parseFloat((Math.random() * 100).toFixed(2)),
      memoryKb: parseFloat((Math.random() * 1000).toFixed(2)),
      user,
      startTime: generateStartTime(),
      threads: Math.floor(Math.random() * 20) + 1,
      priority
    };
  }).sort((a, b) => b.memoryKb - a.memoryKb);
};

// Generate mock system resources data as a fallback
const generateMockSystemResources = (): SystemResources => {
  return {
    totalCpuUsage: parseFloat((Math.random() * 100).toFixed(2)),
    totalMemoryUsage: parseFloat((Math.random() * 16000).toFixed(2)),
    totalMemory: 32000, // 32GB in MB
    diskUsage: parseFloat((Math.random() * 500000).toFixed(2)),
    totalDisk: 1000000, // 1TB in MB 
    networkUsage: parseFloat((Math.random() * 100).toFixed(2))
  };
};

export const ProcessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [systemResources, setSystemResources] = useState<SystemResources>({
    totalCpuUsage: 0,
    totalMemoryUsage: 0,
    totalMemory: 32000,
    diskUsage: 0,
    totalDisk: 1000000,
    networkUsage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const REFRESH_INTERVAL = 10000; // 10 seconds

  const refreshProcesses = async () => {
    try {
      // Don't set loading to true during auto-refresh to avoid UI jumps
      if (processes.length === 0) {
        setLoading(true);
      }
      
      // Fetch both processes and system resources in parallel
      const [processData, resourceData] = await Promise.all([
        fetchProcesses(),
        fetchSystemResources()
      ]);
      
      // Update processes state
      setProcesses(prevProcesses => {
        // Only update if there are meaningful changes
        const hasChanged = !prevProcesses.length || 
          JSON.stringify(processData.slice(0, 5)) !== JSON.stringify(prevProcesses.slice(0, 5));
        
        return hasChanged ? processData : prevProcesses;
      });
      
      // Update system resources state
      setSystemResources(resourceData);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch system data');
      toast.error('Failed to fetch system data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToChatHistory = (response: string) => {
    setChatHistory(prev => [...prev, response]);
  };

  useEffect(() => {
    // Initial fetch
    refreshProcesses();
    
    // Set up auto-refresh interval
    intervalRef.current = setInterval(refreshProcesses, REFRESH_INTERVAL);
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ProcessContext.Provider 
      value={{ 
        processes, 
        systemResources,
        loading, 
        error, 
        refreshProcesses,
        chatHistory,
        addToChatHistory
      }}
    >
      {children}
    </ProcessContext.Provider>
  );
};
