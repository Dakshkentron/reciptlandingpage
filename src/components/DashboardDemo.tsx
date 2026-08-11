import { useEffect, useRef, useState } from 'react';
import {
  TrendingUp, TrendingDown, Filter, ArrowUpRight, Share2, Edit3,
} from 'lucide-react';
import {
  dashboardSummaryCards, dashboardFilters, productLines, quarters,
} from '@/data/content';

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const ALL_QUARTERS = 'All quarters';

function generateBarData(filterQuarter: string) {
  const qMap: Record<string, number[]> = {
    [ALL_QUARTERS]: [32, 45, 38, 28, 22, 18],
    Q1: [22, 30, 25, 18, 14, 10],
    Q2: [28, 38, 32, 24, 18, 14],
    Q3: [32, 45, 38, 28, 22, 18],
  };
  return qMap[filterQuarter] ?? qMap[ALL_QUARTERS];
}

function generateScatterData() {
  return [
    { x: 45, y: 12, label: 'Teleportation' },
    { x: 38, y: 22, label: 'Quantum' },
    { x: 28, y: 8, label: 'Wormhole' },
    { x: 22, y: 35, label: 'Dark matter' },
    { x: 18, y: 15, label: 'Temporal' },
    { x: 14, y: 28, label: 'Anti-grav' },
  ];
}

function SummaryCard({ card }: { card: typeof dashboardSummaryCards[0] }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="text-xs text-ink-400">{card.label}</div>
      <div className="mt-1 text-2xl font-bold text-ink-950">{card.value}</div>
      <div className="mt-1.5 flex items-center gap-1 text-xs">
        {card.trend === 'up' ? (
          <TrendingUp className="h-3.5 w-3.5 text-brand-500" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-accent-500" />
        )}
        <span className={card.trend === 'up' ? 'text-brand-600' : 'text-accent-600'}>
          {card.sub}
        </span>
      </div>
    </div>
  );
}

function FilterDropdown({ filter }: { filter: typeof dashboardFilters[0] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(filter.options[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-ink-300"
      >
        <span className="text-ink-400">{filter.label}:</span>
        <span className="text-ink-900">{selected}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-10 w-48 rounded-lg border border-ink-100 bg-white py-1 shadow-xl">
          {filter.options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false); }}
              className={`block w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-ink-50 ${
                selected === opt ? 'font-semibold text-brand-600' : 'text-ink-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BarChartCard({ quarter }: { quarter: string }) {
  const data = generateBarData(quarter);
  const max = Math.max(...data);
  const colors = ['#16a86a', '#1d63f0', '#f57e16', '#38c082', '#59a8ff', '#f99e3c'];
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-ink-900">Revenue by Product Line Over Time</div>
          <div className="text-xs text-ink-400 mt-0.5">{quarter === ALL_QUARTERS ? 'Q1–Q3' : quarter}</div>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Explore
        </button>
      </div>
      <div className="flex items-end gap-4 h-44">
        {data.map((val, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-end justify-center h-36">
              <div
                className="w-full max-w-[36px] rounded-t-md origin-bottom transition-[height] duration-700 ease-out"
                style={{
                  height: inView ? `${(val / max) * 100}%` : '0%',
                  background: colors[i],
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </div>
            <span className="text-[10px] text-ink-400 truncate w-full text-center">
              {productLines[i].split(' ').slice(0, 2).join(' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScatterChartCard() {
  const data = generateScatterData();
  const maxX = 50;
  const maxY = 50;
  const colors = ['#16a86a', '#1d63f0', '#f57e16', '#38c082', '#59a8ff', '#f99e3c'];
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-ink-900">Account Revenue vs Growth</div>
          <div className="text-xs text-ink-400 mt-0.5">by Product Line (Q3)</div>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Explore
        </button>
      </div>
      <div className="relative h-44 border-l border-b border-ink-100">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border-r border-t border-ink-50" />
          ))}
        </div>
        {data.map((point, i) => (
          <div
            key={i}
            className="absolute transition-[opacity,translate] duration-500 ease-out"
            style={{
              left: `${(point.x / maxX) * 100}%`,
              bottom: `${(point.y / maxY) * 100}%`,
              translate: `-50% calc(-50% + ${inView ? '0px' : '8px'})`,
              opacity: inView ? 1 : 0,
              transitionDelay: `${i * 100}ms`,
            }}
            title={point.label}
          >
            <div
              className="h-3 w-3 rounded-full transition-transform duration-200 hover:scale-150"
              style={{ background: colors[i] }}
            />
          </div>
        ))}
        <span className="absolute -bottom-5 left-0 text-[10px] text-ink-400">Revenue ($M)</span>
        <span className="absolute -left-2 -top-5 text-[10px] text-ink-400">Growth (%)</span>
      </div>
    </div>
  );
}

function DonutChartCard() {
  const segments = [
    { label: 'Core Worlds', value: 55, color: '#16a86a' },
    { label: 'Mid-Rim', value: 28, color: '#1d63f0' },
    { label: 'Outer Rim', value: 17, color: '#f57e16' },
  ];

  let cumulative = 0;
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-ink-900">Revenue by Region</div>
        <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Explore
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-28 w-28 flex-none">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {segments.map((seg) => {
              const dash = (seg.value / 100) * circumference;
              const offset = (cumulative / 100) * circumference;
              cumulative += seg.value;
              return (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
              <span className="text-xs text-ink-600 flex-1">{seg.label}</span>
              <span className="text-xs font-semibold text-ink-900">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardDemo() {
  const [activeQuarter, setActiveQuarter] = useState(ALL_QUARTERS);

  return (
    <section className="section bg-ink-50" id="dashboard">
      <div className="section-container">
        <div className="section-intro">
          <div className="eyebrow bg-brand-50 text-brand-700">
            <Filter className="h-3.5 w-3.5" />
            Data apps & dashboards
          </div>
          <h2 className="section-title text-ink-950">
            Turn any analysis into a shareable, interactive app
          </h2>
          <p className="section-lead text-ink-500">
            Filters, inputs, and charts update live. Share with a link — or embed where teams already work.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-ink-950/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
              </div>
              <span className="text-sm font-semibold text-ink-900">NexaCorp Revenue Overview</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-ink-300">
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink-800">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-ink-500 mb-5 max-w-2xl">
              Interactive breakdown of NexaCorp's revenue across product lines, regions, and customer sectors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {dashboardSummaryCards.map((card) => (
                <SummaryCard key={card.label} card={card} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              {dashboardFilters.map((filter) => (
                <FilterDropdown key={filter.label} filter={filter} />
              ))}
              <div className="ml-auto flex gap-1.5">
                {[ALL_QUARTERS, ...quarters].map((q) => {
                  const isActive = activeQuarter === q;
                  return (
                    <button
                      key={q}
                      onClick={() => setActiveQuarter(q)}
                      aria-pressed={isActive}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-ink-950 text-white'
                          : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700'
                      }`}
                    >
                      {q === ALL_QUARTERS ? 'All' : q}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BarChartCard quarter={activeQuarter} />
              <ScatterChartCard />
              <DonutChartCard />
              <div className="rounded-xl border border-ink-100 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-ink-900">Sector Revenue Mix</div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Explore
                  </button>
                </div>
                <div className="space-y-3">
                  {productLines.slice(0, 5).map((pl, i) => {
                    const mix = [
                      { label: 'Defense', val: 50 - i * 8, color: '#16a86a' },
                      { label: 'Commercial', val: 30 + i * 4, color: '#1d63f0' },
                      { label: 'Research', val: 15, color: '#f57e16' },
                      { label: 'Gov', val: 5 + i * 2, color: '#38c082' },
                    ];
                    return (
                      <div key={pl}>
                        <div className="text-xs text-ink-500 mb-1 truncate">{pl}</div>
                        <div className="flex h-5 overflow-hidden rounded-md">
                          {mix.map((m) => (
                            <div
                              key={m.label}
                              className="h-full transition-all"
                              style={{ width: `${m.val}%`, background: m.color }}
                              title={`${m.label}: ${m.val}%`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Defense', 'Commercial', 'Research', 'Gov'].map((label, i) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ background: ['#16a86a', '#1d63f0', '#f57e16', '#38c082'][i] }} />
                      <span className="text-[10px] text-ink-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
