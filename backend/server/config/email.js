import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const EMAIL_FROM = process.env.EMAIL_FROM || "Swadeshi Opticals <id.swadeshi.opticals051@gmail.com>";

/**
 * Thin wrapper so controllers don't need to know about Nodemailer's API shape.
 * Every email in the app goes through this one function.
 */
export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  } catch (err) {
    // We log but don't throw — a failed email shouldn't break the
    // underlying action (e.g. an order should still save even if the
    // confirmation email fails to send).
    console.error("Email send failed:", err.message);
  }
}