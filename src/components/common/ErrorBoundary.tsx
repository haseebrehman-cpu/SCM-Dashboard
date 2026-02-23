import { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "../../services/logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component - PRODUCTION GRADE
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 *
 * Features:
 * - Comprehensive error logging with context
 * - User-friendly fallback UI
 * - Support for custom error handlers
 * - Development-specific error details
 * - Error recovery with reset functionality
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to error tracking service
    logger.error("Error caught by ErrorBoundary", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      timestamp: new Date().toISOString(),
    });

    // Update state with error details
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    // Reload the page to reset everything
    window.location.reload();
  };

  handleGoHome = (): void => {
    // Clear error state before navigating
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-900">
            {/* Error Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 4v2M5.07 4.11a9 9 0 019.858 0m-6.943 9.94a9 9 0 009.858 0"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4 text-sm">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-900/50 rounded border border-gray-300 dark:border-gray-700 max-h-48 overflow-y-auto">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap break-words">
                    <strong>Stack:</strong>
                    {'\n'}
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              If this problem persists, please contact{' '}
              <a href="mailto:support@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
