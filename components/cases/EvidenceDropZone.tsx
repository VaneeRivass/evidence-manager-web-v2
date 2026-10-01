'use client'

import { AlertTriangle, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

// The empty state of the evidence panel: drag a file here or pick one. Nothing
// is uploaded yet. The drag state lives here, so the panel does not track it.
export function EvidenceDropZone({
  onChoose,
  fieldError,
}: {
  onChoose: (file: File) => void
  fieldError: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

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
          const file = event.dataTransfer.files[0]
          if (file) {
            onChoose(file)
          }
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
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Reset, so picking the same file again still fires (after an error).
          event.target.value = ''
          if (file) {
            onChoose(file)
          }
        }}
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
