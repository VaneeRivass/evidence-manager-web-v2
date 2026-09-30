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
    const problem = isProblemDetails(body)
      ? body
      : {
          title: response.statusText,
          status: response.status,
          code: 'UNEXPECTED_ERROR',
        }
    const error = new ApiError(problem)

    // The session the API rejected: the cookie is in the browser but no longer
    // valid, and the client cannot delete an httpOnly cookie. Go to the login
    // screen with the marker the proxy honours, so it does not bounce back here.
    // A wrong password is also a 401 (INVALID_CREDENTIALS) and must NOT redirect:
    // that one is shown next to the field.
    if (
      error.status === 401 &&
      error.code === 'UNAUTHENTICATED' &&
      typeof window !== 'undefined'
    ) {
      window.location.assign('/login?expirada=1')
    }

    throw error
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

/** What the API answers when asked for an upload link (RF-10). */
export type UploadTarget = { uploadUrl: string; key: string; expiresIn: number }

/**
 * The upload goes straight to storage — NOT through the API — and without
 * credentials, so the session cookie never travels to Cloudflare.
 * XMLHttpRequest, not fetch: only XHR reports upload progress in every browser,
 * which is what the single progress bar (RF-17) needs.
 */
export function uploadToStorage(
  url: string,
  file: File,
  onProgress: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    // Must match the content type the link was signed with.
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(event.loaded / event.total)
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Storage rejected the upload (${xhr.status})`))
      }
    }
    xhr.onerror = () => reject(new Error('Network error while uploading'))
    xhr.onabort = () => reject(new Error('Upload aborted'))
    // withCredentials stays false: the session cookie must never reach storage.
    xhr.send(file)
  })
}
