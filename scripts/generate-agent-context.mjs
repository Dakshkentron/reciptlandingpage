/**
 * Generates the machine-readable layer of the site.
 *
 * The app is a client-rendered SPA with hash routes, so an agent that fetches the
 * URL without running JavaScript sees an empty <div id="root">. Everything here
 * exists to make the site legible to that reader: a static summary in the HTML
 * itself, JSON-LD for the structured facts, and llms.txt / llms-full.txt for the
 * long-form content.
 *
 * It is generated rather than hand-written so the copy cannot drift from
 * `src/data/*` — run via `npm run build` (prebuild) or `npm run agent:context`.
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.html');
const publicDir = join(root, 'public');

const html = readFileSync(indexPath, 'utf8');

/** The deployed origin is declared once, in the og:url tag. */
const SITE_URL = html.match(/property="og:url" content="([^"]+)"/)?.[1].replace(/\/$/, '');
if (!SITE_URL) throw new Error('index.html has no og:url meta tag to derive the site URL from');

const DESCRIPTION = html.match(/property="og:description" content="([^"]+)"/)?.[1] ?? '';

// Load the TypeScript data modules through Vite so the `@/` alias resolves.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { teams } = await server.ssrLoadModule('/src/data/useCases.ts');
const { CATALOG_LABEL, integrationCatalog, categories, popularIntegrations } =
  await server.ssrLoadModule('/src/data/integrations.ts');
const { faqs, features } = await server.ssrLoadModule('/src/data/content.ts');
const { resourcePages, DOCS_URL } = await server.ssrLoadModule('/src/data/resources.ts');
await server.close();

const url = (hash) => `${SITE_URL}/${hash}`;

/** Every addressable page, in the order a reader should meet them. */
const routes = [
  { hash: '', title: 'Receipt — an AI coworker that proves what it did', desc: DESCRIPTION },
  { hash: '#/use-cases', title: 'Use cases', desc: `Worked examples across ${teams.length} teams.` },
  ...teams.map((t) => ({
    hash: `#/use-cases/${t.slug}`,
    title: `${t.label} use cases`,
    desc: t.tagline,
  })),
  { hash: '#/integrations', title: 'Integrations', desc: `${CATALOG_LABEL} connectors across ${categories.length} categories.` },
  { hash: '#/pricing', title: 'Pricing', desc: 'Credit-based pricing from $50; free tier and enterprise plans.' },
  { hash: '#/compare', title: 'Compare', desc: 'Receipt against workflow builders, chat assistants, and in-house scripts; includes the price promise.' },
  { hash: '#/security', title: 'Security', desc: 'Sandbox isolation, policy gates, and the receipt chain.' },
  ...Object.values(resourcePages).map((p) => ({
    hash: `#/${p.kind}`,
    title: p.eyebrow,
    desc: p.lead,
  })),
];

/* ---------------------------------------------------------------- llms.txt */

const llms = `# Receipt

> ${DESCRIPTION}

Receipt runs tasks across your connected SaaS apps and servers in an isolated
sandbox, gates state-changing operations behind org policy, and records every
step as an immutable, cryptographically chained receipt you can replay and
verify independently.

This site is a client-rendered single-page app addressed by hash routes; fetch
${SITE_URL}/llms-full.txt for the full text of every page without running
JavaScript.

## Pages

${routes.map((r) => `- [${r.title}](${url(r.hash)}): ${r.desc}`).join('\n')}

## Documentation

- [Product documentation](${DOCS_URL}): quickstart, core concepts, and the API.

## Key facts

- Connectors: ${CATALOG_LABEL} in the catalog across ${categories.length} categories, connectable today.
- Teams with worked use cases: ${teams.map((t) => t.label).join(', ')}.
- Every action produces a receipt: command, evidence artifact, exit code, chained hash.
- Credentials stay with the connector layer (Nango); Receipt stores encrypted references only.
`;

/* ----------------------------------------------------------- llms-full.txt */

const teamSection = (t) => `## ${t.label} — ${t.headline}

Status: ${t.status}. ${t.intro}

Stops doing by hand: ${t.killed}
Connected stack: ${t.stack.join(', ')}
${t.metrics.map((m) => `- ${m.value} ${m.label}`).join('\n')}

${t.cases
  .map(
    (c) => `### ${c.title}
Prompt: "${c.prompt}"
Steps:
${c.steps.map((s) => `  1. ${s}`).join('\n')}
Tools: ${c.tools.join(', ')}
Proof: ${c.proof}`,
  )
  .join('\n\n')}`;

const llmsFull = `# Receipt — full site content

Source: ${SITE_URL}
Generated from the site's own content data. Docs live at ${DOCS_URL}.

## What Receipt is

${DESCRIPTION}

${features.map((f) => `- ${f.title}: ${f.description}`).join('\n')}

# Use cases by team

${teams.map(teamSection).join('\n\n')}

# Integrations

${CATALOG_LABEL} connectors across ${categories.length} categories. Popular: ${popularIntegrations
  .slice(0, 24)
  .join(', ')}.

${categories
  .map((category) => {
    const names = integrationCatalog.filter((i) => i.category === category).map((i) => i.name);
    return `## ${category} (${names.length})\n${names.join(', ')}`;
  })
  .join('\n\n')}

# Frequently asked questions

${faqs.map((f) => `## ${f.q}\n${f.a}`).join('\n\n')}

# Resources

${Object.values(resourcePages)
  .map(
    (p) => `## ${p.eyebrow} — ${p.title}
${p.lead}

${p.sections
  .map((s) => `### ${s.heading}\n${s.items.map((i) => `- ${i.title}: ${i.desc}`).join('\n')}`)
  .join('\n\n')}`,
  )
  .join('\n\n')}
`;

/* ------------------------------------------------------- robots + sitemap */

const robots = `# Crawling and AI agents are both welcome here.
User-agent: *
Allow: /
# Internal endpoints. They require a signed-in Kentron session regardless; this
# just keeps them out of crawl budgets and search results.
Disallow: /api/

# Named explicitly so there is no ambiguity for AI crawlers.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

// Crawlers discard URL fragments, so the sitemap carries the origin and the two
// machine-readable documents; the hash routes are enumerated inside llms.txt.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/llms.txt</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/llms-full.txt</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
</urlset>
`;

/* ------------------------------------------- JSON-LD + noscript in the HTML */

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Receipt',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/receipt-mark.svg`,
    description: DESCRIPTION,
    parentOrganization: { '@type': 'Organization', name: 'Kentron Inc.' },
    sameAs: ['https://www.linkedin.com/company/kentronai/'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Receipt',
    url: `${SITE_URL}/`,
    description: DESCRIPTION,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Receipt',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE_URL}/`,
    description: DESCRIPTION,
    featureList: features.map((f) => f.title),
    offers: {
      '@type': 'Offer',
      price: '50',
      priceCurrency: 'USD',
      description: 'Credit-based pricing starting at $50 for 20,000 credits. Free tier available.',
      url: url('#/pricing'),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const noscript = `<noscript>
      <h1>Receipt — an AI coworker that proves what it did</h1>
      <p>${escape(DESCRIPTION)}</p>
      <p>This site renders with JavaScript. The full text of every page is available at
        <a href="${SITE_URL}/llms-full.txt">/llms-full.txt</a>, and a summary with links at
        <a href="${SITE_URL}/llms.txt">/llms.txt</a>.</p>
      <h2>Pages</h2>
      <ul>
${routes.map((r) => `        <li><a href="${url(r.hash)}">${escape(r.title)}</a> — ${escape(r.desc)}</li>`).join('\n')}
        <li><a href="${DOCS_URL}">Documentation</a> — quickstart, core concepts, and the API.</li>
      </ul>
      <h2>Frequently asked questions</h2>
      <dl>
${faqs.map((f) => `        <dt>${escape(f.q)}</dt>\n        <dd>${escape(f.a)}</dd>`).join('\n')}
      </dl>
    </noscript>`;

const block = [
  '    <!-- agent-context:start — generated by scripts/generate-agent-context.mjs, do not edit by hand -->',
  `    <link rel="canonical" href="${SITE_URL}/" />`,
  '    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />',
  `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  '    <!-- agent-context:end -->',
].join('\n');

const blockRe = /[ \t]*<!-- agent-context:start[\s\S]*?<!-- agent-context:end -->/;
const noscriptRe = /[ \t]*<noscript>[\s\S]*?<\/noscript>/;

// Both anchors must exist; a no-op rewrite is fine, a missing anchor is not.
for (const [re, what] of [[blockRe, 'the agent-context markers'], [noscriptRe, 'the <noscript> block']]) {
  if (!re.test(html)) {
    throw new Error(`index.html is missing ${what} — see scripts/generate-agent-context.mjs`);
  }
}

const withNoscript = html.replace(blockRe, () => block).replace(noscriptRe, () => `    ${noscript}`);

writeFileSync(indexPath, withNoscript);
writeFileSync(join(publicDir, 'llms.txt'), llms);
writeFileSync(join(publicDir, 'llms-full.txt'), llmsFull);
writeFileSync(join(publicDir, 'robots.txt'), robots);
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

console.log(
  `agent context: ${routes.length} routes, ${faqs.length} FAQs, ${integrationCatalog.length} connectors → index.html, llms.txt, llms-full.txt, robots.txt, sitemap.xml`,
);
