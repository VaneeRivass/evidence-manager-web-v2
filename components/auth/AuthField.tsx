import type { InputHTMLAttributes } from 'react'
import { Field, fieldClass } from '@/components/common/Field'

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
    <Field label={label} id={id} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={fieldClass}
        {...input}
      />
    </Field>
  )
}
