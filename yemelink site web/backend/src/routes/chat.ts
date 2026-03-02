import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { pool } from '../database/config.js';
import { authenticate, optional, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';

const router: Router = express.Router();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Send message to AI
router.post(
  '/message',
  optional,
  [body('message').notEmpty().trim()],
  asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, session_id } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'AI service not configured. Please add OPENAI_API_KEY to environment.'
      });
    }

    const connection = await pool.getConnection();

    try {
      // Get chat history if user is logged in
      let history: any[] = [];
      if (req.userId) {
        const [messages] = await connection.execute(
          `SELECT role, content FROM chat_messages
           WHERE user_id = ? AND session_id = ?
           ORDER BY created_at DESC LIMIT 5`,
          [req.userId, session_id]
        );
        history = (messages as any).reverse();
      }

      // Prepare messages for OpenAI
      const messagesForAPI = [
        {
          role: 'system',
          content: `You are YEMELINK Assistant, a helpful AI representing YEMELINK - a tech & digital media company.
You help users with questions about web development, mobile apps, graphic design, content creation, digital marketing, and copywriting services.
Be professional, friendly, and concise. Offer to connect them with the team for specific projects.`
        },
        ...history,
        { role: 'user', content: message }
      ];

      // Call OpenAI API
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: messagesForAPI,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiMessage = response.data.choices[0].message.content;

      // Save messages to database if user is logged in
      if (req.userId) {
        const finalSessionId = session_id || `session_${Date.now()}`;
        await connection.execute(
          `INSERT INTO chat_messages (user_id, role, content, session_id) VALUES (?, ?, ?, ?)`,
          [req.userId, 'user', message, finalSessionId]
        );
        await connection.execute(
          `INSERT INTO chat_messages (user_id, role, content, session_id) VALUES (?, ?, ?, ?)`,
          [req.userId, 'assistant', aiMessage, finalSessionId]
        );
      }

      res.json({
        message: aiMessage,
        session_id: session_id || `session_${Date.now()}`
      });
    } catch (error: any) {
      console.error('OpenAI error:', error);
      res.status(500).json({
        error: 'Failed to process message',
        details: error.response?.data?.error?.message || error.message
      });
    } finally {
      await connection.release();
    }
  })
);

// Get chat history
router.get(
  '/history/:session_id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [messages] = await connection.execute(
        `SELECT id, role, content, created_at FROM chat_messages
         WHERE user_id = ? AND session_id = ?
         ORDER BY created_at ASC`,
        [req.userId, req.params.session_id]
      );

      res.json({ messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat history' });
    } finally {
      await connection.release();
    }
  })
);

// Get all sessions
router.get(
  '/sessions',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [sessions] = await connection.execute(
        `SELECT DISTINCT session_id, MIN(created_at) as created_at, MAX(created_at) as last_message
         FROM chat_messages
         WHERE user_id = ?
         GROUP BY session_id
         ORDER BY last_message DESC`,
        [req.userId]
      );

      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sessions' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
