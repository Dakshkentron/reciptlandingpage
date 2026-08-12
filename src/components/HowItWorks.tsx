import { useEffect, useRef, useState } from 'react';
import { Workflow } from 'lucide-react';
import { features } from '@/data/content';
import {
  NotebookMockup, ThreadsMockup, ContextStudioMockup, DataAppMockup,
} from './mockups';

const stepVisuals: Record<string, JSX.Element> = {
  notebooks: <NotebookMockup />,
  threads: <ThreadsMockup />,
  context: <ContextStudioMockup />,
  'data-apps': <DataAppMockup />,
};

/**
 * Sticky scroll walkthrough: the section is tall enough to scroll through,
 * while an inner sticky panel stays pinned and swaps its content per step.
 * On small screens the steps simply stack — no scroll hijacking on touch.
 */
export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const steps = features.length;

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = -el.getBoundingClientRect().top / scrollable;
      const clamped = Math.min(Math.max(progress, 0), 0.999);
      setActive(Math.floor(clamped * steps));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [steps]);

  /**
   * The steps look interactive because they are — clicking one scrolls the page to
   * the middle of that step's range, which is what drives `active`. Without this the
   * list highlights on scroll but swallows every click.
   */
  const goToStep = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const sectionTop = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({ top: sectionTop + ((i + 0.5) / steps) * scrollable, behavior: 'smooth' });
  };

  return (
    <div id="how-it-works">
      {/* Desktop: pinned panel driven by scroll */}
      <section
        ref={sectionRef}
        className="relative hidden bg-white lg:block"
        style={{ height: `${steps * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="section-container grid w-full grid-cols-[minmax(0,380px)_1fr] items-center gap-14">
            <div>
              <div className="eyebrow bg-brand-50 text-brand-700">
                <Workflow className="h-3.5 w-3.5" />
                How it works
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-ink-950 text-balance xl:text-5xl">
                From question to proven answer — in one workspace.
              </h2>

              <ol className="mt-10 space-y-1">
                {features.map((feature, i) => {
                  const isActive = i === active;
                  return (
                    <li key={feature.id}>
                      <button
                        type="button"
                        onClick={() => goToStep(i)}
                        aria-current={isActive ? 'step' : undefined}
                        className={`group flex w-full items-start gap-4 rounded-xl px-4 py-3 text-left transition-colors duration-300 ${
                          isActive ? 'bg-ink-50' : 'hover:bg-ink-50/60'
                        }`}
                      >
                        <span
                          className={`mt-0.5 font-mono text-xs font-semibold tabular-nums transition-colors duration-300 ${
                            isActive ? 'text-brand-600' : 'text-ink-300 group-hover:text-brand-500'
                          }`}
                        >
                          /0{i + 1}
                        </span>
                        <span
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive ? 'text-ink-950' : 'text-ink-400 group-hover:text-ink-700'
                          }`}
                        >
                          {feature.eyebrow}
                        </span>
                      </button>
                      <div
                        className={`ml-4 h-px origin-left bg-brand-500 transition-transform duration-500 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="relative h-[calc(100vh-9rem)] max-h-[760px] min-h-[600px]">
              {features.map((feature, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={feature.id}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 flex flex-col transition-all duration-500 ${
                      isActive
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-3 opacity-0'
                    }`}
                  >
                    <div className="flex min-h-0 flex-1 items-center justify-center">
                      <div className="w-full">{stepVisuals[feature.id]}</div>
                    </div>

                    <div className="mt-8 flex-none border-t border-ink-100 pt-6">
                      <div className="font-mono text-xs font-semibold text-brand-600">
                        /0{i + 1}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink-950">
                        {feature.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile / tablet: plain stacked steps */}
      <section className="section bg-white lg:hidden">
        <div className="section-container">
          <div className="section-intro">
            <div className="eyebrow bg-brand-50 text-brand-700">
              <Workflow className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="section-title text-ink-950">
              From question to proven answer — in one workspace.
            </h2>
          </div>

          <div className="space-y-14">
            {features.map((feature, i) => (
              <div key={feature.id}>
                <div className="font-mono text-xs font-semibold text-brand-600">/0{i + 1}</div>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {feature.description}
                </p>
                <div className="mt-6">{stepVisuals[feature.id]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
