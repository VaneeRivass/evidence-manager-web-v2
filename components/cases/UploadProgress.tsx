import { Loader2 } from 'lucide-react'
import { FileChip } from '@/components/cases/FileChip'
import type { UploadPhase } from '@/hooks/useFileUpload'

// One bar for the three calls behind the upload (RF-17). The message says what
// is happening in the person's terms; the spinner covers the phases with no
// percentage, so it never looks stuck.
export function UploadProgress({
  file,
  phase,
  progress,
}: {
  file: File | null
  phase: UploadPhase
  progress: number
}) {
  const percent = Math.round(progress * 100)
  const message =
    phase === 'requesting'
      ? 'Preparando la subida…'
      : phase === 'confirming'
        ? 'El servidor está verificando el archivo…'
        : `Subiendo… ${percent} %`

  return (
    <div className="grid min-w-0 gap-2.5 rounded-2xl border border-line p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <FileChip
          name={file?.name ?? null}
          size={file?.size ?? null}
          type={file?.type ?? null}
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
