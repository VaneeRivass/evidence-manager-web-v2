'use client'

import { AlertTriangle, Check, CircleAlert, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

// sonner's default icons are bare glyphs; the mockup shows a small coloured
// circle with the glyph inside.
function Dot({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={`grid size-[22px] shrink-0 place-items-center rounded-full text-white ${className}`}
    >
      {children}
    </span>
  )
}

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      closeButton
      theme="light"
      icons={{
        success: (
          <Dot className="bg-positive">
            <Check className="size-3.5" />
          </Dot>
        ),
        error: (
          <Dot className="bg-danger">
            <CircleAlert className="size-3.5" />
          </Dot>
        ),
        warning: (
          <Dot className="bg-warning">
            <AlertTriangle className="size-3.5" />
          </Dot>
        ),
        info: (
          <Dot className="bg-brand">
            <Info className="size-3.5" />
          </Dot>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            'rounded-2xl border border-line bg-card text-ink shadow-[0_16px_40px_rgba(22,28,45,.16)]',
          title: 'text-[13.5px] font-semibold text-ink',
          description: 'text-[12.5px] text-muted',
          actionButton:
            'rounded-full bg-brand px-3 py-1.5 text-[12px] font-semibold text-white',
          cancelButton:
            'rounded-full border border-line bg-card px-3 py-1.5 text-[12px] font-semibold text-ink',
          closeButton: 'border-line bg-card text-muted',
        },
      }}
    />
  )
}
