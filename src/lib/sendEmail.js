import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",       // or your email provider SMTP
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,  // your email
    pass: process.env.EMAIL_PASS,  // app password
  },
});

export async function sendVerificationEmail(toEmail, token) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const verifyURL = `${baseURL}/verify-email?token=${token}`;

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

  await transporter.sendMail({
    from: `"Blogger Web" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your Blogger Web account",
    html: message,
  });
}
