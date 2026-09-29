import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Case } from '@/lib/schemas'

// GET /cases/:id. A 404 (gone or someone else's) is a fact, not a glitch.
export function useCase(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => api.get<Case>(`/api/cases/${id}`),
    retry: false,
  })
}
