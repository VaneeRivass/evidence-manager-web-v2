'use client'

import { AlertTriangle, CheckCircle2, Download, Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FileChip } from '@/components/cases/FileChip'
import { Button } from '@/components/common/Button'
import { useDownloadEvidence, useUploadEvidence } from '@/hooks/useFileUpload'
import { ApiError } from '@/lib/api'
import { validateEvidenceFile } from '@/lib/files'
import { errorMessage } from '@/lib/messages.es'
import type { Case } from '@/lib/schemas'

// The evidence of one case, as the design shows it: a drop zone that becomes a
// chosen file, then a single progress bar, then the verified file. To the person
// it is one action; behind it are three calls (RF-17).
//
// Validation errors stay next to the zone (they are the person's to fix, RF-18);
// operation errors become a floating notice with a retry (RF-19).
export function EvidencePanel({ caseItem }: { caseItem: Case }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<File | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const { start, phase, progress } = useUploadEvidence(caseItem.id)
  const { download, downloading } = useDownloadEvidence(caseItem.id)

  const busy = phase !== 'idle'

  const choose = (file: File | undefined) => {
    if (!file) {
      return
    }
    const error = validateEvidenceFile(file)
    if (error) {
      setFieldError(error)
      setSelected(null)
      return
    }
    setFieldError(null)
    setSelected(file)
  }

  const attach = async () => {
    if (!selected) {
      return
    }
    const result = await start(selected)
    if (result.ok) {
      setSelected(null)
      toast.success('Evidencia adjuntada', {
        description: 'El archivo ya está en el caso.',
      })
      return
    }
    const code =
      result.error instanceof ApiError ? result.error.code : 'UPLOAD_FAILED'
    const message =
      result.error instanceof ApiError
        ? errorMessage(result.error.code, result.error.params)
        : errorMessage('UPLOAD_FAILED')
    toast.error(message, {
      description: <span className="font-mono text-[11px]">{code}</span>,
      action: { label: 'Reintentar', onClick: () => void attach() },
    })
  }

  // A case that already holds a file: show it verified, with a download button.
  if (caseItem.fileName) {
    return (
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line p-3.5">
          <FileChip
            name={caseItem.fileName}
            size={caseItem.fileSize}
            type={caseItem.fileType}
          />
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-positive-strong">
            <CheckCircle2 className="size-3.5" />
            Verificada
          </span>
          <Button
            type="button"
            className="ml-auto"
            onClick={download}
            disabled={downloading}
          >
            <Download className="size-4" />
            Descargar
          </Button>
        </div>
        <p className="text-[12.5px] text-muted">
          Cada caso guarda un único archivo y no se puede reemplazar.
        </p>
      </div>
    )
  }

  if (busy) {
    const percent = Math.round(progress * 100)
    const message =
      phase === 'requesting'
        ? 'Preparando la subida…'
        : phase === 'confirming'
          ? 'El servidor está verificando el archivo…'
          : `Subiendo… ${percent} %`

    return (
      <div className="grid gap-2.5 rounded-2xl border border-line p-3.5">
        <div className="flex items-center gap-3">
          <FileChip
            name={selected?.name ?? null}
            size={selected?.size ?? null}
            type={selected?.type ?? null}
          />
          <span className="ml-auto text-[12px] tabular-nums text-muted">
            {percent} %
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="flex items-center gap-2 text-[12.5px] text-slate-ink">
          {phase !== 'uploading' ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin text-brand" />
          ) : null}
          {message}
        </p>
        {phase === 'uploading' ? (
          <p className="text-[12px] text-muted">
            No cierres esta pestaña hasta que termine.
          </p>
        ) : null}
      </div>
    )
  }

  if (selected) {
    return (
      <div className="grid gap-3.5 rounded-2xl border border-brand/40 bg-brand-soft/30 p-4">
        <FileChip name={selected.name} size={selected.size} type={selected.type} />
        <p className="flex items-center gap-2 text-[12.5px] text-slate-ink">
          <AlertTriangle className="size-4 shrink-0 text-warning" />
          Una vez adjuntado no se podrá cambiar por otro archivo.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelected(null)
              setFieldError(null)
            }}
          >
            Elegir otro
          </Button>
          <Button type="button" onClick={attach}>
            <Upload className="size-4" />
            Adjuntar
          </Button>
        </div>
      </div>
    )
  }

  // No file yet: the drop zone. Nothing is uploaded until the person confirms.
  return (
    <div className="grid gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          choose(event.dataTransfer.files[0])
        }}
        className={`grid justify-items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${
          dragging ? 'border-brand bg-brand-soft' : 'border-brand/40 bg-brand-soft/30'
        }`}
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-card text-brand shadow-sm">
          <Upload className="size-5" />
        </span>
        <strong className="text-sm">Arrastra aquí el archivo</strong>
        <p className="text-[12.5px] text-muted">
          o{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-brand underline"
          >
            elígelo desde tu equipo
          </button>
        </p>
        <p className="text-[12.5px] text-muted">
          PDF, JPG o PNG de hasta 5 MB. Un archivo por caso.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        className="hidden"
        onChange={(event) => choose(event.target.files?.[0])}
      />

      {fieldError ? (
        <p className="flex items-center gap-2 text-[13px] text-danger">
          <AlertTriangle className="size-4 shrink-0" />
          {fieldError}
        </p>
      ) : null}
    </div>
  )
}
