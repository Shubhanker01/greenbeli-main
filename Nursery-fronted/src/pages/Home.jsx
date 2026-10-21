import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PlantQuiz from "../components/PlantQuiz";
import { getProducts, getCategories, getTestimonials, submitTestimonial } from "../utils/api";
import Hero from "../components/Hero";
import CategoryHighlight from "../components/CategoryHighlight";
import FeaturedCollection from "../components/FeaturedCollection";
import BotanicalSection from "../components/BotanicalSection";
import TestimonialsSection, { TestimonialModal } from "../components/TestimonialsSection";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active collection tab
  const [activeTab, setActiveTab] = useState("all");

  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, prods, tests] = await Promise.all([
        getCategories(),
        getProducts({ limit: 12 }),
        getTestimonials(),
      ]);
      setCategories(cats);
      setFeaturedProducts(prods);
      setTestimonials(tests);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    const formData = new FormData();
    formData.append("name", reviewName);
    formData.append("role", reviewRole);
    formData.append("city", reviewCity);
    formData.append("rating", reviewRating);
    formData.append("comment", reviewComment);

    await submitTestimonial(formData);
    setReviewSubmitting(false);
    setReviewSuccess(true);
    setTimeout(() => {
      setIsTestimonialModalOpen(false);
      setReviewSuccess(false);
      setReviewName("");
      setReviewComment("");
    }, 2000);
  };

  // Filter products by tab
  const filteredProducts = featuredProducts.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "indoor") {
      return (
        product.categorySlug === "indoor-plants" ||
        product.category === "Indoor Plants" ||
        product.careLevel === "Easy" ||
        product.name.toLowerCase().includes("plant") ||
        product.name.toLowerCase().includes("lily")
      );
    }
    if (activeTab === "outdoor") {
      return (
        product.categorySlug === "outdoor-plants" ||
        product.category === "Outdoor Plants" ||
        product.name.toLowerCase().includes("bonsai") ||
        product.name.toLowerCase().includes("bougainvillea")
      );
    }
    if (activeTab === "pots") {
      return (
        product.categorySlug === "pots-planters" ||
        product.category === "Pots & Planters" ||
        product.name.toLowerCase().includes("planter") ||
        product.name.toLowerCase().includes("pot")
      );
    }
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 sm:pb-24 overflow-hidden bg-[url(/public/gardening-leaf-pattern.svg)]">

      {/* 1. HERO SECTION - Ultra Luxury Botanical Showcase */}
      <Hero />

      {/* 2. CATEGORY HIGHLIGHT CARDS */}
      <CategoryHighlight categories={categories} />


      {/* 3. FEATURED COLLECTION TABS & PRODUCTS */}
      <FeaturedCollection filteredProducts={filteredProducts} loading={loading} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. INTERACTIVE PLANT FINDER QUIZ */}
      <section id="plant-quiz" className="max-w-7xl mx-auto px-4 sm:px-8">
        <PlantQuiz />
      </section>

      {/* 5. BOTANICAL EXCELLENCE & GUARANTEE */}
      <BotanicalSection />

      {/* 6. TESTIMONIALS CAROUSEL */}


      <TestimonialsSection
        testimonials={testimonials}
        onShare={() => setIsTestimonialModalOpen(true)}
      />

      <TestimonialModal
        open={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        reviewSuccess={reviewSuccess}
        reviewSubmitting={reviewSubmitting}
        handleTestimonialSubmit={handleTestimonialSubmit}
        reviewName={reviewName} setReviewName={setReviewName}
        reviewRole={reviewRole} setReviewRole={setReviewRole}
        reviewCity={reviewCity} setReviewCity={setReviewCity}
        reviewRating={reviewRating} setReviewRating={setReviewRating}
        reviewComment={reviewComment} setReviewComment={setReviewComment}
      />

    </div>

  );
}
