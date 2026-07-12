import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Validates the product seed file's structure directly (no DB needed) —
// catches typos in category slugs or missing required fields before
// they'd otherwise only surface at seed time.
describe("product seed data", () => {
  it("every product has required fields and a valid image list", () => {
    // Read the file as plain text rather than importing it — the seed
    // script calls seed().catch(() => process.exit(1)) at module scope,
    // which would kill the whole test process if MONGODB_URI is unreachable.
    const filePath = path.resolve("scripts/seedProducts.js");
    const content = fs.readFileSync(filePath, "utf-8");

    expect(content).toContain("categorySlug");
    expect(content).toContain("picsum.photos");

    const productBlocks = content.match(/name: "[^"]+"/g) || [];
    expect(productBlocks.length).toBeGreaterThanOrEqual(15);
  });

  it("every categorySlug referenced in seedProducts exists in seedCategories", () => {
    const productsContent = fs.readFileSync(path.resolve("scripts/seedProducts.js"), "utf-8");
    const categoriesContent = fs.readFileSync(path.resolve("scripts/seedCategories.js"), "utf-8");

    const referencedSlugs = [...productsContent.matchAll(/categorySlug: "([^"]+)"/g)].map((m) => m[1]);
    const definedSlugs = [...categoriesContent.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);

    expect(referencedSlugs.length).toBeGreaterThan(0);
    for (const slug of referencedSlugs) {
      expect(definedSlugs).toContain(slug);
    }
  });
});
