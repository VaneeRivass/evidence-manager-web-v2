import { CheckCircle2, Download } from 'lucide-react'
import { FileIcon, fileTypeLabel } from '@/components/cases/FileChip'
import { Button } from '@/components/common/Button'
import { formatBytes } from '@/lib/format'

// The case already holds an evidence: a clean single row — icon, the file's
// details stacked, and the download. The name truncates, so a long one never
// reflows the row.
export function VerifiedFile({
  name,
  size,
  type,
  onDownload,
  downloading,
}: {
  name: string | null
  size: number | null
  type: string | null
  onDownload: () => void
  downloading: boolean
}) {
  return (
    <div className="grid min-w-0 gap-3">
      <div className="flex min-w-0 items-center gap-3.5 rounded-2xl border border-line p-4">
        <FileIcon type={type} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-ink">{name}</p>
          <p className="text-[12px] text-muted">
            {fileTypeLabel(type)}
            {size !== null ? ` · ${formatBytes(size)}` : ''}
          </p>
          <span className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-positive-strong">
            <CheckCircle2 className="size-3.5" />
            Verificada
          </span>
        </div>
        <Button
          type="button"
          className="shrink-0"
          onClick={onDownload}
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
