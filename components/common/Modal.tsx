'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

// A small accessible modal built on the native <dialog> element, which gives us
// the focus trap, Escape to close and the backdrop for free — no extra library.
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) {
      return
    }
    if (open && !dialog.open) {
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      className="m-auto w-[min(460px,92vw)] rounded-3xl bg-card p-7 text-ink shadow-2xl backdrop:bg-ink/45"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="min-w-0 [overflow-wrap:anywhere] text-[19px] font-extrabold tracking-tight">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="text-muted transition hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </dialog>
  )
}
