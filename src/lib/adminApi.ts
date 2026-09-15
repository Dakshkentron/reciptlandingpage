/**
 * Client half of the admin console.
 *
 * Both calls go to this site's own serverless functions, which hold the Receipt
 * session in a cookie the browser cannot read. Nothing in `src/` decides who
 * may see production data — Receipt does.
 */

import type { AdminOverview, AdminRunDetail } from '@/lib/adminTypes';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function failFrom(response: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) message = body.error;
  } catch {
    // A non-JSON body means the platform answered rather than our function;
    // the fallback reads better than a parser error.
  }
  throw new ApiError(message, response.status);
}

export async function signIn(email: string, password: string): Promise<void> {
  const response = await fetch('/api/admin/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) await failFrom(response, 'Sign-in failed.');
}

export async function signOut(): Promise<void> {
  await fetch('/api/admin/session', { method: 'DELETE' });
}

/** Returns null when not signed in, which is a state rather than an error. */
export async function fetchOverview(): Promise<AdminOverview | null> {
  const response = await fetch('/api/admin/stats');
  if (response.status === 401) return null;
  if (!response.ok) await failFrom(response, 'Could not load company metrics.');

  try {
    return (await response.json()) as AdminOverview;
  } catch {
    // A 200 that is not JSON means something other than our function answered —
    // a proxy, or a login page in front of the deploy. Surfacing the parser's
    // own words ("Unexpected token '<'") tells nobody anything useful.
    throw new ApiError('Received an unexpected response instead of company metrics.', 502);
  }
}

/**
 * One run's detail, for the prompt inspector's "execution trace" panel.
 *
 * Throws on 404 rather than returning null: unlike `fetchOverview`, a missing
 * run is a real failure to show the caller, not an ordinary state like being
 * signed out.
 */
export async function fetchRunDetail(messageId: string): Promise<AdminRunDetail> {
  const response = await fetch(`/api/admin/run?messageId=${encodeURIComponent(messageId)}`);
  if (response.status === 401) throw new ApiError('Not signed in.', 401);
  if (response.status === 404) throw new ApiError('No run found for that message id.', 404);
  if (!response.ok) await failFrom(response, 'Could not load the run detail.');

  try {
    return (await response.json()) as AdminRunDetail;
  } catch {
    throw new ApiError('Received an unexpected response instead of a run detail.', 502);
  }
}
