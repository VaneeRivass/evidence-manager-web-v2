import { FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { AppHeader } from '@/components/app/AppHeader'
import { BackButton } from '@/components/common/BackButton'
import { buttonClass } from '@/components/common/Button'

// The in-app 404: a URL that does not exist. It keeps the app's top bar, so the
// person sees their session is still alive and the app has not broken — not an
// empty full-screen dead end. Two ways out: the central view, and back.
export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="grid flex-1 place-items-center p-8">
        <div className="grid max-w-md justify-items-center gap-3 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand">
            <FileQuestion className="size-7" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            No encontramos esta página
          </h1>
          <p className="text-[13px] text-muted">
            Puede que el enlace esté mal escrito o que lo hayamos movido. Tu
            sesión sigue activa.
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <Link href="/cases" className={buttonClass('primary', 'md')}>
              Ir a mis casos
            </Link>
            <BackButton />
          </div>
        </div>
      </main>
    </>
  )
}
