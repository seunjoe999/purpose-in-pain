import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

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

  // NOTE: Notification email to purposeinpain1@gmail.com is a documented TODO —
  // see README.md "SMTP / email delivery" section. No SMTP credentials were
  // provided, so we do not fabricate a working email send here.

  res.status(201).json({
    message: 'Thank you for signing up to volunteer with Purpose In Pain Initiative CIC. We will be in touch soon.',
    id: result.rows[0].id,
  });
});

export default router;
