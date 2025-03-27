
import React, { useState } from 'react';
import { Process, useProcesses } from './ProcessProvider';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const ProcessTable: React.FC = () => {
  const { processes, loading, refreshProcesses } = useProcesses();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Process;
    direction: 'ascending' | 'descending';
  }>({
    key: 'memoryKb',
    direction: 'descending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof Process) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredProcesses = React.useMemo(() => {
    return processes.filter(process => 
      process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.pid.toString().includes(searchTerm) ||
      process.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processes, searchTerm]);

  const sortedProcesses = React.useMemo(() => {
    return [...filteredProcesses].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProcesses, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedProcesses.length / itemsPerPage);
  const paginatedProcesses = sortedProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIndicator = (key: keyof Process) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Return a stable height even when data is loading
  const tableHeight = "min-h-[300px]";

  return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">System Processes ({filteredProcesses.length} found)</h2>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input max-w-xs"
          />
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              refreshProcesses();
            }}
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
            aria-label="Refresh processes"
          >
            <RefreshCw size={18} className={`text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className={`rounded-lg overflow-hidden border border-border ${tableHeight}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={() => handleSort('pid')}
              >
                PID {getSortIndicator('pid')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={() => handleSort('name')}
              >
                Name {getSortIndicator('name')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={() => handleSort('user')}
              >
                User {getSortIndicator('user')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={() => handleSort('status')}
              >
                Status {getSortIndicator('status')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200 text-right"
                onClick={() => handleSort('cpuKb')}
              >
                CPU (KB) {getSortIndicator('cpuKb')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200 text-right"
                onClick={() => handleSort('memoryKb')}
              >
                Memory (KB) {getSortIndicator('memoryKb')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200"
                onClick={() => handleSort('startTime')}
              >
                Start Time {getSortIndicator('startTime')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200 text-right"
                onClick={() => handleSort('threads')}
              >
                Threads {getSortIndicator('threads')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors duration-200 text-right"
                onClick={() => handleSort('priority')}
              >
                Priority {getSortIndicator('priority')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !processes.length ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <TableCell key={`skeleton-cell-${cellIndex}`}>
                      <div className="h-4 bg-muted animate-pulse-subtle rounded"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedProcesses.length > 0 ? (
              paginatedProcesses.map((process) => (
                <TableRow key={process.pid} className="hover:bg-muted/50 transition-colors duration-200">
                  <TableCell>{process.pid}</TableCell>
                  <TableCell className="font-medium">{process.name}</TableCell>
                  <TableCell>{process.user}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        process.status === 'running' 
                          ? 'bg-green-100 text-green-800' 
                          : process.status === 'sleeping' 
                          ? 'bg-blue-100 text-blue-800'
                          : process.status === 'zombie'
                          ? 'bg-red-100 text-red-800'  
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {process.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{process.cpuKb.toFixed(2)} K</TableCell>
                  <TableCell className="text-right">{process.memoryKb.toFixed(2)} K</TableCell>
                  <TableCell>{process.startTime}</TableCell>
                  <TableCell className="text-right">{process.threads}</TableCell>
                  <TableCell className="text-right">{process.priority}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? 'No matching processes found' : 'No processes found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {sortedProcesses.length > itemsPerPage && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Display page numbers around the current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      isActive={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
