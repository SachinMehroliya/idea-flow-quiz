export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Progress: {current} / {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="progress-fill h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
