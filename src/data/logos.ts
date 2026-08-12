/**
 * Real brand logos for the connector directory.
 *
 * Every connector resolves to a domain, and the logo is the brand's own favicon
 * served at 128px. Names in the catalog are catalog names, not brand names
 * ("Confluence (Basic Auth)", "Zoho Books", "Amazon Selling Partner (Beta)"),
 * so the resolution order is: explicit override -> bare domain in the name ->
 * a normalized `<name>.com` guess, which is right for most SaaS vendors.
 */

/** Domains that a `<name>.com` guess would get wrong. */
const domainOverrides: Record<string, string> = {
  // --- Live connectors: these must always be right ---
  'apollo': 'apollo.io',
  'aws': 'aws.amazon.com',
  'azure devops': 'azure.microsoft.com',
  'confluence': 'atlassian.com',
  'datadog': 'datadoghq.com',
  'google ads': 'ads.google.com',
  'google analytics': 'analytics.google.com',
  'google cloud': 'cloud.google.com',
  'jira': 'atlassian.com',
  'linear': 'linear.app',
  'meta marketing api': 'developers.facebook.com',
  'notion': 'notion.so',
  'sentry': 'sentry.io',
  'terraform cloud': 'hashicorp.com',
  'zoom': 'zoom.us',

  // --- Google / Microsoft / Apple families ---
  'gmail': 'mail.google.com',
  'google drive': 'drive.google.com',
  'google sheets': 'sheets.google.com',
  'google docs': 'docs.google.com',
  'google slides': 'slides.google.com',
  'google calendar': 'calendar.google.com',
  'google forms': 'forms.google.com',
  'google chat': 'chat.google.com',
  'google search console': 'search.google.com',
  'google bigquery': 'cloud.google.com',
  'bigquery': 'cloud.google.com',
  'gcp': 'cloud.google.com',
  'google workspace': 'workspace.google.com',
  'youtube': 'youtube.com',
  'microsoft teams': 'microsoft.com',
  'microsoft excel': 'microsoft.com',
  'microsoft outlook': 'outlook.com',
  'outlook': 'outlook.com',
  'onedrive': 'onedrive.live.com',
  'sharepoint': 'microsoft.com',
  'one note': 'onenote.com',
  'onenote': 'onenote.com',
  'microsoft dynamics': 'dynamics.microsoft.com',
  'power bi': 'powerbi.microsoft.com',
  'azure': 'azure.microsoft.com',
  'apple app store': 'apple.com',
  'apple business manager': 'apple.com',
  'amazon': 'amazon.com',
  'amazon selling partner': 'sellercentral.amazon.com',

  // --- Names whose brand domain is not the .com ---
  'atlas.so': 'atlas.so',
  'bitbucket': 'bitbucket.org',
  'buildkite': 'buildkite.com',
  'calendly': 'calendly.com',
  'circleci': 'circleci.com',
  'clickup': 'clickup.com',
  'close': 'close.com',
  'discord': 'discord.com',
  'docusign': 'docusign.com',
  'fireflies': 'fireflies.ai',
  'front': 'front.com',
  'gong': 'gong.io',
  'grain': 'grain.com',
  'greenhouse': 'greenhouse.io',
  'height': 'height.app',
  'intercom': 'intercom.com',
  'launchdarkly': 'launchdarkly.com',
  'lever': 'lever.co',
  'loom': 'loom.com',
  'mailchimp': 'mailchimp.com',
  'mixpanel': 'mixpanel.com',
  'monday': 'monday.com',
  'netsuite': 'netsuite.com',
  'okta': 'okta.com',
  'pagerduty': 'pagerduty.com',
  'pandadoc': 'pandadoc.com',
  'quickbooks': 'quickbooks.intuit.com',
  'ramp': 'ramp.com',
  'segment': 'segment.com',
  'sendgrid': 'sendgrid.com',
  'shortcut': 'shortcut.com',
  'snowflake': 'snowflake.com',
  'stripe': 'stripe.com',
  'supabase': 'supabase.com',
  'tableau': 'tableau.com',
  'twilio': 'twilio.com',
  'typeform': 'typeform.com',
  'workday': 'workday.com',
  'xero': 'xero.com',
  'zapier': 'zapier.com',
  'databricks': 'databricks.com',
  'dbt': 'getdbt.com',
  'airflow': 'airflow.apache.org',
  'looker': 'looker.com',
  'posthog': 'posthog.com',
  'heap': 'heap.io',
  'pendo': 'pendo.io',
  'freshdesk': 'freshworks.com',
  'freshsales': 'freshworks.com',
  'freshservice': 'freshworks.com',
  'freshteam': 'freshworks.com',
  'help scout': 'helpscout.com',
  'zoho': 'zoho.com',
  'salesforce': 'salesforce.com',
  'pipedrive': 'pipedrive.com',
  'attio': 'attio.com',
  'outreach': 'outreach.io',
  'salesloft': 'salesloft.com',
  'clari': 'clari.com',
  'asana': 'asana.com',
  'trello': 'trello.com',
  'basecamp': 'basecamp.com',
  'smartsheet': 'smartsheet.com',
  'airtable': 'airtable.com',
  'coda': 'coda.io',
  'miro': 'miro.com',
  'mural': 'mural.co',
  'figma': 'figma.com',
  'canva': 'canva.com',
  'webflow': 'webflow.com',
  'contentful': 'contentful.com',
  'wordpress': 'wordpress.com',
  'shopify': 'shopify.com',
  'woocommerce': 'woocommerce.com',
  'bigcommerce': 'bigcommerce.com',
  'squarespace': 'squarespace.com',
  'wix': 'wix.com',
  'adobe': 'adobe.com',
  'adobe commerce': 'business.adobe.com',
  'adobe workfront': 'business.adobe.com',
  'bamboohr': 'bamboohr.com',
  'gusto': 'gusto.com',
  'rippling': 'rippling.com',
  'deel': 'deel.com',
  'justworks': 'justworks.com',
  'personio': 'personio.com',
  'hibob': 'hibob.com',
  'lattice': 'lattice.com',
  'ashby': 'ashbyhq.com',
  'workable': 'workable.com',
  'smartrecruiters': 'smartrecruiters.com',
  'adp': 'adp.com',
  'adp workforce now': 'adp.com',
  'adp lyric': 'adp.com',
  'paychex': 'paychex.com',
  'paylocity': 'paylocity.com',
  'paycom': 'paycom.com',
  'paycor': 'paycor.com',
  'ukg': 'ukg.com',
  'sap': 'sap.com',
  'oracle': 'oracle.com',
  'servicenow': 'servicenow.com',
  'jamf': 'jamf.com',
  'kandji': 'kandji.io',
  '1password': '1password.com',
  'lastpass': 'lastpass.com',
  'auth0': 'auth0.com',
  'twitch': 'twitch.tv',
  'spotify': 'spotify.com',
  'vimeo': 'vimeo.com',
  'dropbox': 'dropbox.com',
  'box': 'box.com',
  'egnyte': 'egnyte.com',
  'zendesk': 'zendesk.com',
  'gitlab': 'gitlab.com',
  'github': 'github.com',
  'anthropic': 'anthropic.com',
  'openai': 'openai.com',
  'hugging face': 'huggingface.co',
  'cohere': 'cohere.com',
  'perplexity': 'perplexity.ai',
  'mistral': 'mistral.ai',
  'pinecone': 'pinecone.io',
  'elevenlabs': 'elevenlabs.io',
  'replicate': 'replicate.com',
  'netlify': 'netlify.com',
  'heroku': 'heroku.com',
  'digitalocean': 'digitalocean.com',
  'fly.io': 'fly.io',
  'render': 'render.com',
  'railway': 'railway.app',
  'grafana': 'grafana.com',
  'new relic': 'newrelic.com',
  'splunk': 'splunk.com',
  'elastic': 'elastic.co',
  'mongodb': 'mongodb.com',
  'redis': 'redis.io',
  'planetscale': 'planetscale.com',
  'neon': 'neon.tech',
  'clickhouse': 'clickhouse.com',
  'braze': 'braze.com',
  'klaviyo': 'klaviyo.com',
  'customer.io': 'customer.io',
  'iterable': 'iterable.com',
  'marketo': 'marketo.com',
  'ahrefs': 'ahrefs.com',
  'semrush': 'semrush.com',
  'brevo': 'brevo.com',
  'activecampaign': 'activecampaign.com',
  'plaid': 'plaid.com',
  'brex': 'brex.com',
  'mercury': 'mercury.com',
  'wise': 'wise.com',
  'paypal': 'paypal.com',
  'square': 'squareup.com',
  'adyen': 'adyen.com',
  'chargebee': 'chargebee.com',
  'recurly': 'recurly.com',
  'bill.com': 'bill.com',
  'expensify': 'expensify.com',
  'navan': 'navan.com',
  'coupa': 'coupa.com',
  'freeagent': 'freeagent.com',
  'sage': 'sage.com',
  'wave': 'waveapps.com',
  'linkedin': 'linkedin.com',
  'x (twitter)': 'x.com',
  'twitter': 'x.com',
  'reddit': 'reddit.com',
  'instagram': 'instagram.com',
  'tiktok': 'tiktok.com',
  'pinterest': 'pinterest.com',
  'snapchat': 'snapchat.com',
  'incident.io': 'incident.io',
  'statuspage': 'statuspage.io',
  'opsgenie': 'atlassian.com',
  'rootly': 'rootly.com',
  'firehydrant': 'firehydrant.com',
  'zoominfo': 'zoominfo.com',
  'clearbit': 'clearbit.com',
  'crunchbase': 'crunchbase.com',
  'hunter': 'hunter.io',
  'lusha': 'lusha.com',
  'seamless.ai': 'seamless.ai',
  'discourse': 'discourse.org',
  'circle': 'circle.so',
  'ghost': 'ghost.org',
  'sanity': 'sanity.io',
  'storyblok': 'storyblok.com',
  'strapi': 'strapi.io',
  'algolia': 'algolia.com',
  'typesense': 'typesense.org',
  'meilisearch': 'meilisearch.com',
};

/** Qualifiers the catalog appends to a brand name; none of them change the brand. */
const QUALIFIER = /\s*\((?:oauth[^)]*|basic auth|api key|api token|personal access token|app oauth|client credentials|scim[^)]*|events api|users api|mcp[^)]*|beta|v\d+|eu|us|generic|self[- ]hosted|legacy|next generation|sandbox)\)\s*/gi;

/** Strips connector qualifiers and normalizes to a lookup key. */
export function brandKey(name: string) {
  return name
    .replace(QUALIFIER, ' ')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .trim()
    .toLowerCase();
}

/** URL-safe id used for the per-integration route. */
export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Best-known web domain for a connector name. */
export function domainFor(name: string): string {
  const key = brandKey(name);
  if (domainOverrides[key]) return domainOverrides[key];

  // Product families: fall back to the parent brand's domain.
  const firstWord = key.split(' ')[0];
  if (domainOverrides[firstWord]) return domainOverrides[firstWord];

  // Names that already carry their own domain: "incident.io", "cal.com", "atlas.so".
  const bare = key.match(/^([a-z0-9-]+\.(?:io|com|so|ai|co|app|dev|sh|tech|org|net|us|tv))\b/);
  if (bare) return bare[1];

  const slug = key.replace(/[^a-z0-9]/g, '');
  return slug ? `${slug}.com` : 'example.com';
}

/** Brand logo at 128px, served from the vendor's own domain. */
export function logoUrl(name: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${domainFor(name)}`;
}

/** Deterministic hue per connector, for the monogram shown before/instead of a logo. */
export function hueFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return hash;
}

export function monogram(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
  if (words.length === 0 || !words[0]) return '#';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
