interface LaunchSkeletonListProps {
  count?: number
}

export function LaunchSkeletonList({ count = 6 }: LaunchSkeletonListProps) {
  const placeholders = Array.from({ length: count })
  return (
    <div className="launch-grid" aria-hidden="true">
      {placeholders.map((_, index) => (
        <div key={index} className="launch-card launch-card--skeleton">
          <div className="skeleton skeleton--badge" />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--text" />
          <div className="skeleton skeleton--text" />
        </div>
      ))}
    </div>
  )
}
