import { useEffect, useState } from 'react';
import { announcements } from '@/data/content';

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[index];

  return (
    <div className="bg-ink-950 text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-5 lg:px-8">
        <a
          href={current.href}
          className="flex items-center gap-2 text-xs font-medium text-ink-100 transition-opacity hover:text-white"
          key={index}
        >
          <span className="text-sm">{current.icon}</span>
          <span className="animate-fade-in">{current.text}</span>
        </a>
      </div>
    </div>
  );
}
