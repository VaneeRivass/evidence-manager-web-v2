import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}))

import { DeleteCaseDialog } from '@/components/cases/DeleteCaseDialog'
import type { Case } from '@/lib/schemas'
import { renderWithProviders } from '@/test/render'

const base: Case = {
  id: 'case-1',
  title: 'Caso de prueba',
  description: 'Una descripción del caso',
  status: 'OPEN',
  fileKey: null,
  fileName: null,
  fileSize: null,
  fileType: null,
  userId: 'user-1',
  createdAt: '2026-09-29T10:00:00.000Z',
  updatedAt: '2026-09-29T10:00:00.000Z',
}

// RF-20 · the confirmation names what is lost and warns it cannot be undone.
describe('DeleteCaseDialog', () => {
  it('names the case and its file, and warns it cannot be undone', async () => {
    renderWithProviders(
      <DeleteCaseDialog
        open
        onClose={() => {}}
        caseToDelete={{
          ...base,
          fileName: 'factura.pdf',
          fileSize: 1200,
          fileType: 'application/pdf',
        }}
      />,
    )

    expect(await screen.findByText('Caso de prueba')).toBeInTheDocument()
    expect(screen.getByText('Una descripción del caso')).toBeInTheDocument()
    expect(screen.getByText(/no se puede deshacer/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /eliminar caso y archivo/i }),
    ).toBeInTheDocument()
  })

  it('does not offer to delete a file when there is none', async () => {
    renderWithProviders(
      <DeleteCaseDialog open onClose={() => {}} caseToDelete={base} />,
    )

    expect(
      await screen.findByRole('button', { name: /^eliminar caso$/i }),
    ).toBeInTheDocument()
  })
})
