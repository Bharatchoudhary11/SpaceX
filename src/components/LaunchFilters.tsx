interface LaunchFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  years: string[]
  selectedYear: string
  onYearChange: (value: string) => void
  showSuccessOnly: boolean
  onShowSuccessOnlyChange: (value: boolean) => void
  showFavoritesOnly: boolean
  onShowFavoritesOnlyChange: (value: boolean) => void
}

export function LaunchFilters({
  search,
  onSearchChange,
  years,
  selectedYear,
  onYearChange,
  showSuccessOnly,
  onShowSuccessOnlyChange,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
}: LaunchFiltersProps) {
  return (
    <section className="filters">
      <div className="field">
        <label htmlFor="mission-search">Search missions</label>
        <input
          id="mission-search"
          type="search"
          placeholder="Search by mission name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="launch-year">Launch year</label>
        <select
          id="launch-year"
          value={selectedYear}
          onChange={(event) => onYearChange(event.target.value)}
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="toggle-group" role="group" aria-label="Filters">
        <label className="toggle">
          <input
            type="checkbox"
            checked={showSuccessOnly}
            onChange={(event) => onShowSuccessOnlyChange(event.target.checked)}
          />
          Successful launches only
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => onShowFavoritesOnlyChange(event.target.checked)}
          />
          Favorites only
        </label>
      </div>
    </section>
  )
}
