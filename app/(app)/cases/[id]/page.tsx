'use client'

import { ArrowLeft, Lock, Pencil, Trash2, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { CaseFormDialog } from '@/components/cases/CaseFormDialog'
import { CaseStatusPill } from '@/components/cases/CaseStatusPill'
import { CasesError } from '@/components/cases/CasesError'
import { DeleteCaseDialog } from '@/components/cases/DeleteCaseDialog'
import { FileChip } from '@/components/cases/FileChip'
import { useCase } from '@/hooks/useCase'
import { useUpdateCase } from '@/hooks/useCases'
import { formatRelative } from '@/lib/format'

const actionButton =
  'inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-[13px] font-semibold text-ink transition hover:border-brand disabled:opacity-60'

// /cases/[id] · the detail screen. It reads one case, and from here a person
// edits it, changes its state or deletes it. Attaching evidence arrives in
// WEB #8.
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
    content = (
      <div className="mt-5">
        <CasesError error={error} onRetry={() => refetch()} />
      </div>
    )
  } else if (item) {
    content = (
      <>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <section className="grid min-w-0 gap-4 rounded-3xl border border-line bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CaseStatusPill status={item.status} />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className={actionButton}
                >
                  <Pencil className="size-4" />
                  Editar
                </button>
                <button
                  type="button"
                  disabled={updateCase.isPending}
                  onClick={() =>
                    updateCase.mutate({
                      id: item.id,
                      input: {
                        status: item.status === 'OPEN' ? 'CLOSED' : 'OPEN',
                      },
                    })
                  }
                  className={actionButton}
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
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-card px-3.5 py-1.5 text-[13px] font-semibold text-danger transition hover:border-danger"
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </button>
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
                <b className="font-semibold text-ink">
                  {formatRelative(item.createdAt)}
                </b>
              </span>
              <span>
                Actualizado{' '}
                <b className="font-semibold text-ink">
                  {formatRelative(item.updatedAt)}
                </b>
              </span>
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-3xl border border-line bg-card p-6">
            <h2 className="text-[15px] font-bold">Evidencia</h2>
            {item.fileName ? (
              <FileChip
                name={item.fileName}
                size={item.fileSize}
                type={item.fileType}
              />
            ) : (
              <p className="text-[13px] text-muted">
                Todavía sin evidencia. Se adjunta en el siguiente paso.
              </p>
            )}
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
    <main className="mx-auto w-full max-w-4xl p-8">
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
