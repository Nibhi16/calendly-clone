'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CalendarClock, Settings2, Users } from 'lucide-react';

const links = [
  { href: '/event-types', label: 'Scheduling', icon: Settings2 },
  { href: '/availability', label: 'Availability', icon: CalendarClock },
  { href: '/meetings', label: 'Meetings', icon: Users }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopWidth = collapsed ? 'w-16' : 'w-60';

  const NavContent = (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <button
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label="Go to MeetFlow home"
          onClick={() => setCollapsed(false)}
        >
          <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-semibold">
            MF
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                MeetFlow
              </span>
              <span className="text-[11px] text-slate-400">
                Smart meeting scheduling
              </span>
            </div>
          )}
        </button>
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Collapse sidebar"
          >
            ‹
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Expand sidebar"
          >
            ›
          </button>
        )}
      </div>
      <nav
        className="flex-1 px-2 py-4 space-y-1"
        aria-label="Main navigation"
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition ${
                active
                  ? 'bg-primary-soft text-blue-700'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={`hidden md:flex bg-slate-950 text-slate-50 flex-col transition-all duration-200 ${desktopWidth}`}
      >
        {NavContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed inset-x-0 top-0 z-30 bg-slate-950 text-slate-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-semibold">
            MF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              MeetFlow
            </span>
            <span className="text-[11px] text-slate-400">
              Smart meeting scheduling
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Open navigation</span>
          <span className="text-lg">{mobileOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 md:hidden" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-30 w-64 h-full bg-slate-950 text-slate-50 flex flex-col">
            {NavContent}
          </aside>
        </div>
      )}
    </>
  );
}

