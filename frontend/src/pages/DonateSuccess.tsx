import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiGet } from '../lib/api';
import { donationThankYouNote } from '../lib/content';

export default function DonateSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'unknown'>('checking');

  useEffect(() => {
    if (!sessionId) { setStatus('unknown'); return; }
    apiGet(`/donations/verify/${sessionId}`)
      .then((res: any) => setStatus(res.status === 'success' ? 'success' : 'failed'))
      .catch(() => setStatus('unknown'));
  }, [sessionId]);

  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-xl card text-center">
        {status === 'checking' && <p className="text-navy-700/70">Confirming your donation…</p>}

        {status === 'success' && (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl text-sky-600">♥</span>
            <h1 className="mt-6 font-display text-3xl font-bold text-navy-700">Thank You</h1>
            <p className="mt-4 leading-relaxed text-navy-700/85">{donationThankYouNote}</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h1 className="font-display text-2xl font-bold text-navy-700">We couldn't confirm this payment</h1>
            <p className="mt-3 text-navy-700/70">
              If you believe this is an error, please contact us at purposeinpain1@gmail.com and we'll help sort it out.
            </p>
          </>
        )}

        {status === 'unknown' && (
          <>
            <h1 className="font-display text-2xl font-bold text-navy-700">Donation status unavailable</h1>
            <p className="mt-3 text-navy-700/70">
              We could not verify this transaction automatically. If you completed a payment, thank you — please
              contact us if you would like a confirmation.
            </p>
          </>
        )}

        <Link to="/" className="btn-primary mt-8 inline-flex">Back to Home</Link>
      </div>
    </div>
  );
}
