import { useState } from 'react';
import {
  ArrowRight, ChevronDown, Eye, FileCheck2, Fingerprint, KeyRound, Lock, RefreshCw, ServerCog,
  ShieldCheck, Users,
} from 'lucide-react';

const pillars = [
  {
    icon: Lock,
    title: 'We never hold your credentials.',
    desc: `Receipt authenticates to every connector through official OAuth flows or scoped API keys held in the connector layer. Receipt stores an encrypted reference — never the secret itself — so revoking access at the provider cuts Receipt off instantly.`,
  },
  {
    icon: ServerCog,
    title: 'Every run is isolated.',
    desc: 'Work executes inside a per-run sandbox with no ambient network or filesystem access. The sandbox gets exactly the connections that run needs, and it is destroyed when the run ends.',
  },
  {
    icon: ShieldCheck,
    title: 'Writes wait for a human.',
    desc: 'Reads run immediately. Anything that changes state in a connected system passes an org-level policy gate first — sandbox by default, approval before action.',
  },
  {
    icon: FileCheck2,
    title: 'Every action leaves a receipt.',
    desc: 'Each call is written to an append-only, cryptographically chained receipt carrying the command, the raw API response, a tamper-evident hash, and the exit code. Break the chain and it shows.',
  },
  {
    icon: RefreshCw,
    title: 'Anything can be replayed.',
    desc: 'Receipts are the source of truth, not a log describing one. You can replay any past run step by step and verify the outcome independently — which is what makes an AI decision auditable rather than merely observed.',
  },
  {
    icon: Users,
    title: 'You decide who reaches what.',
    desc: 'Per-connection, per-team permissions decide which people can drive which systems. Connect two GitHub orgs or three AWS accounts and each keeps its own scopes and its own receipt trail.',
  },
];

const controls = [
  { label: 'Credential storage', value: 'Encrypted references only — secrets stay in the connector layer' },
  { label: 'Execution', value: 'Per-run isolated sandbox, zero ambient access, destroyed after use' },
  { label: 'Data in transit', value: 'TLS 1.3 on every hop, including connector traffic' },
  { label: 'Data at rest', value: 'AES-256, per-tenant encryption keys' },
  { label: 'Tenancy', value: 'Hard multi-tenant isolation; no shared execution context' },
  { label: 'Audit trail', value: 'Append-only chained receipts, exportable to your SIEM' },
  { label: 'Access control', value: 'Role-based policy, per-connection scoping, SSO/SAML and SCIM on Enterprise' },
  { label: 'Model providers', value: 'No customer data used for model training, ever' },
];

const faqs = [
  {
    q: 'Is it actually safe to give an AI agent access to production systems?',
    a: 'It is safe when the agent cannot act without leaving proof, and cannot change anything without a gate. Receipt runs every job in an isolated sandbox with no ambient access, holds every state-changing operation behind an org-level policy gate, and chains each action into an immutable receipt you can replay. The default posture is sandbox first, audit everything — not trust and react.',
  },
  {
    q: 'What is the difference between a receipt and normal logging?',
    a: 'Observability logs describe state that lives somewhere else; deleting them costs you visibility but not data. Receipts are the state — the append-only source of truth — and the running system is a derived copy. That is what lets you replay any past moment, audit any decision, and prove causation instead of inferring it after the fact.',
  },
  {
    q: 'Where do our credentials actually live?',
    a: 'With the connector layer, which holds the OAuth grant or API key. Receipt stores an encrypted reference to that connection and asks the connector layer to make the call. Receipt never sees, logs, or persists the underlying secret, and revoking the grant at the provider removes Receipt’s access immediately.',
  },
  {
    q: 'Do you train models on our data?',
    a: 'No. Customer data is never used to train models, ours or a provider’s. Model calls run under zero-retention terms, and the content of a run is retained only as the receipts your workspace owns.',
  },
  {
    q: 'What happens if a run crashes halfway through?',
    a: 'The receipt chain records every completed step, so recovery resumes from the last receipt rather than re-running work that already happened. Stalled work is detected by lease expiry and watchdog checks and re-dispatched deterministically — no duplicate side effects.',
  },
  {
    q: 'Can we prove to an auditor what the agent did?',
    a: 'Yes, and that is the point of the architecture. Export the receipt chain for any period: each entry carries the command issued, the raw response from the external system, the hash linking it to the previous receipt, and the identity that approved it. Any entry can be replayed and independently verified.',
  },
];

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

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-sky-50/50 to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-[26rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 py-14 text-center lg:px-8 lg:py-20">
          <div className="eyebrow bg-brand-500/10 text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security &amp; trust
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 text-balance lg:text-6xl">
            An agent you can audit.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
            Most AI tools ask you to trust the output. Receipt is built the other way round: isolated
            execution, approval before any write, and an immutable receipt for every single call — so you can
            prove what happened instead of believing it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
            </a>
            <a href="mailto:hello@beetle.run" className="btn-secondary btn-lg">
              Request our security review pack
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Pillars ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border border-ink-100 bg-white p-6">
                <p.icon className="h-5 w-5 text-brand-500" />
                <h2 className="mt-4 text-base font-semibold text-ink-950">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- The receipt model ---------- */}
      <section className="border-t border-ink-100 bg-ink-950">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="eyebrow bg-brand-500/15 text-brand-300">
            <Fingerprint className="h-3.5 w-3.5" />
            The receipt model
          </div>
          <h2 className="section-title text-white">Proof, not promises</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-200">
            <p>
              When an agent tells you it reconciled the invoices, you have two options: take its word, or
              check. Receipt is designed so checking is trivial. Every command it issues and every response
              it receives is written into an append-only chain, each entry hashed against the one before it.
            </p>
            <p>
              That chain is the system of record. The running state is derived from it, not the other way
              around — which is why a receipt can be replayed to reconstruct any past moment, why a crash
              resumes instead of restarting, and why tampering is detectable rather than plausible.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: KeyRound, title: 'Command', desc: 'The exact call issued, with parameters and the identity behind it.' },
              { icon: Eye, title: 'Evidence', desc: 'The raw external response, verbatim, plus a tamper-evident hash.' },
              { icon: RefreshCw, title: 'Replay', desc: 'Re-execute the receipt independently and compare the result.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-700/60 bg-ink-850 p-5">
                <item.icon className="h-5 w-5 text-brand-400" />
                <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Controls table ---------- */}
      <section className="border-t border-ink-100">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-8 text-center text-ink-950">How the platform is built</h2>
          <div className="overflow-hidden rounded-2xl border border-ink-100">
            {controls.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-6 ${
                  i % 2 ? 'bg-ink-50/50' : 'bg-white'
                }`}
              >
                <div className="text-sm font-semibold text-ink-950">{row.label}</div>
                <div className="text-sm leading-relaxed text-ink-500 sm:col-span-2">{row.value}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ink-400">
            Working through a vendor review? Email{' '}
            <a href="mailto:hello@beetle.run" className="font-semibold text-brand-700 hover:text-brand-800">
              hello@beetle.run
            </a>{' '}
            and we&rsquo;ll send the current security pack, DPA, and subprocessor list.
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-20">
          <h2 className="section-title mb-6 text-center text-ink-950">Security questions</h2>
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
          <h2 className="section-title text-ink-950">Give it access. Keep the proof.</h2>
          <p className="section-lead text-ink-500">
            Start free, connect one system, and read the receipts it writes before you connect the next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://app.kentron.ai/auth/sign-up" className="btn-primary btn-lg">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@beetle.run" className="btn-secondary btn-lg">
              Request the security pack
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
