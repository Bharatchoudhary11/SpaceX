import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface FavoritesContextValue {
  favorites: Set<string>
  toggleFavorite: (launchId: string) => void
  isFavorite: (launchId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'spacex:favorites'

function loadInitialFavorites(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) {
      return new Set()
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((item): item is string => typeof item === 'string'))
    }
    return new Set()
  } catch (error) {
    console.warn('Failed to parse favorites from localStorage', error)
    return new Set()
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadInitialFavorites())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const ids = Array.from(favorites)
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  }, [favorites])

  const toggleFavorite = useCallback((launchId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(launchId)) {
        next.delete(launchId)
      } else {
        next.add(launchId)
      }
      return next
    })
  }, [])

  const value = useMemo(() => {
    const isFavorite = (launchId: string) => favorites.has(launchId)

    return {
      favorites,
      toggleFavorite,
      isFavorite,
    }
  }, [favorites, toggleFavorite])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
