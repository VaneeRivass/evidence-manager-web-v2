import type { ButtonHTMLAttributes } from 'react'

// One place for the pill button: every screen shares its look and its
// focus/disabled states, instead of copying the same classes around.
type Variant = 'primary' | 'outline' | 'danger' | 'dangerOutline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_6px_16px_rgba(79,104,241,.28)] hover:bg-brand-strong',
  outline: 'border border-line bg-card text-ink hover:border-brand',
  danger: 'bg-danger text-white hover:opacity-90',
  dangerOutline: 'border border-danger/40 bg-card text-danger hover:border-danger',
  ghost: 'text-muted hover:text-ink',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[13px]',
  md: 'px-4 py-2 text-[13px]',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: { variant?: Variant; size?: Size } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
