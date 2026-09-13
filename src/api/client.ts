// Wrapper mínimo em cima do fetch para falar com a API.
//
// - Prefixa tudo com "/api" (o Vite faz proxy para o backend — ver vite.config.ts).
// - `credentials: 'include'` garante que os cookies de sessão vão em toda requisição.
// - Converte respostas de erro (4xx/5xx) num `ApiError` com a mensagem do backend.
// - Renovação transparente: se um request der 401, tenta uma vez o
//   `POST /auth/refresh` e repete o request original. Se o refresh falhar,
//   avisa o app (setUnauthorizedHandler) para cair no login.

const BASE_URL = '/api'
const CSRF_COOKIE = 'petencanto_csrf'

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type Query = Record<string, string | number | undefined | null>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Query
}

// --- Renovação de sessão --------------------------------------------------

let refreshPromise: Promise<boolean> | null = null
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

function shouldAutoRefresh(path: string): boolean {
  return path === '/auth/me' || !path.startsWith('/auth/')
}

// --- Requisição ---------------------------------------------------------

function buildQuery(query?: Query): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function csrfHeader(): Record<string, string> {
  const csrf = readCookie(CSRF_COOKIE)
  return csrf ? { 'X-CSRF-Token': csrf } : {}
}

export function refreshSession(): Promise<boolean> {
  return tryRefresh()
}

export function notifyUnauthorized(): void {
  onUnauthorized?.()
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function doFetch(path: string, { method = 'GET', body, query }: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (!SAFE_METHODS.has(method)) {
    Object.assign(headers, csrfHeader())
  }

  return fetch(`${BASE_URL}${path}${buildQuery(query)}`, {
    method,
    credentials: 'include',
    headers: Object.keys(headers).length ? headers : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = data?.detail
    let message = 'Erro inesperado ao falar com o servidor'
    let code: string | undefined
    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail)) {
      message = detail.map((d) => d.msg).join('; ')
    } else if (detail && typeof detail === 'object' && typeof detail.message === 'string') {
      message = detail.message
      code = typeof detail.code === 'string' ? detail.code : undefined
    }
    throw new ApiError(response.status, message, code)
  }

  return data as T
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response = await doFetch(path, options)

  if (response.status === 401 && shouldAutoRefresh(path)) {
    const renewed = await tryRefresh()
    if (renewed) {
      response = await doFetch(path, options)
    } else {
      onUnauthorized?.()
    }
  }

  return handleResponse<T>(response)
}

/** Envio de arquivos (multipart/form-data) — usado só pelo upload de fotos da galeria. */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  function send() {
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: csrfHeader(),
      body: formData,
    })
  }

  let response = await send()

  if (response.status === 401) {
    const renewed = await tryRefresh()
    if (renewed) {
      response = await send()
    } else {
      onUnauthorized?.()
    }
  }

  return handleResponse<T>(response)
}
