import { Bot, Check, Lock, Server, Sparkles, Terminal } from 'lucide-react';
import { products } from '@/data/content';

const product = products.find((p) => p.id === 'mcp-gateway')!;

const clients = [
  { label: 'Claude', icon: Sparkles },
  { label: 'Cursor', icon: Terminal },
  { label: 'ChatGPT', icon: Bot },
  { label: 'Agents', icon: Server },
];

export default function MCPGateway() {
  return (
    <section id="mcp-gateway" className="section bg-ink-50">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="eyebrow bg-brand-50 text-brand-700 px-5 py-2 text-base font-bold">
              <Server className="h-5 w-5" />
              {product.eyebrow}
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-ink-950 text-balance xl:text-5xl">
              {product.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {product.description}
            </p>

            <ul className="mt-8 space-y-3">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-brand-600" strokeWidth={3} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-8 rounded-[1.75rem] border border-ink-200 bg-white px-8 py-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {clients.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-ink-700"
                >
                  <Icon className="h-5 w-5 text-brand-600" />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex items-center gap-3 rounded-2xl bg-ink-950 px-6 py-4 text-white shadow-lg">
              <Server className="h-6 w-6 text-brand-400" />
              <span className="text-sm font-bold">Kentron MCP Gateway</span>
            </div>

            <div className="h-8 w-px bg-ink-200" />

            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-5 py-3 text-ink-700">
              <Lock className="h-4 w-4 text-brand-600" />
              <span className="text-xs font-semibold">80,000+ tools &amp; apps, policy-governed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
