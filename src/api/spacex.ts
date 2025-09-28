import type { Launch } from '../types'

interface ApiRocket {
  id?: string
  name?: string
}

interface ApiLaunch {
  id: string
  name: string
  date_utc: string
  success: boolean | null
  details: string | null
  rocket: ApiRocket | string | null
  links: {
    patch?: {
      small: string | null
      large: string | null
    }
    wikipedia?: string | null
    webcast?: string | null
    article?: string | null
  }
}

interface LaunchQueryResponse {
  docs: ApiLaunch[]
}

const SPACEX_QUERY_URL = 'https://api.spacexdata.com/v4/launches/query'

export async function fetchLaunches(): Promise<Launch[]> {
  const response = await fetch(SPACEX_QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {},
      options: {
        sort: { date_utc: 'desc' },
        populate: ['rocket'],
        pagination: false,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to fetch launches from SpaceX API')
  }

  const payload: LaunchQueryResponse = await response.json()

  return payload.docs.map((launch) => {
    const rocket = launch.rocket && typeof launch.rocket === 'object' ? launch.rocket.name : null

    return {
      id: launch.id,
      name: launch.name,
      dateUtc: launch.date_utc,
      success: launch.success,
      details: launch.details,
      rocketName: rocket ?? 'Unknown Rocket',
      links: {
        patchSmall: launch.links?.patch?.small ?? null,
        patchLarge: launch.links?.patch?.large ?? null,
        wikipedia: launch.links?.wikipedia ?? null,
        webcast: launch.links?.webcast ?? null,
        article: launch.links?.article ?? null,
      },
    }
  })
}
