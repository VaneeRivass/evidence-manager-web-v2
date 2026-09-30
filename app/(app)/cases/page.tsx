'use client'

import { Plus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { CaseFormDialog } from '@/components/cases/CaseFormDialog'
import { CasesEmpty } from '@/components/cases/CasesEmpty'
import { CasesError } from '@/components/cases/CasesError'
import { CasesFilters } from '@/components/cases/CasesFilters'
import { CaseTable } from '@/components/cases/CaseTable'
import { CaseTableSkeleton } from '@/components/cases/CaseTableSkeleton'
import { Button } from '@/components/common/Button'
import { useCases, type CasesSort } from '@/hooks/useCases'
import type { CaseStatus } from '@/lib/schemas'

// The screen composes; it does not fetch. It owns the filters and picks ONE of
// the states (RF-15): loading, error, empty, or the table. Never two at once.
export default function CasesPage() {
  const [status, setStatus] = useState<CaseStatus | undefined>(undefined)
  const [sort, setSort] = useState<CasesSort>('updatedAt')
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isPending, isError, error, refetch } = useCases({ status, sort })

  const isEmpty = !isPending && !isError && data !== undefined && data.items.length === 0

  let content: ReactNode = null
  if (isPending) {
    content = <CaseTableSkeleton />
  } else if (isError) {
    content = <CasesError error={error} onRetry={() => refetch()} />
  } else if (data && data.items.length === 0) {
    content = <CasesEmpty status={status} onCreate={() => setCreateOpen(true)} />
  } else if (data) {
    content = <CaseTable cases={data.items} />
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mis casos</h1>
          {!isPending && !isError && data ? (
            <p className="mt-1 text-[13px] text-muted">
              {data.total > data.items.length
                ? `Mostrando los ${data.items.length} más recientes de ${data.total}`
                : `${data.total} ${data.total === 1 ? 'caso' : 'casos'}`}
            </p>
          ) : null}
        </div>

        {/* With an empty list the CTA lives in the empty state, so the header
            does not offer a second way to create (matches the design). */}
        {isEmpty ? null : (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Nuevo caso
          </Button>
        )}
      </div>

      <div className="mt-5">
        <CasesFilters
          status={status}
          onStatus={setStatus}
          sort={sort}
          onSort={setSort}
        />
      </div>

      <div className="mt-5">{content}</div>

      <CaseFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </main>
  )
}
