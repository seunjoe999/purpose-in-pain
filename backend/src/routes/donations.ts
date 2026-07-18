import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { pool } from '../db/pool';
import { sendMail } from '../lib/mailer';

const router = Router();

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const DONATION_THANK_YOU_TEXT = `Thank you for sowing into hope. Because of your generosity, a widow will breathe a little easier, a child will move closer to their dreams, and a woman carrying silent pain will be reminded that she is not forgotten. Thank you for choosing to be part of someone's healing story. May God richly bless you.

— Purpose In Pain Initiative CIC`;

async function sendDonationReceipt(donation: { email: string; donor_name: string | null; amount_pence: number; currency: string; frequency: string }) {
  const amount = (donation.amount_pence / 100).toFixed(2);
  await sendMail({
    to: donation.email,
    subject: 'Thank you for your gift — Purpose In Pain Initiative',
    text: `Dear ${donation.donor_name || 'friend'},\n\nYour ${donation.frequency === 'monthly' ? 'monthly' : 'one-time'} gift of ${donation.currency} ${amount} has been received.\n\n${DONATION_THANK_YOU_TEXT}`,
  });
}

function paystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not set. Add your Paystack test secret key to backend/.env (see .env.example).'
    );
  }
  return key;
}

const initSchema = z.object({
  email: z.string().email(),
  donorName: z.string().optional(),
  amountPounds: z.number().positive('Amount must be greater than zero'),
  frequency: z.enum(['one-time', 'monthly']).default('one-time'),
  callbackUrl: z.string().url().optional(),
});

// ── Initialize a Paystack transaction (one-time or monthly) ────────────────
router.post('/initialize', async (req, res) => {
  const parsed = initSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, donorName, amountPounds, frequency, callbackUrl } = parsed.data;
  const amountPence = Math.round(amountPounds * 100);
  const currency = process.env.PAYSTACK_CURRENCY || 'GBP';
  const reference = `pip_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  try {
    const secretKey = paystackSecretKey();

    let planCode: string | undefined;

    if (frequency === 'monthly') {
      // Create (or reuse) a Paystack Plan for this amount so Paystack can
      // automatically bill the donor monthly after their first successful charge.
      const planRes = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `PIP Monthly Giving - £${amountPounds}`,
          interval: 'monthly',
          amount: amountPence,
          currency,
        }),
      });
      const planData = (await planRes.json()) as any;
      if (planRes.ok && planData?.data?.plan_code) {
        planCode = planData.data.plan_code;
      }
      // If plan creation fails we still proceed with a one-time-style charge
      // rather than blocking the donor — this is logged for follow-up.
      if (!planCode) {
        // eslint-disable-next-line no-console
        console.warn('[donations] Could not create Paystack plan, proceeding without recurring plan.', planData);
      }
    }

    await pool.query(
      `INSERT INTO donations (reference, email, donor_name, amount_pence, currency, frequency, status, paystack_plan_code)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)`,
      [reference, email, donorName ?? null, amountPence, currency, frequency, planCode ?? null]
    );

    const initRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountPence,
        currency,
        reference,
        callback_url: callbackUrl,
        plan: planCode,
        metadata: {
          donor_name: donorName,
          frequency,
        },
      }),
    });

    const initData = (await initRes.json()) as any;
    if (!initRes.ok || !initData.status) {
      return res.status(502).json({ error: initData?.message || 'Could not initialize payment with Paystack.' });
    }

    res.json({
      authorizationUrl: initData.data.authorization_url,
      accessCode: initData.data.access_code,
      reference,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initialize donation.' });
  }
});

// ── Verify a transaction after redirect from Paystack ───────────────────────
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  try {
    const secretKey = paystackSecretKey();
    const verifyRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const verifyData = (await verifyRes.json()) as any;

    const status = verifyData?.data?.status === 'success' ? 'success' : 'failed';

    const result = await pool.query(
      `UPDATE donations SET status = $1, verified_at = now() WHERE reference = $2 RETURNING *`,
      [status, reference]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    const donation = result.rows[0];
    if (status === 'success' && !donation.receipt_sent_at) {
      await sendDonationReceipt(donation);
      await pool.query(`UPDATE donations SET receipt_sent_at = now() WHERE reference = $1`, [reference]);
    }

    res.json({ status, donation });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to verify donation.' });
  }
});

// ── Paystack webhook (recommended production path for confirming payments) ─
router.post('/webhook', async (req: any, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.headers['x-paystack-signature'];

  if (secretKey && signature) {
    const hash = crypto.createHmac('sha512', secretKey).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== signature) {
      return res.status(401).send('Invalid signature');
    }
  }

  const event = req.body;
  if (event?.event === 'charge.success') {
    const reference = event.data?.reference;
    if (reference) {
      const result = await pool.query(
        `UPDATE donations SET status = 'success', verified_at = now() WHERE reference = $1 RETURNING *`,
        [reference]
      );
      const donation = result.rows[0];
      if (donation && !donation.receipt_sent_at) {
        await sendDonationReceipt(donation);
        await pool.query(`UPDATE donations SET receipt_sent_at = now() WHERE reference = $1`, [reference]);
      }
    }
  }

  res.sendStatus(200);
});

export default router;
