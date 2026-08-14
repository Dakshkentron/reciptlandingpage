/**
 * Client half of the admin console.
 *
 * Both calls go to this site's own serverless functions, which hold the Receipt
 * session in a cookie the browser cannot read. Nothing in `src/` decides who
 * may see production data — Receipt does.
 */

import type { AdminOverview } from '@/lib/adminTypes';

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

export const ADMIN_EMAIL_DOMAIN = 'kentron.ai';

/**
 * Earliest of three domain checks, purely so the form can say so before a
 * request is made. The two that matter run on servers — in our function, and
 * again in Receipt. This one is convenience, not protection.
 */
export function isKentronEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${ADMIN_EMAIL_DOMAIN}`);
}

export async function register(name: string, email: string, password: string): Promise<string> {
  const response = await fetch('/api/admin/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) await failFrom(response, 'Could not create the account.');
  const body = (await response.json()) as { message?: string };
  return body.message ?? 'Account created. Check your inbox to verify it.';
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
  return (await response.json()) as AdminOverview;
}
