import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Settings defaults contain the real shop contact info", () => {
  const content = fs.readFileSync(path.resolve("server/models/Settings.js"), "utf-8");

  it("has the correct WhatsApp number in international format", () => {
    expect(content).toContain("919413460346");
  });

  it("has the correct admin/store email", () => {
    expect(content).toContain("id.swadeshi.opticals051@gmail.com");
  });

  it("has the correct shop address", () => {
    expect(content).toContain("51, Rana Sanga Market");
    expect(content).toContain("312001");
  });
});
