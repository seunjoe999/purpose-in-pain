import { useState } from 'react';
import { volunteerTeams } from '../lib/content';
import { apiPost } from '../lib/api';

export default function Volunteer() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    teams: [] as string[],
    availability: '',
    reason: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function toggleTeam(name: string) {
    setForm((f) => ({
      ...f,
      teams: f.teams.includes(name) ? f.teams.filter((t) => t !== name) : [...f.teams, name],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.teams.length === 0) {
      setError('Please select at least one team you are interested in.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await apiPost('/volunteers', form);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto max-w-lg card">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl text-sky-600">✓</span>
          <h1 className="mt-6 font-display text-3xl font-bold text-navy-700">Thank you for signing up!</h1>
          <p className="mt-3 text-navy-700/80">
            We're so grateful for your willingness to serve. Our Volunteer Care Team will be in touch with next steps
            soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Volunteer With Us</h1>
            <p className="mt-4 max-w-2xl text-white/80">
              From mentoring to media to prayer, there are many ways to give your time and skills to this mission.
            </p>
          </div>
          <img
            src="/assets/images/call-for-volunteers.png"
            alt="Purpose In Pain Initiative — Call for Volunteers"
            className="mx-auto max-h-96 w-auto rounded-2xl shadow-soft"
          />
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <h2 className="section-heading">Our Volunteer Teams</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {volunteerTeams.map((t) => (
            <div key={t.name} className="card">
              <h3 className="font-display text-base font-bold text-navy-700">{t.name}</h3>
              <p className="mt-2 text-sm text-navy-700/70">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky-50/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <h2 className="section-heading text-center">Sign Up to Volunteer</h2>
            <form onSubmit={handleSubmit} className="card mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name">Full name</label>
                  <input
                    id="full_name"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="location">Location / timezone</label>
                  <input
                    id="location"
                    placeholder="e.g. UK (GMT), Nigeria (WAT), US (EST)"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Which team(s) are you interested in?</label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {volunteerTeams.map((t) => (
                    <label key={t.name} className="flex items-center gap-2 rounded-lg border border-navy-50 px-3 py-2 text-sm font-normal text-navy-700">
                      <input
                        type="checkbox"
                        className="shrink-0"
                        checked={form.teams.includes(t.name)}
                        onChange={() => toggleTeam(t.name)}
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="availability">Availability</label>
                <input
                  id="availability"
                  placeholder="e.g. weekday evenings, weekends"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="reason">Why do you want to volunteer with us?</label>
                <textarea
                  id="reason"
                  rows={4}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {status === 'loading' ? 'Submitting…' : 'Submit Sign-Up'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
