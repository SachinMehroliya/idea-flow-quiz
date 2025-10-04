import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function ErrorBanner({ error, onRetry }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="border-destructive bg-destructive/5 p-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-foreground mb-4">
            We encountered an error while processing your request. Please try again.
          </p>
          
          {error && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
              aria-expanded={showDetails}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide error details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show error details
                </>
              )}
            </button>
          )}

          {showDetails && error && (
            <div className="bg-muted p-3 rounded-lg mb-4 font-mono text-sm text-foreground">
              {error}
            </div>
          )}

          {onRetry && (
            <Button onClick={onRetry} className="btn-gradient">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
