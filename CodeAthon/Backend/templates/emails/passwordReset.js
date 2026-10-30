/**
 * Password Reset Email Template.
 * Provides both responsive HTML and clean plain-text versions.
 *
 * @param {object} params
 * @param {string} params.name - User's name
 * @param {string} params.otp - 6-digit numeric OTP
 * @param {number} params.expiresInMinutes - Expiry time in minutes
 * @returns {{ subject: string, html: string, text: string }}
 */
export function getPasswordResetTemplate({ name, otp, expiresInMinutes = 10 }) {
  const subject = `Your Password Reset Code: ${otp}`;

  const text = `Hello ${name},

We received a request to reset your password for your GST Billing System account.

Your verification code is: ${otp}

This code will expire in ${expiresInMinutes} minutes. If you did not request a password reset, please ignore this email or contact support immediately.

Best regards,
GST Billing System Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 560px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
      padding: 28px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .body {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 16px;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .otp-box {
      margin: 24px 0;
      padding: 20px;
      background-color: #f1f5f9;
      border-radius: 8px;
      text-align: center;
      border: 1px dashed #cbd5e1;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #4f46e5;
      font-family: 'Courier New', Courier, monospace;
    }
    .expiry {
      font-size: 13px;
      color: #64748b;
      margin-top: 8px;
    }
    .warning {
      font-size: 13px;
      color: #64748b;
      border-left: 3px solid #f59e0b;
      padding-left: 12px;
      margin: 20px 0;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding: 20px 28px;
      background-color: #f8fafc;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GST Billing System</h1>
    </div>
    <div class="body">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <p>We received a request to reset your password. Use the verification code below to complete the process:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expiry">Expires in ${expiresInMinutes} minutes</div>
      </div>
      <div class="warning">
        If you did not request this password reset, please ignore this email. Your password will remain unchanged.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} GST Billing System. All rights reserved.
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

export default getPasswordResetTemplate;
