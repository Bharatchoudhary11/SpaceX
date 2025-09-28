import { useEffect, useRef } from 'react'
import type { Launch } from '../types'

interface LaunchDetailsModalProps {
  launch: Launch
  onClose: () => void
  isLoading: boolean
  errorMessage: string | null
}

export function LaunchDetailsModal({ launch, onClose, isLoading, errorMessage }: LaunchDetailsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const resourceLinks = [
    { label: 'Wikipedia', url: launch.links.wikipedia },
    { label: 'Webcast', url: launch.links.webcast },
    { label: 'Article', url: launch.links.article },
  ]

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close details">
          <span aria-hidden="true">×</span>
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
          {isLoading && <p className="modal__status">Refreshing mission details…</p>}
          {errorMessage && <p className="modal__status modal__status--error">{errorMessage}</p>}
          <p className="modal__details">{launch.details ?? 'No additional mission details provided.'}</p>
          <div className="modal__links">
            {resourceLinks.map(({ label, url }) =>
              url ? (
                <a key={label} href={url} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                <span key={label} className="modal__link-disabled">
                  {label} unavailable
                </span>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
