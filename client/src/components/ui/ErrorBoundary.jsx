import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
    
    // You could also log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-md bg-danger/10 border border-danger/30 p-6 my-6 text-center">
          <AlertCircle className="h-10 w-10 text-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            An error occurred while rendering this component
          </p>
          <details className="text-left text-sm my-4">
            <summary className="cursor-pointer text-danger hover:underline">
              Error details
            </summary>
            <pre className="mt-2 bg-secondary p-4 rounded-md overflow-auto max-h-[200px]">
              {this.state.error?.toString() || 'Unknown error'}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn btn-outline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
