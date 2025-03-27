import React, { useState, useEffect } from 'react';
import { useProcesses } from '@/components/ProcessProvider';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChartData = {
  time: string;
  cpu: number;
  memory: number;
};

export const PerformanceChart = () => {
  const { systemResources } = useProcesses();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Get current time for x-axis
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Add new data point using real system resources
    setChartData(prev => {
      const newData = [...prev, { 
        time: timeStr, 
        cpu: systemResources.totalCpuUsage, 
        memory: systemResources.totalMemoryUsage 
      }];
      // Keep only last 20 data points to avoid overcrowding
      return newData.slice(-20);
    });
  }, [systemResources]);

  const chartConfig = {
    cpu: {
      label: "CPU Usage",
      theme: {
        light: '#0091ff',
        dark: '#00a3ff'
      }
    },
    memory: {
      label: "Memory Usage",
      theme: {
        light: '#ff6b6b',
        dark: '#ff8585'
      }
    }
  };

  return (
    <div className="glass-card p-4 h-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-foreground">System Performance</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="text-foreground">Real-time monitoring of CPU and Memory usage:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground">
                <li>CPU Usage: Percentage of total CPU capacity being used</li>
                <li>Memory Usage: Amount of RAM being used out of total available RAM</li>
                <li>Data updates every 10 seconds</li>
                <li>Chart shows last 20 data points for trend analysis</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-sm mb-2 flex justify-between text-foreground">
        <span>CPU: {systemResources.totalCpuUsage.toFixed(1)}%</span>
        <span>Memory: {systemResources.totalMemoryUsage.toFixed(1)} GB / {systemResources.totalMemory.toFixed(1)} GB</span>
      </div>
      <ChartContainer className="h-[230px]" config={chartConfig}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
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
          <Line 
            type="monotone" 
            dataKey="cpu" 
            name="CPU" 
            stroke="var(--color-cpu)" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="memory" 
            name="Memory" 
            stroke="var(--color-memory)" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Legend />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
