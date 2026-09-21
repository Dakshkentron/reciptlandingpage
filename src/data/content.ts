import { CATALOG_LABEL } from '@/data/integrations';

import { teamNavChildren, teams } from '@/data/useCases';
import { resourceNavChildren } from '@/data/resources';

export type NavChild = {
  label: string;
  href: string;
  desc?: string;
  icon?: string;
};

export type NavLink = {
  label: string;
  href?: string;
  children?: NavChild[];
  /** Render the dropdown as a two-column panel — for menus with many entries. */
  wide?: boolean;
};

export const navLinks: NavLink[] = [
  {
    label: 'Product',
    children: [
      { label: 'Receipt: AI Coworker', href: '#receipt-ai-coworker', desc: 'The AI coworker that proves what it did', icon: 'Rocket' },
      { label: 'MCP Gateway', href: '#mcp-gateway', desc: 'One gateway for every MCP connection', icon: 'Server' },
      { label: 'LLM Gateway', href: '#llm-gateway', desc: 'Route, log, and govern every model call', icon: 'Workflow' },
      { label: 'Kentron Catalog', href: '#kentron-catalog', desc: `${CATALOG_LABEL} connectors, browsable A–Z`, icon: 'Boxes' },
      { label: 'Kentron Guard', href: '#kentron-guard', desc: 'Stop risky agent actions before they execute', icon: 'ShieldCheck' },
      { label: 'Kentron Core', href: '#kentron-core', desc: 'The platform underneath every Kentron product', icon: 'LayoutDashboard' },
    ],
  },
  { label: 'For Teams', wide: true, children: teamNavChildren },
  { label: 'Resources', children: resourceNavChildren },
  { label: 'Customers', href: '#customers' },
  { label: 'Security', href: '#/security' },
];

export const trustedBy = [
  'OrangePro', 'MyVisionLab', 'TenUp',  'Binaryflux', 'CStream'
];

export const heroStats = [
  { value: CATALOG_LABEL, label: 'integrations, ready to operate' },
  { value: 'Every step', label: 'typed, immutable, and hash-linked' },
  { value: 'Replayable', label: 'any past run, decision by decision' },
];


/**
 * PLACEHOLDER social proof, deliberately unattributed.
 *
 * These are role-and-profile placeholders, not quotes from named people at named
 * companies — nothing here claims an endorsement we cannot produce on request.
 * Swap each entry for a real quote, with the person's written permission, before
 * treating this section as social proof. `saved` is the weekly time-back badge.
 */
export const testimonials = [
  { quote: 'The first run paid for itself. It found the deploy behind an incident while we were still reading the alert, and the revert PR was open before the call started.', name: 'Placeholder quote', role: 'Head of Platform', company: 'Series B fintech', saved: '10+ hours/week' },
  { quote: 'What sold our security team was not the autonomy. It was being able to open a run six weeks later and read exactly which calls were made, in what order, against which account.', name: 'Placeholder quote', role: 'Director of Security', company: 'Logistics platform', saved: '4-6 hours/week' },
  { quote: 'We stopped writing the Monday report. It arrives written, with every figure linked back to the system it came from, and nobody has to trust that it was assembled honestly.', name: 'Placeholder quote', role: 'RevOps lead', company: 'B2B marketplace', saved: '6-8 hours/week' },
  { quote: 'It is the connective work it takes off you — reading the trace, finding the commit, updating the ticket, telling everyone. That was always the expensive part of the day.', name: 'Placeholder quote', role: 'Staff Engineer', company: 'Developer tools company', saved: '3-5 hours/week' },
  { quote: 'Access reviews used to be a week of screenshots. Now it is one run, and the evidence is the run itself rather than something we assemble afterwards for the auditor.', name: 'Placeholder quote', role: 'IT Operations Manager', company: 'Healthcare SaaS', saved: '10+ hours/week' },
  { quote: 'The approval gate is the reason it is still connected. Reads opened up in week one; writes are still gated, one operation at a time, exactly as we wanted.', name: 'Placeholder quote', role: 'VP Engineering', company: 'Payments company', saved: '1-3 hours/week' },
];

/**
 * PLACEHOLDER deployment profiles. Anonymised on purpose — these describe the shape
 * of a deployment, not a named customer, and none of them should be presented as a
 * reference account until a real one replaces it.
 */
export const customerStories = [
  { company: 'fintech', title: 'Incident triage without the tab sprawl', desc: 'Sentry, Vercel, GitHub and Datadog connected. Kentron AI correlates the alert to the deploy and opens the revert PR for review.', logo: 'Series B fintech', href: '#/use-cases/engineering' },
  { company: 'logistics', title: 'The offboarding gap, closed', desc: 'The access review reads every connected system, not only the ones behind SSO, and verifies each revoke with a second read.', logo: 'Logistics platform', href: '#/use-cases/it-security' },
  { company: 'marketplace', title: 'Month-end close, reconciled nightly', desc: 'Processor, ledger, and CRM compared on a schedule, so finance reviews exceptions instead of transactions.', logo: 'B2B marketplace', href: '#/use-cases/finance' },
  { company: 'support', title: 'Answers with the record attached', desc: 'Support drafts replies against billing and order history directly, and every refund still waits for a human yes.', logo: 'Healthcare SaaS', href: '#/use-cases/customer-support' },
];

/**
 * The first-class connectors — every name here resolves to a live entry in the
 * catalog, so no card on the home page advertises something you cannot connect.
 */
export const integrations = [
  { name: 'AWS', category: 'Cloud', desc: 'Inventory resources, read state, reconcile spend', logo: 'aws' },
  { name: 'Google Cloud', category: 'Cloud', desc: 'Query projects, resources, and billing', logo: 'gcloud' },
  { name: 'Cloudflare', category: 'Cloud', desc: 'Read DNS, zones, and edge configuration', logo: 'cloudflare' },
  { name: 'Vercel', category: 'Cloud', desc: 'Correlate deployments with what changed', logo: 'vercel' },
  { name: 'GitHub', category: 'Code', desc: 'Read repos, open pull requests, review diffs', logo: 'github' },
  { name: 'GitLab', category: 'Code', desc: 'Same run, against GitLab repositories', logo: 'gitlab' },
  { name: 'Azure DevOps', category: 'Code', desc: 'Pipelines, repos, and work items', logo: 'azuredevops' },
  { name: 'Jira', category: 'Work tracking', desc: 'File, update, and close issues with evidence', logo: 'jira' },
  { name: 'Linear', category: 'Work tracking', desc: 'Open issues that carry their own proof', logo: 'linear' },
  { name: 'Datadog', category: 'Observability', desc: 'Read metrics and monitors around an incident', logo: 'datadog' },
  { name: 'Sentry', category: 'Observability', desc: 'Group traces and find when an issue started', logo: 'sentry' },
  { name: 'Notion', category: 'Knowledge', desc: 'Read and write the pages teams work from', logo: 'notion' },
  { name: 'Confluence', category: 'Knowledge', desc: 'Search spaces and update documentation', logo: 'confluence' },
  { name: 'Slack', category: 'Messaging', desc: 'Where the objective is posted and returned', logo: 'slack' },
  { name: 'Terraform Cloud', category: 'Infrastructure as code', desc: 'Read plans and check drift against reality', logo: 'terraform' },
  { name: 'Kentron AI API', category: 'Custom', desc: 'Kick off governed runs from your own systems', logo: 'api' },
];

export const integrationHighlights = [
  {
    title: 'Built for the cloud',
    desc: 'Kentron AI reaches your cloud accounts to inventory resources, read state, and reconcile spend — with the raw API response attached to the receipt.',
    badges: ['AWS', 'Google Cloud', 'Cloudflare', 'Vercel'],
  },
  {
    title: 'Built for the codebase',
    desc: 'Read repositories, correlate a deploy with the commit that caused it, and open a pull request a human reviews as a diff.',
    badges: ['GitHub', 'GitLab', 'Azure DevOps'],
  },
  {
    title: 'Alerts to answers',
    desc: 'Group traces, read the metrics around the window, and find the first occurrence — before anyone joins the call.',
    badges: ['Datadog', 'Sentry'],
  },
  {
    title: 'Scoped actions, not blank cheques',
    desc: 'Every connector exposes an explicit list of what an agent may do with it. Runtime policy authorizes at the action level, and each action that runs is a typed event on the chain.',
    badges: ['Runtime policy'],
  },
  {
    title: 'Lanes decide what a run can touch',
    desc: 'A lane bundles the class of tools, the class of actions, and the policy that applies. Choose it at launch, or let policy route the objective.',
    badges: ['Lanes'],
  },
  {
    title: 'Credentials stay server-side',
    desc: 'Authorize with OAuth or an API credential once. Credentials are stored server-side and never written into the receipt chain — revoke at the provider and the actions stop.',
    badges: ['OAuth', 'API key'],
  },
  {
    title: 'Work tracking and knowledge',
    desc: 'File the issue, update the ticket, and write the page — so the output of a run lands where the team already looks.',
    badges: ['Jira', 'Linear', 'Notion', 'Confluence'],
  },
  {
    title: 'Reconnect, revoke, rescope',
    desc: 'An expired token is recorded as a receipt and prompts reauthorization. Revoke a connector and its actions leave future runs; past receipts still show what ran.',
    badges: ['Managed connectors'],
  },
];

/**
 * The six product sections on the home page, in the order they appear.
 *
 * Single source of truth: each section component renders its entry, and
 * scripts/generate-agent-context.mjs reads them for llms.txt and JSON-LD.
 * Adding a product here and rendering it is enough — nothing else to update.
 */
export type Product = {
  /** Anchor id of the section, matching the Product nav entry. */
  id: string;
  /** Small label above the headline. */
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export const products: Product[] = [
  {
    id: 'receipt-ai-coworker',
    eyebrow: 'Receipt: AI Coworker',
    title: 'An AI coworker for every question',
    description:
      'Mention Kentron AI in a thread or launch a run from the workbench. It works through your connected systems and backs every result with a receipt you can replay.',
    bullets: [
      'Post an objective in Slack or the workbench — no workflow to draw first',
      'It operates through your connected systems, with evidence attached as it goes',
      'Every material step is a receipt: typed, immutable, and replayable later',
    ],
  },
  {
    id: 'mcp-gateway',
    eyebrow: 'MCP Gateway',
    title: 'One gateway for every MCP connection',
    description:
      'Secure, governed MCP access across Claude, Cursor, ChatGPT, Codex, and agents—with policy controls, OAuth, runtime security, and an audit trail for every request.',
    bullets: [
      'Securely integrates with 80,000+ tools and 1000+ apps, preview capabilities instantly, no API docs required.',
      'Take action anywhere—zero setup, zero keys, zero configuration needed',
      'AI agents autonomously discover, reason about, and operate any app.',
    ],
  },
  {
    id: 'llm-gateway',
    eyebrow: 'LLM Gateway',
    title: 'Route, log, and govern every model call',
    description:
      'Route all LLM traffic through a single, policy-enforcing checkpoint that prevents costly failures and compliance breaches.',
    bullets: [
      'Real-time policy enforcement blocks non-compliant requests before they generate costs',
      'Intelligent rate limiting and token budgets prevent runaway spending across all models',
      'Unified audit trail tracks every LLM request for regulatory compliance and investigation',
    ],
  },
  {
    id: 'kentron-catalog',
    eyebrow: 'Kentron Catalog',
    title: `${CATALOG_LABEL} connectors, browsable A–Z`,
    description:
      'One governed registry for approved connectors, skills, and plugins—with clear ownership, dependencies, access controls, and usage visibility.',
    bullets: [
      'Centralized registry with automated approval ensures only vetted connectors reach production.',
      'Real-time visibility into connector dependencies, adoption patterns, and security posture',
      'Clear accountability with role-based access rules that enforce governance automatically.',
    ],
  },
  {
    id: 'kentron-guard',
    eyebrow: 'Kentron Guard',
    title: 'Stop risky agent actions before they execute',
    description:
      'Real-time inspection of tools, outputs, PII, policies, and agent actions with threat scanners that evolve with emerging risks.',
    bullets: [
      'Intercept risky agent actions in real-time before execution, preventing compliance violations automatically.',
      'Threat scanners that continuously learn and adapt against emerging agent risks and attack patterns.',
      'Detect and block PII leakage, policy violations, and unauthorized data access in single dashboard.',
    ],
  },
  {
    id: 'kentron-core',
    eyebrow: 'Kentron Core',
    title: 'The platform underneath every Kentron product',
    description:
      'Automatically transform production conversations into high-quality training datasets for rapid model iteration.',
    bullets: [
      'Extract and label production conversations automatically for instant model retraining',
      'Turn customer interactions into validated training data without manual annotation',
      'Close the feedback loop: production insights powering continuous AI model improvement',
    ],
  },
];

export const faqs = [
  { q: 'What is Kentron AI and what does it actually do?', a: `Kentron AI is an autonomous AI coworker platform that gives your team an AI agent with real execution capability: it runs code in a private isolated sandbox, reaches your connected tools (AWS, Jira, GitHub, Vercel, Slack, and more) through scoped actions, and converts probabilistic AI requests into deterministic, auditable outcomes. Every action is logged as an immutable, cryptographically chained \u201creceipt\u201d\u2014the permanent source of truth\u2014enabling full audit, replay, and crash recovery.` },
  { q: 'How is Kentron AI different from Claude Code, Codex, or other AI coding tools?', a: `Claude Code and Codex are single-session coding assistants for individual developers; Kentron AI is a multi-tenant production control plane that can orchestrate and run AI agents like those as auditable background workers. Kentron AI adds durable execution (survives crashes), deterministic replay (proves what happened), compliance logging (immutable audit trail), multi-tenant isolation (each org\u2019s data is separate), and integration with the systems you connect\u2014all things you need for production governance that a session-based coding tool doesn\u2019t provide.` },
  { q: 'Is it actually safe to give AI agents access to my production systems?', a: 'Yes\u2014if you use Kentron AI correctly. Every action runs in an isolated OpenSandbox with zero ambient access; credentials are never stored in Kentron AI (Nango owns them, Kentron AI only stores encrypted references); all state-changing operations are deterministic, replayable, and cryptographically chained so you can verify exactly what happened; and Kentron AI enforces org-level policy gates before any AI decision is executed. The default is \u201csandbox first, audit everything\u201d\u2014not \u201ctrust and react.\u201d' },
  { q: 'What\u2019s the difference between a "receipt" and regular logs or observability?', a: 'Observability logs describe state that exists elsewhere; deleting logs loses visibility but not data. Receipts are the state\u2014the append-only source of truth\u2014and the running system is just a derived copy. Deleting receipts loses everything. This matters because it means Kentron AI doesn\u2019t copy data around; it owns the provable history. You can replay any past moment, audit any decision, and prove causation\u2014not just observe failures after they happen.' },
  { q: 'What SaaS apps and systems can Kentron AI connect to?', a: `Kentron AI carries a catalog of ${CATALOG_LABEL} connectors (AWS, Google Cloud, Vercel, GitHub, GitLab, Jira, Confluence, Slack, HubSpot, Salesforce, Linear, Zendesk, and many more). You control which integrations each team member can access via org-level policy; credentials stay with the provider (Nango), never in Kentron AI; and you can add new integrations without waiting for a Kentron AI release. If Nango supports it and your team has a connection, the AI can use it\u2014sandbox first, audit everything.` },
  { q: 'How do I know the AI actually did what it claimed to do?', a: 'Every action is a receipt: immutable, timestamped, cryptographically chained to the previous receipt, and contains the command, the evidence artifact, and the exit code. You can replay that receipt independently to verify the outcome. For external APIs (AWS, Jira, GitHub), the evidence includes the raw API response verbatim plus a tamper-evident hash. For code execution, you get the stdout, exit code, and any files created. Replay + independent verification = proof. No copying data between systems, no hidden side effects.' },
  { q: 'What happens if the agent makes a mistake, gets stuck, or a task crashes?', a: 'Kentron AI logs every step as an immutable receipt, so if a task crashes, you can replay from the last receipt without re-running earlier work\u2014crash recovery is automatic. If the AI makes a wrong decision, that\u2019s logged and auditable; you can review the evidence, fix the underlying issue, and replay from any point. If the agent gets stuck, Kentron AI detects stalled work (expired leases, watchdog, invariant checks) and self-heals with no human intervention\u2014re-folding receipts and re-dispatching deterministically.' },
];

export const footerLinks = {
  Product: [
    { label: 'Integrations', href: '#/integrations' },
    { label: 'Use cases', href: '#/use-cases' },
    { label: 'Security', href: '#/security' },
  ],
  'Use cases': teams.slice(0, 6).map((t) => ({ label: t.label, href: `#/use-cases/${t.slug}` })),
  // The internal console is linked from here, at the end of Resources. The link
  // itself gives nothing away: it opens a sign-in that only a Kentron account
  // gets past, and the page behind it is served by Kentron AI, not by this site.
  //
  // Dropping this link in c57929d did not remove the console — the `#/admin`
  // route and its chunk stayed deployed — it only made the console unreachable
  // for anyone who did not already know the URL.
  Resources: [
    ...resourceNavChildren.map((r) => ({ label: r.label, href: r.href })),
    { label: 'Admin console', href: '#/admin' },
  ],
};
