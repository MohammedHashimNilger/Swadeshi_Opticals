import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { generateToken } from "../server/utils/generateToken.js";
import { generateTotpSecret, verifyTotpCode } from "../server/utils/totp.js";
import { buildWhatsappLink } from "../server/utils/buildWhatsappLink.js";

beforeAll(() => {
  process.env.JWT_SECRET = "test_secret";
});

describe("generateToken", () => {
  it("signs a token containing id and role", () => {
    const token = generateToken({ id: "abc123", role: "customer" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe("abc123");
    expect(decoded.role).toBe("customer");
  });
});

describe("totp", () => {
  it("generates a secret and verifies a code round-trip", async () => {
    const { base32Secret } = await generateTotpSecret("testadmin");
    expect(base32Secret).toBeTruthy();

    // Import speakeasy directly to generate a valid current code for the secret
    const speakeasy = (await import("speakeasy")).default;
    const code = speakeasy.totp({ secret: base32Secret, encoding: "base32" });

    expect(verifyTotpCode(base32Secret, code)).toBe(true);
    expect(verifyTotpCode(base32Secret, "000000")).toBe(false);
  });
});

describe("buildWhatsappLink", () => {
  it("builds a wa.me link containing order details", () => {
    const link = buildWhatsappLink({
      storeWhatsapp: "919999999999",
      order: {
        orderId: "SWO-00001",
        customerName: "Test User",
        customerPhone: "9999999999",
        customerAddress: { fullAddress: "123 Test Street" },
        items: [{ name: "Ray-Ban Clone", quantity: 1, price: 999 }],
        prescription: null,
        specialInstructions: "",
        total: 999,
      },
    });

    expect(link.startsWith("https://wa.me/919999999999?text=")).toBe(true);
    const decoded = decodeURIComponent(link.split("text=")[1]);
    expect(decoded).toContain("SWO-00001");
    expect(decoded).toContain("Test User");
    expect(decoded).toContain("Ray-Ban Clone");
    expect(decoded).toContain("Prescription uploaded: No");
  });
});
