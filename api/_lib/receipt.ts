/**
 * Server-side link between this site and Receipt (beetle.run).
 *
 * The admin page runs on this static site, which has no database and cannot
 * reach Receipt's — Postgres sits inside a private VPC. So every figure the
 * page shows comes from `GET /api/admin-metrics` on beetle.run, and the only
 * thing this site stores is the visitor's Receipt session, in a cookie their
 * browser cannot read.
 *
 * There is no shared service token anywhere in this flow. A request is
 * authorized because a named Kentron person is behind it, which is also why
 * removing someone's Receipt account removes their access here with no separate
 * step.
 */

/** Overridable so a local Receipt can be pointed at during development. */
export const RECEIPT_ORIGIN = (process.env.RECEIPT_ORIGIN?.trim() || 'https://beetle.run').replace(
  /\/+$/,
  '',
)

/** Only work accounts on this domain may use the admin console. */
export const ADMIN_EMAIL_DOMAIN = 'kentron.ai'

/**
 * First of two domain checks.
 *
 * Receipt checks again on every request and remains the authority — this one
 * exists so a wrong address is refused here in milliseconds instead of after a
 * round trip, and so a stranger's password is never forwarded anywhere. Both
 * checks run on a server; neither is the browser being trusted.
 *
 * Deleting this would not open a hole. Deleting the one in Receipt would.
 */
export function isKentronEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${ADMIN_EMAIL_DOMAIN}`)
}

/** Holds the Receipt session cookie; opaque to the browser. */
const COOKIE_NAME = 'receipt_admin_session'
const SESSION_MAX_AGE = 8 * 60 * 60

/** Beyond this, treat Receipt as unreachable rather than leaving the page hanging. */
const TIMEOUT_MS = 15_000

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Vercel's CDN, corporate proxies, and the browser would all otherwise be
      // free to keep a copy of production numbers.
      'cache-control': 'no-store, max-age=0',
      ...headers,
    },
  })
}

/**
 * Whether Receipt answered as an API rather than as a web page.
 *
 * This is a security check, not a formality. Receipt is a single-page app: a
 * path it does not recognize is answered by the app shell with `200 text/html`,
 * not with a 404. So when `/api/admin-metrics` is missing — not deployed yet,
 * renamed, or lost to a routing change — a bare `response.ok` reads that HTML
 * as "request allowed", and the one call that asks Receipt whether this person
 * may see customer data silently succeeds for everyone.
 *
 * Requiring JSON closes that: an app shell can never be mistaken for an answer.
 */
export function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').toLowerCase().includes('application/json')
}

export async function fetchReceipt(path: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(`${RECEIPT_ORIGIN}${path}`, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export function readSessionCookie(request: Request): string | null {
  const header = request.headers.get('cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === COOKIE_NAME) {
      const value = rest.join('=')
      return value.length > 0 ? decodeURIComponent(value) : null
    }
  }
  return null
}

function serialize(value: string, maxAge: number): string {
  return [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    // HttpOnly keeps the Receipt session out of reach of any script on the
    // page, so an injected script cannot lift it and replay it elsewhere.
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ].join('; ')
}

export function setSessionCookie(value: string): string {
  return serialize(value, SESSION_MAX_AGE)
}

export function clearSessionCookie(): string {
  return serialize('', 0)
}

/**
 * Extracts the Receipt session cookie from a sign-in response.
 *
 * Better Auth may return several cookies and prefixes them by configuration, so
 * matching on a hardcoded name would break the moment that configuration
 * changed. Taking the whole `name=value` pair of each and replaying them keeps
 * this agnostic to what Receipt calls its cookie.
 */
export function extractSessionCookies(response: Response): string | null {
  const setCookie
    = typeof (response.headers as { getSetCookie?: () => string[] }).getSetCookie === 'function'
      ? (response.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : [response.headers.get('set-cookie') ?? ''].filter(Boolean)

  const pairs = setCookie
    .map((entry) => entry.split(';')[0]?.trim())
    .filter((pair): pair is string => Boolean(pair) && pair.includes('='))

  return pairs.length > 0 ? pairs.join('; ') : null
}
