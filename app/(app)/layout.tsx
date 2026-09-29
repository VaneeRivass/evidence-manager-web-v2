import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app/AppHeader'

// Everything under (app) is behind the login guard in middleware.ts, so the top
// bar can assume a session exists.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="flex-1">{children}</div>
    </>
  )
}
