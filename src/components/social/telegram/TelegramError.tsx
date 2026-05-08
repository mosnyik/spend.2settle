import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error);
    console.error("Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 max-w-xl mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="mb-2">Something went wrong</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  We're sorry, but there was an error loading this component.
                </p>
                {this.state.error && (
                  <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                    {this.state.error.toString()}
                  </p>
                )}
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  className="w-full mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
