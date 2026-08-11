import { ArrowLeft, Hexagon, type LucideIcon } from 'lucide-react';
import { departments } from '@/data/content';
import {
  Users, Code2, Headphones, TrendingUp, Megaphone, Building2,
  ShoppingBag, UserCog, Server, Wallet, Scale,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Users, Code2, Headphones, TrendingUp, Megaphone, Building2,
  ShoppingBag, UserCog, Server, Wallet, Scale,
};

interface DepartmentPageProps {
  slug: string;
  onBack: () => void;
}

export default function DepartmentPage({ slug, onBack }: DepartmentPageProps) {
  const dept = departments.find((d) => d.label.toLowerCase().replace(/\s+/g, '-') === slug);

  if (!dept) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Hexagon className="mx-auto h-12 w-12 text-brand-500" strokeWidth={2.5} fill="rgba(22,168,106,0.08)" />
          <h1 className="mt-4 text-2xl font-bold text-ink-950">Department not found</h1>
          <button onClick={onBack} className="btn-primary mt-6">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[dept.icon] ?? Users;
  const otherDepts = departments.filter((d) => d.label !== dept.label);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-ink-50 to-white pt-28">
        <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10">
              <Icon className="h-8 w-8 text-brand-500" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Department
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-ink-950 lg:text-5xl">
                {dept.label}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg text-ink-500">
            {dept.desc}. This is a dedicated page for {dept.label} — add your content here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <Icon className="h-6 w-6 text-ink-400" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink-700">Content coming soon</h2>
          <p className="mt-2 text-sm text-ink-400">
            This section is ready for your {dept.label} content — features, case studies, metrics, and more.
          </p>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/50">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
            Explore other departments
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {otherDepts.map((d) => {
              const OtherIcon = iconMap[d.icon] ?? Users;
              return (
                <a
                  key={d.label}
                  href={`#/department/${d.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 bg-white p-4 text-center transition-all hover:border-brand-200 hover:shadow-md"
                >
                  <OtherIcon className="h-5 w-5 text-brand-500" />
                  <span className="text-xs font-semibold text-ink-700">{d.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
