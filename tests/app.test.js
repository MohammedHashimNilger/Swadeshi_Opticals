import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

let app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_secret";
  process.env.MONGODB_URI = "mongodb://127.0.0.1:1/unreachable";
  process.env.CLOUDINARY_CLOUD_NAME = "test";
  process.env.CLOUDINARY_API_KEY = "test";
  process.env.CLOUDINARY_API_SECRET = "test";
  process.env.RESEND_API_KEY = "test";
  process.env.EMAIL_FROM = "test@example.com";
  process.env.GOOGLE_CLIENT_ID = "test";
  process.env.CLIENT_URL = "http://localhost:5173";
  const mod = await import("../server/app.js");
  app = mod.default;
});

describe("health check", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("unknown route", () => {
  it("returns 404 JSON, not a crash", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.message).toBeTruthy();
  });
});

describe("customer order routes require auth", () => {
  it("rejects order creation without a token", async () => {
    const res = await request(app).post("/api/orders");
    expect(res.status).toBe(401);
  });
});

describe("admin routes require auth", () => {
  it("rejects admin order list without a token", async () => {
    const res = await request(app).get("/api/orders/admin/all");
    expect(res.status).toBe(401);
  });
});

describe("mongo operator injection is stripped from body", () => {
  it("does not crash the server on $-prefixed keys", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: { $gt: "" }, password: "x" });
    expect(typeof res.status).toBe("number");
    expect(res.body).toHaveProperty("message");
  });
});
