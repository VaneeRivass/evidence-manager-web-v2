import { AlertTriangle, Upload } from 'lucide-react'
import { FileChip } from '@/components/cases/FileChip'
import { Button } from '@/components/common/Button'

// The file is picked and passes validation, but nothing has been sent yet. As
// the evidence cannot be replaced, this is the one moment to think twice.
export function ChosenFile({
  file,
  onDiscard,
  onAttach,
}: {
  file: File
  onDiscard: () => void
  onAttach: () => void
}) {
  return (
    <div className="grid min-w-0 gap-3.5 rounded-2xl border border-brand/40 bg-brand-soft/30 p-4">
      <FileChip name={file.name} size={file.size} type={file.type} />
      <p className="flex items-center gap-2 text-[12.5px] text-slate-ink">
        <AlertTriangle className="size-4 shrink-0 text-warning" />
        Una vez adjuntado no se podrá cambiar por otro archivo.
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDiscard}>
          Elegir otro
        </Button>
        <Button type="button" onClick={onAttach}>
          <Upload className="size-4" />
          Adjuntar
        </Button>
      </div>
    </div>
  )
}
