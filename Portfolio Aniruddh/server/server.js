// ============================================================
//  PORTFOLIO BACKEND — server.js
//  Express + MongoDB + Nodemailer
//  Contact Form API with Email Notifications
// ============================================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (the portfolio)
app.use(express.static(path.join(__dirname, '..')));

// ── Rate Limiting ──
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per IP per 15 min
  message: { success: false, message: 'Too many messages. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ── Nodemailer Transport ──
let transporter;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  console.log('✅ Email transport configured');
} else {
  console.log('⚠️  Email transport not configured (set GMAIL_USER and GMAIL_APP_PASSWORD in .env)');
}

// ── Validation Rules ──
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('role').optional().trim().isLength({ max: 100 }),
  body('budget').optional().trim().isLength({ max: 50 }),
];

// ── API: POST /api/contact ──
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, company, role, budget, message } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || '';

    // Save to database (optional)
    let contactId = null;
    try {
      if (mongoose.connection.readyState === 1) {
        const contact = await Contact.create({
          name, email, company, role, budget, message, ip,
        });
        contactId = contact._id;
      } else {
        console.log('⚠️  Database offline. Skipping database save, sending email only.');
      }
    } catch (dbErr) {
      console.error('⚠️  Database save failed:', dbErr.message);
    }

    console.log(`📬 New message from ${name} (${email})`);

    // Send email notifications (non-blocking)
    if (transporter) {
      // 1. Notification to Aniruddh
      const notifMail = {
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🚀 New Portfolio Message from ${name}`,
        html: `
          <div style="font-family:system-ui;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px">
            <h2 style="color:#3b82f6;margin-bottom:24px">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#94a3b8;width:120px"><strong>Name:</strong></td><td style="padding:8px 0">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8"><strong>Email:</strong></td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#3b82f6">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#94a3b8"><strong>Company:</strong></td><td style="padding:8px 0">${company}</td></tr>` : ''}
              ${role ? `<tr><td style="padding:8px 0;color:#94a3b8"><strong>Role:</strong></td><td style="padding:8px 0">${role}</td></tr>` : ''}
              ${budget ? `<tr><td style="padding:8px 0;color:#94a3b8"><strong>Budget:</strong></td><td style="padding:8px 0">${budget}</td></tr>` : ''}
            </table>
            <div style="margin-top:20px;padding:20px;background:rgba(59,130,246,0.1);border-radius:12px;border:1px solid rgba(59,130,246,0.2)">
              <p style="color:#94a3b8;margin:0 0 8px;font-size:13px;font-weight:700">MESSAGE:</p>
              <p style="margin:0;line-height:1.7;white-space:pre-wrap">${message}</p>
            </div>
            <p style="margin-top:20px;font-size:12px;color:#475569">Sent from your portfolio contact form</p>
          </div>
        `,
      };

      // 2. Thank-you email to sender
      const thankYouMail = {
        from: `"Aniruddh Parmar" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}! 🙌`,
        html: `
          <div style="font-family:system-ui;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px">
            <h2 style="color:#3b82f6;margin-bottom:16px">Thanks for your message, ${name}!</h2>
            <p style="color:#94a3b8;line-height:1.7">I've received your message and will get back to you within <strong style="color:#f1f5f9">24 hours</strong>. I appreciate you taking the time to reach out.</p>
            <p style="color:#94a3b8;line-height:1.7">In the meantime, feel free to check out my work:</p>
            <div style="margin:20px 0">
              <a href="https://github.com/aniruddh209" style="display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px">View My GitHub →</a>
            </div>
            <p style="margin-top:24px;color:#94a3b8">Best regards,<br><strong style="color:#f1f5f9">Aniruddh Parmar</strong><br>Full Stack Developer & Teaching Assistant</p>
          </div>
        `,
      };

      // Send both emails (non-blocking)
      Promise.all([
        transporter.sendMail(notifMail),
        transporter.sendMail(thankYouMail),
      ]).then(() => {
        console.log('✅ Emails sent successfully');
      }).catch(err => {
        console.error('⚠️  Email sending failed:', err.message);
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      id: contactId,
    });

  } catch (error) {
    console.error('❌ Contact form error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
});

// ── API: GET /api/contacts (Admin) ──
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running on http://localhost:${PORT}\n`);
});
