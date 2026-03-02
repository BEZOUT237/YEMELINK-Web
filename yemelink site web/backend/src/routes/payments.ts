import express, { Router } from 'express';
import Stripe from 'stripe';
import { pool } from '../database/config.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/errors.js';
import { sendPaymentConfirmation } from '../services/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const router: Router = express.Router();

const SUBSCRIPTION_PLANS = {
  premium_monthly: {
    price_id: process.env.STRIPE_PREMIUM_MONTHLY_PRICE || 'price_test',
    amount: 4900,
    period: 'monthly'
  },
  premium_yearly: {
    price_id: process.env.STRIPE_PREMIUM_YEARLY_PRICE || 'price_test',
    amount: 49900,
    period: 'yearly'
  }
};

// Create checkout session
router.post(
  '/create-checkout',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { plan } = req.body;

    if (!SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const connection = await pool.getConnection();

    try {
      // Get user email
      const [users] = await connection.execute(
        'SELECT email FROM users WHERE id = ?',
        [req.userId]
      );

      const userEmail = (users as any)[0]?.email;

      const session = await stripe.checkout.sessions.create({
        customer_email: userEmail,
        payment_method_types: ['card'],
        line_items: [
          {
            price: SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS].price_id,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-canceled`,
        metadata: {
          userId: req.userId.toString(),
          plan
        }
      });

      // Save pending payment record
      await connection.execute(
        `INSERT INTO payments (user_id, stripe_session_id, status, subscription_type, amount)
         VALUES (?, ?, 'pending', ?, ?)`,
        [
          req.userId,
          session.id,
          plan,
          SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS].amount
        ]
      );

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    } finally {
      await connection.release();
    }
  })
);

// Get subscription status
router.get(
  '/subscription',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const connection = await pool.getConnection();

    try {
      const [subscriptions] = await connection.execute(
        `SELECT id, subscription_type, status, current_period_start, current_period_end
         FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC`,
        [req.userId]
      );

      const subscription = (subscriptions as any)[0];

      if (subscription) {
        res.json({
          has_subscription: true,
          subscription: {
            type: subscription.subscription_type,
            status: subscription.status,
            expiry: subscription.current_period_end
          }
        });
      } else {
        res.json({ has_subscription: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subscription' });
    } finally {
      await connection.release();
    }
  })
);

// Webhook handler for Stripe events
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as any).message}`);
    }

    const connection = await pool.getConnection();

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update payment status
        await connection.execute(
          `UPDATE payments SET status = 'completed', stripe_payment_intent_id = ?
           WHERE stripe_session_id = ?`,
          [session.payment_intent, session.id]
        );

        // Create subscription record
        const metadata = session.metadata as any;
        const userId = parseInt(metadata.userId);
        const plan = metadata.plan;

        await connection.execute(
          `INSERT INTO subscriptions (user_id, subscription_type, stripe_subscription_id, status)
           VALUES (?, ?, ?, 'active')`,
          [userId, plan, session.subscription]
        );

        // Send confirmation email
        const [users] = await connection.execute(
          'SELECT email FROM users WHERE id = ?',
          [userId]
        );
        await sendPaymentConfirmation((users as any)[0].email, {
          amount: session.amount_total,
          subscription_type: plan,
          status: 'completed'
        });
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    } finally {
      await connection.release();
    }
  })
);

export default router;
