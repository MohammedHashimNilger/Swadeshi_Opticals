/**
 * One-time script to populate the Category collection with the full
 * category tree approved in the SRS. Run with: node scripts/seedCategories.js
 * Safe to re-run — it skips any slug that already exists.
 */
import "dotenv/config";
import mongoose from "mongoose";
import Category from "../server/models/Category.js";

const CATEGORY_TREE = [
  {
    name: "Eyeglasses",
    slug: "eyeglasses",
    icon: "IconEyeglass",
    children: [
      { name: "Men", slug: "eyeglasses-men" },
      { name: "Women", slug: "eyeglasses-women" },
      { name: "Kids", slug: "eyeglasses-kids" },
    ],
  },
  {
    name: "Frames",
    slug: "frames",
    icon: "IconBox",
    children: [
      { name: "Full Rim", slug: "frames-full-rim" },
      { name: "Half Rim", slug: "frames-half-rim" },
      { name: "Rimless", slug: "frames-rimless" },
      { name: "Metal", slug: "frames-metal" },
      { name: "Plastic", slug: "frames-plastic" },
      { name: "Titanium", slug: "frames-titanium" },
      { name: "TR90", slug: "frames-tr90" },
      { name: "Acetate", slug: "frames-acetate" },
    ],
  },
  {
    name: "Lenses",
    slug: "lenses",
    icon: "IconCircleDot",
    children: [
      { name: "Single Vision", slug: "lenses-single-vision" },
      { name: "Bifocal", slug: "lenses-bifocal" },
      { name: "Progressive", slug: "lenses-progressive" },
      { name: "Blue Cut", slug: "lenses-blue-cut" },
      { name: "Computer Glasses", slug: "lenses-computer-glasses" },
      { name: "Anti-Glare", slug: "lenses-anti-glare" },
      { name: "UV Protection", slug: "lenses-uv-protection" },
      { name: "Photochromic", slug: "lenses-photochromic" },
      { name: "High Index", slug: "lenses-high-index" },
    ],
  },
  {
    name: "Sunglasses",
    slug: "sunglasses",
    icon: "IconSun",
    children: [
      { name: "Men", slug: "sunglasses-men" },
      { name: "Women", slug: "sunglasses-women" },
      { name: "Kids", slug: "sunglasses-kids" },
      { name: "Polarized", slug: "sunglasses-polarized" },
      { name: "UV400", slug: "sunglasses-uv400" },
    ],
  },
  {
    name: "Contact Lenses",
    slug: "contact-lenses",
    icon: "IconEye",
    children: [
      { name: "Daily", slug: "contact-lenses-daily" },
      { name: "Monthly", slug: "contact-lenses-monthly" },
      { name: "Yearly", slug: "contact-lenses-yearly" },
      { name: "Colored", slug: "contact-lenses-colored" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: "IconBriefcase",
    children: [
      { name: "Cases", slug: "accessories-cases" },
      { name: "Cleaning Cloth", slug: "accessories-cleaning-cloth" },
      { name: "Lens Cleaner", slug: "accessories-lens-cleaner" },
      { name: "Chains", slug: "accessories-chains" },
      { name: "Repair Kits", slug: "accessories-repair-kits" },
    ],
  },
  // Collections — top-level, no children, used for homepage sections/filters
  { name: "New Arrivals", slug: "new-arrivals", icon: "IconSparkles" },
  { name: "Best Sellers", slug: "best-sellers", icon: "IconFlame" },
  { name: "Premium Collection", slug: "premium-collection", icon: "IconCrown" },
  { name: "Budget Collection", slug: "budget-collection", icon: "IconTag" },
];

async function upsertCategory({ name, slug, icon, parentCategory = null, displayOrder = 0 }) {
  const existing = await Category.findOne({ slug });
  if (existing) return existing;
  return Category.create({ name, slug, icon, parentCategory, displayOrder });
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Seeding categories...");

  let order = 0;
  for (const top of CATEGORY_TREE) {
    const parent = await upsertCategory({
      name: top.name,
      slug: top.slug,
      icon: top.icon,
      displayOrder: order++,
    });
    console.log(`✓ ${parent.name}`);

    for (const child of top.children || []) {
      await upsertCategory({
        name: child.name,
        slug: child.slug,
        parentCategory: parent._id,
        displayOrder: order++,
      });
      console.log(`  ↳ ${child.name}`);
    }
  }

  console.log("Done seeding categories.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
