import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Case, CaseStatus } from '@/lib/schemas'

export type CasesSort = 'updatedAt' | 'createdAt'

export type CasesFilters = {
  status?: CaseStatus
  sort: CasesSort
}

export type CasesResponse = { items: Case[]; total: number }

// GET /cases. The filters are part of the cache key, so switching tabs or the
// order fetches (and caches) each combination separately.
export function useCases(filters: CasesFilters) {
  const params = new URLSearchParams()
  if (filters.status) {
    params.set('status', filters.status)
  }
  params.set('sort', filters.sort)
  const query = params.toString()

  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => api.get<CasesResponse>(`/api/cases?${query}`),
  })
}
