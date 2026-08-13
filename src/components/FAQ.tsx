import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { faqs } from '@/data/content';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section bg-white" id="faq">
      <div className="section-container max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="eyebrow bg-brand-50 text-brand-700">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h2 className="section-title text-ink-950">
              Frequently asked questions
            </h2>
            <p className="section-lead text-ink-500">
              What Receipt is, how it runs work against your systems, and what it proves afterwards.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-brand-200 bg-brand-50/30'
                      : 'border-ink-100 bg-white hover:border-ink-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold ${isOpen ? 'text-brand-700' : 'text-ink-900'}`}>
                      {faq.q}
                    </span>
                    <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full transition-colors ${
                      isOpen ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500'
                    }`}>
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-ink-600 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
