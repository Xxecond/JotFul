 // lib/sendEmail.js
import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in .env');
  }

  transporter = nodemailer.createTransport({  // fixed typo
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMagicLinkEmail(toEmail, magicLink, sessionId = null) {
  // Add sessionId to magic link if provided for cross-device auth
  const yesLink = sessionId ? `${magicLink}&sessionId=${sessionId}&action=approve` : `${magicLink}&action=approve`;
  const noLink = sessionId ? `${magicLink}&sessionId=${sessionId}&action=deny` : `${magicLink}&action=deny`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Someone is trying to log in to jotFul</h2>
      <p>Was this you?</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${yesLink}"
           style="display:inline-block;background:#22c55e;color:white;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:10px;">
           ✓ Yes, it's me
        </a>
        
        <a href="${noLink}"
           style="display:inline-block;background:#ef4444;color:white;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;margin:10px;">
           ✗ No, it's not me
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">This request expires in 15 minutes.</p>
      <p style="font-size: 12px; color: #999;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const t = getTransporter();

  await t.sendMail({
    from: `"jotFul" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "jotFul Login Verification",
    html: message,
  });
}