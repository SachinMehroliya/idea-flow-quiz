import { Card } from '@/components/ui/card';

export function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      <Card className="card-elevated p-8 text-center max-w-md">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-foreground" aria-live="polite">
          {message}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a few moments...
        </p>
      </Card>
    </div>
  );
}
