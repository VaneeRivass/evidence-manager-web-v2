import { formatBytes } from '@/lib/format'

// The document icon of the design: a coloured page with the top-right corner
// folded (clip-path), and the type at the bottom.
function iconFor(type: string | null): { label: string; color: string } {
  if (type === 'application/pdf') {
    return { label: 'PDF', color: '#c8414b' }
  }
  if (type === 'image/png') {
    return { label: 'PNG', color: '#00bb9c' }
  }
  if (type === 'image/jpeg') {
    return { label: 'JPG', color: '#00bb9c' }
  }
  return { label: 'DOC', color: '#3e4675' }
}

export function fileTypeLabel(type: string | null): string {
  return iconFor(type).label
}

export function FileIcon({ type }: { type: string | null }) {
  const { label, color } = iconFor(type)

  return (
    <span
      aria-hidden
      className="flex h-8 w-[26px] shrink-0 items-end justify-center rounded-[4px] pb-1 text-[8.5px] font-extrabold text-white"
      style={{
        clipPath: 'polygon(0 0, 66% 0, 100% 27%, 100% 100%, 0 100%)',
        background: `linear-gradient(225deg, rgba(255,255,255,.5) 0 19%, transparent 19%), ${color}`,
      }}
    >
      {label}
    </span>
  )
}

export function FileChip({
  name,
  size,
  type,
}: {
  name: string | null
  size: number | null
  type: string | null
}) {
  if (!name) {
    return <span className="text-[13px] text-muted/70">Sin evidencia</span>
  }

  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-2 text-[13px]">
      <FileIcon type={type} />
      <span className="min-w-0 truncate">{name}</span>
      {size !== null ? (
        <span className="shrink-0 whitespace-nowrap text-muted">
          {formatBytes(size)}
        </span>
      ) : null}
    </span>
  )
}
