import { ArrowRight, Star, Quote, Users } from 'lucide-react';
import { customerStories, testimonials } from '@/data/content';

export default function Customers() {
  return (
    <section id="customers" className="section bg-white">
      <div className="section-container">
        <div className="section-intro">
          <div className="eyebrow bg-brand-50 text-brand-700">
            <Users className="h-3.5 w-3.5" />
            Customers
          </div>
          <h2 className="section-title text-ink-950">
            Teams of all sizes do more with their data
          </h2>
          <p className="section-lead text-ink-500">
            From fast-growing startups to global enterprises, Receipt powers data work across the org.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {customerStories.map((story) => (
            <a
              key={story.company}
              href={story.href}
              className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-ink-950/5"
            >
              <div className="mb-4 flex h-10 items-center">
                <span className="text-xl font-bold text-ink-900">{story.logo}</span>
              </div>
              <h3 className="text-base font-bold text-ink-950 mb-2">{story.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed flex-1">{story.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Read the story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-ink-600">
              Rated on G2 as an industry leader based on customer reviews.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-ink-100 bg-ink-50/50 p-6 transition-all duration-300 hover:shadow-md hover:bg-white"
              >
                <Quote className="h-6 w-6 text-brand-400 mb-3 flex-none" />
                <p className="text-sm leading-relaxed text-ink-700 flex-1">
                  {t.quote}
                </p>
                <div className="mt-4 pt-4 border-t border-ink-100">
                  <div className="text-sm font-semibold text-ink-950">{t.name}</div>
                  <div className="text-xs text-ink-400 mt-0.5">{t.role}, {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
