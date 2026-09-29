'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CaseStatusPill } from '@/components/cases/CaseStatusPill'
import { FileChip } from '@/components/cases/FileChip'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { useDeleteCase } from '@/hooks/useCases'
import { ApiError } from '@/lib/api'
import { errorMessage } from '@/lib/messages.es'
import type { Case } from '@/lib/schemas'

// RF-20 · the confirmation names what is lost — the case and, if there is one,
// its evidence — and warns it cannot be undone. A generic "are you sure?" is
// not enough.
export function DeleteCaseDialog({
  open,
  onClose,
  caseToDelete,
}: {
  open: boolean
  onClose: () => void
  caseToDelete: Case
}) {
  const router = useRouter()
  const deleteCase = useDeleteCase()

  const onConfirm = async () => {
    try {
      await deleteCase.mutateAsync(caseToDelete.id)
      onClose()
      toast.success('Caso eliminado')
      router.push('/cases')
    } catch (error) {
      onClose()
      toast.error(
        error instanceof ApiError
          ? errorMessage(error.code, error.params)
          : 'No pudimos eliminar el caso. Inténtalo de nuevo.',
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`¿Eliminar «${caseToDelete.title}»?`}
    >
      <div className="grid gap-4">
        <div className="grid gap-2 rounded-2xl border border-danger/30 bg-danger-soft/40 p-3.5 text-[13px] text-slate-ink">
          <div className="flex items-center gap-2">
            <CaseStatusPill status={caseToDelete.status} />
            El caso, con su título y descripción
          </div>
          {caseToDelete.fileName ? (
            <div className="flex items-center gap-2">
              <FileChip
                name={caseToDelete.fileName}
                size={caseToDelete.fileSize}
                type={caseToDelete.fileType}
              />
            </div>
          ) : null}
        </div>

        <p className="flex items-center gap-2 text-[13px] font-semibold text-danger">
          <Trash2 className="size-4" />
          El archivo se borra definitivamente. No se puede deshacer.
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={deleteCase.isPending}
          >
            Eliminar caso y archivo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
