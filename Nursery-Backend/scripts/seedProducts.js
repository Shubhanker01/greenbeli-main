require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../src/models/Productsmodel");

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/greenbeli';

// Inline fallback products array
const FALLBACK_PRODUCTS = [
    {
        _id: "prod-1",
        name: "Monstera Deliciosa (Swiss Cheese Plant)",
        slug: "monstera-deliciosa",
        price: 899,
        originalPrice: 1199,
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        rating: 4.9,
        reviewsCount: 42,
        images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 25,
        careLevel: "Easy",
        lightRequirement: "Bright Indirect Light",
        waterRequirement: "Once a week",
        petFriendly: false,
        description: "The classic Monstera Deliciosa brings an instant tropical vibe to any indoor room with its natural leaf perforations.",
        featured: true,
    },
    {
        _id: "prod-2",
        name: "Golden Snake Plant (Sansevieria)",
        slug: "golden-snake-plant",
        price: 499,
        originalPrice: 699,
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        rating: 4.8,
        reviewsCount: 38,
        images: ["https://images.unsplash.com/photo-1599598425947-0206455589db?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 40,
        careLevel: "Beginner Friendly",
        lightRequirement: "Low to High Light",
        waterRequirement: "Every 2-3 weeks",
        petFriendly: false,
        description: "One of the toughest air-purifying indoor plants. Releases oxygen at night and requires minimal care.",
        featured: true,
    },
    {
        _id: "prod-3",
        name: "Fiddle Leaf Fig (Ficus Lyrata)",
        slug: "fiddle-leaf-fig",
        price: 1499,
        originalPrice: 1899,
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        rating: 4.7,
        reviewsCount: 19,
        images: ["https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 12,
        careLevel: "Medium",
        lightRequirement: "Bright Filtered Light",
        waterRequirement: "When top soil is dry",
        petFriendly: false,
        description: "Architectural foliage with iconic violin-shaped glossy leaves. Perfect focal point for living rooms.",
        featured: true,
    },
    {
        _id: "prod-4",
        name: "Handcrafted Ceramic Planter (Sage Green)",
        slug: "ceramic-planter-sage",
        price: 649,
        originalPrice: 849,
        category: "Pots & Planters",
        categorySlug: "pots-planters",
        rating: 4.9,
        reviewsCount: 27,
        images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 30,
        careLevel: "N/A",
        lightRequirement: "N/A",
        waterRequirement: "Includes drainage hole & saucer",
        petFriendly: true,
        description: "Premium matte glazed heavy ceramic pot designed for healthy root aeration.",
        featured: true,
    },
    {
        _id: "prod-5",
        name: "Peace Lily (Spathiphyllum)",
        slug: "peace-lily",
        price: 549,
        originalPrice: 749,
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        rating: 4.9,
        reviewsCount: 51,
        images: ["https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 18,
        careLevel: "Easy",
        lightRequirement: "Low to Medium Light",
        waterRequirement: "Twice a week",
        petFriendly: false,
        description: "Elegantly blooms white spathes while actively filtering indoor air pollutants.",
        featured: false,
    },
    {
        _id: "prod-6",
        name: "Bougainvillea Bonsai Starter",
        slug: "bougainvillea-bonsai",
        price: 1199,
        originalPrice: 1599,
        category: "Outdoor Plants",
        categorySlug: "outdoor-plants",
        rating: 4.8,
        reviewsCount: 15,
        images: ["https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80"],
        inStock: true,
        stock: 8,
        careLevel: "Medium",
        lightRequirement: "Full Direct Sunlight",
        waterRequirement: "Moderate",
        petFriendly: true,
        description: "Vibrant magenta flowering outdoor plant that thrives under bright sunshine.",
        featured: true,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('📦 Connected to MongoDB for seeding...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🧹 Cleared existing products.');

        // Map inline fallback products to match schema requirements
        const formattedProducts = FALLBACK_PRODUCTS.map((item, index) => ({
            name: item.name,
            slug: item.slug,
            sku: `SKU-${index + 1001}`,
            price: item.price,
            mrp: item.originalPrice || item.price * 1.3,
            stock: item.stock || 20,
            stockStatus: item.inStock ? 'in_stock' : 'out_of_stock',
            shortDescription: item.description,
            detailedDescription: item.description,
            images: item.images || [],
            sunlightRequirement: item.lightRequirement || '',
            wateringSchedule: item.waterRequirement || '',
            maintenanceLevel: item.careLevel || '',
            airPurifying: true,
            soldBy: 'Greenbeli Nursery',
            isActive: true,
        }));

        await Product.insertMany(formattedProducts);
        console.log(`✅ Successfully seeded ${formattedProducts.length} products!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedDatabase();