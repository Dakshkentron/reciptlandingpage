/**
 * Create a Receipt account from the admin console.
 *
 * The account is an ordinary Receipt account, created through Receipt's own
 * sign-up — this site has no user store of its own and does not invent one. The
 * domain is checked here first so a non-Kentron address never reaches Receipt,
 * and Receipt refuses it again at the console regardless.
 *
 * Receipt sends a verification code to the address given. That is what makes
 * the domain rule meaningful: anyone can type a colleague's address, but only
 * its owner can read what arrives.
 */

import {
  ADMIN_EMAIL_DOMAIN,
  fetchReceipt,
  isKentronEmail,
  json,
} from '../_lib/receipt';

export const config = { runtime: 'edge' };

const MIN_PASSWORD_LENGTH = 8;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let name: string;
  let email: string;
  let password: string;
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
      return json({ error: 'Enter your email and a password.' }, 400);
    }
    email = body.email.trim();
    password = body.password;
    name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : email;
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  if (!isKentronEmail(email)) {
    return json(
      { error: `Accounts here are limited to @${ADMIN_EMAIL_DOMAIN} addresses.` },
      403,
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return json(
      { error: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` },
      400,
    );
  }

  let signUp: Response;
  try {
    signUp = await fetchReceipt('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    return json({ error: 'Could not reach Receipt. Try again in a moment.' }, 502);
  }

  if (!signUp.ok) {
    let message = 'Could not create the account.';
    try {
      const body = (await signUp.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Non-JSON body; the fallback reads better than a parser error.
    }
    return json({ error: message }, signUp.status === 422 ? 409 : 400);
  }

  // No session is returned here on purpose. The address is unverified until the
  // emailed code is used, and an unverified account must not hold a session to
  // customer data.
  return json({
    ok: true,
    message: 'Check your inbox for a verification code, then sign in.',
  });
}
