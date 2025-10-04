export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-base font-bold text-foreground">
          Progress: {current} / {total}
        </span>
        <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-4 bg-muted rounded-full overflow-hidden shadow-inner relative">
        <div
          className="progress-fill h-full rounded-full relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 animate-pulse opacity-50 bg-white/20"></div>
        </div>
      </div>
    </div>
  );
}
