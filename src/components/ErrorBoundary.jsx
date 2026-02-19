import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, ExternalLink } from "lucide-react";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Enhanced fallback UI with glassmorphic design
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br slate-950">
          <div className="max-w-2xl w-full bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-black/40 p-8 lg:p-10">
            {/* Header with icon */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-2xl shadow-lg">
                  <AlertTriangle className="text-white" size={32} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-100 mb-3 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-base text-gray-400 leading-relaxed max-w-md mx-auto">
                {this.props.message || "An unexpected error occurred. Don't worry, we can help you get back on track."}
              </p>
            </div>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-5 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/60">
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-300 mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-3 text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-48 p-3 bg-gray-900/50 rounded-xl">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Recovery Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  icon={RefreshCw}
                  iconPosition="left"
                  className="flex-1 sm:flex-initial"
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={this.handleGoBack}
                  icon={ArrowLeft}
                  iconPosition="left"
                  className="flex-1 sm:flex-initial"
                >
                  Go Back
                </Button>
                {this.props.showHomeButton !== false && (
                  <Button
                    variant="secondary"
                    onClick={this.handleGoHome}
                    icon={Home}
                    iconPosition="left"
                    className="flex-1 sm:flex-initial"
                  >
                    Go Home
                  </Button>
                )}
              </div>

              {/* Additional Help Links */}
              <div className="pt-4 border-t border-gray-700/60">
                <p className="text-xs text-center text-gray-500 mb-3">
                  Need more help?
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors hover:underline"
                  >
                    <RefreshCw size={14} />
                    Reload Page
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <a
                    href="/"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors hover:underline"
                  >
                    <Home size={14} />
                    Home Page
                  </a>
                  {this.state.retryCount > 2 && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.reload();
                        }}
                        className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center gap-1.5 transition-colors hover:underline"
                      >
                        <ExternalLink size={14} />
                        Clear Cache & Reload
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  message: PropTypes.string,
  onReset: PropTypes.func,
  showHomeButton: PropTypes.bool,
};

export default ErrorBoundary;



