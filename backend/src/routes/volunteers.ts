import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { sendMail, NOTIFICATION_INBOX } from '../lib/mailer';

const router = Router();

const volunteerSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  teams: z.array(z.string()).min(1, 'Select at least one team'),
  availability: z.string().optional(),
  reason: z.string().optional(),
});

router.post('/', async (req, res) => {
  const parsed = volunteerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { full_name, email, phone, location, teams, availability, reason } = parsed.data;

  const result = await pool.query(
    `INSERT INTO volunteer_signups (full_name, email, phone, location, teams, availability, reason)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
    [full_name, email, phone ?? null, location ?? null, teams, availability ?? null, reason ?? null]
  );

  // Best-effort notification email — the sign-up is always safely stored in
  // the volunteer_signups table (and visible in the admin dashboard) whether
  // or not SMTP is configured (see backend/.env.example).
  await sendMail({
    to: NOTIFICATION_INBOX,
    subject: `New volunteer sign-up from ${full_name}`,
    text: [
      `Name: ${full_name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      location ? `Location: ${location}` : null,
      `Teams: ${teams.join(', ')}`,
      availability ? `Availability: ${availability}` : null,
      reason ? `\nWhy they want to volunteer:\n${reason}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  res.status(201).json({
    message: 'Thank you for signing up to volunteer with Purpose In Pain Initiative CIC. We will be in touch soon.',
    id: result.rows[0].id,
  });
});

export default router;
