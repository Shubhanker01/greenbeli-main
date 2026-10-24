require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Testimonial = require("../src/models/Testimonial");

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/greenbeli';

const FALLBACK_TESTIMONIALS = [
    {
        _id: "t-1",
        name: "Ananya Sharma",
        role: "Interior Designer",
        city: "Mumbai",
        rating: 5,
        comment: "The quality of plants received from GreenBeli nursery was outstanding! Healthy roots and beautiful packaging.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isApproved: true,
    },
    {
        _id: "t-2",
        name: "Vikram Malhotra",
        role: "Plant Parent & Architect",
        city: "Bangalore",
        rating: 5,
        comment: "Ordered 12 indoor plants for our new office landscape. Delivered fresh without a single damaged leaf!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        isApproved: true,
    },
];

const seedTestimonials = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('📦 Connected to MongoDB for seeding testimonials...');

        await Testimonial.deleteMany({});
        console.log('🧹 Cleared existing testimonials.');

        const formattedTestimonials = FALLBACK_TESTIMONIALS.map((item) => ({
            name: item.name,
            city: item.city,
            rating: item.rating,
            comment: item.comment,
            avatar: item.avatar,
            isApproved: item.isApproved,
        }));

        await Testimonial.insertMany(formattedTestimonials);
        console.log(`✅ Successfully seeded ${formattedTestimonials.length} testimonials!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding testimonials:', error);
        process.exit(1);
    }
};

seedTestimonials();