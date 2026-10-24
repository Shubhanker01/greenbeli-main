/**
 * Run: node scripts/seedCategories.js (from Nursery-Backend root, after MONGO_URI in .env)
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Category = require("../src/models/Categories");

const SEED = [
  { _id: "cat-1", name: "Indoor Plants", slug: "indoor-plants", description: "Purify your living space with vibrant indoor greenery.", imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-2", name: "Outdoor Plants", slug: "outdoor-plants", description: "Lush flowering and garden landscape plants for balcony & garden.", imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-3", name: "Pots & Planters", slug: "pots-planters", description: "Ceramic, terracotta, and modern minimalist planters.", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-4", name: "Gardening Tools", slug: "gardening-tools", description: "Ergonomic pruners, soil shovels, and watering tools.", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-5", name: "Plant Care", slug: "plant-care", description: "Organic fertilizers, soil mixes, and pest control.", imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80" },
  { _id: "cat-6", name: "Seeds & Bulbs", slug: "seeds-bulbs", description: "High germinating exotic flower, herb & vegetable seeds.", imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80" },
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB_NAME || undefined });
  for (const row of SEED) {
    await Category.findOneAndUpdate(
      { slug: row.slug },
      {
        $setOnInsert: {
          name: row.name,
          description: row.description,
          slug: row.slug,
          kind: "Plants",
          isActive: true,
          imageUrl: row.imageUrl
        },
      },
      { upsert: true, new: true }
    );
    console.log("Category:", row.slug);
  }
  console.log("Done.");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
