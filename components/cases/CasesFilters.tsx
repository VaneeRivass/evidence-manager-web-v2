'use client'

import { ChevronDown } from 'lucide-react'
import type { CasesSort } from '@/hooks/useCases'
import type { CaseStatus } from '@/lib/schemas'

const TABS: { value: CaseStatus | undefined; label: string }[] = [
  { value: undefined, label: 'Todos' },
  { value: 'OPEN', label: 'Abiertos' },
  { value: 'CLOSED', label: 'Cerrados' },
]

// Filter by state and choose the order. Both are state the page owns; this
// component only draws them and reports the change.
export function CasesFilters({
  status,
  onStatus,
  sort,
  onSort,
}: {
  status?: CaseStatus
  onStatus: (status: CaseStatus | undefined) => void
  sort: CasesSort
  onSort: (sort: CasesSort) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex gap-1 rounded-full border border-line bg-card p-1">
        {TABS.map((tab) => {
          const active = status === tab.value
          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={active}
              onClick={() => onStatus(tab.value)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                active ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <label className="relative inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-[13px] text-slate-ink">
        <span className="sr-only">Ordenar por</span>
        <select
          value={sort}
          onChange={(event) => onSort(event.target.value as CasesSort)}
          className="appearance-none bg-transparent pr-5 outline-none"
        >
          <option value="updatedAt">Última actualización</option>
          <option value="createdAt">Fecha de creación</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted" />
      </label>
    </div>
  )
}
