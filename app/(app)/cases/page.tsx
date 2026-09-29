'use client'

import { useState } from 'react'
import { CasesEmpty } from '@/components/cases/CasesEmpty'
import { CasesError } from '@/components/cases/CasesError'
import { CasesFilters } from '@/components/cases/CasesFilters'
import { CaseTable } from '@/components/cases/CaseTable'
import { CaseTableSkeleton } from '@/components/cases/CaseTableSkeleton'
import { useCases, type CasesSort } from '@/hooks/useCases'
import type { CaseStatus } from '@/lib/schemas'

// The screen composes; it does not fetch. It owns the filters and picks which
// of the three states the list shows (RF-15): loading, error, empty — or data.
export default function CasesPage() {
  const [status, setStatus] = useState<CaseStatus | undefined>(undefined)
  const [sort, setSort] = useState<CasesSort>('updatedAt')

  const { data, isPending, isError, error, refetch } = useCases({ status, sort })

  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mis casos</h1>
          {data ? (
            <p className="mt-1 text-[13px] text-muted">
              {data.total} {data.total === 1 ? 'caso' : 'casos'}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <CasesFilters
          status={status}
          onStatus={setStatus}
          sort={sort}
          onSort={setSort}
        />
      </div>

      <div className="mt-5">
        {isPending ? <CaseTableSkeleton /> : null}

        {isError ? <CasesError error={error} onRetry={() => refetch()} /> : null}

        {data && data.items.length === 0 ? <CasesEmpty status={status} /> : null}

        {data && data.items.length > 0 ? <CaseTable cases={data.items} /> : null}
      </div>
    </main>
  )
}
