import { useState } from 'react';
import { apiPost } from '../lib/api';

const PRESETS_GBP = [5, 25, 100];

const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'GBP (British Pound)', rate: 1 },
  { code: 'USD', symbol: '$', label: 'USD (US Dollar)', rate: 1.27 },
  { code: 'EUR', symbol: '€', label: 'EUR (Euro)', rate: 1.17 },
  { code: 'NGN', symbol: '₦', label: 'NGN (Nigerian Naira)', rate: 2100 },
];

export default function Donate() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [email, setEmail] = useState('');
  const [donorName, setDonorName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const displayAmount = customAmount ? Number(customAmount) : amount;
  const gbpAmount = displayAmount / currency.rate;

  const presets = PRESETS_GBP.map((p) => Math.round(p * currency.rate));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayAmount || displayAmount <= 0) {
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
        amountPounds: Math.max(1, Math.round(gbpAmount * 100) / 100),
        frequency,
        callbackUrl,
      });
      window.location.href = res.authorizationUrl;
    } catch (err: any) {
      setError(err.message || 'Could not start your donation. Please try again.');
      setStatus('error');
    }
  }

  function handleCurrencyChange(code: string) {
    const c = CURRENCIES.find((c) => c.code === code)!;
    setCurrency(c);
    setAmount(Math.round(PRESETS_GBP[1] * c.rate));
    setCustomAmount('');
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
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={currency.code}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy-700 focus:border-sky-400 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Amount ({currency.code})</label>
              <div className="grid grid-cols-3 gap-3">
                {presets.map((p) => (
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
                    {currency.symbol}{p.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor="custom">Or enter a custom amount</label>
                <input
                  id="custom"
                  type="number"
                  min={1}
                  placeholder={`e.g. ${currency.symbol}${Math.round(40 * currency.rate)}`}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
              {currency.code !== 'GBP' && displayAmount > 0 && (
                <p className="mt-1 text-xs text-navy-700/50">
                  Approx. £{gbpAmount.toFixed(2)} GBP (payments processed in GBP)
                </p>
              )}
            </div>

            <div>
              <label htmlFor="donorName">
                Your name <span className="text-xs text-navy-700/40">(optional)</span>
              </label>
              <input id="donorName" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
            </div>

            <div>
              <label htmlFor="email">Email <span className="text-xs text-red-400">*</span></label>
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
                : `Give ${currency.symbol}${(displayAmount || 0).toLocaleString()}${frequency === 'monthly' ? ' / month' : ''}`}
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
