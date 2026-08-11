import { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, Users, Code2, Headphones, TrendingUp, Megaphone, Building2, ShoppingBag, UserCog, Server, Wallet, Scale, type LucideIcon } from 'lucide-react';
import { navLinks } from '@/data/content';

const iconMap: Record<string, LucideIcon> = {
  Users, Code2, Headphones, TrendingUp, Megaphone, Building2, ShoppingBag, UserCog, Server, Wallet, Scale,
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-ink-950">
            <span className="text-lg font-bold tracking-tight">Receipt</span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const hasChildren = !!link.children;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenDropdown(link.label)}
                  onMouseLeave={() => {
                    setOpenDropdown(null);
                    setOpenSection(null);
                  }}
                >
                  <a
                    href={link.href ?? '#'}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
                  >
                    {link.label}
                    {hasChildren && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                  </a>

                  {hasChildren && openDropdown === link.label && (
                    <div className="absolute left-0 top-full pt-2 w-80">
                      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-xl shadow-ink-950/5 ring-1 ring-ink-950/5">
                        {link.children!.map((child) => (
                          <div
                            key={child.label}
                            className="relative"
                            onMouseEnter={() => child.submenu && setOpenSection(child.label)}
                            onMouseLeave={() => child.submenu && setOpenSection(null)}
                          >
                            <a
                              href={child.href}
                              className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50 ${
                                openSection === child.label ? 'bg-ink-50' : ''
                              }`}
                            >
                              <div>
                                <div className="text-sm font-semibold text-ink-900">{child.label}</div>
                                <div className="mt-0.5 text-xs text-ink-400">{child.desc}</div>
                              </div>
                              {child.submenu && (
                                <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />
                              )}
                            </a>

                            {child.submenu && openSection === child.label && (
                              <div className="absolute left-full top-0 z-10 ml-2 w-80 rounded-xl border border-ink-100 bg-white p-2 shadow-xl shadow-ink-950/5 ring-1 ring-ink-950/5">
                                <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                                  Departments
                                </div>
                                <div className="grid max-h-[28rem] grid-cols-1 gap-0.5 overflow-y-auto">
                                  {child.submenu.map((item) => {
                                    const Icon = item.icon ? iconMap[item.icon] : null;
                                    return (
                                      <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-start gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-ink-50"
                                      >
                                        {Icon && (
                                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                                        )}
                                        <div>
                                          <div className="text-sm font-semibold text-ink-900">{item.label}</div>
                                          <div className="mt-0.5 text-xs text-ink-400">{item.desc}</div>
                                        </div>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="https://beetle.run/auth/sign-up" className="btn-ghost">Sign in</a>
          <a href="https://beetle.run/auth/sign-up" className="btn-primary">Get started</a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-5 py-4 lg:hidden">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  {link.label}
                </div>
                <div className="mt-2 space-y-1">
                  {link.children
                    .flatMap((child): { label: string; href: string }[] => child.submenu ?? [child])
                    .map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
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
            <a href="https://beetle.run/auth/sign-up" className="btn-secondary flex-1">Sign in</a>
            <a href="https://beetle.run/auth/sign-up" className="btn-primary flex-1">Get started</a>
          </div>
        </div>
      )}
    </header>
  );
}
