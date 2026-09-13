import { Fragment, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Minus, Receipt, Sparkles, Zap } from 'lucide-react';
import { CATALOG_LABEL } from '@/data/integrations';

/** Credit ladder. One price per credit, so the tiers are the same deal at every size. */
const tiers = [
  { credits: 20_000, price: 50 },
  { credits: 40_000, price: 100 },
  { credits: 125_000, price: 300 },
  { credits: 300_000, price: 750, popular: true },
  { credits: 600_000, price: 1_500 },
  { credits: 1_000_000, price: 2_500 },
  { credits: 2_000_000, price: 5_000 },
  { credits: 3_000_000, price: 7_500 },
  { credits: 6_000_000, price: 15_000 },
  { credits: 12_000_000, price: 30_000 },
];

const DEFAULT_TIER = 3;

const formatCredits = (n: number) =>
  n >= 1_000_000 ? `${n / 1_000_000}M` : `${(n / 1_000).toLocaleString('en-US')}K`;

const teamIncludes = [
  'Slack-native coworker — mentions and in-thread replies',
  'Persistent workspace context across every run',
  `All ${CATALOG_LABEL} connectors in the catalog`,
  'Scheduled and recurring tasks',
  'Draft-first writes with approval gates',
  'Immutable receipts, replay, and crash recovery',
  'Unlimited seats — you pay for work, not headcount',
];

const enterpriseIncludes = [
  'Everything in Team, at negotiated credit rates',
  'SSO/SAML, SCIM provisioning, and role-based policy',
  'Security review, DPA, and compliance questionnaires',
  'Uptime SLA with a named support channel',
  'Dedicated onboarding and solution engineering',
  'Annual invoicing and purchase-order billing',
];

const creditExamples = [
  {
    icon: Zap,
    label: 'Quick task',
    range: '100–300 credits',
    example: '“Pull yesterday’s Stripe transactions and flag anything unusual.” One tool, one pass, answer in Slack.',
  },
  {
    icon: Sparkles,
    label: 'Complex workflow',
    range: '500–1,500 credits',
    example: '“Reconcile Stripe against HubSpot, find the mismatches, and open a Linear issue for each.” Several tools, several steps.',
  },
  {
    icon: Receipt,
    label: 'Full project',
    range: '2,000–5,000 credits',
    example: '“Audit our AWS spend, check it against the Terraform plan, and write the cost report with sources attached.”',
  },
];

type Cell = boolean | string;

const comparison: { section: string; rows: { label: string; free: Cell; team: Cell; enterprise: Cell }[] }[] = [
  {
    section: 'Working with Receipt',
    rows: [
      { label: 'Monthly credits', free: '$100 in credits, once', team: 'Your chosen tier', enterprise: 'Negotiated' },
      { label: 'Seats', free: 'Up to 3', team: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Slack-native agent', free: true, team: true, enterprise: true },
      { label: 'Microsoft Teams', free: false, team: true, enterprise: true },
      { label: 'Scheduled & recurring tasks', free: false, team: true, enterprise: true },
      { label: 'Persistent workspace context', free: true, team: true, enterprise: true },
    ],
  },
  {
    section: 'Connectors',
    rows: [
      { label: 'Connectors', free: `All ${CATALOG_LABEL}`, team: `All ${CATALOG_LABEL}`, enterprise: `All ${CATALOG_LABEL}` },
      { label: 'Multiple accounts per connector', free: false, team: true, enterprise: true },
      { label: 'Receipt builds against your own API', free: false, team: true, enterprise: true },
      { label: 'Private / self-hosted endpoints', free: false, team: false, enterprise: true },
    ],
  },
  {
    section: 'Governance & proof',
    rows: [
      { label: 'Immutable receipts on every action', free: true, team: true, enterprise: true },
      { label: 'Deterministic replay', free: true, team: true, enterprise: true },
      { label: 'Approval gates on state changes', free: true, team: true, enterprise: true },
      { label: 'Org-level policy engine', free: false, team: true, enterprise: true },
      { label: 'Receipt retention', free: '30 days', team: '12 months', enterprise: 'Custom' },
      { label: 'Audit log export', free: false, team: true, enterprise: true },
      { label: 'SSO / SAML & SCIM', free: false, team: false, enterprise: true },
    ],
  },
  {
    section: 'Support',
    rows: [
      { label: 'Community & docs', free: true, team: true, enterprise: true },
      { label: 'Email support', free: false, team: true, enterprise: true },
      { label: 'Shared Slack channel', free: false, team: false, enterprise: true },
      { label: 'Uptime SLA', free: false, team: false, enterprise: '99.9%' },
      { label: 'Dedicated onboarding', free: false, team: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Every new workspace starts with $100 in credits, without a card on file and without talking to anyone here first. That is enough for a few hundred real tasks, which is the only honest way to find out whether Receipt is useful for your team.',
  },
  {
    q: 'How many credits do we actually need?',
    a: 'Most teams land between 125,000 and 300,000 credits a month once Receipt is part of the routine — roughly 100–300 credits for a quick lookup, 500–1,500 for a multi-tool workflow, and 2,000–5,000 for a full project. Start on a small tier; moving up takes one click.',
  },
  {
    q: 'Can we change plans mid-month?',
    a: 'Yes. Upgrade at any time and you are charged the prorated difference immediately. Downgrades take effect at the start of the next billing period, and nothing is locked behind an annual contract unless you want one.',
  },
  {
    q: 'Do unused credits roll over?',
    a: 'Credits reset each billing period on Team plans. If your usage is uneven month to month, Enterprise agreements can pool credits across a year instead — that is usually the cheaper answer for seasonal work.',
  },
  {
    q: 'Do you charge per seat?',
    a: 'No. Team plans include unlimited seats. You pay for the work Receipt does, not for how many people are allowed to ask — because a tool everyone can reach is worth more than one gated to a licensed few.',
  },
  {
    q: 'Are any features held back on the cheaper plans?',
    a: `No feature gating on the work itself: every plan reaches all ${CATALOG_LABEL} connectors and gets receipts, replay, and approval gates. Enterprise adds the things large orgs need around it — SSO, policy administration, retention, SLA, and dedicated onboarding.`,
  },
  {
    q: 'How do we keep credit usage down?',
    a: 'Be specific about scope, let Receipt reuse workspace context instead of re-reading the same systems, and schedule recurring reports rather than asking ad hoc. We do not mark up model tokens, and cached context is not re-billed, so tighter prompts genuinely cost less.',
  },
  {
    q: 'Do you offer nonprofit or startup discounts?',
    a: 'Yes — 15% off for registered nonprofits and educational institutions, and startup credits for early-stage companies. Email us with a line about what you are building.',
  },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-brand-600" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-ink-200" aria-label="Not included" />;
  return <span className="text-sm text-ink-700">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-ink-950">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-none text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="-mt-1 pb-5 pr-8 text-sm leading-relaxed text-ink-500">{a}</p>}
    </div>
  );
}

export default function PricingPage() {
  const [tierIndex, setTierIndex] = useState(DEFAULT_TIER);
  const tier = tiers[tierIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 text-center lg:px-8 lg:py-20">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            $100 in credits to start
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-6xl">
            Pay for the work.
            <br />
            Not for the seats.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
            Receipt bills in credits, so the cost tracks what your coworker actually did — not how many
            people you let near it. Start without a card, and without a call.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
            </a>
            <a href="mailto:hello@beetle.run" className="btn-secondary btn-lg">
              Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Plans ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Free */}
            <div className="flex flex-col rounded-3xl border border-ink-100 bg-white p-7">
              <h2 className="text-lg font-bold text-ink-950">Free</h2>
              <p className="mt-1.5 text-sm text-ink-500">See whether it earns a place in the workflow.</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-ink-950">$0</span>
                <span className="text-sm text-ink-400">forever</span>
              </div>
              <p className="mt-2 text-sm text-ink-500">$100 in credits, once. No card required.</p>
              <a href="https://app.kentron.ai/auth/sign-up" className="btn-secondary mt-6 w-full">
                Start free
              </a>
              <ul className="mt-7 space-y-3 border-t border-ink-100 pt-6">
                {[
                  'Up to 3 seats',
                  `All ${CATALOG_LABEL} connectors`,
                  'Slack-native coworker',
                  'Receipts, replay, and approval gates',
                  '30-day receipt retention',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Team — credit slider */}
            <div className="relative flex flex-col rounded-3xl border-2 border-brand-500 bg-white p-7 shadow-xl shadow-brand-500/10">
              <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
              <h2 className="text-lg font-bold text-ink-950">Team</h2>
              <p className="mt-1.5 text-sm text-ink-500">Pick the credit tier that matches your volume.</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-ink-950">
                  ${tier.price.toLocaleString('en-US')}
                </span>
                <span className="text-sm text-ink-400">/month</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-brand-700">
                {formatCredits(tier.credits)} credits per month
              </p>

              <div className="mt-5">
                <input
                  type="range"
                  min={0}
                  max={tiers.length - 1}
                  step={1}
                  value={tierIndex}
                  onChange={(e) => setTierIndex(Number(e.target.value))}
                  aria-label="Monthly credits"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-100 accent-brand-500"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-ink-400">
                  <span>{formatCredits(tiers[0].credits)}</span>
                  <span>{formatCredits(tiers[tiers.length - 1].credits)}</span>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  ${(tier.price / (tier.credits / 1000)).toFixed(2)} per 1,000 credits · same rate at every
                  tier · change tiers any time
                </p>
              </div>

              <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary mt-6 w-full">
                Get started
              </a>

              <ul className="mt-7 space-y-3 border-t border-ink-100 pt-6">
                {teamIncludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col rounded-3xl border border-ink-100 bg-ink-950 p-7 text-white">
              <h2 className="text-lg font-bold">Enterprise</h2>
              <p className="mt-1.5 text-sm text-ink-300">
                For orgs that have to prove what the agent did.
              </p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight">Custom</span>
              </div>
              <p className="mt-2 text-sm text-ink-300">Volume credit rates, billed annually.</p>
              <a
                href="mailto:hello@beetle.run"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-200 hover:bg-ink-100 active:scale-[0.98]"
              >
                Contact sales
              </a>
              <ul className="mt-7 space-y-3 border-t border-ink-700/60 pt-6">
                {enterpriseIncludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-200">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- What a credit buys ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="section-intro">
            <h2 className="section-title text-ink-950">What does a credit actually buy?</h2>
            <p className="section-lead text-ink-500">
              A credit is a unit of work, not a subscription seat. Here is what real jobs cost.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {creditExamples.map((ex) => (
              <div key={ex.label} className="rounded-2xl border border-ink-100 bg-white p-6">
                <ex.icon className="h-5 w-5 text-brand-500" />
                <h3 className="mt-4 text-base font-semibold text-ink-950">{ex.label}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-700">{ex.range}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{ex.example}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: 'No model markup.',
                desc: 'You pay what the underlying models cost us. We make money when Receipt is worth keeping, not on a token spread.',
              },
              {
                title: 'Cached context is not re-billed.',
                desc: 'Receipt reuses what it already knows about your workspace instead of re-reading the same systems every run.',
              },
              {
                title: 'Automation gets cheaper with scale.',
                desc: 'Recurring jobs reuse plans and context, so the tenth run of a report costs meaningfully less than the first.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-semibold text-ink-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Comparison ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-10 text-center text-ink-950">Compare the plans</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="w-2/5 py-4 text-sm font-semibold text-ink-950">Feature</th>
                  <th className="py-4 text-center text-sm font-semibold text-ink-950">Free</th>
                  <th className="py-4 text-center text-sm font-semibold text-brand-700">Team</th>
                  <th className="py-4 text-center text-sm font-semibold text-ink-950">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((group) => (
                  <Fragment key={group.section}>
                    <tr className="bg-ink-50/60">
                      <td
                        colSpan={4}
                        className="px-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400"
                      >
                        {group.section}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-ink-100">
                        <td className="py-3.5 pr-4 text-sm text-ink-700">{row.label}</td>
                        <td className="px-2 py-3.5 text-center">
                          <CellValue value={row.free} />
                        </td>
                        <td className="bg-brand-50/40 px-2 py-3.5 text-center">
                          <CellValue value={row.team} />
                        </td>
                        <td className="px-2 py-3.5 text-center">
                          <CellValue value={row.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-6 text-center text-ink-950">Pricing questions</h2>
          <div className="rounded-2xl border border-ink-100 bg-white px-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Start free. Bring your whole stack.</h2>
          <p className="section-lead text-ink-500">
            $100 in credits, all {CATALOG_LABEL} connectors, and a receipt for everything Receipt does.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/integrations" className="btn-secondary btn-lg">
              Browse integrations
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
