import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let transporterInstance = null;

/**
 * Get or initialize the Nodemailer SMTP transporter for Brevo
 */
const getTransporter = () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(env.SMTP_PORT) || 587;
  const secure = env.SMTP_SECURE === true;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;

  if (!user || !pass) {
    logger.warn('Brevo SMTP credentials (SMTP_USER/SMTP_PASS) not fully configured; emails will not be sent.');
    return null;
  }

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporterInstance;
};

/**
 * Verifies the Brevo SMTP transporter connection
 */
export const verifyConnection = async () => {
  const transporter = getTransporter();
  if (!transporter) {
    return { success: false, message: 'SMTP credentials missing.' };
  }

  try {
    await transporter.verify();
    logger.info('Brevo SMTP connection verified successfully.');
    return { success: true };
  } catch (error) {
    logger.error({ err: error.message }, 'Failed to verify Brevo SMTP connection.');
    return { success: false, error: error.message };
  }
};

/**
 * Common HTML Header & Footer Wrapper for UniMitra emails
 */
const wrapEmailTemplate = (content, previewText = '') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UniMitra</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-subtitle {
      font-size: 13px;
      font-weight: 500;
      color: #e0f2fe;
      margin-top: 6px;
    }
    .body-content {
      padding: 36px 32px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .otp-box {
      background: #eff6ff;
      border: 2px dashed #3b82f6;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #1d4ed8;
      margin: 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background-color: #dbeafe;
      color: #1d4ed8;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-title">UniMitra 🎓</h1>
        <div class="brand-subtitle">বিশ্ববিদ্যালয় শৈক্ষিক AI সহায়ক • Academic Companion</div>
      </div>
      <div class="body-content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569;">UniMitra Intelligent Campus Assistant</p>
        <p style="margin: 0 0 8px 0;">This is an automated notification from UniMitra. Please do not reply directly to this email.</p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} UniMitra. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send an OTP Verification Email via Brevo
 */
export const sendOtpEmail = async ({ to, name = 'Member', otp, role = 'member', reason = 'Verification' }) => {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn({ to, otp }, 'Email transporter not available. OTP logged to console/logger only.');
    return { success: false, reason: 'Transporter not configured.' };
  }

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const subject = `Your UniMitra Verification Code: ${otp}`;
  const preview = `Your UniMitra verification OTP is ${otp}. Valid for 5 minutes.`;

  const htmlContent = `
    <div style="margin-bottom: 20px;">
      <span class="badge">${roleLabel} Access</span>
    </div>
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
      Hello ${name},
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
      We received a request to authenticate your <strong>UniMitra</strong> account for <em>${reason}</em>. Use the one-time verification code below to proceed:
    </p>

    <div class="otp-box">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 1px;">
        One-Time Verification Code
      </div>
      <p class="otp-code">${otp}</p>
      <div style="font-size: 12px; color: #64748b; margin-top: 10px; font-weight: 500;">
        ⏱️ This code will expire in <strong>5 minutes</strong>.
      </div>
    </div>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin: 24px 0 16px 0;">
      <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
        <strong>Security Notice:</strong> UniMitra administrators or support representatives will never ask for your OTP. Do not disclose this code to anyone.
      </p>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 20px 0 0 0;">
      If you did not initiate this request, you can safely disregard this email or update your password if you suspect unauthorized access.
    </p>
  `;

  const mailOptions = {
    from: env.EMAIL_FROM || `"UniMitra" <${env.SENDER_EMAIL || 'yourappmail.co@gmail.com'}>`,
    to,
    subject,
    html: wrapEmailTemplate(htmlContent, preview),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, to, subject }, 'OTP email successfully dispatched via Brevo');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error({ err: error.message, to }, 'Failed to send OTP email via Brevo');
    return { success: false, error: error.message };
  }
};

/**
 * Send a Welcome / Successful Login Notification Email via Brevo
 */
export const sendWelcomeEmail = async ({ to, name = 'Member', role = 'student', memberId = null, loginTime = new Date() }) => {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn({ to }, 'Email transporter not available for welcome email.');
    return { success: false, reason: 'Transporter not configured.' };
  }

  const roleLabel = role === 'super_admin' ? 'Super Administrator' : (role.charAt(0).toUpperCase() + role.slice(1));
  const formattedTime = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  }).format(loginTime);

  const subject = `Welcome to UniMitra | Successful Login Notification`;
  const preview = `Welcome to UniMitra! Your ${roleLabel} account was accessed on ${formattedTime}.`;

  const htmlContent = `
    <div style="margin-bottom: 20px;">
      <span class="badge" style="background-color: #dcfce7; color: #15803d;">Active Session</span>
    </div>
    <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
      Welcome back, ${name}! 👋
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      You have successfully signed in to your <strong>UniMitra ${roleLabel}</strong> account.
    </p>

    <!-- Session Details Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px;">
        🔐 Login Session Details:
      </div>
      <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Account:</td>
          <td style="padding: 4px 0; font-weight: 600;">${to}</td>
        </tr>
        ${memberId ? `
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Member ID:</td>
          <td style="padding: 4px 0; font-weight: 700; color: #1d4ed8;">${memberId}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Designation:</td>
          <td style="padding: 4px 0; font-weight: 600;">${roleLabel}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Timestamp:</td>
          <td style="padding: 4px 0; font-weight: 600;">${formattedTime} IST</td>
        </tr>
      </table>
    </div>

    <!-- UniMitra Assistant Features Card -->
    <div style="border: 1px solid #dbeafe; background: #f0f9ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #0369a1; margin: 0 0 10px 0;">
        💡 What you can do with UniMitra:
      </h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #0f766e; line-height: 1.7;">
        <li><strong>Bilingual Voice AI:</strong> Ask academic questions in pure Assamese (অসমীয়া), Romanized Assamese, or English.</li>
        <li><strong>Instant Statutory Knowledge:</strong> Check university ordinances, exam regulations, attendance clauses, and hostel rules.</li>
        <li><strong>Official Circulars:</strong> View real-time gazettes, syllabus notices, and event announcements.</li>
      </ul>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
      If you did not initiate this login, please change your password immediately or contact your university administrator.
    </p>
  `;

  const mailOptions = {
    from: env.EMAIL_FROM || `"UniMitra" <${env.SENDER_EMAIL || 'yourappmail.co@gmail.com'}>`,
    to,
    subject,
    html: wrapEmailTemplate(htmlContent, preview),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, to, subject }, 'Welcome/login notification email sent via Brevo');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error({ err: error.message, to }, 'Failed to send welcome email via Brevo');
    return { success: false, error: error.message };
  }
};

export const emailService = {
  verifyConnection,
  sendOtpEmail,
  sendWelcomeEmail,
};

