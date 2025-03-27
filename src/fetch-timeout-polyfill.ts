
// This adds the timeout option to fetch API
declare global {
  interface RequestInit {
    timeout?: number;
  }
}

// Add timeout support to fetch
const originalFetch = window.fetch;
window.fetch = function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit = {}) {
  const { timeout } = options;
  
  if (!timeout) {
    return originalFetch(resource, options);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  const fetchPromise = originalFetch(
    resource,
    {
      ...options,
      signal: controller.signal
    }
  );

  return new Promise<Response>((resolve, reject) => {
    fetchPromise
      .then(response => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          reject(new Error('Request timeout'));
        } else {
          reject(error);
        }
      });
  });
};

export {}; // Make this a module
