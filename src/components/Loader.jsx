import { Card } from '@/components/ui/card';

export function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
      <Card className="card-elevated p-12 text-center max-w-md shadow-glow-lg">
        <div className="relative w-28 h-28 mx-auto mb-8 float-animation">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-accent border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3" aria-live="polite">
          {message}
        </p>
        <p className="text-base text-muted-foreground">
          This may take a few moments...
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </Card>
    </div>
  );
}
