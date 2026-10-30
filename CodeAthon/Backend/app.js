import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import env, { validateEnv } from './config/env.js';
import connectDB from './config/db.js';
import notFoundHandler from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import { sendSuccess } from './utils/apiResponse.js';
import authRoutes from './routes/auth.routes.js';
import shopRoutes from './routes/shop.routes.js';
import userRoutes from './routes/user.routes.js';
import partyRoutes from './routes/party.routes.js';
import itemRoutes from './routes/item.routes.js';
import billRoutes from './routes/bill.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// ─── Validate environment variables ───
validateEnv();

// ─── Create Express app ───
const app = express();

// ─── Security Middleware ───
app.use(helmet());

// ─── CORS ───
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ─── Body Parsing ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Cookie Parsing ───
app.use(cookieParser());

// ──────────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────────

// Health check — no auth required
app.get('/api/health', (_req, res) => {
  sendSuccess(res, 200, 'GST Billing API is running', {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes (signup, login, logout, me, password reset)
app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ──────────────────────────────────────────────

// ─── 404 Handler (after all routes) ───
app.use(notFoundHandler);

// ─── Global Error Handler (must be last) ───
app.use(errorHandler);

// ─── Start Server ───
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(env.PORT, () => {
      console.log('');
      console.log('  ═══════════════════════════════════════');
      console.log('  ║       GST BILLING SYSTEM API        ║');
      console.log('  ═══════════════════════════════════════');
      console.log(`  Environment: ${env.NODE_ENV}`);
      console.log(`  Server:      http://localhost:${env.PORT}`);
      console.log(`  Health:      http://localhost:${env.PORT}/api/health`);
      console.log(`  Client:      ${env.CLIENT_URL}`);
      console.log('  ═══════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
