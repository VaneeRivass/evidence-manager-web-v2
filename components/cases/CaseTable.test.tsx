import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CaseTable } from '@/components/cases/CaseTable'
import type { Case } from '@/lib/schemas'

// RF-15 · the state with data: each row shows the case, its state and its
// evidence, and links to the detail.
const oneCase: Case = {
  id: 'case-1',
  title: 'Portátil perdido',
  description: 'Equipo extraviado en el aeropuerto',
  status: 'OPEN',
  fileKey: 'users/u/cases/case-1/file.pdf',
  fileName: 'denuncia.pdf',
  fileSize: 3009,
  fileType: 'application/pdf',
  userId: 'user-1',
  createdAt: '2026-09-29T10:00:00.000Z',
  updatedAt: '2026-09-29T10:00:00.000Z',
}

describe('CaseTable', () => {
  it('renders the case with its state, its evidence and a link to the detail', () => {
    render(<CaseTable cases={[oneCase]} />)

    expect(screen.getByText('Portátil perdido')).toBeInTheDocument()
    expect(screen.getByText('Abierto')).toBeInTheDocument()
    expect(screen.getByText('denuncia.pdf')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /portátil perdido/i }),
    ).toHaveAttribute('href', '/cases/case-1')
  })
})
