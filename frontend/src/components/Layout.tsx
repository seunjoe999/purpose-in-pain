import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { socialLinks, PAST_EVENT_IDS } from '../lib/content';
import { apiGet } from '../lib/api';

function BrandsSlider() {
  return (
    <div className="border-t border-navy-100 bg-white py-5">
      <p className="container-page mb-3 text-xs font-semibold uppercase tracking-wide text-navy-700/40">
        Our Partners &amp; Collaborators
      </p>
      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <div className="flex animate-marquee items-center" style={{ width: 'max-content' }}>
          <img
            src="/assets/images/brand-logos-strip.png"
            alt="Our partners and collaborators"
            className="h-16 w-auto"
          />
          <img
            src="/assets/images/brand-logos-strip.png"
            alt=""
            aria-hidden="true"
            className="h-16 w-auto"
          />
        </div>
      </div>
    </div>
  );
}

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
};

function useCountdown(targetDate: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }); return; }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

function PinnedCountdown({ event }: { event: Event }) {
  const t = useCountdown(event.event_date);
  if (t.expired) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-accent-pink/95 text-white shadow-lg backdrop-blur-sm">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold">{event.title}</p>
          <p className="text-xs text-white/70">
            {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            {event.location ? ` · ${event.location}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-display text-sm font-bold tabular-nums">
            <span>{String(t.days).padStart(2, '0')}d</span>
            <span className="text-white/40">:</span>
            <span>{String(t.hours).padStart(2, '0')}h</span>
            <span className="text-white/40">:</span>
            <span>{String(t.minutes).padStart(2, '0')}m</span>
            <span className="text-white/40">:</span>
            <span>{String(t.seconds).padStart(2, '0')}s</span>
          </div>
          <Link
            to="/events"
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-accent-pink transition hover:bg-white/90"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    apiGet('/events')
      .then((evs: Event[]) => {
        const now = Date.now();
        const upcoming = evs
          .filter((e) => new Date(e.event_date).getTime() > now && !PAST_EVENT_IDS.has(e.id))
          .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setNextEvent(upcoming[0] ?? null);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className={`flex-1 ${nextEvent ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      <BrandsSlider />
      <Footer />

      {nextEvent && <PinnedCountdown event={nextEvent} />}

      {/* Pinned WhatsApp chat button: sits above the countdown bar */}
      <a
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className={`fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:scale-110 hover:bg-green-600 ${nextEvent ? 'bottom-20' : 'bottom-6'}`}
      >
        💬
      </a>
    </div>
  );
}
