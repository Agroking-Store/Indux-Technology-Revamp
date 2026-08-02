import nodemailer from "nodemailer";
import { env } from "../config/env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: env.SMTP_PORT || 587,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  // If no SMTP credentials are provided, simply log and skip to prevent app crash
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("SMTP credentials not found, skipping email send.");
    return;
  }

  const mailOptions = {
    from: `"Indux Technology" <${env.SENDER_EMAIL || env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.to}`);
  } catch (error) {
    console.error(`Failed to send email to ${options.to}:`, error);
    throw new Error("Email sending failed");
  }
};
