'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, fieldClass } from '@/components/common/Field'
import { Modal } from '@/components/common/Modal'
import { useCreateCase, useUpdateCase } from '@/hooks/useCases'
import { applyApiError } from '@/lib/form'
import { caseFormSchema, type Case, type CaseFormInput } from '@/lib/schemas'

// One dialog for both creating and editing: the fields and the rules are the
// same (RF-05, RF-08); only the title and the button text change.
export function CaseFormDialog({
  open,
  onClose,
  caseToEdit,
}: {
  open: boolean
  onClose: () => void
  caseToEdit?: Case
}) {
  const router = useRouter()
  const isEdit = Boolean(caseToEdit)
  const createCase = useCreateCase()
  const updateCase = useUpdateCase()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormInput>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      title: caseToEdit?.title ?? '',
      description: caseToEdit?.description ?? '',
    },
  })

  // The dialog is always mounted: refresh its fields each time it opens, so an
  // edit starts from the case's values and a new case starts empty.
  useEffect(() => {
    if (open) {
      reset({
        title: caseToEdit?.title ?? '',
        description: caseToEdit?.description ?? '',
      })
    }
  }, [open, caseToEdit, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (caseToEdit) {
        await updateCase.mutateAsync({ id: caseToEdit.id, input: values })
        onClose()
        toast.success('Cambios guardados')
      } else {
        const created = await createCase.mutateAsync(values)
        onClose()
        router.push(`/cases/${created.id}`)
        toast.success('Caso creado')
      }
    } catch (error) {
      applyApiError(error, setError)
    }
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar caso' : 'Nuevo caso'}
    >
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {!isEdit ? (
          <p className="text-[13px] text-muted">
            Podrás adjuntar la evidencia en el siguiente paso.
          </p>
        ) : null}

        <Field label="Título" id="title" error={errors.title?.message}>
          <input
            id="title"
            className={fieldClass}
            maxLength={120}
            {...register('title')}
          />
        </Field>

        <Field
          label="Descripción"
          id="description"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            className={`${fieldClass} min-h-24 resize-y`}
            maxLength={2000}
            {...register('description')}
          />
        </Field>

        {errors.root?.message ? (
          <p className="rounded-xl bg-danger-soft px-3 py-2 text-[13px] text-danger">
            {errors.root.message}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-card px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-brand"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-strong disabled:opacity-60"
          >
            {isEdit ? 'Guardar cambios' : 'Crear caso'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
