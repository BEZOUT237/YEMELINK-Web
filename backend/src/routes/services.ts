import express, { Router } from 'express';
import { pool } from '../database/config.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// Get all services
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [services] = await connection.execute(
        `SELECT id, title, slug, description, icon, category, pricing_tiers, featured_image, turnaround_time
         FROM services WHERE is_active = true ORDER BY title ASC`
      );

      res.json({ services });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    } finally {
      await connection.release();
    }
  })
);

// Get service by slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [services] = await connection.execute(
        `SELECT * FROM services WHERE slug = ? AND is_active = true`,
        [req.params.slug]
      );

      if ((services as any).length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ service: (services as any)[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    } finally {
      await connection.release();
    }
  })
);

// Get services by category
router.get(
  '/category/:category',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [services] = await connection.execute(
        `SELECT id, title, slug, description, icon, category, featured_image, turnaround_time
         FROM services WHERE category = ? AND is_active = true ORDER BY title ASC`,
        [req.params.category]
      );

      res.json({ services });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
