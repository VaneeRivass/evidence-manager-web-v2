// Small display helpers. They turn numbers and dates into what a person reads.

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

// "hace 2 h", "ayer", "24 sep" — as the design shows it.
export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return 'ahora'
  }
  if (diff < hour) {
    return `hace ${Math.round(diff / minute)} min`
  }
  if (diff < day) {
    return `hace ${Math.round(diff / hour)} h`
  }
  if (diff < 2 * day) {
    return 'ayer'
  }
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}
