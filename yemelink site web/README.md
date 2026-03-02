# YEMELINK - Full Stack Web Application

**Status**: Complete Production-Ready Application
**Stack**: React + Node.js + MySQL
**Deployment Ready**: Yes

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Development Setup](#development-setup)
5. [Database Setup](#database-setup)
6. [Backend Configuration](#backend-configuration)
7. [Frontend Configuration](#frontend-configuration)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Deployment Guide](#deployment-guide)
11. [Features](#features)
12. [Environment Variables](#environment-variables)
13. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd yemelink-fullstack
npm run install-all

# 2. Setup databases
npm run db:setup
npm run db:seed

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start development
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
yemelink-fullstack/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── index.ts        # Main server entry
│   │   ├── database/       # Database config & schema
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (email, payments)
│   │   └── utils/          # Helpers, error handling
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # React application
│   ├── src/
│   │   ├── main.tsx        # Entry point
│   │   ├── App.tsx         # Router setup
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API clients
│   │   ├── store/          # Zustand state management
│   │   ├── theme/          # Design tokens
│   │   └── index.css       # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env.example
│
├── package.json            # Workspace root
└── README.md              # This file
```

---

## 💾 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MySQL** 8.0+
- **Git**

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd yemelink-fullstack
```

### Step 2: Install Dependencies

```bash
# Install all workspace dependencies
npm run install-all

# Or individual workspaces:
npm install --workspace=frontend
npm install --workspace=backend
```

---

## ⚙️ Development Setup

### 1. MySQL Database Setup

```bash
# Start MySQL
# macOS (Homebrew)
brew services start mysql

# Windows (via installer)
# Start MySQL Workbench or MySQL Command Line Client

# Ubuntu/Debian
sudo systemctl start mysql

# Connect to MySQL and create database:
mysql -u root -p
CREATE DATABASE yemelink;
USE yemelink;
```

### 2. Backend Configuration

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Key variables to update:
# - DB_HOST=localhost
# - DB_USER=root
# - DB_PASSWORD=your_password
# - DB_NAME=yemelink
# - SMTP_* for email configuration
# - OPENAI_API_KEY for AI chat
# - STRIPE_* for payments
```

### 3. Frontend Configuration

```bash
cd frontend

# Copy environment template
cp .env.example .env

# Edit .env:
# - VITE_API_BASE_URL=http://localhost:5000/api
# - VITE_STRIPE_PUBLIC_KEY=your_public_key
```

---

## 🗄️ Database Setup

### Create Tables and Seed Data

```bash
# From root directory
npm run db:setup    # Creates all tables
npm run db:seed     # Populates demo data
```

### Demo Credentials

After seeding, you can login with:

**Admin Account:**
- Email: `admin@yemelink.test`
- Password: `Yemelink123!`

**Demo User:**
- Email: `demo@yemelink.test`
- Password: `Demo123!`

### Database Tables

The following tables are automatically created:

- `users` - User accounts and profiles
- `projects` - Portfolio projects
- `services` - Service offerings
- `posts` - Community feed posts
- `comments` - Post comments
- `likes` - Post/comment likes
- `articles` - Blog articles
- `quote_requests` - Customer quote requests
- `chat_messages` - AI chat history
- `payments` - Payment records
- `subscriptions` - User subscriptions
- `reports` - Content moderation reports
- `analytics` - Application analytics

---

## 🔑 Backend Configuration

### Essential Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yemelink

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Email (Gmail SMTP example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use Gmail app password, not regular password
SMTP_FROM=noreply@yemelink.com
CONTACT_EMAIL=yemelink@gmail.com

# WhatsApp
WHATSAPP_NUMBER=+905057404314

# OpenAI (for AI Chat)
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-3.5-turbo

# Stripe (for payments)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx
STRIPE_PREMIUM_MONTHLY_PRICE=price_1234567890
STRIPE_PREMIUM_YEARLY_PRICE=price_0987654321

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
```

### API Endpoints

**Authentication Routes:**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

**Projects Routes:**
- `GET /api/projects` - List all projects (paginated)
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:slug` - Get single project

**Services Routes:**
- `GET /api/services` - List all services
- `GET /api/services/:slug` - Get single service
- `GET /api/services/category/:category` - Filter by category

**Posts (Community Feed) Routes:**
- `GET /api/posts` - Get feed (paginated)
- `POST /api/posts` - Create post (auth required)
- `POST /api/posts/:postId/like` - Like/unlike post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/comments` - Add comment

**Articles Routes:**
- `GET /api/articles` - List articles (paginated)
- `GET /api/articles/featured` - Get featured articles
- `GET /api/articles/:slug` - Get single article
- `GET /api/articles/search/:query` - Search articles

**Contact Routes:**
- `POST /api/contact/message` - Send contact message
- `POST /api/contact/quote` - Submit quote request

**Chat Routes:**
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history/:session_id` - Get chat history
- `GET /api/chat/sessions` - Get all sessions

**Payments Routes:**
- `POST /api/payments/create-checkout` - Create Stripe session
- `GET /api/payments/subscription` - Get subscription status
- `POST /api/payments/webhook` - Stripe webhook handler

**Admin Routes (requires admin role):**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/posts/:postId` - Delete post
- `PATCH /api/admin/posts/:postId/pin` - Pin/unpin post
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/:articleId` - Update article
- `DELETE /api/admin/articles/:articleId` - Delete article
- `GET /api/admin/reports` - Get moderation reports

---

## 🎨 Frontend Configuration

### Theme & Design Tokens

All design tokens are defined in `frontend/src/theme/tokens.ts`:

```typescript
- Primary Color: #00bcd4 (Cyan)
- Secondary: #0a0f1a (Dark Navy)
- Typography: Inter + Poppins fonts
- Border Radius: 16px (default)
- Animations: Smooth, 400ms easing
```

### Components

Pre-built reusable components:

- `Button` - Primary/secondary buttons
- `Card` - Content cards with glass effect
- `Navigation` - Top navigation with mobile menu
- `Footer` - Site footer with social links
- `Notification` - Toast notifications
- `Layout` - Main page layout wrapper

### Styling Approach

- **Tailwind CSS** for utility styles
- **CSS Modules** for component-specific styles
- **Framer Motion** for animations
- **Glassmorphism** effects for modern UI

---

## 🏃 Running the Application

### Development Mode

```bash
# From root directory
npm run dev

# Or separately:
npm run dev:backend  # API runs on http://localhost:5000
npm run dev:frontend # React app on http://localhost:3000
```

### Build for Production

```bash
npm run build

# Build individual workspaces:
npm run build:backend
npm run build:frontend
```

### Production Run

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/auth/me
```

### Error Responses

API returns consistent error format:

```json
{
  "error": "Error message",
  "status": 400
}
```

### Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Chat endpoint: 20 requests per minute
- Contact/Quote endpoints: Standard limit

---

## 🌐 Deployment Guide

### Option 1: Deploy to Vercel (Recommended for Frontend)

**Frontend Deployment:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel

# 3. Configure environment variables in Vercel dashboard
# Set VITE_API_BASE_URL to your backend URL
```

### Option 2: Deploy to Render or Railway (Backend + Frontend)

**Backend Setup:**

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy (automatic on git push)

**Frontend Setup:**

1. Same as above
2. Connect to backend API via environment variable

### Option 3: Deploy to Your Own Server

**Prerequisites:**
- Ubuntu/Debian server
- Node.js 18+
- MySQL 8+
- Nginx/Apache (as reverse proxy)
- SSL certificate (Let's Encrypt)

**Backend Deployment:**

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone <your-repo-url>
cd yemelink-fullstack/backend

# Install and build
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name "yemelink-api"
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Frontend Deployment:**

```bash
# Build
cd frontend
npm run build

# Deploy dist/ folder to web server
# Use Nginx or Apache to serve static files
```

### Environment Variables for Production

Update these in your hosting platform:

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DB_HOST=your-mysql-server.com
JWT_SECRET=generate-a-strong-random-key
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-live-stripe-key
STRIPE_PUBLIC_KEY=your-live-stripe-public-key
```

---

## ✨ Key Features

### ✅ Implemented

- [x] Modern React UI with smooth animations
- [x] Responsive design (mobile + desktop)
- [x] User authentication (email/password)
- [x] Community feed with posts, comments, likes
- [x] Blog system with articles
- [x] Portfolio/Projects showcase
- [x] Services listing and details
- [x] AI Chat assistant (OpenAI integration)
- [x] Contact & quote request forms
- [x] Email notifications
- [x] Admin dashboard
- [x] Payment integration (Stripe ready)
- [x] Premium subscriptions
- [x] Content moderation tools
- [x] Analytics tracking
- [x] Smooth scroll effects
- [x] Dark mode theme (default)
- [x] Global state management
- [x] Error handling & validation
- [x] Rate limiting
- [x] Security middleware

### 🔄 To Complete (Customization)

- [ ] Upload remaining placeholder pages
- [ ] Configure email service
- [ ] Setup OpenAI integration
- [ ] Configure Stripe keys
- [ ] Add real project images
- [ ] Customize blog articles
- [ ] Add actual portfolio projects
- [ ] Setup admin email notifications
- [ ] Configure push notifications
- [ ] Add analytics tracking

---

## 🔧 Troubleshooting

### MySQL Connection Error

```bash
# Check MySQL is running
mysql -h localhost -u root -p -e "SELECT 1;"

# Reset root password if needed
# macOS:
mysql_secure_installation

# Ubuntu:
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Port Already in Use

```bash
# Check what's using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### CORS Errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL:

```env
FRONTEND_URL=http://localhost:3000  # Development
FRONTEND_URL=https://yourdomain.com  # Production
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run install-all
```

### Build Errors

```bash
# Clear build cache
rm -rf backend/dist frontend/dist

# Rebuild
npm run build
```

---

## 📞 Support & Contact

- 📧 Email: yemelink@gmail.com
- 📱 WhatsApp: +905057404314
- 🌐 Website: https://yemelink.com
- 📱 Instagram: @yemelink2000

---

## 📄 License

This project is proprietary to YEMELINK. All rights reserved.

---

## 🎯 Next Steps

1. **Customize Brand**: Update logo, colors, and content
2. **Setup Services**: Configure payment processing
3. **Setup Email**: Configure SMTP for notifications
4. **Setup AI**: Add OpenAI API key for chat
5. **Deploy**: Choose hosting platform and deploy
6. **Monitor**: Setup analytics and monitoring
7. **Scale**: Add caching, CDN, and optimize performance

---

## 🚀 Performance Optimization

### Frontend

- Code splitting with Vite
- Image optimization & lazy loading
- CSS optimization with purging
- JavaScript minification
- Caching strategies

### Backend

- Database indexing
- Connection pooling
- Caching with Redis (optional)
- API response compression
- Rate limiting

---

**Made with ❤️ by YEMELINK Development Team**
