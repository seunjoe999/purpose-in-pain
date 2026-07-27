import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { pool } from '../db/pool';
import { sendMail } from '../lib/mailer';

const router = Router();

const CURRENCY_SYMBOLS: Record<string, string> = { GBP: '£', NGN: '₦', USD: '$' };

const DONATION_THANK_YOU_TEXT = `Thank you for sowing into hope. Because of your generosity, a widow will breathe a little easier, a child will move closer to their dreams, and a woman carrying silent pain will be reminded that she is not forgotten. Thank you for choosing to be part of someone's healing story. May God richly bless you.

— Purpose In Pain Initiative CIC`;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set. Add it to your environment variables.');
  return new Stripe(key);
}

async function sendDonationReceipt(donation: {
  email: string;
  donor_name: string | null;
  amount_pence: number;
  currency: string;
  frequency: string;
}) {
  const symbol = CURRENCY_SYMBOLS[donation.currency] || donation.currency + ' ';
  const amount = (donation.amount_pence / 100).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  await sendMail({
    to: donation.email,
    subject: 'Thank you for your gift — Purpose In Pain Initiative',
    text: `Dear ${donation.donor_name || 'friend'},\n\nYour ${
      donation.frequency === 'monthly' ? 'monthly' : 'one-time'
    } gift of ${symbol}${amount} has been received.\n\n${DONATION_THANK_YOU_TEXT}`,
  });
}

const initSchema = z.object({
  email: z.string().email(),
  donorName: z.string().optional(),
  amount: z.number().positive('Amount must be greater than zero'),
  currency: z.enum(['GBP', 'NGN', 'USD']).default('GBP'),
  frequency: z.enum(['one-time', 'monthly']).default('one-time'),
  callbackUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

// ── Create a Stripe Checkout Session ─────────────────────────────────────────
router.post('/initialize', async (req, res) => {
  const parsed = initSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, donorName, amount, currency, frequency, callbackUrl, cancelUrl } = parsed.data;
  const amountCents = Math.round(amount * 100);

  try {
    const stripe = getStripe();

    const productName =
      frequency === 'monthly'
        ? 'Monthly Donation — Purpose In Pain Initiative CIC'
        : 'Donation — Purpose In Pain Initiative CIC';

    const successUrl = callbackUrl
      ? `${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`
      : `https://purposeinpain.org/donate/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrlFinal =
      cancelUrl ||
      (callbackUrl ? callbackUrl.replace('/donate/success', '/donate') : 'https://purposeinpain.org/donate');

    let session: Stripe.Checkout.Session;

    if (frequency === 'monthly') {
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: amountCents,
              product_data: { name: productName },
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrlFinal,
        metadata: { donor_name: donorName ?? '', frequency, currency },
      });
    } else {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: amountCents,
              product_data: { name: productName },
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrlFinal,
        metadata: { donor_name: donorName ?? '', frequency, currency },
      });
    }

    await pool.query(
      `INSERT INTO donations (reference, email, donor_name, amount_pence, currency, frequency, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [session.id, email, donorName ?? null, amountCents, currency, frequency]
    );

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initialize payment.' });
  }
});

// ── Verify a Stripe Checkout Session after redirect ───────────────────────────
router.get('/verify/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const status = session.payment_status === 'paid' ? 'success' : 'failed';

    const result = await pool.query(
      `UPDATE donations SET status = $1, verified_at = now() WHERE reference = $2 RETURNING *`,
      [status, sessionId]
    );

    if (result.rowCount === 0) {
      return res.json({ status, donation: null });
    }

    const donation = result.rows[0];
    if (status === 'success' && !donation.receipt_sent_at) {
      await sendDonationReceipt(donation);
      await pool.query(`UPDATE donations SET receipt_sent_at = now() WHERE reference = $1`, [sessionId]);
    }

    res.json({ status, donation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to verify payment.' });
  }
});

// ── Stripe webhook (recommended production path) ──────────────────────────────
// NOTE: This route receives a raw Buffer body — app.ts mounts
// express.raw() for /api/donations/webhook before express.json().
router.post('/webhook', async (req: any, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body as Stripe.Event;
    }
  } catch (err: any) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const result = await pool.query(
      `UPDATE donations SET status = 'success', verified_at = now() WHERE reference = $1 RETURNING *`,
      [session.id]
    );
    const donation = result.rows[0];
    if (donation && !donation.receipt_sent_at) {
      const stripe = getStripe();
      const fullSession = await stripe.checkout.sessions.retrieve(session.id);
      const donationWithEmail = { ...donation, email: fullSession.customer_email || donation.email };
      await sendDonationReceipt(donationWithEmail);
      await pool.query(`UPDATE donations SET receipt_sent_at = now() WHERE reference = $1`, [session.id]);
    }
  }

  res.sendStatus(200);
});

export default router;
