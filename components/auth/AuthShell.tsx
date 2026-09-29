import { FileCheck2 } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * The split screen shared by login and register: a navy panel on the left, the
 * form on the right. Presentational only — it knows nothing about data.
 */
export function AuthShell({
  heading,
  description,
  children,
}: {
  heading: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-brand/50 blur-sm"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-positive/40 blur-sm"
        />

        <div className="relative flex items-center gap-2.5 text-[15px] font-bold">
          <span className="grid size-8 place-items-center rounded-[10px] bg-brand">
            <FileCheck2 className="size-4" />
          </span>
          Gestor de evidencias
        </div>

        <div className="relative">
          <h2 className="max-w-[14ch] text-3xl font-extrabold leading-tight tracking-tight">
            {heading}
          </h2>
          <p className="mt-3 max-w-[34ch] text-white/70">{description}</p>
        </div>
      </aside>

      <section className="flex items-center justify-center p-8 sm:p-14">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  )
}
