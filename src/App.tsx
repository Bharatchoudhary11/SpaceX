import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { fetchLaunches } from './api/spacex'
import type { Launch } from './types'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { LaunchFilters } from './components/LaunchFilters'
import { LaunchList } from './components/LaunchList'
import { LaunchDetailsModal } from './components/LaunchDetailsModal'
import { useFavorites } from './context/FavoritesContext'
import { LaunchSkeletonList } from './components/LaunchSkeletonList'
import { Pagination } from './components/Pagination'

function App() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [showSuccessOnly, setShowSuccessOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const debouncedSearch = useDebouncedValue(search, 350)

  useEffect(() => {
    let ignore = false

    const loadLaunches = async () => {
      try {
        setLoading(true)
        const data = await fetchLaunches()
        if (!ignore) {
          setLaunches(data)
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Unknown error fetching launches')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadLaunches()

    return () => {
      ignore = true
    }
  }, [])

  const years = useMemo(() => {
    const uniqueYears = new Set<string>()
    launches.forEach((launch) => {
      const year = new Date(launch.dateUtc).getUTCFullYear()
      if (!Number.isNaN(year)) {
        uniqueYears.add(String(year))
      }
    })
    return Array.from(uniqueYears).sort((a, b) => Number(b) - Number(a))
  }, [launches])

  const filteredLaunches = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    return launches.filter((launch) => {
      const matchesSearch = launch.name.toLowerCase().includes(normalizedSearch)
      const launchYear = new Date(launch.dateUtc).getUTCFullYear()
      const matchesYear = selectedYear ? String(launchYear) === selectedYear : true
      const matchesSuccess = showSuccessOnly ? launch.success === true : true
      const matchesFavorite = showFavoritesOnly ? favorites.has(launch.id) : true

      return matchesSearch && matchesYear && matchesSuccess && matchesFavorite
    })
  }, [launches, debouncedSearch, selectedYear, showSuccessOnly, showFavoritesOnly, favorites])

  const PAGE_SIZE = 9

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedYear, showSuccessOnly, showFavoritesOnly])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredLaunches.length / PAGE_SIZE) || 1)
  }, [filteredLaunches.length])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedLaunches = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredLaunches.slice(start, start + PAGE_SIZE)
  }, [filteredLaunches, currentPage])

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__intro">
          <h1>SpaceX Mission Explorer</h1>
          <p>Browse SpaceX launches, filter by mission, and dive into mission details.</p>
        </div>
        <label className="favorites-toggle">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Favorites only
        </label>
      </header>

      <LaunchFilters
        search={search}
        onSearchChange={setSearch}
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        showSuccessOnly={showSuccessOnly}
        onShowSuccessOnlyChange={setShowSuccessOnly}
      />

      {loading ? (
        <>
          <p className="sr-only" role="status" aria-live="polite">
            Loading launches…
          </p>
          <LaunchSkeletonList />
        </>
      ) : error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : (
        <>
          <LaunchList
            launches={paginatedLaunches}
            onSelect={setSelectedLaunch}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            emptyMessage={
              showFavoritesOnly
                ? 'No favorite missions yet. Browse missions and add some!'
                : 'No launches match your filters yet.'
            }
          />
          {filteredLaunches.length > PAGE_SIZE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {selectedLaunch && (
        <LaunchDetailsModal launch={selectedLaunch} onClose={() => setSelectedLaunch(null)} />
      )}
    </div>
  )
}

export default App
