import { useEffect } from 'react'
import type { Launch } from '../types'

interface LaunchDetailsModalProps {
  launch: Launch
  onClose: () => void
}

export function LaunchDetailsModal({ launch, onClose }: LaunchDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-modal-title"
      onClick={onClose}
    >
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close details">
          ×
        </button>
        <header className="modal__header">
          {launch.links.patchLarge || launch.links.patchSmall ? (
            <img
              src={launch.links.patchLarge ?? launch.links.patchSmall ?? ''}
              alt={`${launch.name} mission patch`}
              className="modal__patch"
            />
          ) : (
            <div className="modal__patch placeholder">No patch available</div>
          )}
          <div>
            <h2 id="launch-modal-title">{launch.name}</h2>
            <p className="modal__rocket">Rocket: {launch.rocketName}</p>
          </div>
        </header>

        <section className="modal__body">
          <p className="modal__details">{launch.details ?? 'No additional mission details provided.'}</p>
          <div className="modal__links">
            {launch.links.wikipedia && (
              <a href={launch.links.wikipedia} target="_blank" rel="noreferrer">
                Wikipedia
              </a>
            )}
            {launch.links.webcast && (
              <a href={launch.links.webcast} target="_blank" rel="noreferrer">
                Webcast
              </a>
            )}
            {launch.links.article && (
              <a href={launch.links.article} target="_blank" rel="noreferrer">
                Article
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
