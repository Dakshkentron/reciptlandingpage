/**
 * Datadog RUM — real user monitoring for the landing site.
 *
 * Lives in its own module so `main.tsx` stays a plain mount point, and so the
 * single place that decides *whether* monitoring starts is easy to find.
 */

import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

// Both values are publishable by design: a Datadog client token is meant to
// ship in the browser bundle and can only write RUM events, never read them.
const APPLICATION_ID = '61227deb-0dd6-471a-a7c3-f80bf35e3fa3';
const CLIENT_TOKEN = 'pub40901616e3d111aea79dbafb3882455b';

export function initDatadogRum() {
  // Vercel runs the same production build for preview deploys, so
  // `import.meta.env.PROD` would let every PR preview report into the live
  // dashboards. Only the production deploy does. This covers `npm run dev`
  // too, where VERCEL_ENV is absent.
  if (__DEPLOY_ENV__ !== 'production') return;

  // The admin console is an internal tool that renders customer data. This is
  // the marketing site's monitoring — don't record staff sessions or replay
  // their screens.
  if (window.location.hash.startsWith('#/admin')) return;

  datadogRum.init({
    applicationId: APPLICATION_ID,
    clientToken: CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: 'receipt-landing',
    env: 'production',
    version: __APP_VERSION__,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
    // Replays keep the shape of a page but not what anyone typed into it.
    defaultPrivacyLevel: 'mask-user-input',
    // The site routes on `window.location.hash` rather than a router library,
    // so there is no router integration for the plugin to hook into. RUM still
    // starts a new view on each hash change on its own.
    plugins: [reactPlugin({ router: false })],
  });
}
