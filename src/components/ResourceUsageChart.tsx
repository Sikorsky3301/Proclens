import React, { useState, useEffect } from 'react';
import { useProcesses } from '@/components/ProcessProvider';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  AreaChart,
  Area,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
  Tooltip
} from 'recharts';
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ResourceData = {
  time: string;
  diskIO: number;
  network: number;
};

export const ResourceUsageChart = () => {
  const { systemResources } = useProcesses();
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  
  useEffect(() => {
    // Get current time for x-axis
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Add new data point using real system resources
    setResourceData(prev => {
      const newData = [...prev, { 
        time: timeStr, 
        diskIO: systemResources.diskUsage / 1000, // Convert to GB for better visualization
        network: systemResources.networkUsage 
      }];
      // Keep only last 20 data points
      return newData.slice(-20);
    });
  }, [systemResources]);

  const chartConfig = {
    diskIO: {
      label: "Disk I/O",
      theme: {
        light: '#8B5CF6',
        dark: '#A78BFA'
      }
    },
    network: {
      label: "Network",
      theme: {
        light: '#F97316',
        dark: '#FB923C'
      }
    }
  };

  const diskUsedPercent = (systemResources.diskUsage / systemResources.totalDisk) * 100;

  return (
    <div className="glass-card p-4 h-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-foreground">Resource Usage</h3>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="text-foreground">Real-time monitoring of Disk and Network usage:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground">
                <li>Disk Usage: Amount of storage space used out of total available space</li>
                <li>Network Usage: Current network transfer rate in MB/s</li>
                <li>Data updates every 10 seconds</li>
                <li>Chart shows last 20 data points for trend analysis</li>
              </ul>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm mb-2 flex justify-between text-foreground">
        <span>Disk: {(systemResources.diskUsage / 1000).toFixed(1)} GB / {(systemResources.totalDisk / 1000).toFixed(1)} GB ({diskUsedPercent.toFixed(1)}%)</span>
        <span>Network: {systemResources.networkUsage.toFixed(1)} MB/s</span>
      </div>
      <ChartContainer className="h-[230px]" config={chartConfig}>
        <AreaChart data={resourceData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'currentColor' }}
            tickMargin={10}
            width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="diskIO" 
            name="Disk I/O" 
            stroke="var(--color-diskIO)" 
            fill="var(--color-diskIO)"
            fillOpacity={0.3}
            strokeWidth={2} 
          />
          <Area 
            type="monotone" 
            dataKey="network" 
            name="Network" 
            stroke="var(--color-network)" 
            fill="var(--color-network)"
            fillOpacity={0.3}
            strokeWidth={2} 
          />
          <Legend />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
