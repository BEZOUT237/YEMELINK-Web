import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../database/config.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

// Generate JWT Token
const generateToken = (userId: number, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('first_name').notEmpty(),
    body('last_name').notEmpty()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, first_name, last_name } = req.body;
    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existing as any).length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const [result] = await connection.execute(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified)
         VALUES (?, ?, ?, ?, 'user', false)`,
        [email, password_hash, first_name, last_name]
      );

      const userId = (result as any).insertId;
      const token = generateToken(userId, 'user');

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, email, first_name, last_name, role: 'user' }
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    } finally {
      await connection.release();
    }
  })
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const connection = await pool.getConnection();

    try {
      // Find user
      const [users] = await connection.execute(
        'SELECT id, password_hash, first_name, last_name, role FROM users WHERE email = ?',
        [email]
      );

      if ((users as any).length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = (users as any)[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.role);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    } finally {
      await connection.release();
    }
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, email, first_name, last_name, avatar_url, bio, role FROM users WHERE id = ?',
        [req.userId]
      );

      if ((users as any).length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: (users as any)[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    } finally {
      await connection.release();
    }
  })
);

// Update profile
router.put(
  '/profile',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { first_name, last_name, bio, avatar_url } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `UPDATE users SET first_name = ?, last_name = ?, bio = ?, avatar_url = ? WHERE id = ?`,
        [first_name, last_name, bio, avatar_url, req.userId]
      );

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    } finally {
      await connection.release();
    }
  })
);

// Change password
router.post(
  '/change-password',
  authenticate,
  [body('current_password').notEmpty(), body('new_password').isLength({ min: 6 })],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { current_password, new_password } = req.body;
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [req.userId]
      );

      if ((users as any).length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = (users as any)[0];
      const passwordMatch = await bcrypt.compare(current_password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const new_hash = await bcrypt.hash(new_password, 10);
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [new_hash, req.userId]
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Change password failed' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
