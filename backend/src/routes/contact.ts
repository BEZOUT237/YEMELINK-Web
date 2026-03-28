import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../database/config.js';
import { asyncHandler } from '../utils/errors.js';
import { sendContactEmail, sendQuoteRequestEmail } from '../services/emailService.js';

const router: Router = express.Router();

// Submit contact form
router.post(
  '/message',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('subject').notEmpty().trim(),
    body('message').notEmpty().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;
    const connection = await pool.getConnection();

    try {
      // Save to database for admin dashboard
      await connection.execute(
        `INSERT INTO quote_requests (name, email, service_type, message, status)
         VALUES (?, ?, 'contact', ?, 'new')`,
        [name, email, message]
      );

      // Send email notification
      await sendContactEmail({ name, email, subject, message });

      res.status(200).json({
        message: 'Message sent successfully. We will contact you soon.',
        email_sent: true
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    } finally {
      await connection.release();
    }
  })
);

// Submit quote request
router.post(
  '/quote',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('service_type').notEmpty().trim(),
    body('message').notEmpty().trim(),
    body('phone').optional().trim(),
    body('budget').optional().trim(),
    body('timeline').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, service_type, message, budget, timeline } = req.body;
    const connection = await pool.getConnection();

    try {
      // Save to database
      const [result] = await connection.execute(
        `INSERT INTO quote_requests (name, email, phone, service_type, message, budget, timeline, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
        [name, email, phone || null, service_type, message, budget || null, timeline || null]
      );

      // Send email notification
      await sendQuoteRequestEmail({
        name,
        email,
        phone,
        service_type,
        message
      });

      res.status(201).json({
        message: 'Quote request submitted successfully!',
        request_id: (result as any).insertId,
        whatsapp_link: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=Hi%20YEMELINK,%20I%20submitted%20a%20quote%20request!`
      });
    } catch (error) {
      console.error('Quote error:', error);
      res.status(500).json({ error: 'Failed to submit quote request' });
    } finally {
      await connection.release();
    }
  })
);

// Get quote requests (admin only)
router.get(
  '/admin/requests',
  asyncHandler(async (req, res) => {
    // TODO: Add admin authentication middleware
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    try {
      const [requests] = await connection.execute(
        `SELECT id, name, email, phone, service_type, message, status, created_at
         FROM quote_requests
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch requests' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
