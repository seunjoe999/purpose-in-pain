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
      <section className="bg-navy-700 py-20 text-white sm:py-28">
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

          <div className="card space-y-4">
            <h2 className="font-display text-xl font-bold text-navy-700">Follow &amp; Connect</h2>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-navy-100 p-3 transition hover:border-pink-300 hover:bg-pink-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </span>
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">Instagram</p>
                <p className="text-sm font-semibold text-navy-700">@purposeinpaininitiativecic</p>
              </span>
            </a>

            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-navy-100 p-3 transition hover:border-navy-300 hover:bg-navy-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.88a8.28 8.28 0 0 0 4.84 1.54V7c-.99 0-1.93-.27-2.77-.74z"/></svg>
              </span>
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">TikTok</p>
                <p className="text-sm font-semibold text-navy-700">@pipwomenshealthhub</p>
              </span>
            </a>

            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-navy-100 p-3 transition hover:border-red-300 hover:bg-red-50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </span>
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">YouTube</p>
                <p className="text-sm font-semibold text-navy-700">PurposeinPainInitiativeCIC</p>
              </span>
            </a>

            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-3 transition hover:bg-green-100"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </span>
              <span>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">WhatsApp</p>
                <p className="text-sm font-semibold text-green-800">Chat with us on WhatsApp</p>
              </span>
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
