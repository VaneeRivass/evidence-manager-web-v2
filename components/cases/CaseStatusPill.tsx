import type { CaseStatus } from '@/lib/schemas'

// The state of a case, as a pill with a dot (the design's "Abierto" / "Cerrado").
export function CaseStatusPill({ status }: { status: CaseStatus }) {
  const open = status === 'OPEN'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        open ? 'bg-brand-soft text-brand-strong' : 'bg-line text-muted'
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {open ? 'Abierto' : 'Cerrado'}
    </span>
  )
}
