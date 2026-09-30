'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// A thin wrapper over the design system's Dialog: every screen keeps the same
// small API (open / onClose / title), while the accessibility — focus trap,
// Escape, portal — comes from the component library.
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
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent className="w-[min(460px,92vw)] bg-card p-7 sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="[overflow-wrap:anywhere] text-[19px] font-extrabold tracking-tight text-ink">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
