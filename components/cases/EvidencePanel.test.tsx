import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  }
})

import { EvidencePanel } from '@/components/cases/EvidencePanel'
import { api } from '@/lib/api'
import type { Case } from '@/lib/schemas'
import { renderWithProviders } from '@/test/render'

const caseWithoutFile: Case = {
  id: 'case-1',
  title: 'Caso sin evidencia',
  description: 'Una descripción',
  status: 'OPEN',
  fileKey: null,
  fileName: null,
  fileSize: null,
  fileType: null,
  userId: 'user-1',
  createdAt: '2026-09-29T10:00:00.000Z',
  updatedAt: '2026-09-29T10:00:00.000Z',
}

const pick = (container: HTMLElement, file: File) => {
  const input = container.querySelector('input[type="file"]')
  if (!input) {
    throw new Error('file input not found')
  }
  fireEvent.change(input, { target: { files: [file] } })
}

// RF-17 · the browser rejects a wrong type or an oversized file before any
// request; a good one moves to the "chosen file" step.
describe('EvidencePanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a wrong type without calling the API', () => {
    const { container } = renderWithProviders(
      <EvidencePanel caseItem={caseWithoutFile} />,
    )

    pick(container, new File(['x'], 'video.mp4', { type: 'video/mp4' }))

    expect(screen.getByText(/no se puede adjuntar/i)).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
    expect(
      screen.queryByRole('button', { name: /adjuntar/i }),
    ).not.toBeInTheDocument()
  })

  it('offers to attach a valid file', () => {
    const { container } = renderWithProviders(
      <EvidencePanel caseItem={caseWithoutFile} />,
    )

    pick(container, new File(['x'], 'evidencia.pdf', { type: 'application/pdf' }))

    expect(screen.getByText('evidencia.pdf')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /adjuntar/i })).toBeInTheDocument()
    expect(api.post).not.toHaveBeenCalled()
  })
})
