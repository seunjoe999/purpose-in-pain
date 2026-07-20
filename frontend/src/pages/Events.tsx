import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { socialLinks } from '../lib/content';

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

export default function Events() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/events')
      .then(setEvents)
      .catch((e) => setError(e.message));
  }, []);

  const now = Date.now();
  const upcoming = events?.filter((e) => new Date(e.event_date).getTime() > now) ?? [];
  const past = events?.filter((e) => new Date(e.event_date).getTime() <= now) ?? [];

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
              {past.map((ev) => (
                <div key={ev.id}>
                  <div className="card flex flex-col overflow-hidden p-0 sm:flex-row">
                    {ev.image && (
                      <img src={ev.image} alt={ev.title} className="aspect-square w-full object-cover sm:w-64 sm:shrink-0" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <span className="inline-block w-fit rounded-full bg-navy-100 px-3 py-0.5 text-xs font-bold text-navy-700">Past Event</span>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy-700/40">
                        {new Date(ev.event_date).toLocaleDateString(undefined, {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-navy-700">{ev.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-navy-700/60">
                        <span aria-hidden>📍</span> {ev.location}
                      </p>
                      <p className="mt-3 flex-1 text-sm text-navy-700/80">{ev.description}</p>
                      <a
                        href={ev.youtube_url ?? socialLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary mt-4 w-fit"
                      >
                        View Gallery
                      </a>
                    </div>
                  </div>

                  {/* Conference gallery grid */}
                  <div className="mt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-700/50">Event Gallery</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                      {[
                        '/assets/images/beyond-birth-flyer.png',
                        '/assets/images/value-community.jpg',
                        '/assets/images/value-empowerment.jpg',
                        '/assets/images/value-purpose.jpg',
                        '/assets/images/design-1.png',
                        '/assets/images/mission-statement.png',
                      ].map((src, i) => (
                        <a key={i} href={ev.youtube_url ?? socialLinks.youtube} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl">
                          <img
                            src={src}
                            alt={`${ev.title} gallery image ${i + 1}`}
                            className="aspect-square w-full object-cover transition group-hover:scale-105"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
