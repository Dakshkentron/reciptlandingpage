import { ArrowRight, BadgeCheck, Check, Minus, ShieldCheck } from 'lucide-react';
import { CATALOG_LABEL } from '@/data/integrations';

/**
 * Compare page.
 *
 * The centrepiece is the price promise — it is the reason most visitors arrive
 * on this route, so it sits directly under the hero rather than at the bottom
 * of a long table.
 *
 * The comparison below it is deliberately drawn against *categories* of
 * alternative rather than named products: we can stand behind every line about
 * how a workflow builder or a chat assistant works as a class of tool, which is
 * not true of a feature grid for somebody else's roadmap.
 */

/** The promise, kept in one place so the page and its metadata cannot drift apart. */
const PROMISE =
  'We are confident you will not find a better product at this price. If you do, we will give you one year of service free.';

const CLAIM_EMAIL = 'hello@beetle.run';

type Cell = boolean | string;

const alternatives = ['Workflow builders & RPA', 'General chat assistants', 'In-house scripts'] as const;

const comparison: {
  section: string;
  rows: { label: string; receipt: Cell; builders: Cell; assistants: Cell; inHouse: Cell }[];
}[] = [
  {
    section: 'Getting work started',
    rows: [
      {
        label: 'How a task begins',
        receipt: 'Describe the outcome in Slack',
        builders: 'Draw the workflow first',
        assistants: 'Prompt, then act on it yourself',
        inHouse: 'Someone writes the script',
      },
      { label: 'Works without a diagram or trigger to configure', receipt: true, builders: false, assistants: true, inHouse: false },
      { label: 'Runs in the background after you close the tab', receipt: true, builders: true, assistants: false, inHouse: 'With your own scheduler' },
      { label: 'Handles a step the plan did not anticipate', receipt: true, builders: false, assistants: 'Advice only', inHouse: false },
    ],
  },
  {
    section: 'Reaching your systems',
    rows: [
      { label: 'Connectors ready to operate', receipt: `All ${CATALOG_LABEL}`, builders: 'Large catalogues', assistants: 'A handful', inHouse: 'Whatever you build' },
      { label: 'Actually changes state, not just reads it', receipt: true, builders: true, assistants: false, inHouse: true },
      { label: 'Browsers and terminals, not only APIs', receipt: true, builders: false, assistants: false, inHouse: 'If you write it' },
      { label: 'Permissions scoped per action, not per tool', receipt: true, builders: false, assistants: false, inHouse: false },
    ],
  },
  {
    section: 'Proving what happened',
    rows: [
      { label: 'Typed, hash-linked record of every material step', receipt: true, builders: false, assistants: false, inHouse: false },
      { label: 'Deterministic replay of a past run', receipt: true, builders: 'Run logs', assistants: false, inHouse: 'Log files' },
      { label: 'Approval gate before a write lands', receipt: true, builders: 'Manual steps', assistants: false, inHouse: false },
      { label: 'An audit reads one chain, not five systems’ logs', receipt: true, builders: false, assistants: false, inHouse: false },
    ],
  },
  {
    section: 'What it costs to keep',
    rows: [
      { label: 'Priced on work done, not seats', receipt: true, builders: 'Usually per seat or per task', assistants: 'Per seat', inHouse: 'Engineering time' },
      { label: 'Cost when the process changes', receipt: 'Say what changed', builders: 'Rebuild the workflow', assistants: 'Re-prompt each time', inHouse: 'Reopen the code' },
      { label: 'Maintained by your engineers', receipt: false, builders: false, assistants: false, inHouse: true },
    ],
  },
];

/** Reasons a team lands here, phrased as the question they arrived with. */
const differentiators = [
  {
    title: 'It operates. It does not advise.',
    body: 'A worker is leased to the run and works through your connected systems — browsers, terminals, repositories, scoped connector actions. The result comes back with the raw response attached, not summarised away.',
  },
  {
    title: 'The proof is the product.',
    body: 'Objective accepted, worker leased, actions executed, checks passed, review recorded, receipt issued. The chain is immutable and previous-hash linked: tamper with one entry and every entry after it breaks.',
  },
  {
    title: 'Nothing to draw first.',
    body: `Post an objective the way you would ask a colleague. No canvas, no trigger configuration, and no rebuild when the process shifts underneath you — across all ${CATALOG_LABEL} connectors in the catalogue.`,
  },
  {
    title: 'You pay for work, not headcount.',
    body: 'Credits track what your coworker actually ran, and Team plans include unlimited seats — so a tool everyone can reach costs the same as one gated to a licensed few.',
  },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-[18px] w-[18px] text-brand-500" aria-label="Yes" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-ink-300" aria-label="No" />;
  return <span className="text-[13px] leading-snug text-ink-600">{value}</span>;
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 text-center lg:px-8 lg:py-20">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            Compare Receipt
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-6xl">
            Compare it against
            <br />
            whatever you use today.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
            Most teams reach Receipt from a workflow builder, a chat assistant, or a folder of scripts
            somebody wrote once. Here is the honest difference — and a promise about the price.
          </p>
        </div>
      </section>

      {/* ---------- The price promise ---------- */}
      <section className="px-5 pb-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-brand-500 bg-white p-8 shadow-xl shadow-brand-500/10 lg:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-200/30 blur-[80px]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                <ShieldCheck className="h-6 w-6" />
              </span>

              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  Our price promise
                </div>
                <p className="mt-3 text-xl font-semibold leading-relaxed tracking-tight text-ink-950 text-balance lg:text-2xl">
                  {PROMISE}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-500">
                  Found something that does this work better for less? Send us the comparison at{' '}
                  <a
                    href={`mailto:${CLAIM_EMAIL}?subject=Price%20promise`}
                    className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-500"
                  >
                    {CLAIM_EMAIL}
                  </a>{' '}
                  and we will honour it.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="https://beetle.run/auth/sign-up" className="btn-primary">
                    Get started for free
                  </a>
                  <a href="#/pricing" className="btn-secondary">
                    See pricing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why teams switch ---------- */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title text-center text-ink-950">Why teams move over</h2>
          <p className="section-lead mx-auto text-center text-ink-500">
            Four differences that survive contact with a real week of work.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title} className="rounded-3xl border border-ink-100 bg-white p-7">
                <h3 className="text-lg font-bold tracking-tight text-ink-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Comparison table ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title text-center text-ink-950">Receipt and the alternatives</h2>
          <p className="section-lead mx-auto text-center text-ink-500">
            Compared by category of tool, not by brand — so every line is one we can stand behind.
          </p>

          <div className="mt-12 overflow-x-auto rounded-3xl border border-ink-100 bg-white px-6 py-2 lg:px-8">
            <table className="w-full min-w-[52rem] border-collapse">
              <thead>
                <tr className="border-b border-ink-200">
                  <th className="w-[26%] py-5 pr-4 text-left text-sm font-semibold text-ink-500">
                    <span className="sr-only">Capability</span>
                  </th>
                  <th className="w-[20%] bg-brand-50/40 px-2 py-5 text-center text-sm font-bold text-ink-950">
                    Receipt
                  </th>
                  {alternatives.map((label) => (
                    <th key={label} className="px-2 py-5 text-center text-sm font-semibold text-ink-500">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.flatMap((group) => [
                  <tr key={group.section} className="bg-ink-50/60">
                    <td colSpan={5} className="px-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                      {group.section}
                    </td>
                  </tr>,
                  ...group.rows.map((row) => (
                    <tr key={`${group.section}-${row.label}`} className="border-b border-ink-100">
                      <td className="py-3.5 pr-4 align-middle text-sm text-ink-700">{row.label}</td>
                      <td className="bg-brand-50/40 px-3 py-3.5 text-center align-middle">
                        <CellValue value={row.receipt} />
                      </td>
                      <td className="px-3 py-3.5 text-center align-middle">
                        <CellValue value={row.builders} />
                      </td>
                      <td className="px-3 py-3.5 text-center align-middle">
                        <CellValue value={row.assistants} />
                      </td>
                      <td className="px-3 py-3.5 text-center align-middle">
                        <CellValue value={row.inHouse} />
                      </td>
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
          <h2 className="section-title text-ink-950">Try it against your own work.</h2>
          <p className="section-lead text-ink-500">
            $100 in credits, all {CATALOG_LABEL} connectors, and a receipt for everything Receipt does. The
            price promise stands behind it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://beetle.run/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/pricing" className="btn-secondary btn-lg">
              Compare plans
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
