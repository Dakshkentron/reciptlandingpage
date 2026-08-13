import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { testimonials } from '@/data/content';

/** LinkedIn glyph — marks the quote as a named person, not an anonymous blurb. */
function LinkedInMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21.5h5.16V9.4H2.4v12.1ZM10 9.4h4.95v1.65h.07c.69-1.24 2.38-2.55 4.89-2.55 5.23 0 6.19 3.32 6.19 7.64v7.36h-5.15v-6.53c0-1.56-.03-3.56-2.2-3.56-2.2 0-2.54 1.7-2.54 3.45v6.64H10V9.4Z" />
    </svg>
  );
}

const AUTOPLAY_MS = 5500;

/**
 * Testimonials as a carousel: arrows to step through, and an autoplay that keeps
 * moving on its own until someone interacts. Autoplay pauses on hover, on keyboard
 * focus, when the tab is hidden, and for anyone who asked for reduced motion.
 */
export default function TestimonialCarousel() {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = Math.max(0, testimonials.length - perView);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // A narrower viewport means fewer pages — keep the index inside the new range.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir < 0 ? maxIndex : i + dir > maxIndex ? 0 : i + dir)),
    [maxIndex]
  );

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (!document.hidden) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, maxIndex, step]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {testimonials.map((t, i) => {
            // The middle card of the visible window gets the solid treatment, so the
            // eye lands somewhere instead of scanning three identical panels.
            const featured = i === index + Math.floor(perView / 2);
            return (
              <div
                key={t.name + t.company}
                className="flex-none px-2.5 sm:px-3"
                style={{ width: `${100 / perView}%` }}
                aria-hidden={i < index || i >= index + perView}
              >
                <div
                  className={`flex h-full flex-col rounded-3xl border p-6 transition-all duration-500 lg:p-7 ${
                    featured
                      ? 'border-white/20 bg-white shadow-2xl shadow-ink-950/30'
                      : 'border-white/15 bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${featured ? 'text-brand-600' : 'text-white/70'}`} />
                    <span className={`text-xs font-medium ${featured ? 'text-ink-500' : 'text-white/70'}`}>
                      Saved:
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        featured ? 'bg-brand-50 text-brand-700' : 'bg-white/15 text-white'
                      }`}
                    >
                      {t.saved}
                    </span>
                  </div>

                  <blockquote
                    className={`mt-5 flex-1 text-[17px] leading-relaxed lg:text-lg ${
                      featured ? 'text-ink-800' : 'text-white'
                    }`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-bold ${
                          featured ? 'bg-ink-100 text-ink-700' : 'bg-white/20 text-white'
                        }`}
                        aria-hidden
                      >
                        {t.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-semibold ${featured ? 'text-ink-950' : 'text-white'}`}>
                          {t.name}
                        </div>
                        <div className={`truncate text-xs ${featured ? 'text-ink-400' : 'text-white/70'}`}>
                          {t.role}, {t.company}
                        </div>
                      </div>
                    </div>
                    <LinkedInMark
                      className={`h-5 w-5 flex-none ${featured ? 'text-[#0a66c2]' : 'text-white/80'}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous testimonials"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-900 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next testimonials"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-900 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
