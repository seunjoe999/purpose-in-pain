import { useState } from 'react';
import { apiPost } from '../lib/api';

type Currency = 'GBP' | 'NGN' | 'USD';

const CURRENCIES: { code: Currency; flag: string; symbol: string; presets: number[] }[] = [
  { code: 'GBP', flag: '🇬🇧', symbol: '£', presets: [5, 10, 20, 50] },
  { code: 'NGN', flag: '🇳🇬', symbol: '₦', presets: [1000, 2500, 5000, 10000] },
  { code: 'USD', flag: '🇺🇸', symbol: '$', presets: [5, 10, 25, 50] },
];

function formatAmount(amount: number, currency: Currency) {
  const cur = CURRENCIES.find((c) => c.code === currency)!;
  if (currency === 'NGN') return `${cur.symbol}${amount.toLocaleString('en-NG')}`;
  return `${cur.symbol}${amount}`;
}

export default function Donate() {
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [preset, setPreset] = useState<number | null>(10);
  const [custom, setCustom] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cur = CURRENCIES.find((c) => c.code === currency)!;
  const amount = custom ? parseFloat(custom) : preset;
  const displayAmount = amount ? formatAmount(amount, currency) : `${cur.symbol}—`;

  function switchCurrency(code: Currency) {
    setCurrency(code);
    setPreset(CURRENCIES.find((c) => c.code === code)!.presets[1]);
    setCustom('');
    setError('');
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || amount <= 0) { setError('Please choose or enter an amount.'); return; }
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      const callbackUrl = `${window.location.origin}/donate/success`;
      const cancelUrl = `${window.location.origin}/donate`;
      const result = await apiPost('/donations/initialize', {
        email,
        donorName: name || undefined,
        amount,
        currency,
        frequency,
        callbackUrl,
        cancelUrl,
      }) as any;
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError('Could not start payment. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="mx-auto max-w-lg">
          <form onSubmit={handleDonate} className="card space-y-6">

            {/* Currency */}
            <div>
              <p className="mb-2 text-sm font-semibold text-navy-700">Select your currency</p>
              <div className="flex gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => switchCurrency(c.code)}
                    className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
                      currency === c.code
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-navy-100 text-navy-700/60 hover:border-navy-300'
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.symbol} {c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preset amounts */}
            <div>
              <p className="mb-2 text-sm font-semibold text-navy-700">Choose an amount</p>
              <div className="grid grid-cols-4 gap-2">
                {cur.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setPreset(p); setCustom(''); }}
                    className={`rounded-xl border-2 py-3 font-display font-bold transition ${
                      preset === p && !custom
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-navy-100 text-navy-700 hover:border-sky-300'
                    }`}
                  >
                    {formatAmount(p, currency)}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="shrink-0 font-display text-lg font-bold text-navy-700">{cur.symbol}</span>
                <input
                  type="number"
                  placeholder="Other amount"
                  min="1"
                  step="any"
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setPreset(null); }}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <p className="mb-2 text-sm font-semibold text-navy-700">Frequency</p>
              <div className="flex gap-2">
                {(['one-time', 'monthly'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
                      frequency === f
                        ? 'border-sky-500 bg-sky-50 text-sky-600'
                        : 'border-navy-100 text-navy-700/60 hover:border-navy-300'
                    }`}
                  >
                    {f === 'one-time' ? 'One-time gift' : 'Give monthly'}
                  </button>
                ))}
              </div>
              {frequency === 'monthly' && (
                <p className="mt-1.5 text-xs text-navy-700/50">
                  You will be charged {displayAmount} every month. Cancel anytime.
                </p>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <label>Your name (optional)</label>
                <input placeholder="Dr Shalom Mojere" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label>Email address *</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Impact */}
            <div className="rounded-2xl bg-sky-50 px-5 py-4 text-sm text-navy-700/80">
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-sky-500">✓</span> Fund a mentoring session for a mother in crisis</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-sky-500">✓</span> Support a care package for a family in need</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-sky-500">✓</span> Help run a live community event</li>
              </ul>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
            )}

            <button type="submit" disabled={loading || !amount} className="btn-primary w-full text-base">
              {loading
                ? 'Preparing your payment…'
                : `Donate ${amount ? displayAmount : ''} ${frequency === 'monthly' ? 'monthly' : 'now'}`}
            </button>

            <p className="text-center text-xs text-navy-700/40">
              Payments processed securely via Stripe. You will be redirected to complete your gift.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
