import speakeasy from "speakeasy";
import QRCode from "qrcode";

/**
 * Generates a new TOTP secret for the admin, plus a QR code image
 * (as a data URL) that they scan into Google Authenticator / Authy.
 */
export async function generateTotpSecret(adminUsername) {
  const secret = speakeasy.generateSecret({
    name: `Swadeshi Opticals Admin (${adminUsername})`,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    base32Secret: secret.base32, // store this on the Admin document
    qrCodeDataUrl, // send this to the frontend to render as an <img>
  };
}

/**
 * Verifies a 6-digit code the admin typed against their stored secret.
 * `window: 1` allows the code from one time-step before/after, to
 * tolerate small clock drift between server and phone.
 */
export function verifyTotpCode(base32Secret, token) {
  return speakeasy.totp.verify({
    secret: base32Secret,
    encoding: "base32",
    token,
    window: 1,
  });
}
