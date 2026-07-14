/**
 * Seeds sample products with real (hotlinkable, license-free) placeholder
 * photos from Picsum so the storefront looks fully populated immediately
 * after setup — no Cloudinary upload needed for this demo data. Real
 * products added later through the admin panel will use Cloudinary as
 * designed. Run with: node scripts/seedProducts.js
 * Safe to re-run — it skips any slug that already exists.
 */
import "dotenv/config";
import mongoose from "mongoose";
import Product from "../server/models/Product.js";
import Category from "../server/models/Category.js";

function img(seed, n) {
  return Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/800`);
}

const PRODUCTS = [
  {
    name: "Classic Round Eyeglasses",
    slug: "classic-round-eyeglasses",
    description: "A timeless round frame in matte acetate, comfortable for all-day wear.",
    categorySlug: "eyeglasses-men",
    price: 1499,
    discountPrice: 1199,
    stock: 25,
    prescriptionRequired: true,
    images: img("round-eyeglasses", 3),
    specifications: { frameSize: "Medium", frameMaterial: "Acetate", lensType: "Single Vision", gender: "Men", brand: "Swadeshi Basics", color: "Black", weight: "18g", dimensions: "140mm width", shape: "Round" },
  },
  {
    name: "Cat-Eye Statement Frame",
    slug: "cat-eye-statement-frame",
    description: "Bold cat-eye silhouette with a glossy tortoise finish.",
    categorySlug: "eyeglasses-women",
    price: 1799,
    stock: 18,
    prescriptionRequired: true,
    images: img("cateye-frame", 3),
    specifications: { frameSize: "Medium", frameMaterial: "Acetate", lensType: "Single Vision", gender: "Women", brand: "Swadeshi Studio", color: "Tortoise", weight: "16g", dimensions: "138mm width", shape: "Cat-Eye" },
  },
  {
    name: "Kids Flexible Frame",
    slug: "kids-flexible-frame",
    description: "Durable, bendable frame built for active kids.",
    categorySlug: "eyeglasses-kids",
    price: 999,
    stock: 30,
    prescriptionRequired: true,
    images: img("kids-frame", 2),
    specifications: { frameSize: "Small", frameMaterial: "TR90", lensType: "Single Vision", gender: "Kids", brand: "Swadeshi Junior", color: "Blue", weight: "12g", dimensions: "125mm width", shape: "Round" },
  },
  {
    name: "Titanium Rimless Frame",
    slug: "titanium-rimless-frame",
    description: "Ultra-lightweight rimless design in premium titanium.",
    categorySlug: "frames-rimless",
    price: 2999,
    discountPrice: 2499,
    stock: 12,
    prescriptionRequired: true,
    images: img("titanium-rimless", 3),
    specifications: { frameSize: "Medium", frameMaterial: "Titanium", lensType: "Single Vision", gender: "Unisex", brand: "Swadeshi Premium", color: "Silver", weight: "9g", dimensions: "142mm width", shape: "Rimless" },
  },
  {
    name: "Full Rim Metal Frame",
    slug: "full-rim-metal-frame",
    description: "Classic full-rim metal frame with adjustable nose pads.",
    categorySlug: "frames-full-rim",
    price: 1699,
    stock: 20,
    prescriptionRequired: true,
    images: img("full-rim-metal", 2),
    specifications: { frameSize: "Medium", frameMaterial: "Metal", lensType: "Single Vision", gender: "Unisex", brand: "Swadeshi Basics", color: "Gunmetal", weight: "14g", dimensions: "140mm width", shape: "Full Rim" },
  },
  {
    name: "Progressive Lens Pack",
    slug: "progressive-lens-pack",
    description: "High-quality progressive lenses for seamless near and far vision.",
    categorySlug: "lenses-progressive",
    price: 2200,
    stock: 40,
    prescriptionRequired: true,
    images: img("progressive-lens", 2),
    specifications: { lensType: "Progressive", gender: "Unisex", brand: "Swadeshi Optics" },
  },
  {
    name: "Blue Light Computer Lenses",
    slug: "blue-light-computer-lenses",
    description: "Reduces digital eye strain during long screen hours.",
    categorySlug: "lenses-computer-glasses",
    price: 1200,
    discountPrice: 999,
    stock: 50,
    prescriptionRequired: true,
    images: img("blue-light-lens", 2),
    specifications: { lensType: "Computer Glasses", gender: "Unisex", brand: "Swadeshi Optics" },
  },
  {
    name: "Aviator Polarized Sunglasses",
    slug: "aviator-polarized-sunglasses",
    description: "Classic aviator shape with true polarized UV400 protection.",
    categorySlug: "sunglasses-polarized",
    price: 1899,
    discountPrice: 1599,
    stock: 22,
    prescriptionRequired: false,
    images: img("aviator-sunglasses", 3),
    specifications: { frameSize: "Medium", frameMaterial: "Metal", lensType: "UV Protection", gender: "Unisex", brand: "Swadeshi Sun", color: "Gold", weight: "22g", dimensions: "145mm width" },
  },
  {
    name: "Women's Oversized Sunglasses",
    slug: "womens-oversized-sunglasses",
    description: "Trendy oversized frame with gradient tinted lenses.",
    categorySlug: "sunglasses-women",
    price: 1399,
    stock: 16,
    prescriptionRequired: false,
    images: img("oversized-sunglasses", 2),
    specifications: { frameSize: "Large", frameMaterial: "Acetate", lensType: "UV Protection", gender: "Women", brand: "Swadeshi Sun", color: "Brown Gradient", weight: "20g", dimensions: "148mm width", shape: "Oversized" },
  },
  {
    name: "Kids UV400 Sunglasses",
    slug: "kids-uv400-sunglasses",
    description: "Fun and protective sunglasses sized for children.",
    categorySlug: "sunglasses-kids",
    price: 699,
    stock: 25,
    prescriptionRequired: false,
    images: img("kids-sunglasses", 2),
    specifications: { frameSize: "Small", frameMaterial: "Plastic", lensType: "UV Protection", gender: "Kids", brand: "Swadeshi Junior", color: "Red", weight: "10g", dimensions: "120mm width", shape: "Full Rim" },
  },
  {
    name: "Daily Disposable Contact Lenses",
    slug: "daily-disposable-contact-lenses",
    description: "Comfortable daily-wear lenses, box of 30.",
    categorySlug: "contact-lenses-daily",
    price: 1099,
    stock: 60,
    prescriptionRequired: true,
    images: img("daily-contacts", 1),
    specifications: { lensType: "Single Vision", gender: "Unisex", brand: "Swadeshi Vision" },
  },
  {
    name: "Monthly Colored Contact Lenses",
    slug: "monthly-colored-contact-lenses",
    description: "Subtle color-enhancing lenses, monthly wear.",
    categorySlug: "contact-lenses-colored",
    price: 1499,
    stock: 35,
    prescriptionRequired: true,
    images: img("colored-contacts", 2),
    specifications: { lensType: "Single Vision", gender: "Unisex", brand: "Swadeshi Vision", color: "Hazel" },
  },
  {
    name: "Premium Leather Eyewear Case",
    slug: "premium-leather-eyewear-case",
    description: "Hard-shell case wrapped in genuine leather.",
    categorySlug: "accessories-cases",
    price: 399,
    stock: 45,
    prescriptionRequired: false,
    images: img("leather-case", 2),
    specifications: { brand: "Swadeshi Accessories", color: "Brown" },
  },
  {
    name: "Microfiber Cleaning Cloth (Pack of 3)",
    slug: "microfiber-cleaning-cloth-pack",
    description: "Lint-free cloths safe for all lens coatings.",
    categorySlug: "accessories-cleaning-cloth",
    price: 149,
    stock: 100,
    prescriptionRequired: false,
    images: img("cleaning-cloth", 1),
    specifications: { brand: "Swadeshi Accessories" },
  },
  {
    name: "Anti-Fog Lens Cleaner Spray",
    slug: "anti-fog-lens-cleaner-spray",
    description: "Streak-free lens cleaning spray with anti-fog formula.",
    categorySlug: "accessories-lens-cleaner",
    price: 249,
    stock: 60,
    prescriptionRequired: false,
    images: img("lens-cleaner", 1),
    specifications: { brand: "Swadeshi Accessories" },
  },
  {
    name: "Adjustable Eyewear Chain",
    slug: "adjustable-eyewear-chain",
    description: "Stylish beaded chain to keep your glasses handy.",
    categorySlug: "accessories-chains",
    price: 299,
    discountPrice: 249,
    stock: 40,
    prescriptionRequired: false,
    images: img("eyewear-chain", 1),
    specifications: { brand: "Swadeshi Accessories", color: "Gold" },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Seeding products...");

  for (const p of PRODUCTS) {
    const existing = await Product.findOne({ slug: p.slug });
    if (existing) {
      console.log(`- skip (exists): ${p.name}`);
      continue;
    }

    const category = await Category.findOne({ slug: p.categorySlug });
    const { categorySlug, ...productData } = p;

    await Product.create({
      ...productData,
      categories: category ? [category._id] : [],
    });
    console.log(`✓ ${p.name}`);
  }

  console.log("Done seeding products.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
