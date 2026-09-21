import { trustedBy } from '@/data/content';

export default function LogoMarquee() {
  const logos = [...trustedBy, ...trustedBy];

  return (
    <section className="border-y border-ink-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-ink-400 mb-6">
          Teams putting Kentron AI to work
        </p>
        <div className="relative overflow-hidden mask-fade-r">
          <div className="flex w-max animate-marquee-slow gap-12">
            {logos.map((logo, i) => (
              <div
                key={i}
                className="flex items-center text-xl font-bold text-ink-300 whitespace-nowrap transition-colors hover:text-ink-500"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
