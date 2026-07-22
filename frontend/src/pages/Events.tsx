import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { socialLinks, PAST_EVENT_IDS } from '../lib/content';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image: string | null;
  youtube_url?: string | null;
};

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
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

  return timeLeft;
}

function CountdownBadge({ date }: { date: string }) {
  const t = useCountdown(date);
  if (t.expired) return null;
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-sky-500">Starts in</span>
      <span className="font-display text-sm font-bold text-navy-700 tabular-nums">
        {t.days}d {String(t.hours).padStart(2, '0')}h {String(t.minutes).padStart(2, '0')}m {String(t.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
}

function GalleryModal({ images, title, startIndex = 0, onClose }: { images: string[]; title: string; startIndex?: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main image */}
        <img
          src={images[idx]}
          alt={`${title} — photo ${idx + 1} of ${images.length}`}
          className="mx-auto max-h-[75vh] w-full rounded-2xl object-contain shadow-2xl"
        />

        {/* Counter */}
        <p className="mt-3 text-center text-sm text-white/60">{idx + 1} / {images.length}</p>

        {/* Prev */}
        {idx > 0 && (
          <button
            onClick={() => setIdx((i) => i - 1)}
            className="absolute left-0 top-1/2 -translate-x-5 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-navy-700 shadow-lg transition hover:bg-sky-50"
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        {/* Next */}
        {idx < images.length - 1 && (
          <button
            onClick={() => setIdx((i) => i + 1)}
            className="absolute right-0 top-1/2 translate-x-5 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-navy-700 shadow-lg transition hover:bg-sky-50"
            aria-label="Next"
          >
            ›
          </button>
        )}

        {/* Dot indicators */}
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-navy-700 shadow-lg transition hover:bg-red-50 hover:text-red-500"
          aria-label="Close gallery"
        >
          ×
        </button>
      </div>
    </div>
  );
}

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1573167101669-476636b96cea?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573166364839-1bfe9196c23e?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550305080-4e029753abcf?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497701240-345a300b8d36?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555725305-e823b44548de?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560523159-94c9d18bcf27?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554200876-980213841c94?w=800&h=800&fit=crop&q=80',
];

export default function Events() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [eventGalleries, setEventGalleries] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');
  const [galleryState, setGalleryState] = useState<{ event: Event; startIndex: number } | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    apiGet('/events').then(setEvents).catch((e) => setError(e.message));
    apiGet('/settings').then((d: any) => setEventGalleries(d.event_galleries || {})).catch(() => {});
    // Tick every second so events auto-move from upcoming → past when timer hits zero
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const upcoming = events?.filter((e) => new Date(e.event_date).getTime() > now && !PAST_EVENT_IDS.has(e.id)) ?? [];
  const past = events?.filter((e) => new Date(e.event_date).getTime() <= now || PAST_EVENT_IDS.has(e.id)) ?? [];

  function getGalleryImages(ev: Event): string[] {
    const custom = eventGalleries[ev.id];
    if (custom && custom.length > 0) return custom;
    return [ev.image ?? '/assets/images/beyond-birth-flyer.png', ...DEFAULT_GALLERY].filter(Boolean);
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Events</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Live, expert-led sessions and community gatherings for mothers across the UK, Nigeria and the US.
          </p>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="section-heading">Upcoming Events</h2>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {!events && !error && <p className="mt-4 text-navy-700/60">Loading events…</p>}
        {events && upcoming.length === 0 && (
          <p className="mt-4 text-navy-700/60">No upcoming events right now. Check back soon or follow us on Instagram for announcements.</p>
        )}

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((ev) => (
            <div key={ev.id} className="card flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg">
              {ev.image && <img src={ev.image} alt={ev.title} className="aspect-square w-full object-cover" />}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                  {new Date(ev.event_date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-navy-700">{ev.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-navy-700/60">
                  <span aria-hidden>📍</span> {ev.location}
                </p>
                <p className="mt-3 flex-1 text-sm text-navy-700/80">{ev.description}</p>
                <CountdownBadge date={ev.event_date} />
                <a
                  href="https://bit.ly/PurposeinpainCIC2026"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-4 w-full text-center"
                >
                  Register Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section className="bg-sky-50/60 py-16 sm:py-20">
          <div className="container-page">
            <h2 className="section-heading">Past Events</h2>
            <div className="mt-8 space-y-12">
              {past.map((ev) => {
                const galleryImages = getGalleryImages(ev);
                return (
                  <div key={ev.id}>
                    <div className="card flex flex-col overflow-hidden p-0 sm:flex-row">
                      {ev.image && (
                        <img src={ev.image} alt={ev.title} className="aspect-square w-full object-cover sm:w-64 sm:shrink-0" />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <span className="inline-block w-fit rounded-full bg-navy-100 px-3 py-0.5 text-xs font-bold text-navy-700">Past Event</span>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                          {new Date(ev.event_date).toLocaleDateString(undefined, {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold text-navy-700">{ev.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-navy-700/60">
                          <span aria-hidden>📍</span> {ev.location}
                        </p>
                        <p className="mt-3 flex-1 text-sm text-navy-700/80">{ev.description}</p>
                        <button
                          onClick={() => setGalleryState({ event: ev, startIndex: 0 })}
                          className="btn-secondary mt-4 w-fit"
                        >
                          View Gallery
                        </button>
                      </div>
                    </div>

                    {/* Gallery thumbnail grid */}
                    <div className="mt-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-700/50">Event Gallery</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                        {galleryImages.map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setGalleryState({ event: ev, startIndex: i })}
                            className="group block overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                          >
                            <img
                              src={src}
                              alt={`${ev.title} gallery photo ${i + 1}`}
                              className="aspect-square w-full object-cover transition group-hover:scale-105"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Don't Miss the Next One</h2>
          <p className="max-w-xl text-white/80">
            We post confirmed event dates, live snapshots, and reminders across our social media before every session.
            Follow along so you never miss a live date.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Follow us on Social Media
            </Link>
            <a href={socialLinks.community} target="_blank" rel="noreferrer" className="btn-secondary border-white text-white hover:bg-white hover:text-navy-700">
              Join the Community
            </a>
          </div>
        </div>
      </section>

      {/* Gallery lightbox */}
      {galleryState && (
        <GalleryModal
          images={getGalleryImages(galleryState.event)}
          title={galleryState.event.title}
          startIndex={galleryState.startIndex}
          onClose={() => setGalleryState(null)}
        />
      )}
    </div>
  );
}
