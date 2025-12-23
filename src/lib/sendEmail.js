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

  transporter = nodemailer.createTransport({  // no "r"
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMagicLinkEmail(toEmail, magicLink) {
  const message = `
    <h2>Log in to jotFul</h2>
    <p>Click the button below to log in:</p>
    <a href="${magicLink}"
       style="display:inline-block;background:#000000;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;">
       Log in now
    </a>
    <p>Link expires in 15 minutes.</p>
    <p>If you didn’t request this, ignore it.</p>
  `;

  const t = getTransporter();

  await t.sendMail({
    from: `"jotFul" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your jotFul magic login link",
    html: message,
  });
}