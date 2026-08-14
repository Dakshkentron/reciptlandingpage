import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navLinks } from '@/data/content';
import { iconMap } from '@/components/icons';
import ReceiptMark from '@/components/ReceiptMark';

// The header sends visitors to a booked conversation rather than a self-serve
// account, so it carries no sign-in or sign-up link.
const DEMO_URL = 'https://meetings-na2.hubspot.com/snagpal';

/**
 * Floating header. The nav is a rounded card sitting over the page rather than a
 * full-bleed bar attached to the viewport — so the hero's gradient runs behind it
 * and the chrome reads as part of the product, not part of the browser.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Past the fold the card tightens up and takes a stronger shadow, so it stays
  // legible over whatever section happens to be behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A hash change means the mobile sheet has done its job.
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-300 sm:px-5 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl rounded-2xl border border-ink-100/80 bg-white/90 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? 'shadow-lg shadow-ink-950/[0.07]'
            : 'shadow-sm shadow-ink-950/[0.03]'
        }`}
      >
        <nav
          className={`flex items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
          <div className="flex items-center gap-7">
            <a href="#" className="flex items-center gap-2 text-ink-950" aria-label="Receipt home">
              <ReceiptMark className="h-7 w-7 flex-none text-brand-500" paperClassName="text-white" />
              <span className="text-[19px] font-bold tracking-tight">Receipt</span>
            </a>

            <div className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const hasChildren = !!link.children;
                const open = openDropdown === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => hasChildren && setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <a
                      href={link.href ?? '#'}
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
                        open ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950'
                      }`}
                    >
                      {link.label}
                      {hasChildren && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </a>

                    {hasChildren && open && (
                      <div className={`absolute left-0 top-full pt-3 ${link.wide ? 'w-[42rem]' : 'w-[22rem]'}`}>
                        <div
                          className={`grid animate-fade-in gap-0.5 rounded-2xl border border-ink-100 bg-white p-2 shadow-2xl shadow-ink-950/10 ${
                            link.wide ? 'grid-cols-2' : 'grid-cols-1'
                          }`}
                        >
                          {link.children!.map((child) => {
                            const Icon = child.icon ? iconMap[child.icon] : null;
                            return (
                              <a
                                key={child.label}
                                href={child.href}
                                {...(child.href.startsWith('http')
                                  ? { target: '_blank', rel: 'noreferrer' }
                                  : {})}
                                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50"
                              >
                                {Icon && (
                                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                                    <Icon className="h-4 w-4" />
                                  </span>
                                )}
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-ink-900">{child.label}</div>
                                  {child.desc && (
                                    <div className="mt-0.5 text-xs leading-relaxed text-ink-400">
                                      {child.desc}
                                    </div>
                                  )}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink-950 px-5 py-2.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-ink-800 hover:shadow-lg active:scale-[0.98]"
            >
              Schedule Demo
            </a>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-b-2xl border-t border-ink-100 px-4 py-4 lg:hidden">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="py-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    {link.label}
                  </div>
                  <div className="mt-2 space-y-1">
                    {link.children.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        {...(item.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                        className="block rounded-lg px-2 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2.5 text-sm font-medium text-ink-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            <div className="mt-3 flex gap-2 border-t border-ink-100 pt-4">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex-1"
                onClick={() => setMobileOpen(false)}
              >
                Schedule Demo
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
