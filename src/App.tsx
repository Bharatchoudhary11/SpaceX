import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { fetchLaunches } from './api/spacex'
import type { Launch } from './types'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { LaunchFilters } from './components/LaunchFilters'
import { LaunchList } from './components/LaunchList'
import { LaunchDetailsModal } from './components/LaunchDetailsModal'

function App() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [selectedLaunch, setSelectedLaunch] = useState<Launch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [showSuccessOnly, setShowSuccessOnly] = useState(false)

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

      return matchesSearch && matchesYear && matchesSuccess
    })
  }, [launches, debouncedSearch, selectedYear, showSuccessOnly])

  return (
    <div className="app">
      <header className="app__header">
        <h1>SpaceX Mission Explorer</h1>
        <p>Browse SpaceX launches, filter by mission, and dive into mission details.</p>
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

      {loading && <p className="status-message">Loading launches…</p>}
      {error && !loading && <p className="status-message status-message--error">{error}</p>}
      {!loading && !error && (
        <LaunchList launches={filteredLaunches} onSelect={setSelectedLaunch} />
      )}

      {selectedLaunch && (
        <LaunchDetailsModal launch={selectedLaunch} onClose={() => setSelectedLaunch(null)} />
      )}
    </div>
  )
}

export default App
