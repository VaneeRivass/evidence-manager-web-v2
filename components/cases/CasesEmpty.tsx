import { FolderPlus } from 'lucide-react'
import type { CaseStatus } from '@/lib/schemas'

// The empty state explains there is nothing and offers to create the first one.
// With a filter on, the text names the filter (RF-15).
function copyFor(status?: CaseStatus): { title: string; text: string } {
  if (status === 'OPEN') {
    return {
      title: 'No tienes casos abiertos',
      text: 'Todos tus casos están cerrados. Crea uno nuevo o cambia el filtro.',
    }
  }
  if (status === 'CLOSED') {
    return {
      title: 'No tienes casos cerrados',
      text: 'Ningún caso se ha cerrado todavía. Cambia el filtro para verlos todos.',
    }
  }
  return {
    title: 'Todavía no tienes casos',
    text: 'Crea un caso para registrar una incidencia. Después podrás adjuntarle el archivo que la respalda.',
  }
}

export function CasesEmpty({ status }: { status?: CaseStatus }) {
  const copy = copyFor(status)

  return (
    <div className="grid justify-items-center gap-2.5 rounded-2xl border border-line bg-card px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-soft text-brand">
        <FolderPlus className="size-7" />
      </span>
      <h3 className="text-[17px] font-bold text-ink">{copy.title}</h3>
      <p className="max-w-[46ch] text-[13px] text-muted">{copy.text}</p>
    </div>
  )
}
