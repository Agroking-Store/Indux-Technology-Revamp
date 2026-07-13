import nodemailer from "nodemailer";
import { env } from "../config/env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
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
    from: `"Indux Technology" <${env.SMTP_USER}>`,
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
