// The ONLY place that speaks HTTP. Everything else asks this module for data.
// It knows HTTP and the RFC 9457 error shape; it knows nothing about cases,
// sessions or any other domain concept. See docs/adr/0007.

/** One field that failed validation, as the API reports it (RF-18). */
export type FieldError = {
  field: string
  code: string
  params?: Record<string, unknown>
}

/** What every failed request carries: RFC 9457 problem details (RF-21…RF-23). */
type ProblemDetails = {
  title: string
  status: number
  code: string
  errors?: FieldError[]
  params?: Record<string, unknown>
  requestId?: string
}

/**
 * A failed request, already understood.
 * `code` is the stable name the interface switches on; `fieldErrors` holds the
 * per-field validation errors; `params` are the values a message needs to be
 * composed in Spanish (lib/messages.es.ts).
 */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly params?: Record<string, unknown>
  readonly fieldErrors: FieldError[]
  readonly requestId?: string

  constructor(problem: ProblemDetails) {
    super(problem.title)
    this.name = 'ApiError'
    this.status = problem.status
    this.code = problem.code
    this.params = problem.params
    this.fieldErrors = problem.errors ?? []
    this.requestId = problem.requestId
  }
}

const isProblemDetails = (value: unknown): value is ProblemDetails =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'code' in value

// Relative paths only: the browser talks to its own origin and the rewrite in
// next.config.ts forwards to the API. No base URL, no CORS, no token handling.
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  // 204 No Content (delete, logout) has no body to parse.
  if (response.status === 204) {
    return undefined as T
  }

  const body: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    // Every error the API sends is RFC 9457. Anything else is unexpected and
    // surfaces as a generic code the notices can still show.
    throw isProblemDetails(body)
      ? new ApiError(body)
      : new ApiError({
          title: response.statusText,
          status: response.status,
          code: 'UNEXPECTED_ERROR',
        })
  }

  return body as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' }),
}
