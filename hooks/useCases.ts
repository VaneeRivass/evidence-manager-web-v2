import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Case, CaseFormInput, CaseStatus } from '@/lib/schemas'

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

// Every mutation invalidates the list so it refreshes on its own. Updating also
// writes the new value into the single-case cache, so the detail screen does
// not go stale.
export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CaseFormInput) => api.post<Case>('/api/cases', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  })
}

type UpdateCaseArgs = {
  id: string
  input: Partial<CaseFormInput> & { status?: CaseStatus }
}

export function useUpdateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: UpdateCaseArgs) =>
      api.patch<Case>(`/api/cases/${id}`, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(['case', updated.id], updated)
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}

export function useDeleteCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/cases/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  })
}
