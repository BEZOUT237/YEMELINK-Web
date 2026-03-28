import express, { Router } from 'express';
import { pool } from '../database/config.js';
import { optional } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// Get all projects with pagination
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    try {
      const [projects] = await connection.execute(
        `SELECT id, title, slug, description, short_description, client_name, images,
                featured_image, live_url, case_study, testimonial, featured, views_count, created_at
         FROM projects ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [count] = await connection.execute(
        'SELECT COUNT(*) as total FROM projects'
      );

      res.json({
        projects,
        pagination: {
          total: (count as any)[0].total,
          page,
          limit,
          pages: Math.ceil((count as any)[0].total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    } finally {
      await connection.release();
    }
  })
);

// Get featured projects
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [projects] = await connection.execute(
        `SELECT id, title, slug, description, short_description, client_name, images,
                featured_image, live_url, case_study, testimonial, views_count
         FROM projects WHERE featured = true ORDER BY created_at DESC LIMIT 6`
      );

      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured projects' });
    } finally {
      await connection.release();
    }
  })
);

// Get single project by slug
router.get(
  '/:slug',
  optional,
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [projects] = await connection.execute(
        `SELECT * FROM projects WHERE slug = ?`,
        [req.params.slug]
      );

      if ((projects as any).length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Increment views counter
      if ((projects as any).length > 0) {
        const projectId = (projects as any)[0].id;
        await connection.execute(
          'UPDATE projects SET views_count = views_count + 1 WHERE id = ?',
          [projectId]
        );
      }

      res.json({ project: (projects as any)[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
