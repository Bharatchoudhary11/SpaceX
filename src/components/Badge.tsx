import type { ReactNode } from 'react'

interface BadgeProps {
  variant: 'success' | 'failure' | 'pending'
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>
}
