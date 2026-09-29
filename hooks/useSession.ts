import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LoginInput, RegisterInput } from '@/lib/schemas'

/** Who is signed in, the only shape the client ever learns (RF-02, RF-03). */
export type Session = { id: string; email: string }

const SESSION_KEY = ['session'] as const

// GET /auth/me. A 401 is a fact ("not signed in"), not a glitch: never retry it.
export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: () => api.get<Session>('/api/auth/me'),
    retry: false,
    staleTime: 5 * 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<Session>('/api/auth/login', input),
    onSuccess: (session) => queryClient.setQueryData(SESSION_KEY, session),
  })
}

// Register creates the account but does NOT start a session (no cookie): the
// person signs in afterwards. So nothing is written to the session cache here.
export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post<Session>('/api/auth/register', input),
  })
}
