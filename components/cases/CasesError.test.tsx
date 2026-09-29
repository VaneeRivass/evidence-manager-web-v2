import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CasesError } from '@/components/cases/CasesError'

// RF-15 · the error state: the code in sight and a retry button, never a blank
// screen. A failure that never reached the API has no code.
describe('CasesError', () => {
  it('shows the network code and retries when asked', () => {
    const onRetry = vi.fn()
    render(<CasesError error={new Error('boom')} onRetry={onRetry} />)

    expect(screen.getByText('NETWORK_ERROR')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
