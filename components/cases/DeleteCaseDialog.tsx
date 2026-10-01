'use client'

import { CircleAlert, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CaseStatusPill } from '@/components/cases/CaseStatusPill'
import { FileChip } from '@/components/cases/FileChip'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { useDeleteCase } from '@/hooks/useCases'
import { ApiError } from '@/lib/api'
import { clientMessages, errorMessage } from '@/lib/messages.es'
import type { Case } from '@/lib/schemas'

// RF-20 · the confirmation names what is lost — the case, with its title and
// description, and, when there is one, its evidence — and warns it cannot be
// undone. A generic "are you sure?" is not enough.
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
  const hasFile = Boolean(caseToDelete.fileName)

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
          : clientMessages.deleteCaseFailed,
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="¿Estás seguro de eliminar este caso?"
      icon={
        <span
          aria-hidden
          className="grid size-11 place-items-center rounded-[14px] bg-danger-soft text-danger"
        >
          <Trash2 className="size-[22px]" />
        </span>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-2.5 rounded-2xl border border-danger/30 bg-danger-soft/40 p-3.5">
          <CaseStatusPill status={caseToDelete.status} className="justify-self-start" />
          <p className="[overflow-wrap:anywhere] text-[13.5px] font-semibold text-ink">
            {caseToDelete.title}
          </p>
          <p className="line-clamp-3 text-[13px] text-muted">
            {caseToDelete.description}
          </p>
          {hasFile ? (
            <div className="border-t border-danger/20 pt-2.5">
              <FileChip
                name={caseToDelete.fileName}
                size={caseToDelete.fileSize}
                type={caseToDelete.fileType}
              />
            </div>
          ) : null}
        </div>

        <p className="flex items-center gap-2 text-[13px] font-semibold text-danger">
          <CircleAlert className="size-4 shrink-0" />
          Se borrará definitivamente y no se puede deshacer.
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
            {hasFile ? 'Eliminar caso y archivo' : 'Eliminar caso'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
