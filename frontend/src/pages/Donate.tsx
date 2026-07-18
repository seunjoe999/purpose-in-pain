import { useState } from 'react';
import { apiPost } from '../lib/api';

const PRESETS = [5, 25, 100];

export default function Donate() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) {
      setError('Please choose or enter a donation amount greater than zero.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const callbackUrl = `${window.location.origin}/donate/success`;
      const res = await apiPost('/donations/initialize', {
        email,
        donorName,
        amountPounds: finalAmount,
        frequency,
        callbackUrl,
      });
      window.location.href = res.authorizationUrl;
    } catch (err: any) {
      setError(err.message || 'Could not start your donation. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div>
      <section className="bg-navy-700 py-16 text-white sm:py-20">
        <div className="container-page">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Sow Into Hope</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Your gift helps a mother breathe a little easier, a child move closer to their dreams, and a woman
            carrying silent pain feel remembered.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="flex rounded-full bg-navy-50 p-1">
              {(['one-time', 'monthly'] as const).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 rounded-full py-2 text-sm font-display font-semibold transition ${
                    frequency === f ? 'bg-sky-500 text-white shadow-soft' : 'text-navy-700'
                  }`}
                >
                  {f === 'one-time' ? 'Give Once' : 'Give Monthly'}
                </button>
              ))}
            </div>

            <div>
              <label>Amount (GBP)</label>
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      setAmount(p);
                      setCustomAmount('');
                    }}
                    className={`rounded-xl border-2 py-3 font-display font-bold transition ${
                      !customAmount && amount === p
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-navy-100 text-navy-700 hover:border-sky-300'
                    }`}
                  >
                    £{p}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor="custom">Or enter a custom amount</label>
                <input
                  id="custom"
                  type="number"
                  min={1}
                  placeholder="e.g. 40"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="donorName">Your name</label>
              <input id="donorName" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
              {status === 'loading'
                ? 'Redirecting to secure checkout…'
                : `Give £${finalAmount || 0}${frequency === 'monthly' ? ' / month' : ''}`}
            </button>

            <p className="text-center text-xs text-navy-700/50">
              Payments are processed securely via Paystack. You will be redirected to complete your donation.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
