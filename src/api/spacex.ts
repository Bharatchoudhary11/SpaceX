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

function extractRocketName(rocket: ApiLaunch['rocket']): string {
  if (rocket && typeof rocket === 'object' && 'name' in rocket && rocket.name) {
    return rocket.name
  }
  return 'Unknown Rocket'
}

function transformLaunch(apiLaunch: ApiLaunch): Launch {
  return {
    id: apiLaunch.id,
    name: apiLaunch.name,
    dateUtc: apiLaunch.date_utc,
    success: apiLaunch.success,
    details: apiLaunch.details,
    rocketName: extractRocketName(apiLaunch.rocket),
    links: {
      patchSmall: apiLaunch.links?.patch?.small ?? null,
      patchLarge: apiLaunch.links?.patch?.large ?? null,
      wikipedia: apiLaunch.links?.wikipedia ?? null,
      webcast: apiLaunch.links?.webcast ?? null,
      article: apiLaunch.links?.article ?? null,
    },
  }
}

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

  return payload.docs.map(transformLaunch)
}

export async function fetchLaunchById(id: string): Promise<Launch | null> {
  const response = await fetch(SPACEX_QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: { _id: id },
      options: {
        populate: ['rocket'],
        limit: 1,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to fetch launch details')
  }

  const payload: LaunchQueryResponse = await response.json()
  const launch = payload.docs[0]

  return launch ? transformLaunch(launch) : null
}
