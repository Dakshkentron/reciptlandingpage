/**
 * Sign in and out of the admin console.
 *
 *   POST   — exchange Receipt credentials for a session cookie on this domain
 *   DELETE — sign out
 *
 * The credentials are your ordinary Receipt account. This site never sees a
 * password beyond forwarding it, stores no accounts, and makes no decision
 * about who is allowed in — Receipt does, and it accepts only verified
 * kentron.ai staff.
 */

import {
  clearSessionCookie,
  extractSessionCookies,
  fetchReceipt,
  isKentronEmail,
  json,
  setSessionCookie,
} from '../_lib/receipt';
// TEMPORARY — delete with api/_lib/preview.ts.
import { PREVIEW_COOKIE_VALUE, isPreviewLogin } from '../_lib/preview';

export const config = { runtime: 'edge' };

/**
 * One wording for every refusal at sign-in.
 *
 * Wrong password, wrong domain, and no such account all answer identically, so
 * the form cannot be used to discover which addresses exist or which domain is
 * accepted.
 */
const SIGN_IN_REFUSED = 'That email and password did not match.';

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'DELETE') {
    return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let email: string;
  let password: string;
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
      return json({ error: 'Enter your email and password.' }, 400);
    }
    email = body.email.trim();
    password = body.password;
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  // TEMPORARY — preview access, ahead of the Receipt endpoint being deployed.
  // Delete this block with api/_lib/preview.ts.
  if (isPreviewLogin(email, password)) {
    return json({ ok: true, preview: true }, 200, {
      'set-cookie': setSessionCookie(PREVIEW_COOKIE_VALUE),
    });
  }

  // Refuse a wrong domain here rather than after a round trip. It also means a
  // stranger's password is never forwarded anywhere. Receipt checks again
  // regardless and stays the authority.
  //
  // The reply is deliberately the same one a wrong password gets. Answering
  // "only @kentron.ai may sign in" would tell someone probing this form exactly
  // what to try next, and the page says nothing about the rule either.
  if (!isKentronEmail(email)) {
    return json({ error: SIGN_IN_REFUSED }, 401);
  }

  let signIn: Response;
  try {
    signIn = await fetchReceipt('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return json({ error: 'Could not reach Receipt. Try again in a moment.' }, 502);
  }

  if (!signIn.ok) {
    // Receipt's own wording is more accurate than anything invented here, but
    // fall back so a failure never surfaces as a blank message.
    let message = SIGN_IN_REFUSED;
    try {
      const body = (await signIn.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Non-JSON body; keep the fallback.
    }
    return json({ error: message }, signIn.status === 401 ? 401 : 400);
  }

  const cookies = extractSessionCookies(signIn);
  if (!cookies) {
    return json({ error: 'Receipt did not return a session.' }, 502);
  }

  // Signing in proves who they are; it does not prove they may be here. Ask
  // Receipt before handing back a cookie, so a customer with valid credentials
  // never ends up holding an admin session.
  const check = await fetchReceipt('/api/admin-metrics', { headers: { cookie: cookies } });
  if (check.status === 403) {
    return json({ error: 'This account does not have access to the admin console.' }, 403);
  }
  if (!check.ok) {
    return json({ error: 'Signed in, but Receipt did not return data.' }, 502);
  }

  return json({ ok: true }, 200, { 'set-cookie': setSessionCookie(cookies) });
}
