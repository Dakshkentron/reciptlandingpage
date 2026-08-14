import { catalogCounts } from '@/data/integrations';

import { teamNavChildren, teams, useCaseCount } from '@/data/useCases';
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
    label: 'Solution',
    children: [
      { label: 'Integrations', href: '#/integrations', desc: `${catalogCounts.total} connectors, browsable A–Z`, icon: 'Plug' },
      { label: 'Use cases', href: '#/use-cases', desc: `${useCaseCount} worked examples across ${teams.length} teams`, icon: 'Sparkles' },
    ],
  },
  { label: 'For Teams', wide: true, children: teamNavChildren },
  { label: 'Resources', children: resourceNavChildren },
  { label: 'Customers', href: '#customers' },
  { label: 'Security', href: '#/security' },
  { label: 'Pricing', href: '#/pricing' },
];

export const trustedBy = [
  'OrangePro', 'MyVisionLab', 'TenUp',  'Binaryflux', 'CStream'
];

export const heroStats = [
  { value: `${catalogCounts.live}`, label: 'connectors live today, ready to operate' },
  { value: 'Every step', label: 'typed, immutable, and hash-linked' },
  { value: 'Replayable', label: 'any past run, decision by decision' },
];


export const features = [
  {
    id: 'objective',
    eyebrow: 'Post an objective',
    title: 'Describe the outcome. In Slack, like a colleague.',
    description:
      'Mention Receipt in a thread or launch a run from the web workbench — both create the same receipt-backed run. Receipt replies “Accepted. Starting a background run,” then keeps working after you close the tab.',
    bullets: [
      'No workflow to draw first and no trigger to configure',
      'Slack and the workbench are the same run, recorded the same way',
      'Long-lived work continues in the background without you watching it',
    ],
    badge: 'Slack & workbench',
  },
  {
    id: 'operate',
    eyebrow: 'It operates, not advises',
    title: 'Your systems are the substrate, not its memory.',
    description:
      'A worker is leased to the run and works through connected systems — browsers, terminals, repositories, and scoped connector actions inside its lane. Query AWS, open a pull request, read Datadog, update Jira, with the evidence attached as it goes.',
    bullets: [
      'Every connector exposes an explicit list of actions an agent may use',
      'Runtime policy authorizes at the action level, not the tool level',
      'Results come back with the raw response attached, not summarized away',
    ],
    badge: 'Scoped actions',
  },
  {
    id: 'receipts',
    eyebrow: 'The receipt chain',
    title: 'Every material step is written down before the run moves on.',
    description:
      'Objective accepted, worker leased, actions executed, checks passed, review recorded, receipt issued. The chain is typed, immutable, and previous-hash linked — tamper with one entry and every entry after it breaks.',
    bullets: [
      'Control decisions are events too: leases, policy choices, merges, reviews',
      'Views and queues are projections over the record, never the source of truth',
      'An audit reads one chain instead of correlating five systems’ logs',
    ],
    badge: 'Hash-linked',
  },
  {
    id: 'replay',
    eyebrow: 'Replay & improve',
    title: 'Reconstruct what the agent saw and why it was allowed.',
    description:
      'Replay covers model interaction, action selection, queue movement, and policy decisions. What the run learns — a stronger check, a corrected runbook — is promoted into memory so the next run starts with the fix already in place.',
    bullets: [
      'Recovery resumes from the last receipt instead of re-running finished work',
      'Lessons from reviews and failures are promoted into memory and policy',
      'Scheduled runs repeat the same governed path on their own',
    ],
    badge: 'Deterministic replay',
  },
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
  { company: 'fintech', title: 'Incident triage without the tab sprawl', desc: 'Sentry, Vercel, GitHub and Datadog connected. Receipt correlates the alert to the deploy and opens the revert PR for review.', logo: 'Series B fintech', href: '#/use-cases/engineering' },
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
  { name: 'Receipt API', category: 'Custom', desc: 'Kick off governed runs from your own systems', logo: 'api' },
];

export const integrationHighlights = [
  {
    title: 'Built for the cloud',
    desc: 'Receipt reaches your cloud accounts to inventory resources, read state, and reconcile spend — with the raw API response attached to the receipt.',
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

export const faqs = [
  { q: 'What is Receipt and what does it actually do?', a: `Receipt is an autonomous AI coworker platform that gives your team an AI agent with real execution capability: it runs code in a private isolated sandbox, reaches your connected tools (AWS, Jira, GitHub, Vercel, Slack, and more) through scoped actions, and converts probabilistic AI requests into deterministic, auditable outcomes. Every action is logged as an immutable, cryptographically chained \u201creceipt\u201d\u2014the permanent source of truth\u2014enabling full audit, replay, and crash recovery.` },
  { q: 'How is Receipt different from Claude Code, Codex, or other AI coding tools?', a: `Claude Code and Codex are single-session coding assistants for individual developers; Receipt is a multi-tenant production control plane that can orchestrate and run AI agents like those as auditable background workers. Receipt adds durable execution (survives crashes), deterministic replay (proves what happened), compliance logging (immutable audit trail), multi-tenant isolation (each org\u2019s data is separate), and integration with the systems you connect\u2014all things you need for production governance that a session-based coding tool doesn\u2019t provide.` },
  { q: 'Is it actually safe to give AI agents access to my production systems?', a: 'Yes\u2014if you use Receipt correctly. Every action runs in an isolated OpenSandbox with zero ambient access; credentials are never stored in Receipt (Nango owns them, Receipt only stores encrypted references); all state-changing operations are deterministic, replayable, and cryptographically chained so you can verify exactly what happened; and Receipt enforces org-level policy gates before any AI decision is executed. The default is \u201csandbox first, audit everything\u201d\u2014not \u201ctrust and react.\u201d' },
  { q: 'What\u2019s the difference between a "receipt" and regular logs or observability?', a: 'Observability logs describe state that exists elsewhere; deleting logs loses visibility but not data. Receipts are the state\u2014the append-only source of truth\u2014and the running system is just a derived copy. Deleting receipts loses everything. This matters because it means Receipt doesn\u2019t copy data around; it owns the provable history. You can replay any past moment, audit any decision, and prove causation\u2014not just observe failures after they happen.' },
  { q: 'What SaaS apps and systems can Receipt connect to?', a: `Receipt carries a catalog of ${catalogCounts.total} connectors, ${catalogCounts.live} of them live today (AWS, Google Cloud, Vercel, GitHub, GitLab, Jira, Confluence, Slack, HubSpot, Salesforce, Linear, Zendesk, and many more). You control which integrations each team member can access via org-level policy; credentials stay with the provider (Nango), never in Receipt; and you can add new integrations without waiting for a Receipt release. If Nango supports it and your team has a connection, the AI can use it\u2014sandbox first, audit everything.` },
  { q: 'How do I know the AI actually did what it claimed to do?', a: 'Every action is a receipt: immutable, timestamped, cryptographically chained to the previous receipt, and contains the command, the evidence artifact, and the exit code. You can replay that receipt independently to verify the outcome. For external APIs (AWS, Jira, GitHub), the evidence includes the raw API response verbatim plus a tamper-evident hash. For code execution, you get the stdout, exit code, and any files created. Replay + independent verification = proof. No copying data between systems, no hidden side effects.' },
  { q: 'What happens if the agent makes a mistake, gets stuck, or a task crashes?', a: 'Receipt logs every step as an immutable receipt, so if a task crashes, you can replay from the last receipt without re-running earlier work\u2014crash recovery is automatic. If the AI makes a wrong decision, that\u2019s logged and auditable; you can review the evidence, fix the underlying issue, and replay from any point. If the agent gets stuck, Receipt detects stalled work (expired leases, watchdog, invariant checks) and self-heals with no human intervention\u2014re-folding receipts and re-dispatching deterministically.' },
];

export const footerLinks = {
  Product: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Integrations', href: '#/integrations' },
    { label: 'Use cases', href: '#/use-cases' },
    { label: 'Pricing', href: '#/pricing' },
    { label: 'Security', href: '#/security' },
  ],
  'Use cases': teams.slice(0, 6).map((t) => ({ label: t.label, href: `#/use-cases/${t.slug}` })),
  Resources: [
    ...resourceNavChildren.map((r) => ({ label: r.label, href: r.href })),
    // Internal console for Kentron staff, living in the app rather than here.
    // Listing it costs nothing: it opens only for a signed-in kentron.ai
    // account, and redirects everyone else.
    { label: 'Admin', href: 'https://beetle.run/admin' },
  ],
};
