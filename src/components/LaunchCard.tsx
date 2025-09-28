import { useCallback } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Launch } from '../types'
import { Badge } from './Badge'

interface LaunchCardProps {
  launch: Launch
  isFavorite: boolean
  onToggleFavorite: (launchId: string) => void
  onSelect: (launch: Launch) => void
}

function formatLaunchDate(dateUtc: string) {
  const date = new Date(dateUtc)
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function successMeta(success: boolean | null): { variant: 'success' | 'failure' | 'pending'; label: string } {
  if (success === true) return { variant: 'success', label: 'Success' }
  if (success === false) return { variant: 'failure', label: 'Failure' }
  return { variant: 'pending', label: 'TBD' }
}

export function LaunchCard({ launch, isFavorite, onToggleFavorite, onSelect }: LaunchCardProps) {
  const { variant, label } = successMeta(launch.success)

  const handleToggleFavorite = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onToggleFavorite(launch.id)
    },
    [launch.id, onToggleFavorite],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(launch)
      }
    },
    [launch, onSelect],
  )

  const handleViewDetails = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onSelect(launch)
    },
    [launch, onSelect],
  )

  return (
    <article
      className="launch-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(launch)}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${launch.name}`}
    >
      <header className="launch-card__header">
        <div className="launch-card__title">
          <h2>{launch.name}</h2>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <button
          type="button"
          className="launch-card__favorite"
          aria-pressed={isFavorite}
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${launch.name} from favorites`}
          onClick={handleToggleFavorite}
        >
          <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        </button>
      </header>
      <p className="launch-card__date">{formatLaunchDate(launch.dateUtc)}</p>
      <p className="launch-card__rocket">Rocket: {launch.rocketName}</p>
      <button type="button" className="launch-card__details" onClick={handleViewDetails}>
        View details
      </button>
    </article>
  )
}
