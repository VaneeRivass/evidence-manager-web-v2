import { FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { buttonClass } from '@/components/common/Button'

// The page for a URL that does not exist. It is rendered inside the root layout
// (so it carries the palette and the fonts) but outside the (app) layout, so it
// has no header: an unknown URL belongs to no segment. Better explained than
// hidden behind a silent redirect.
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <div className="grid max-w-md justify-items-center gap-3 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand">
          <FileQuestion className="size-7" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Esta página no existe
        </h1>
        <p className="text-[13px] text-muted">
          La dirección a la que has ido no lleva a ningún sitio. Puede estar mal
          escrita o haber dejado de existir.
        </p>
        <Link href="/cases" className={buttonClass('primary', 'md', 'mt-1')}>
          Volver a mis casos
        </Link>
      </div>
    </main>
  )
}
