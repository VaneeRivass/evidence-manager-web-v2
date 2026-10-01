import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
  }
})

import { ApiError, api } from '@/lib/api'
import { useDownloadEvidence } from '@/hooks/useFileUpload'
import { toast } from 'sonner'

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
)

// The download asks for a fresh link; that request can fail (RF-12/RF-19). It
// used to reject with nothing shown — this is the fix.
describe('useDownloadEvidence', () => {
  beforeEach(() => vi.clearAllMocks())

  it('warns with the API message when the link cannot be signed', async () => {
    vi.mocked(api.get).mockRejectedValue(
      new ApiError({ title: 'Not Found', status: 404, code: 'FILE_NOT_FOUND' }),
    )

    const { result } = renderHook(() => useDownloadEvidence('case-1'), { wrapper })
    await act(async () => {
      await result.current.download()
    })

    expect(toast.error).toHaveBeenCalledWith(
      'Este caso no tiene ninguna evidencia.',
    )
  })

  it('warns generically when the failure is not an ApiError', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useDownloadEvidence('case-1'), { wrapper })
    await act(async () => {
      await result.current.download()
    })

    expect(toast.error).toHaveBeenCalledWith('Algo salió mal. Inténtalo de nuevo.')
  })
})
