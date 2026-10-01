'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { CaseFormDialog } from '@/components/cases/CaseFormDialog'
import { CasesError } from '@/components/cases/CasesError'
import { CaseSummary } from '@/components/cases/CaseSummary'
import { DeleteCaseDialog } from '@/components/cases/DeleteCaseDialog'
import { EvidencePanel } from '@/components/cases/EvidencePanel'
import { useCase } from '@/hooks/useCase'
import { useUpdateCase } from '@/hooks/useCases'
import { ApiError } from '@/lib/api'
import { errorMessage } from '@/lib/messages.es'

// /cases/[id] · the detail screen. It reads one case; from here a person edits
// it, changes its state, deletes it, and attaches or downloads its evidence.
export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: item, isPending, isError, error, refetch } = useCase(id)
  const updateCase = useUpdateCase()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  let content: ReactNode = null
  if (isPending) {
    content = (
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="h-56 animate-pulse rounded-3xl border border-line bg-card" />
        <div className="h-56 animate-pulse rounded-3xl border border-line bg-card" />
      </div>
    )
  } else if (isError) {
    const code = error instanceof ApiError ? error.code : undefined
    const caseProblem = code === 'CASE_FORBIDDEN' || code === 'CASE_NOT_FOUND'
    content = (
      <div className="mt-5">
        <CasesError
          error={error}
          title="No pudimos abrir este caso"
          message={
            caseProblem
              ? errorMessage(code ?? '')
              : 'Puede ser un problema de conexión. Vuelve a intentarlo.'
          }
          onRetry={caseProblem ? undefined : () => refetch()}
        />
      </div>
    )
  } else if (item) {
    content = (
      <>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <CaseSummary
            item={item}
            onEdit={() => setEditOpen(true)}
            onToggleStatus={() =>
              updateCase.mutate({
                id: item.id,
                input: { status: item.status === 'OPEN' ? 'CLOSED' : 'OPEN' },
              })
            }
            onDelete={() => setDeleteOpen(true)}
            statusPending={updateCase.isPending}
          />

          <section className="grid min-w-0 gap-4 self-start rounded-3xl border border-line bg-card p-6">
            <h2 className="text-[15px] font-bold">Evidencia</h2>
            <EvidencePanel caseItem={item} />
          </section>
        </div>

        <CaseFormDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          caseToEdit={item}
        />
        <DeleteCaseDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          caseToDelete={item}
        />
      </>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-4 sm:p-8">
      <Link
        href="/cases"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Mis casos
      </Link>

      {content}
    </main>
  )
}
