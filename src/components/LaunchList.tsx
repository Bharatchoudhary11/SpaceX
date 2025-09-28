import type { Launch } from '../types'

interface LaunchListProps {
  launches: Launch[]
  onSelect: (launch: Launch) => void
}

function formatLaunchDate(dateUtc: string) {
  const date = new Date(dateUtc)
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function successLabel(success: boolean | null) {
  if (success === true) return 'Success'
  if (success === false) return 'Failure'
  return 'TBD'
}

export function LaunchList({ launches, onSelect }: LaunchListProps) {
  if (!launches.length) {
    return <p className="empty-state">No launches match your filters yet.</p>
  }

  return (
    <div className="launch-grid">
      {launches.map((launch) => (
        <button
          key={launch.id}
          className="launch-card"
          type="button"
          onClick={() => onSelect(launch)}
        >
          <header className="launch-card__header">
            <h2>{launch.name}</h2>
            <span className={`badge ${launch.success === true ? 'badge--success' : launch.success === false ? 'badge--failure' : 'badge--pending'}`}>
              {successLabel(launch.success)}
            </span>
          </header>
          <p className="launch-card__date">{formatLaunchDate(launch.dateUtc)}</p>
          <p className="launch-card__rocket">Rocket: {launch.rocketName}</p>
        </button>
      ))}
    </div>
  )
}
