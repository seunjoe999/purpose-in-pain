import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import { socialLinks } from '../lib/content';

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image: string | null;
};

export default function Events() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/events')
      .then(setEvents)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Upcoming Events</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Live, expert-led sessions and community gatherings for mothers across the UK, Nigeria and the US.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <p className="mb-10 rounded-xl bg-accent-mustard/10 px-4 py-3 text-sm text-navy-700/80">
          Note: dates shown below are illustrative placeholders while our full events calendar is finalised — please
          check back or follow us on social media for confirmed dates and times (shown in GMT / WAT / EST).
        </p>

        {error && <p className="text-red-500">{error}</p>}
        {!events && !error && <p className="text-navy-700/60">Loading events…</p>}
        {events && events.length === 0 && <p className="text-navy-700/60">No events scheduled right now — check back soon.</p>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events?.map((ev) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="section-heading">Don't Miss the Next One</h2>
          <p className="max-w-xl text-navy-700/80">
            We post confirmed event dates, live snapshots, and reminders on Instagram before every session — follow
            along so you never miss a live date.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="btn-primary">
              Follow on Instagram
            </a>
            <a href={socialLinks.community} target="_blank" rel="noreferrer" className="btn-secondary">
              Join the Community
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
