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
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

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


  return (

    <div className="space-y-16 sm:space-y-24 pb-20 sm:pb-24 overflow-hidden bg-cream">

      {/* 1. HERO SECTION - Ultra Luxury Botanical Showcase */}
      <Hero />

      {/* 2. CATEGORY HIGHLIGHT CARDS */}
      <CategoryHighlight />


      {/* 3. FEATURED COLLECTION TABS & PRODUCTS */}
      <FeaturedCollection />

      {/* 4. INTERACTIVE PLANT FINDER QUIZ */}
      <section id="plant-quiz" className="max-w-7xl mx-auto px-4 sm:px-8">
        <PlantQuiz />
      </section>

      {/* 5. BOTANICAL EXCELLENCE & GUARANTEE */}
      <BotanicalSection />

      {/* 6. TESTIMONIALS CAROUSEL */}


      <TestimonialsSection
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
