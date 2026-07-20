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
            Questions, partnership ideas, or just want to say hello? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h2 className="font-display text-xl font-bold text-navy-700">Contact Details</h2>
            <div className="mt-5 space-y-4">
              <a href={`mailto:${contactInfo.email}`} className="group flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-600">
                  ✉
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-navy-700/50">Email</span>
                  <span className="text-sm font-medium text-navy-700 group-hover:text-sky-600">{contactInfo.email}</span>
                </span>
              </a>
              <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="group flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg text-sky-600">
                  ☎
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-navy-700/50">Phone</span>
                  <span className="text-sm font-medium text-navy-700 group-hover:text-sky-600">{contactInfo.phone}</span>
                </span>
              </a>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg text-green-600">
                  💬
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-navy-700/50">WhatsApp</span>
                  <span className="text-sm font-medium text-navy-700 group-hover:text-green-600">Chat with us on WhatsApp</span>
                </span>
              </a>
            </div>
          </div>

          <div className="card bg-navy-700 text-white">
            <h2 className="font-display text-xl font-bold">Follow & Connect</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
                Instagram
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
                TikTok
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
                YouTube
              </a>
              <a href={socialLinks.linktree} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
                Linktree
              </a>
            </div>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center gap-3 rounded-2xl bg-green-500/20 p-3 pr-5 transition hover:bg-green-500/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-lg">
                💬
              </span>
              <span className="text-sm font-semibold text-white">Chat us on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          {status === 'success' ? (
            <div className="card flex flex-col items-center py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl text-sky-600">✓</span>
              <h2 className="mt-6 font-display text-2xl font-bold text-navy-700">Message Sent</h2>
              <p className="mt-3 max-w-sm text-navy-700/80">
                Thank you for reaching out. Your message has been received and our team will respond soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5">
              <h2 className="font-display text-xl font-bold text-navy-700">Send Us a Message</h2>
              <div>
                <label htmlFor="name">
                  Name <span className="text-xs text-navy-700/40">(optional)</span>
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email">Email <span className="text-xs text-red-400">*</span></label>
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
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
              <p className="text-center text-xs text-navy-700/50">
                Prefer to chat directly?{' '}
                <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-green-600 hover:underline">
                  Message us on WhatsApp
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
