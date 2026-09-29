import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CasesEmpty } from '@/components/cases/CasesEmpty'

// RF-15 · the empty state: it explains there is nothing and offers to create.
describe('CasesEmpty', () => {
  it('offers to create the first case when no filter is on', () => {
    render(<CasesEmpty onCreate={() => {}} />)

    expect(screen.getByText('Todavía no tienes casos')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /crear mi primer caso/i }),
    ).toBeInTheDocument()
  })

  it('names the filter and hides the create button when one is active', () => {
    render(<CasesEmpty status="CLOSED" onCreate={() => {}} />)

    expect(screen.getByText('No tienes casos cerrados')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /crear/i }),
    ).not.toBeInTheDocument()
  })
})
