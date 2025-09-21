import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details but don't crash the app
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out browser extension errors
    if (error.stack?.includes('chrome-extension://') || 
        error.message?.includes('connectionId') ||
        error.message?.includes('extension')) {
      console.warn('Browser extension error caught and handled:', error.message);
      return;
    }
  }

  public render() {
    if (this.state.hasError) {
      // Check if it's a browser extension error
      if (this.state.error?.stack?.includes('chrome-extension://') ||
          this.state.error?.message?.includes('connectionId') ||
          this.state.error?.message?.includes('extension')) {
        // Don't show error UI for extension errors, just log and continue
        return this.props.children;
      }

      // Show fallback UI for actual app errors
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl text-red-400 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              An error occurred while loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}