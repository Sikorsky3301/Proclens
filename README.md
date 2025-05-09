# ProcLens.ai - Machine Learning Based System Process Monitoring Application

## Project Overview

ProcLens.ai is a web-based system process monitoring application that provides users with real-time visualization of system processes and resources. It features an interactive dashboard with process tables, performance charts, and an AI assistant that can answer questions about the system's processes. The application is designed with a modern, responsive interface and supports both light and dark themes.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS with custom glass-morphism effects
- **UI Components**: shadcn/ui component library
- **Charts/Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API and hooks
- **API Integration**: Optional integration with Ollama AI model (with mock fallback)
- **Build System**: Vite
- **Backend Server**: Node.js with Express and TypeScript
- **System Information**: systeminformation package for real-time system data

## Project Structure

### Core Files

- **index.html**: The entry point HTML file that loads the React application.
- **src/main.tsx**: The main entry point that renders the React app into the DOM.
- **src/App.tsx**: Sets up the application with React Router, Query Client, and global UI providers.
- **vite.config.ts**: Vite configuration for the build process.
- **tailwind.config.ts**: Tailwind CSS configuration with custom theme settings.
- **src/index.css**: Global CSS styles including custom utility classes for glass-morphism effects.

### Pages

- **src/pages/Index.tsx**: The main dashboard page showing process monitoring.
- **src/pages/Contact.tsx**: Contact page with a form for user inquiries.
- **src/pages/NotFound.tsx**: 404 error page for handling non-existent routes.

### Server Implementation

The project includes a Node.js backend server that provides real-time system data:

- **server/src/index.ts**: Main server file with Express setup and API endpoints
- **server/package.json**: Server dependencies and scripts
- **server/tsconfig.json**: TypeScript configuration for the server

#### Server Endpoints

1. **GET /processes**
   - Returns real-time system process data
   - Includes PID, name, status, CPU/memory usage, user, start time, and priority
   - Data is formatted to match the frontend's expected structure

2. **GET /system-resources**
   - Returns real-time system resource usage
   - Includes CPU usage percentage
   - Memory usage in GB (total and used)
   - Disk usage in GB (total and used)
   - Network speed in MB/s

#### Server Features

- Real-time system monitoring using systeminformation package
- Automatic data refresh every 10 seconds
- Error handling with appropriate HTTP status codes
- CORS enabled for frontend communication
- TypeScript for type safety
- Nodemon for development auto-reload

### Components

#### Core Components

- **src/components/ProcessProvider.tsx**: Context provider that fetches, manages, and distributes process data throughout the application. It also manages the chat history for the AI assistant.
- **src/components/ProcessTable.tsx**: Displays system processes in a sortable, paginated table with search functionality.
- **src/components/QueryInput.tsx**: Provides an interface for users to query the AI about system processes, with optional Ollama integration or mock responses.
- **src/components/ResponseBox.tsx**: Displays AI assistant responses in a formatted chat-like interface.

#### Visualization Components

- **src/components/PerformanceChart.tsx**: Line chart showing CPU and memory usage over time.
- **src/components/ResourceUsageChart.tsx**: Area chart showing disk I/O and network usage over time.

#### UI Components

- **src/components/ThemeToggle.tsx**: Button for switching between light and dark mode.
- **src/components/ui/**: Directory containing reusable UI components from shadcn/ui:
  - **navigation-menu.tsx**: Navigation menu component for the top navbar.
  - **button.tsx**: Button component with various styles.
  - **input.tsx**: Input field component.
  - **separator.tsx**: Horizontal or vertical separator line.
  - **scroll-area.tsx**: Scrollable container with custom scrollbars.
  - **table.tsx**: Data table with headers and cells.
  - **tooltip.tsx**: Tooltip component for showing additional information on hover.
  - **progress.tsx**: Progress bar component.
  - **hover-card.tsx**: Card that appears on hover.
  - And many more shadcn/ui components for a consistent UI design.

### Hooks

- **src/hooks/useTheme.tsx**: Custom hook for managing the application's theme (light/dark mode).
- **src/hooks/use-toast.ts**: Hook for displaying toast notifications.

### Utilities

- **src/lib/utils.ts**: Utility functions including the `cn` function for combining Tailwind classes.
- **src/fetch-timeout-polyfill.ts**: Polyfill for adding timeout functionality to fetch requests.

## Key Features

### 1. Process Monitoring

The application provides real-time monitoring of system processes with:

- A sortable and searchable table of processes
- Details including PID, name, status, CPU/memory usage, user, start time, threads, and priority
- Visual status indicators for running, sleeping, stopped, and zombie processes
- Pagination for navigating large process lists

### 2. Performance Visualization

Real-time charts display system performance metrics:

- CPU and memory usage over time with line charts
- Disk I/O and network activity with area charts
- Responsive design that adapts to different screen sizes

### 3. AI Process Assistant

An intelligent assistant that can analyze process data:

- Natural language query interface
- Integration with local Ollama AI model (if available)
- Fallback to mock responses when Ollama is not running
- Persistent chat history during the session

### 4. Responsive Design

The application is fully responsive with:

- Adaptive layout for mobile, tablet, and desktop screens
- Glass-morphism UI elements that work in both light and dark mode
- Smooth animations and transitions

### 5. Theme Support

Complete light and dark theme support:

- User preference detection
- Theme persistence using local storage
- Theme toggle accessible throughout the application

## Technical Details

### Process Data Management

The application now uses a real backend server to provide system process data:

- Node.js server with Express framework
- systeminformation package for accurate system data
- Real-time process monitoring and resource usage tracking
- Automatic data refresh mechanism
- Fallback to mock data if server is unavailable

### Data Formatting

The server implements proper data formatting:

- Memory values converted to GB with 2 decimal places
- Disk usage calculated in GB
- Network speed calculated in MB/s
- CPU usage shown as percentage
- All values properly rounded and formatted

### Server Configuration

The server runs on port 3002 by default and can be configured through environment variables:

- `PORT`: Server port (default: 3002)
- CORS enabled for frontend communication
- TypeScript compilation settings for optimal performance

### Error Handling

The server implements comprehensive error handling:

- Try-catch blocks for all async operations
- Appropriate HTTP status codes for different scenarios
- Detailed error messages for debugging
- Graceful fallback mechanisms

### AI Integration

The application attempts to connect to a locally running Ollama instance:

- Checks for Ollama availability on port 11434
- Uses the "phi" model if available
- Falls back to mock responses if Ollama is not running
- Provides context-aware responses based on current process data

### Styling Approach

The project uses a custom styling approach with:

- Tailwind CSS for utility-first styling
- Custom glass-morphism effect classes
- CSS variables for theme colors
- Responsive design breakpoints

### State Management

The application uses React's Context API for global state management:

- `ProcessProvider` for process data and chat history
- `ThemeProvider` for theme state
- Local component state for UI interactions

## Development Patterns

### Component Structure

Components follow a consistent pattern:

- Functional components with TypeScript typing
- Hook-based state management
- Separation of concerns between data, display, and interaction
- Consistent prop interfaces

### Performance Optimization

The application implements several performance optimizations:

- Memoization of filtered and sorted processes
- Controlled refresh intervals to avoid unnecessary re-renders
- Pagination to handle large datasets efficiently
- Efficient chart rendering with limited data points

## Deployment Considerations

When deploying ProcLens.ai:

1. The backend server needs to be running to provide real system process data.
2. Configure the frontend's API_BASE_URL to point to the correct server address.
3. Ensure proper CORS settings for production deployment.
4. Set up environment variables for server configuration.
5. Consider using a process manager like PM2 for production deployment.
6. The application is configured for deployment with Vite's build system.

## Future Enhancement Opportunities

Potential areas for future development:

1. **Process Management**: Add capability to end, pause, or restart processes.
2. **Historical Data**: Implement persistent storage for historical performance analysis.
3. **Advanced Filtering**: Add more sophisticated filtering and grouping options.
4. **User Accounts**: Add authentication to save preferences and queries.
5. **Backend Integration**: Replace mock data with real system process data.
6. **Enhanced AI Capabilities**: Extend AI capabilities with process optimization recommendations.
7. **System Alerts**: Add threshold-based alerts for resource usage.
8. **Remote Monitoring**: Add support for monitoring remote systems.

## Conclusion

ProcLens.ai demonstrates how modern web technologies can be used to create a sophisticated system monitoring interface with AI-powered assistance. The combination of real-time data visualization, responsive design, and natural language interaction provides users with an intuitive way to understand and manage system processes.
