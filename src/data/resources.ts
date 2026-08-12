/**
 * Resource pages: Blog, Research, Case studies.
 *
 * Docs are not one of them — they live in the Mintlify site, so the Resources
 * menu links straight out to `DOCS_URL` instead of rendering a page here.
 *
 * Case studies are written against anonymised company profiles rather than named
 * logos — the shape of the deployment is the useful part, and it is the part we
 * can actually stand behind.
 */

export const DOCS_URL = 'https://reciptwebsite.mintlify.app/introduction';

export type ResourceKind = 'blog' | 'research' | 'case-studies';

export interface ResourceItem {
  title: string;
  desc: string;
  meta: string;
  tag: string;
  href: string;
}

export interface ResourceSection {
  heading: string;
  items: ResourceItem[];
}

export interface ResourcePageData {
  kind: ResourceKind;
  eyebrow: string;
  icon: string;
  title: string;
  lead: string;
  sections: ResourceSection[];
  /** Shown in the closing panel. */
  cta: { title: string; desc: string };
}

const blog: ResourcePageData = {
  kind: 'blog',
  eyebrow: 'Blog',
  icon: 'Newspaper',
  title: 'Notes on building agents you can audit.',
  lead: 'What we are learning about running AI agents against production systems — the architecture, the failure modes, and the things that turned out to matter more than we expected.',
  sections: [
    {
      heading: 'Latest',
      items: [
        { title: 'Observability describes state. Receipts are the state.', desc: 'Why we made the append-only chain the source of truth and the running system the derived copy — and what that buys you the first time a run crashes halfway.', meta: 'Engineering · 9 min', tag: 'Architecture', href: '#/security' },
        { title: 'The approval gate is the product', desc: 'Autonomy is easy. The hard part is deciding what an agent may do without asking, and making that decision legible to a security team.', meta: 'Product · 7 min', tag: 'Design', href: '#/security' },
        { title: 'What breaks when an agent touches 1,000 SaaS APIs', desc: 'Rate limits, partial writes, inconsistent pagination, and the four idempotency patterns that survived contact with production.', meta: 'Engineering · 12 min', tag: 'Integrations', href: '#/integrations' },
        { title: 'Stop asking whether the model hallucinated', desc: 'The useful question is whether the action can be verified. A tale of two architectures, and why one of them can answer it.', meta: 'Research · 6 min', tag: 'Trust', href: '#/research' },
      ],
    },
    {
      heading: 'From the field',
      items: [
        { title: 'The offboarding gap nobody measures', desc: 'Across the deployments we have seen, SSO covers roughly two-thirds of a departing employee\'s access. Here is where the rest hides.', meta: 'Security · 8 min', tag: 'IT & Security', href: '#/use-cases/it-security' },
        { title: 'Root cause in eleven minutes', desc: 'An anatomy of one incident run: the alert, the deploy correlation, the commit, the revert PR, and the receipt chain underneath all of it.', meta: 'Engineering · 10 min', tag: 'Engineering', href: '#/use-cases/engineering' },
        { title: 'Month-end close as a replayable run', desc: 'What changes when the reconciliation itself is an auditable artifact rather than a process someone remembers performing.', meta: 'Finance · 7 min', tag: 'Finance', href: '#/use-cases/finance' },
      ],
    },
  ],
  cta: {
    title: 'Want these in your inbox?',
    desc: 'One post a fortnight, no digests, no product announcements dressed up as engineering writing.',
  },
};

const research: ResourcePageData = {
  kind: 'research',
  eyebrow: 'Research',
  icon: 'BarChart3',
  title: 'The work behind the architecture.',
  lead: 'Receipt exists because probabilistic systems need deterministic accountability. These are the papers, benchmarks, and design notes we keep coming back to — including our own.',
  sections: [
    {
      heading: 'Our work',
      items: [
        { title: 'Deterministic replay for non-deterministic agents', desc: 'A design note on separating the decision (which the model makes) from the execution record (which must be reproducible), and the folding model that connects them.', meta: 'Design note', tag: 'Architecture', href: '#/security' },
        { title: 'Chained receipts as a tamper-evident audit substrate', desc: 'The hashing scheme, what it does and does not prove, and how independent verification works without trusting our infrastructure.', meta: 'Technical paper', tag: 'Security', href: '#/security' },
        { title: 'Failure taxonomy for cross-system agent runs', desc: 'Every way a multi-tool run went wrong across our early deployments, classified — and which class the policy gate actually prevents.', meta: 'Benchmark', tag: 'Reliability', href: '#/use-cases' },
      ],
    },
    {
      heading: 'What we are reading',
      items: [
        { title: 'On the limits of observability for AI systems', desc: 'Why the tooling built for deterministic services under-serves systems whose behaviour is sampled rather than specified.', meta: 'Literature review', tag: 'Trust', href: '#/research' },
        { title: 'Human approval as a control, not a courtesy', desc: 'Evidence from adjacent fields — clinical decision support, aviation, trade settlement — on where gating helps and where it degrades into rubber-stamping.', meta: 'Literature review', tag: 'Design', href: '#/research' },
        { title: 'Cost of proof', desc: 'Measuring the overhead an immutable execution record adds to a run, and where it lands relative to the API latency it sits behind.', meta: 'Benchmark', tag: 'Performance', href: '#/research' },
      ],
    },
  ],
  cta: {
    title: 'Working on something adjacent?',
    desc: 'We share benchmarks and failure data with researchers working on agent reliability and auditability. Get in touch.',
  },
};

const caseStudies: ResourcePageData = {
  kind: 'case-studies',
  eyebrow: 'Case studies',
  icon: 'Sparkles',
  title: 'What teams actually put it to work on.',
  lead: 'Anonymised, because the interesting part is the shape of the deployment — what they connected, what they gated, and what changed by the second month.',
  sections: [
    {
      heading: 'Deployments',
      items: [
        { title: 'A Series B fintech cut incident triage from 50 to 11 minutes', desc: 'Connected Sentry, Vercel, GitHub and Datadog. Receipt correlates alerts to deploys and opens the revert PR; engineers review a diff instead of assembling a timeline.', meta: '38 engineers · 4 systems', tag: 'Engineering', href: '#/use-cases/engineering' },
        { title: 'A 400-person logistics platform closed the offboarding gap', desc: 'The first access review found 62 credentials outside SSO. Offboarding is now a single run with a verification read after every revoke.', meta: 'IT & Security · 9 systems', tag: 'Security', href: '#/use-cases/it-security' },
        { title: 'A marketplace took three days off month-end close', desc: 'Card feed, processor, and ledger reconciled nightly rather than monthly. Finance sees six exceptions instead of 318 transactions.', meta: 'Finance · 5 systems', tag: 'Finance', href: '#/use-cases/finance' },
        { title: 'A support org stopped escalating billing questions', desc: 'Agents verify charge history and draft evidenced replies themselves. Refunds still wait for a human — every one of them recorded.', meta: 'Support · 6 systems', tag: 'Customer Support', href: '#/use-cases/customer-support' },
      ],
    },
    {
      heading: 'By the numbers',
      items: [
        { title: 'Where the time actually goes', desc: 'Across deployments, the majority of recovered hours came from cross-system gathering, not from generation. The connective work was always the expensive part.', meta: 'Aggregate', tag: 'Analysis', href: '#/use-cases' },
        { title: 'What teams gate, and what they let run', desc: 'Reads open up almost immediately. Writes stay gated far longer than most teams expect — and the ones that ungate do it per-operation, never wholesale.', meta: 'Aggregate', tag: 'Governance', href: '#/security' },
        { title: 'The second-month pattern', desc: 'Usage rarely grows by adding teams. It grows when one team moves a scheduled, recurring job onto Receipt and stops checking it.', meta: 'Aggregate', tag: 'Adoption', href: '#/use-cases' },
      ],
    },
  ],
  cta: {
    title: 'Want to talk to a team already running it?',
    desc: 'We can introduce you to a deployment that looks like yours — same size, same stack, same governance constraints.',
  },
};

export const resourcePages: Record<ResourceKind, ResourcePageData> = {
  blog,
  research,
  'case-studies': caseStudies,
};

export const resourceNavChildren: {
  label: string;
  href: string;
  desc: string;
  icon: string;
  external?: boolean;
}[] = [
  { label: 'Docs', href: DOCS_URL, desc: 'Quickstart, concepts, and the API', icon: 'FileText', external: true },
  { label: 'Blog', href: '#/blog', desc: 'Notes on building auditable agents', icon: 'Newspaper' },
  { label: 'Research', href: '#/research', desc: 'Papers, benchmarks, and design notes', icon: 'BarChart3' },
  { label: 'Case studies', href: '#/case-studies', desc: 'How teams actually deploy it', icon: 'Sparkles' },
];
