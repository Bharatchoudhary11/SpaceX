interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function createPageList(current: number, total: number) {
  const pages: number[] = []
  const delta = 2
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (!pages.includes(1)) {
    pages.unshift(1)
  }

  if (!pages.includes(total)) {
    pages.push(total)
  }

  return Array.from(new Set(pages)).sort((a, b) => a - b)
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = createPageList(currentPage, totalPages)

  return (
    <nav className="pagination" aria-label="Launch pagination">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <ul className="pagination__list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  )
}
