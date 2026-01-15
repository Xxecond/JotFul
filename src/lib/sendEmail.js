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
  // Create simple tracking URLs
  const yesUrl = sessionId ? `${magicLink}&sessionId=${sessionId}&action=approve` : `${magicLink}&action=approve`;
  const noUrl = sessionId ? `${magicLink}&sessionId=${sessionId}&action=deny` : `${magicLink}&action=deny`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Someone is trying to log in to jotFul</h2>
      <p>Was this you?</p>
      
      <div style="display: flex; justify-content: center; text-align: center; gap:12px; margin: 30px 0;">
              <a href="${yesUrl}" 
              style="flex-1; text-align:center; display:inline-block;background:#22c55e;color:white;padding:12px 0;border-radius:8px;text-decoration:none;font-weight:bold;">
                Yes, it's me
              </a>
              <a href="${noUrl}" 
              style="flex-1; text-align: center; display:inline-block;background:#ef4444;color:white;padding:12px 0;border-radius:8px;text-decoration:none;font-weight:bold;">
              No, it's not me
              </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">This request expires in 15 minutes.</p>
      <p style="font-size: 12px; color: #999;">Clicking will open a minimal confirmation page that you can close immediately.</p>
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