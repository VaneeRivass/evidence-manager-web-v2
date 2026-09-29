import type { ReactNode } from 'react'

// A label tied to its control, with the error below it (RF-18). The control is
// passed in as a child, so the same field works for an input or a textarea.
export function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </div>
  )
}

// The shared look of every input and textarea in the application.
export const fieldClass =
  'w-full rounded-2xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft aria-invalid:border-danger aria-invalid:ring-danger-soft'
