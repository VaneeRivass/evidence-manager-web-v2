import { formatBytes } from '@/lib/format'

// A small badge for the file type, so a PDF and an image are told apart at a
// glance without an icon library for every MIME type.
function badgeFor(type: string | null): { text: string; className: string } {
  if (type === 'application/pdf') {
    return { text: 'PDF', className: 'bg-danger/10 text-danger' }
  }
  if (type === 'image/png') {
    return { text: 'PNG', className: 'bg-positive-soft text-positive-strong' }
  }
  if (type === 'image/jpeg') {
    return { text: 'JPG', className: 'bg-positive-soft text-positive-strong' }
  }
  return { text: 'DOC', className: 'bg-line text-muted' }
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

  const badge = badgeFor(type)

  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span
        className={`grid h-6 w-5 shrink-0 place-items-center rounded text-[9px] font-extrabold ${badge.className}`}
      >
        {badge.text}
      </span>
      <span className="max-w-[18ch] truncate">{name}</span>
      {size !== null ? <span className="text-muted">{formatBytes(size)}</span> : null}
    </span>
  )
}
