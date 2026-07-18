import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';

const router = Router();

const newsletterSchema = z.object({
  email: z.string().email('A valid email is required'),
});

router.post('/', async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email } = parsed.data;

  try {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email]
    );
    res.status(201).json({ message: "You're subscribed! Thank you for joining our community." });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
