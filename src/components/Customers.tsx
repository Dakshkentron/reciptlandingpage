import { ArrowRight, Users } from 'lucide-react';
import { customerStories } from '@/data/content';
import TestimonialCarousel from '@/components/TestimonialCarousel';

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
            The shape of a Receipt deployment
          </h2>
          <p className="section-lead text-ink-500">
            What teams connect first, what they gate, and what changes by the second month.
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
                <span className="text-sm font-semibold text-ink-500">{story.logo}</span>
              </div>
              <h3 className="text-base font-bold text-ink-950 mb-2">{story.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed flex-1">{story.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                See the use cases
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-ink-950 px-5 py-14 lg:px-12 lg:py-20">
          <div className="absolute inset-0 bg-grid opacity-25" />
          <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[120px]" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]" />

          <div className="relative">
            <div className="mb-10 text-center">
              <h3 className="section-title text-white">What our customers say.</h3>
            </div>

            <TestimonialCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
