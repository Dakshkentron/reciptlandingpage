/**
 * Company metrics for the admin console.
 *
 * Forwards the visitor's Receipt session to beetle.run and hands back what it
 * returns. This function decides nothing about access — it carries the
 * question, and Receipt answers it.
 */

import {
  clearSessionCookie,
  fetchReceipt,
  isJsonResponse,
  json,
  readSessionCookie,
  RECEIPT_ORIGIN,
} from '../_lib/receipt';
// TEMPORARY — delete with api/_lib/demo.ts.
import { demoOverview, isDemoSession } from '../_lib/demo';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const cookie = readSessionCookie(request);
  if (!cookie) {
    return json({ error: 'Not signed in.' }, 401);
  }

  // TEMPORARY — invented data for the demo account. `isDemoSession` re-checks
  // that the demo is still switched on, so unsetting the environment variables
  // ends a demo session already in progress. Delete with api/_lib/demo.ts.
  if (await isDemoSession(cookie)) {
    return json(demoOverview());
  }

  let response: Response;
  try {
    response = await fetchReceipt('/api/admin-metrics', { headers: { cookie } });
  } catch {
    // Distinguish "Receipt is unreachable" from "you have no companies" so
    // an outage never reads as an empty customer list. Include the configured
    // origin to make it easier to spot a misconfiguration when the host
    // changed.
    return json(
      { error: `Could not reach Receipt at ${RECEIPT_ORIGIN}. Check RECEIPT_ORIGIN configuration.` },
      502,
    );
  }

  if (response.status === 401 || response.status === 403) {
    // The Receipt session has expired or the account lost access, so drop the
    // cookie rather than leaving a dead one to fail on every later request.
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

  if (!response.ok) {
    return json({ error: 'Receipt could not return the metrics.' }, 502);
  }

  // Receipt answers an unknown path with its app shell — `200 text/html`, not a
  // 404 — and parsing that as JSON threw, so the console showed a bare 500
  // where it could have said what was wrong.
  if (!isJsonResponse(response)) {
    return json({ error: 'Receipt has no admin metrics endpoint deployed yet.' }, 502);
  }

  try {
    return json(await response.json());
  } catch {
    return json({ error: 'Receipt returned metrics this page could not read.' }, 502);
  }
}
