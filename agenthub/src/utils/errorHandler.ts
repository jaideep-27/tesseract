// Global error handler for browser extension conflicts
export function setupGlobalErrorHandler() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Check if it's a browser extension error
    if (error?.stack?.includes('chrome-extension://') ||
        error?.message?.includes('connectionId') ||
        error?.message?.includes('extension') ||
        error?.message?.includes('wallet') && error?.message?.includes('inject')) {
      
      console.warn('Browser extension error caught and suppressed:', error);
      event.preventDefault(); // Prevent the error from crashing the app
      return;
    }
    
    // Let other errors through
    console.error('Unhandled promise rejection:', error);
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    // Check if it's a browser extension error
    if (error?.stack?.includes('chrome-extension://') ||
        event.filename?.includes('chrome-extension://') ||
        error?.message?.includes('connectionId') ||
        error?.message?.includes('extension')) {
      
      console.warn('Browser extension error caught and suppressed:', error);
      event.preventDefault(); // Prevent the error from crashing the app
      return;
    }
    
    // Let other errors through
    console.error('Global error:', error);
  });
}

// Suppress specific console errors from extensions
export function suppressExtensionErrors() {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress known extension errors
    if (message.includes('chrome-extension://') ||
        message.includes('connectionId') ||
        message.includes('Unchecked runtime.lastError') ||
        message.includes('Could not establish connection')) {
      return; // Don't log these errors
    }
    
    // Log other errors normally
    originalError.apply(console, args);
  };
}