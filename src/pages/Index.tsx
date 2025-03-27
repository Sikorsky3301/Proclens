
import React from 'react';
import { Link } from 'react-router-dom';
import { ProcessProvider } from '@/components/ProcessProvider';
import { ProcessTable } from '@/components/ProcessTable';
import { QueryInput } from '@/components/QueryInput';
import { ResponseBox } from '@/components/ResponseBox';
import { PerformanceChart } from '@/components/PerformanceChart';
import { ResourceUsageChart } from '@/components/ResourceUsageChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/hooks/useTheme';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Home, Contact } from 'lucide-react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary px-4 py-8">
        <div className="container max-w-7xl mx-auto space-y-8">
          {/* Navigation Bar */}
          <div className="glass-card p-2 rounded-full animate-fade-up">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem>
                  <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Contact className="w-4 h-4" />
                    <span>Contact</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Centered Title and Theme Toggle */}
          <div className="flex flex-col items-center text-center animate-fade-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 pb-1">
              ProcLens.ai
            </h1>
            <p className="mt-1 text-xl text-muted-foreground">
              Monitor system processes and get AI-powered insights
            </p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
          
          <ProcessProvider>
            <div className="grid grid-cols-1 gap-6">
              {/* Performance charts in a grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerformanceChart />
                <ResourceUsageChart />
              </div>
              
              <Separator className="my-2" />
              
              {/* Process table with horizontal scrolling for many columns */}
              <div className="glass-card">
                <div className="p-4 pb-0">
                  <h2 className="text-xl font-semibold mb-2">System Processes</h2>
                </div>
                <div className="max-h-[500px]">
                  <ScrollArea className="h-full w-full">
                    <div className="min-w-max">
                      <ProcessTable />
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              {/* AI interaction section with its own scrollable area */}
              <div id="ai-interaction" className="glass-card p-6 space-y-6">
                <h2 className="text-xl font-semibold">AI Process Assistant</h2>
                <QueryInput />
                <ResponseBox />
              </div>
            </div>
          </ProcessProvider>
          
          <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-up">
            <p>ProcLens.ai — Elegant system monitoring</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
