import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { FavoritesProvider } from '../context/FavoritesContext'

type ApiLaunch = {
  id: string
  name: string
  date_utc: string
  success: boolean | null
  details: string | null
  rocket: { name: string }
  links: {
    patch: { small: string | null; large: string | null }
    wikipedia: string | null
    webcast: string | null
    article: string | null
  }
}

const sampleLaunches: ApiLaunch[] = [
  {
    id: 'launch-alpha',
    name: 'Mission Alpha',
    date_utc: '2020-01-01T00:00:00.000Z',
    success: true,
    details: 'Alpha mission details.',
    rocket: { name: 'Falcon 9' },
    links: {
      patch: {
        small: 'https://images/alpha-small.png',
        large: 'https://images/alpha-large.png',
      },
      wikipedia: 'https://example.com/alpha-wiki',
      webcast: 'https://example.com/alpha-webcast',
      article: 'https://example.com/alpha-article',
    },
  },
  {
    id: 'launch-beta',
    name: 'Mission Beta',
    date_utc: '2021-05-10T12:00:00.000Z',
    success: false,
    details: 'Beta mission details.',
    rocket: { name: 'Falcon Heavy' },
    links: {
      patch: {
        small: 'https://images/beta-small.png',
        large: 'https://images/beta-large.png',
      },
      wikipedia: 'https://example.com/beta-wiki',
      webcast: 'https://example.com/beta-webcast',
      article: 'https://example.com/beta-article',
    },
  },
  {
    id: 'launch-gamma',
    name: 'Mission Gamma',
    date_utc: '2022-09-15T15:30:00.000Z',
    success: null,
    details: 'Gamma mission details.',
    rocket: { name: 'Starship' },
    links: {
      patch: {
        small: 'https://images/gamma-small.png',
        large: 'https://images/gamma-large.png',
      },
      wikipedia: 'https://example.com/gamma-wiki',
      webcast: 'https://example.com/gamma-webcast',
      article: 'https://example.com/gamma-article',
    },
  },
]

function mockLaunchFetch(launches: ApiLaunch[]) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ docs: launches }),
  }) as unknown as typeof fetch

  vi.stubGlobal('fetch', fetchMock)
}

function renderApp() {
  return render(
    <FavoritesProvider>
      <App />
    </FavoritesProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('SpaceX Mission Explorer', () => {
  it('renders launches and filters by search input', async () => {
    mockLaunchFetch(sampleLaunches)
    const user = userEvent.setup()

    renderApp()

    expect(await screen.findByText('Mission Alpha')).toBeInTheDocument()
    expect(screen.getByText('Mission Beta')).toBeInTheDocument()

    const searchInput = screen.getByLabelText(/search missions/i)
    await user.clear(searchInput)
    await user.type(searchInput, 'Gamma')

    await waitFor(() => {
      expect(screen.getByText('Mission Gamma')).toBeInTheDocument()
      expect(screen.queryByText('Mission Alpha')).not.toBeInTheDocument()
      expect(screen.queryByText('Mission Beta')).not.toBeInTheDocument()
    })
  })

  it('toggles favorites and persists to localStorage', async () => {
    mockLaunchFetch(sampleLaunches)
    const user = userEvent.setup()

    renderApp()

    const favoriteButton = await screen.findByRole('button', {
      name: /add Mission Alpha from favorites/i,
    })

    await user.click(favoriteButton)
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')

    const storedFavorites = JSON.parse(window.localStorage.getItem('spacex:favorites') ?? '[]')
    expect(storedFavorites).toContain('launch-alpha')

    const favoritesToggle = screen.getByLabelText(/favorites only/i)
    await user.click(favoritesToggle)

    await waitFor(() => {
      expect(screen.getByText('Mission Alpha')).toBeInTheDocument()
    })
    expect(screen.queryByText('Mission Beta')).not.toBeInTheDocument()
  })

  it('opens detail modal when viewing mission details', async () => {
    mockLaunchFetch(sampleLaunches)
    const user = userEvent.setup()

    renderApp()

    const detailButtons = await screen.findAllByRole('button', { name: /view details/i })
    await user.click(detailButtons[0])

    const dialog = await screen.findByRole('dialog', { name: 'Mission Alpha' })

    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Mission Alpha' })).toBeInTheDocument()
    expect(within(dialog).getByText('Rocket: Falcon 9')).toBeInTheDocument()
    expect(
      within(dialog).getByRole('img', { name: /mission alpha mission patch/i }),
    ).toBeInTheDocument()
  })
})
