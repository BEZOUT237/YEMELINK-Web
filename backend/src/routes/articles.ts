import express, { Router } from 'express';
import { pool } from '../database/config.js';
import { authenticate, authorize, optional, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// Get all published articles
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    try {
      const [articles] = await connection.execute(
        `SELECT id, title, slug, excerpt, featured_image, author_id, tags, category,
                reading_time, views_count, published_at
         FROM articles WHERE is_published = true
         ORDER BY published_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [count] = await connection.execute(
        'SELECT COUNT(*) as total FROM articles WHERE is_published = true'
      );

      res.json({
        articles,
        pagination: {
          total: (count as any)[0].total,
          page,
          limit,
          pages: Math.ceil((count as any)[0].total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    } finally {
      await connection.release();
    }
  })
);

// Get featured articles
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [articles] = await connection.execute(
        `SELECT id, title, slug, excerpt, featured_image, category, reading_time, published_at
         FROM articles WHERE is_published = true
         ORDER BY published_at DESC LIMIT 3`
      );

      res.json({ articles });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    } finally {
      await connection.release();
    }
  })
);

// Get article by slug
router.get(
  '/:slug',
  optional,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [articles] = await connection.execute(
        `SELECT a.*, u.first_name, u.last_name
         FROM articles a
         JOIN users u ON a.author_id = u.id
         WHERE a.slug = ? AND a.is_published = true`,
        [req.params.slug]
      );

      if ((articles as any).length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Increment views
      await connection.execute(
        'UPDATE articles SET views_count = views_count + 1 WHERE id = ?',
        [(articles as any)[0].id]
      );

      res.json({ article: (articles as any)[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch article' });
    } finally {
      await connection.release();
    }
  })
);

// Search articles
router.get(
  '/search/:query',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const query = `%${req.params.query}%`;
      const [articles] = await connection.execute(
        `SELECT id, title, slug, excerpt, featured_image, category, reading_time
         FROM articles
         WHERE is_published = true AND (title LIKE ? OR excerpt LIKE ? OR body LIKE ?)
         ORDER BY published_at DESC LIMIT 20`,
        [query, query, query]
      );

      res.json({ articles });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search articles' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
