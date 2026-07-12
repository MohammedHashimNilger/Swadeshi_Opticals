import Settings from "../models/Settings.js";
import { sendEmail } from "../utils/sendEmail.js";

// POST /api/contact — public. Sends the message to the shop's admin
// notification email rather than storing it in the database, since
// there's no admin UI planned for browsing past contact messages.
export async function sendContactMessage(req, res, next) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are all required." });
    }

    const settings = await Settings.getSingleton();

    await sendEmail({
      to: settings.adminNotificationEmail,
      subject: `New contact form message from ${name}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.json({ message: "Message sent. We'll get back to you soon." });
  } catch (err) {
    next(err);
  }
}
