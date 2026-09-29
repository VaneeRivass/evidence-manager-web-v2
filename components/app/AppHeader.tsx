'use client'

import { FileCheck2, LogOut } from 'lucide-react'
import { useLogout, useSession } from '@/hooks/useSession'

const initials = (email?: string) => (email ? email.slice(0, 2).toUpperCase() : '')

// The application's top bar: who is signed in and the way out. The email is the
// only thing the client ever learns about the session (it cannot read the
// cookie), which is why it comes from /auth/me.
export function AppHeader() {
  const { data: session } = useSession()
  const logout = useLogout()

  return (
    <header className="flex items-center justify-between border-b border-line bg-card px-7 py-3.5">
      <div className="flex items-center gap-2.5 text-[15px] font-bold text-ink">
        <span className="grid size-8 place-items-center rounded-[10px] bg-brand text-white">
          <FileCheck2 className="size-4" />
        </span>
        Gestor de evidencias
      </div>

      <div className="flex items-center gap-3.5 text-[13px] text-muted">
        <span className="hidden sm:inline">{session?.email}</span>
        <span className="grid size-8 place-items-center rounded-full bg-positive-soft text-xs font-bold text-positive-strong">
          {initials(session?.email)}
        </span>
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex items-center gap-1.5 text-muted transition hover:text-ink disabled:opacity-60"
        >
          <LogOut className="size-4" />
          Salir
        </button>
      </div>
    </header>
  )
}
