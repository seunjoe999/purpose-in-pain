import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { sendMail, NOTIFICATION_INBOX } from '../lib/mailer';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email is required'),
  message: z.string().min(1, 'Message is required'),
});

router.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { name, email, message } = parsed.data;

  const result = await pool.query(
    `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, created_at`,
    [name, email, message]
  );

  // Best-effort notification email — the message is always safely stored in
  // the contact_messages table (and visible in the admin dashboard) whether
  // or not SMTP is configured (see backend/.env.example).
  await sendMail({
    to: NOTIFICATION_INBOX,
    subject: `New contact message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  res.status(201).json({
    message: 'Thank you for reaching out. Your message has been received and our team will respond soon.',
    id: result.rows[0].id,
  });
});

export default router;
