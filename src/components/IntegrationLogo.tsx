import { useState } from 'react';
import { hueFor, logoUrl, monogram } from '@/data/logos';

const sizes = {
  sm: { box: 'h-7 w-7 rounded-lg', img: 'h-4 w-4', text: 'text-[10px]' },
  md: { box: 'h-11 w-11 rounded-xl', img: 'h-6 w-6', text: 'text-[13px]' },
  lg: { box: 'h-14 w-14 rounded-2xl', img: 'h-8 w-8', text: 'text-sm' },
  xl: { box: 'h-20 w-20 rounded-[1.25rem]', img: 'h-11 w-11', text: 'text-xl' },
} as const;

export type LogoSize = keyof typeof sizes;

/**
 * Brand logo tile. Falls back to a colored monogram when the vendor has no
 * reachable icon, so a card never renders as an empty square.
 */
export default function IntegrationLogo({
  name,
  size = 'md',
  plain = false,
  className = '',
}: {
  name: string;
  size?: LogoSize;
  /** Drop the tile chrome (border/background) — for use inside an existing card. */
  plain?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const s = sizes[size];
  const hue = hueFor(name);

  if (failed) {
    return (
      <div
        className={`flex flex-none items-center justify-center font-bold ${s.box} ${s.text} ${className}`}
        style={{
          backgroundColor: `hsl(${hue} 70% 96%)`,
          color: `hsl(${hue} 55% 38%)`,
          boxShadow: `inset 0 0 0 1px hsl(${hue} 45% 88%)`,
        }}
        aria-hidden
      >
        {monogram(name)}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-none items-center justify-center overflow-hidden ${s.box} ${
        plain ? '' : 'border border-ink-100 bg-white shadow-sm'
      } ${className}`}
    >
      <img
        src={logoUrl(name)}
        alt={`${name} logo`}
        width={128}
        height={128}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        // A vendor we can't resolve comes back as the icon service's 16px globe
        // placeholder; anything that small is not a usable logo, so fall through
        // to the monogram instead of rendering a stranger's world icon.
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 16) setFailed(true);
        }}
        className={`${s.img} object-contain`}
      />
    </div>
  );
}
