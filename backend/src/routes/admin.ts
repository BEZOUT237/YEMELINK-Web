import express, { Router } from 'express';
import { pool } from '../database/config.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Dashboard stats
router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [userCount] = await connection.execute(
        'SELECT COUNT(*) as total FROM users'
      );
      const [projectCount] = await connection.execute(
        'SELECT COUNT(*) as total FROM projects'
      );
      const [postCount] = await connection.execute(
        'SELECT COUNT(*) as total FROM posts WHERE is_deleted = false'
      );
      const [quoteCount] = await connection.execute(
        'SELECT COUNT(*) as total FROM quote_requests WHERE status = "new"'
      );

      res.json({
        stats: {
          total_users: (userCount as any)[0].total,
          total_projects: (projectCount as any)[0].total,
          total_posts: (postCount as any)[0].total,
          pending_quotes: (quoteCount as any)[0].total
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    } finally {
      await connection.release();
    }
  })
);

// Manage users
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
      );

      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    } finally {
      await connection.release();
    }
  })
);

// Update user role
router.put(
  '/users/:userId/role',
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, req.params.userId]
      );

      res.json({ message: 'User role updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user role' });
    } finally {
      await connection.release();
    }
  })
);

// Moderate posts
router.delete(
  '/posts/:postId',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE posts SET is_deleted = true WHERE id = ?',
        [req.params.postId]
      );

      res.json({ message: 'Post deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    } finally {
      await connection.release();
    }
  })
);

// Pin/Unpin post
router.patch(
  '/posts/:postId/pin',
  asyncHandler(async (req, res) => {
    const { pin } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'UPDATE posts SET is_pinned = ? WHERE id = ?',
        [pin ? true : false, req.params.postId]
      );

      res.json({ message: pin ? 'Post pinned' : 'Post unpinned' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    } finally {
      await connection.release();
    }
  })
);

// Create article
router.post(
  '/articles',
  asyncHandler(async (req: AuthRequest, res) => {
    const { title, slug, excerpt, body, category, tags, is_published } = req.body;
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO articles (title, slug, excerpt, body, author_id, category, tags, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          excerpt,
          body,
          req.userId,
          category,
          JSON.stringify(tags),
          is_published ? true : false,
          is_published ? new Date() : null
        ]
      );

      res.status(201).json({
        message: 'Article created',
        articleId: (result as any).insertId
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create article' });
    } finally {
      await connection.release();
    }
  })
);

// Update article
router.put(
  '/articles/:articleId',
  asyncHandler(async (req, res) => {
    const { title, excerpt, body, category, tags, is_published } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE articles
         SET title = ?, excerpt = ?, body = ?, category = ?, tags = ?, is_published = ?
         WHERE id = ?`,
        [title, excerpt, body, category, JSON.stringify(tags), is_published ? true : false, req.params.articleId]
      );

      res.json({ message: 'Article updated' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update article' });
    } finally {
      await connection.release();
    }
  })
);

// Delete article
router.delete(
  '/articles/:articleId',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        'DELETE FROM articles WHERE id = ?',
        [req.params.articleId]
      );

      res.json({ message: 'Article deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete article' });
    } finally {
      await connection.release();
    }
  })
);

// View reports
router.get(
  '/reports',
  asyncHandler(async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const [reports] = await connection.execute(
        `SELECT r.id, r.reason, r.description, r.status, r.created_at,
                u.first_name, u.last_name, p.content as post_content
         FROM reports r
         LEFT JOIN users u ON r.reported_user_id = u.id
         LEFT JOIN posts p ON r.post_id = p.id
         ORDER BY r.created_at DESC`
      );

      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reports' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
