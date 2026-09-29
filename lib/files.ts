import { formatBytes } from '@/lib/format'

// The same limits the server enforces (RF-10), duplicated here on purpose:
// client-side validation is only fast feedback for the honest user (RNF-04).
// The server checks again and cannot be skipped.
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

/** Why a file cannot be attached, or null when it is fine. */
export function validateEvidenceFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return `«${file.name}» no se puede adjuntar: solo se admiten PDF, JPG o PNG.`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `«${file.name}» pesa ${formatBytes(file.size)} y el máximo es 5 MB.`
  }
  return null
}
