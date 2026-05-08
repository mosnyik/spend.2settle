import React, { useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ErrorBoundary from "./social/telegram/TelegramError";

export function withErrorHandling<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithErrorHandlingWrapper(props: P) {
    const [error, setError] = useState<Error | null>(null);

    const handleError = useCallback((error: Error) => {
      console.error("Error caught by error handler:", error);
      setError(error);
    }, []);

    const handleRetry = useCallback(() => {
      setError(null);
    }, []);

    if (error) {
      return (
        <div className="p-4 max-w-xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="mb-2">Runtime Error</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>An error occurred while running the application:</p>
              <p className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {error.message}
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <WrappedComponent {...props} onError={handleError} />
      </ErrorBoundary>
    );
  };
}
