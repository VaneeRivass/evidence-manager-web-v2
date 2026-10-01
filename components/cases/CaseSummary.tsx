import { Lock, Pencil, Trash2, Unlock } from 'lucide-react'
import { CaseStatusPill } from '@/components/cases/CaseStatusPill'
import { Button } from '@/components/common/Button'
import { formatRelative } from '@/lib/format'
import type { Case } from '@/lib/schemas'

// The card at the top of the detail: the state, the actions, the case itself and
// its dates. It only draws and emits events; the screen owns the state.
export function CaseSummary({
  item,
  onEdit,
  onToggleStatus,
  onDelete,
  statusPending,
}: {
  item: Case
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
  statusPending: boolean
}) {
  return (
    <section className="grid min-w-0 gap-4 rounded-3xl border border-line bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <CaseStatusPill status={item.status} />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={statusPending}
            onClick={onToggleStatus}
          >
            {item.status === 'OPEN' ? (
              <>
                <Lock className="size-4" />
                Cerrar caso
              </>
            ) : (
              <>
                <Unlock className="size-4" />
                Reabrir
              </>
            )}
          </Button>
          <Button type="button" variant="dangerOutline" size="sm" onClick={onDelete}>
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <h1 className="[overflow-wrap:anywhere] text-[26px] font-extrabold leading-tight tracking-tight">
        {item.title}
      </h1>
      <p className="max-w-[62ch] [overflow-wrap:anywhere] leading-relaxed text-slate-ink">
        {item.description}
      </p>
      <div className="flex flex-wrap gap-4 border-t border-line pt-3.5 text-[12.5px] text-muted">
        <span>
          Creado{' '}
          <b className="font-semibold text-ink">{formatRelative(item.createdAt)}</b>
        </span>
        <span>
          Actualizado{' '}
          <b className="font-semibold text-ink">{formatRelative(item.updatedAt)}</b>
        </span>
      </div>
    </section>
  )
}
