import { useState } from 'react';
import { apiPost } from '../lib/api';
import { contactInfo, socialLinks } from '../lib/content';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await apiPost('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Get In Touch</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Questions, partnership ideas, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-700">Contact Details</h2>
          <ul className="mt-5 space-y-3 text-navy-700/80">
            <li>
              <span className="font-semibold">Email:</span>{' '}
              <a href={`mailto:${contactInfo.email}`} className="text-sky-500 hover:underline">
                {contactInfo.email}
              </a>
            </li>
            <li>
              <span className="font-semibold">Phone:</span>{' '}
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-sky-500 hover:underline">
                {contactInfo.phone}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-500 hover:underline">
              Instagram
            </a>
            <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-500 hover:underline">
              TikTok
            </a>
            <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-500 hover:underline">
              YouTube
            </a>
            <a href={socialLinks.linktree} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-500 hover:underline">
              Linktree
            </a>
          </div>
        </div>

        {status === 'success' ? (
          <div className="card">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl text-sky-600">✓</span>
            <h2 className="mt-6 text-center font-display text-2xl font-bold text-navy-700">Message Sent</h2>
            <p className="mt-3 text-center text-navy-700/80">
              Thank you for reaching out. Your message has been received and our team will respond soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
