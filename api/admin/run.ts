/**
 * One run's detail for the admin console's prompt inspector.
 *
 * Same shape of forward-and-hand-back as `stats.ts`: this function decides
 * nothing about access, it carries the question to Receipt's `/api/admin-run`
 * and returns whatever comes back.
 */

import {
  clearSessionCookie,
  fetchReceipt,
  isJsonResponse,
  json,
  readSessionCookie,
  RECEIPT_ORIGIN,
} from '../_lib/receipt.js';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const url = new URL(request.url);
  const messageId = url.searchParams.get('messageId')?.trim();
  if (!messageId) {
    return json({ error: 'messageId is required' }, 400);
  }

  const cookie = readSessionCookie(request);
  if (!cookie) {
    return json({ error: 'Not signed in.' }, 401);
  }

  let response: Response;
  try {
    response = await fetchReceipt(`/api/admin-run?messageId=${encodeURIComponent(messageId)}`, {
      headers: { cookie },
    });
  } catch {
    return json(
      { error: `Could not reach Receipt at ${RECEIPT_ORIGIN}. Check RECEIPT_ORIGIN configuration.` },
      502,
    );
  }

  if (response.status === 401 || response.status === 403) {
    return json(
      {
        error:
          response.status === 403
            ? 'This account no longer has access to the admin console.'
            : 'Your session has expired. Sign in again.',
      },
      response.status,
      { 'set-cookie': clearSessionCookie() },
    );
  }

  if (response.status === 404) {
    return json({ error: 'No run found for that message id.' }, 404);
  }

  if (!response.ok) {
    return json({ error: 'Receipt could not return the run detail.' }, 502);
  }

  // Same reasoning as stats.ts: an unrecognized path answers 200 text/html,
  // not 404, so this is the check that actually distinguishes "not deployed
  // yet" from "here is your data".
  if (!isJsonResponse(response)) {
    return json({ error: 'Receipt has no admin run endpoint deployed yet.' }, 502);
  }

  try {
    return json(await response.json());
  } catch {
    return json({ error: 'Receipt returned a run detail this page could not read.' }, 502);
  }
}
