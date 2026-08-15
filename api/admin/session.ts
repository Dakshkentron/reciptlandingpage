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
  RECEIPT_ORIGIN,
  clearSessionCookie,
  extractSessionCookies,
  fetchReceipt,
  isJsonResponse,
  isKentronEmail,
  json,
  setSessionCookie,
} from '../_lib/receipt';

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
      headers: {
        'content-type': 'application/json',
        // Better Auth rejects a sign-in whose Origin it does not trust, and
        // Receipt trusts only its own (`trustedOrigins: [authBaseURL]`). Which
        // way it goes depends on whether the caller looks like a browser: a
        // runtime that sends `sec-fetch-mode` gets MISSING_OR_NULL_ORIGIN, one
        // that does not is waved through as a server call. Vercel's edge
        // currently does not, which is the only reason sign-in works at all —
        // Node's fetch does, so the same code fails locally.
        //
        // Stating the origin removes the guesswork: every runtime now sends the
        // one Receipt trusts. This is a server-to-server call carrying a
        // password typed into our own form, with no ambient session behind it,
        // so there is no cross-site request here for the check to protect.
        //
        // The cleaner arrangement is Receipt trusting this console's own domain
        // and this header naming it. That is a change on their side; until
        // then, this is what keeps sign-in working in every runtime.
        origin: RECEIPT_ORIGIN,
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return json({ error: 'Could not reach Receipt. Try again in a moment.' }, 502);
  }

  if (!signIn.ok) {
    // A rejected credential answers with the same sentence the domain check
    // gives. Passing Receipt's own wording through here undid that: an accepted
    // domain with a wrong password said "Invalid email or password", while any
    // other domain said "That email and password did not match" — telling a
    // prober which domain is accepted, the one thing the shared wording exists
    // to hide.
    if (signIn.status === 401) {
      return json({ error: SIGN_IN_REFUSED }, 401);
    }

    // Anything else is a condition worth naming — an unverified mailbox, a rate
    // limit — and reaches only someone whose password was already correct.
    let message = 'Receipt refused the sign-in.';
    try {
      const body = (await signIn.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Non-JSON body; keep the fallback.
    }
    return json({ error: message }, 400);
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

  // A 200 that is not JSON is Receipt's app shell answering for a route it does
  // not have. Treating that as approval would hand out an admin session on the
  // strength of a page that never checked anything — so it fails closed, and
  // says which half is missing rather than leaving someone to guess.
  if (!isJsonResponse(check)) {
    return json(
      {
        error:
          'Receipt has no admin metrics endpoint to authorize against. Deploy it before signing in here.',
      },
      502,
    );
  }

  return json({ ok: true }, 200, { 'set-cookie': setSessionCookie(cookies) });
}
