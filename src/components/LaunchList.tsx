import type { Launch } from '../types'
import { LaunchCard } from './LaunchCard'

interface LaunchListProps {
  launches: Launch[]
  onSelect: (launch: Launch) => void
  onToggleFavorite: (launchId: string) => void
  isFavorite: (launchId: string) => boolean
  emptyMessage?: string
}

export function LaunchList({ launches, onSelect, onToggleFavorite, isFavorite, emptyMessage }: LaunchListProps) {
  if (!launches.length) {
    return <p className="empty-state">{emptyMessage ?? 'No launches match your filters yet.'}</p>
  }

  return (
    <div className="launch-grid" aria-live="polite">
      {launches.map((launch) => (
        <LaunchCard
          key={launch.id}
          launch={launch}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite(launch.id)}
        />
      ))}
    </div>
  )
}
