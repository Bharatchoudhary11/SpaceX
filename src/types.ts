export interface LaunchLinks {
  patchSmall: string | null
  patchLarge: string | null
  wikipedia: string | null
  webcast: string | null
  article: string | null
}

export interface Launch {
  id: string
  name: string
  dateUtc: string
  success: boolean | null
  details: string | null
  rocketName: string
  links: LaunchLinks
}
