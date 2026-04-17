interface Props {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines }: Props) {
  if (lines) {
    const widths = ['100%', '85%', '70%', '90%', '60%'];
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`h-4 rounded-lg skeleton-shimmer ${className}`}
            style={{ width: widths[i % widths.length] }}
          />
        ))}
      </div>
    );
  }

  return <div className={`rounded-2xl skeleton-shimmer ${className}`} />;
}
