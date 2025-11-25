import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      'Missing email credentials. Set EMAIL_USER and EMAIL_PASS in your environment.'
    );
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendVerificationEmail(toEmail, token) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const verifyURL = `${baseURL}/api/auth/verify-email?token=${token}`;

  const message = `
    <h2>Verify Your Email</h2>
    <p>Click the button below to confirm your account:</p>
    <a href="${verifyURL}" 
       style="display:inline-block;background:#4CAF50;color:white;
              padding:10px 16px;border-radius:8px;text-decoration:none;">
       ✅ Yes, it's me
    </a>
    <p>If you didn’t request this, ignore this email.</p>
  `;

  const t = getTransporter();

  await t.sendMail({
    from: `"jotFul" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your jotFul account",
    html: message,
  });
}
