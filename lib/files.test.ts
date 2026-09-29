import { describe, expect, it } from 'vitest'
import { MAX_FILE_SIZE_BYTES, validateEvidenceFile } from '@/lib/files'

// RF-17 · the browser rejects a wrong type or an oversized file BEFORE any
// request is made. This is the function that decides.
const file = (name: string, type: string, size: number) =>
  new File([new Uint8Array(size)], name, { type })

describe('validateEvidenceFile', () => {
  it('accepts a PDF within the size limit', () => {
    expect(validateEvidenceFile(file('a.pdf', 'application/pdf', 1000))).toBeNull()
  })

  it('rejects a type that is not allowed', () => {
    expect(
      validateEvidenceFile(file('video.mp4', 'video/mp4', 1000)),
    ).toMatch(/no se puede adjuntar/)
  })

  it('rejects a file over the size limit', () => {
    expect(
      validateEvidenceFile(
        file('big.pdf', 'application/pdf', MAX_FILE_SIZE_BYTES + 1),
      ),
    ).toMatch(/máximo es 5 MB/)
  })
})
