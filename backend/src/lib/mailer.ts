import nodemailer, { Transporter } from 'nodemailer';

/**
 * Thin SMTP wrapper used for: contact-form notifications, volunteer
 * sign-up notifications, and donation thank-you receipts.
 *
 * If SMTP env vars aren't set, `sendMail` logs a warning and resolves
 * without throwing — forms still work (submissions are always persisted
 * to Postgres first), email is best-effort on top of that.
 *
 * Configure via SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM.
 * Works with any standard SMTP provider, including a Gmail App Password
 * for purposeinpain1@gmail.com (smtp.gmail.com, port 465, secure).
 */

let transporter: Transporter | null = null;
let warnedOnce = false;

function isConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter | null {
  if (!isConfigured()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string }) {
  const t = getTransporter();
  if (!t) {
    if (!warnedOnce) {
      // eslint-disable-next-line no-console
      console.warn(
        '[mailer] SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) — skipping email send. ' +
          'Submissions are still saved to the database and visible in the admin dashboard. ' +
          'See backend/.env.example to enable email delivery.'
      );
      warnedOnce = true;
    }
    return { sent: false as const };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { sent: true as const };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[mailer] Failed to send email:', err);
    return { sent: false as const };
  }
}

export const NOTIFICATION_INBOX = process.env.NOTIFICATION_EMAIL || 'purposeinpain1@gmail.com';
