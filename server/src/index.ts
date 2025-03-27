import express, { Request, Response } from 'express';
import cors from 'cors';
import * as si from 'systeminformation';

const app = express();
const port = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());

// Helper function to convert bytes to GB
const bytesToGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

// Helper function to convert bytes to MB/s
const bytesToMBps = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

// Store previous network stats for speed calculation
let previousNetworkStats = {
  rx_bytes: 0,
  tx_bytes: 0,
  timestamp: Date.now()
};

// Get system processes
app.get('/processes', async (req: Request, res: Response) => {
  try {
    const processes = await si.processes();
    const formattedProcesses = processes.list.map((proc: si.Systeminformation.ProcessesProcessData) => ({
      pid: proc.pid,
      name: proc.name,
      status: proc.state,
      cpuKb: proc.cpu,
      memoryKb: proc.mem,
      user: proc.user,
      startTime: new Date(proc.started).toISOString().replace('T', ' ').substring(0, 19),
      threads: 1, // Default to 1 since threads info is not available
      priority: proc.priority || 0
    }));
    res.json(formattedProcesses);
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ error: 'Failed to fetch processes' });
  }
});

// Get system resources
app.get('/system-resources', async (req: Request, res: Response) => {
  try {
    const [cpu, mem, disk, network] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats()
    ]);

    // Calculate disk usage
    const totalDisk = disk.reduce((acc: number, curr: si.Systeminformation.FsSizeData) => acc + curr.size, 0);
    const usedDisk = disk.reduce((acc: number, curr: si.Systeminformation.FsSizeData) => acc + curr.used, 0);

    // Calculate network speed
    const currentTime = Date.now();
    const timeDiff = Math.max((currentTime - previousNetworkStats.timestamp) / 1000, 1); // Ensure at least 1 second
    const rxDiff = network[0].rx_bytes - previousNetworkStats.rx_bytes;
    const txDiff = network[0].tx_bytes - previousNetworkStats.tx_bytes;
    const totalBytesDiff = rxDiff + txDiff;
    const networkSpeed = totalBytesDiff / timeDiff; // bytes per second

    // Update previous stats
    previousNetworkStats = {
      rx_bytes: network[0].rx_bytes,
      tx_bytes: network[0].tx_bytes,
      timestamp: currentTime
    };

    // Calculate memory values in GB
    const totalMemoryGB = mem.total / (1024 * 1024 * 1024);
    const usedMemoryGB = (mem.total - mem.available) / (1024 * 1024 * 1024);

    res.json({
      totalCpuUsage: parseFloat(cpu.currentLoad.toFixed(2)),
      totalMemoryUsage: parseFloat(usedMemoryGB.toFixed(2)),
      totalMemory: parseFloat(totalMemoryGB.toFixed(2)),
      diskUsage: parseFloat(bytesToGB(usedDisk)),
      totalDisk: parseFloat(bytesToGB(totalDisk)),
      networkUsage: parseFloat(bytesToMBps(networkSpeed))
    });
  } catch (error) {
    console.error('Error fetching system resources:', error);
    res.status(500).json({ error: 'Failed to fetch system resources' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 