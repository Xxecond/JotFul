import dotenv from "dotenv";
dotenv.config(); // load variables from .env

import { sendVerificationEmail } from "./sendEmail.js"; // make sure path is correct

console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass:", process.env.EMAIL_PASS);

sendVerificationEmail("halseywrld999@gmail.com", "test-token")
  .then(() => console.log("Email sent"))
  .catch(err => console.error("Email error:", err));
