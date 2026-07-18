import { useState } from 'react';
import { apiPost } from '../lib/api';

export default function NewsletterForm({ variant = 'footer' }: { variant?: 'footer' | 'inline' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await apiPost('/newsletter', { email });
      setMessage(res.message || "You're subscribed!");
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
      setStatus('error');
    }
  }

  const isFooter = variant === 'footer';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className={isFooter ? 'text-white' : ''}>Join our newsletter</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={isFooter ? 'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:ring-sky-400' : ''}
        />
        <button type="submit" disabled={status === 'loading'} className="btn-primary shrink-0">
          {status === 'loading' ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {status === 'success' && <p className="mt-2 text-sm text-sky-300">{message}</p>}
      {status === 'error' && <p className="mt-2 text-sm text-red-400">{message}</p>}
    </form>
  );
}
