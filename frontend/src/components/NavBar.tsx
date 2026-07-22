import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import { apiGet } from '../lib/api';

const DEFAULT_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Blog' },
  { to: '/shop', label: 'Shop' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
];

const DONATE_DEFAULT_LABEL = 'Donate';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    apiGet('/settings')
      .then((d: any) => { if (d.nav_labels) setCustomLabels(d.nav_labels); })
      .catch(() => {});
  }, []);

  const links = DEFAULT_LINKS.map((l) => ({
    to: l.to,
    label: customLabels[l.to] || l.label,
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-navy-50 bg-white/95 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between py-3">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `font-display text-sm font-semibold transition ${
                  isActive ? 'text-sky-500' : 'text-navy-700 hover:text-sky-500'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/donate" className="btn-primary">
            {customLabels['/donate'] || DONATE_DEFAULT_LABEL}
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-100 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl leading-none text-navy-700">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-50 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-display text-sm font-semibold ${
                    isActive ? 'bg-sky-50 text-sky-600' : 'text-navy-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/donate" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              {customLabels['/donate'] || DONATE_DEFAULT_LABEL}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
