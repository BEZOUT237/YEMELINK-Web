import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../database/config.js';
import { authenticate, authorize, optional, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// Get feed with pagination
router.get(
  '/',
  optional,
  asyncHandler(async (req: AuthRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    try {
      const [posts] = await connection.execute(
        `SELECT p.id, p.content, p.type, p.media_url, p.likes_count, p.comments_count,
                p.created_at, u.id as author_id, u.first_name, u.last_name, u.avatar_url
         FROM posts p
         JOIN users u ON p.author_id = u.id
         WHERE p.is_approved = true AND p.is_deleted = false
         ORDER BY p.is_pinned DESC, p.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [count] = await connection.execute(
        'SELECT COUNT(*) as total FROM posts WHERE is_approved = true AND is_deleted = false'
      );

      res.json({
        posts,
        pagination: {
          total: (count as any)[0].total,
          page,
          limit,
          pages: Math.ceil((count as any)[0].total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    } finally {
      await connection.release();
    }
  })
);

// Create post
router.post(
  '/',
  authenticate,
  [
    body('content').notEmpty().trim(),
    body('type').isIn(['text', 'image', 'video', 'link'])
  ],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type, media_url } = req.body;
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO posts (author_id, content, type, media_url, is_approved)
         VALUES (?, ?, ?, ?, true)`,
        [req.userId, content, type, media_url || null]
      );

      res.status(201).json({
        message: 'Post created successfully',
        postId: (result as any).insertId
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    } finally {
      await connection.release();
    }
  })
);

// Like/Unlike post
router.post(
  '/:postId/like',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      // Check if already liked
      const [existence] = await connection.execute(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [req.userId, req.params.postId]
      );

      if ((existence as any).length > 0) {
        // Unlike
        await connection.execute(
          'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
          [req.userId, req.params.postId]
        );
        await connection.execute(
          'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
          [req.params.postId]
        );
        res.json({ message: 'Post unliked', liked: false });
      } else {
        // Like
        await connection.execute(
          'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
          [req.userId, req.params.postId]
        );
        await connection.execute(
          'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
          [req.params.postId]
        );
        res.json({ message: 'Post liked', liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to like post' });
    } finally {
      await connection.release();
    }
  })
);

// Delete post
router.delete(
  '/:postId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      // Verify ownership
      const [posts] = await connection.execute(
        'SELECT author_id FROM posts WHERE id = ?',
        [req.params.postId]
      );

      if ((posts as any).length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if ((posts as any)[0].author_id !== req.userId && req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await connection.execute(
        'UPDATE posts SET is_deleted = true WHERE id = ?',
        [req.params.postId]
      );

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    } finally {
      await connection.release();
    }
  })
);

// Add comment
router.post(
  '/:postId/comments',
  authenticate,
  [body('content').notEmpty().trim()],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO comments (post_id, author_id, content)
         VALUES (?, ?, ?)`,
        [req.params.postId, req.userId, req.body.content]
      );

      await connection.execute(
        'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
        [req.params.postId]
      );

      res.status(201).json({
        message: 'Comment added successfully',
        commentId: (result as any).insertId
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
