import type { InputHTMLAttributes } from 'react'

// A real <label> tied to a real <input>, with its error below (RF-18).
// The keyboard works; no onClick on a div.
export function AuthField({
  label,
  id,
  error,
  ...input
}: {
  label: string
  id: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className="rounded-2xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft aria-invalid:border-danger aria-invalid:ring-danger-soft"
        {...input}
      />
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </div>
  )
}
