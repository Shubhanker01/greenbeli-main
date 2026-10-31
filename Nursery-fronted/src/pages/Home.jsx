import { useState } from "react";

import PlantQuiz from "../components/PlantQuiz";
import { submitTestimonial } from "../utils/api";
import Hero from "../components/Hero";
import CategoryHighlight from "../components/CategoryHighlight";
import FeaturedCollection from "../components/FeaturedCollection";
import BotanicalSection from "../components/BotanicalSection";
import TestimonialsSection, { TestimonialModal } from "../components/TestimonialsSection";
import LeafClusters from "../components/LeafClusters";

export default function Home() {
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

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
    try {
      const payload = {
        name: reviewName,
        role: reviewRole,
        city: reviewCity,
        rating: reviewRating,
        comment: reviewComment,
      };

      const res = await submitTestimonial(payload);
      if (!res.success) {
        setReviewSuccess(false);
      }
      setReviewSubmitting(false);
      setReviewSuccess(true);
      setTimeout(() => {
        setIsTestimonialModalOpen(false);
        setReviewSuccess(false);
        setReviewName("");
        setReviewRole("");
        setReviewCity("");
        setReviewRating(5);
        setReviewComment("");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit testimonial:", err);
      setReviewSubmitting(false);
      alert(err.response?.data?.message || "Failed to submit your garden story.");
    }
  };

  return (
    <div className="relative space-y-16 overflow-hidden bg-cream pb-20 sm:space-y-24 sm:pb-24">
      <LeafClusters />

      <div className="relative z-10 space-y-16 sm:space-y-24">
        <Hero />
        <CategoryHighlight />
        <FeaturedCollection />

        <section id="plant-quiz" className="relative z-10 mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-8">
          <PlantQuiz />
        </section>

        <BotanicalSection />

        <TestimonialsSection onShare={() => setIsTestimonialModalOpen(true)} />

        <TestimonialModal
          open={isTestimonialModalOpen}
          onClose={() => setIsTestimonialModalOpen(false)}
          reviewSuccess={reviewSuccess}
          reviewSubmitting={reviewSubmitting}
          handleTestimonialSubmit={handleTestimonialSubmit}
          reviewName={reviewName}
          setReviewName={setReviewName}
          reviewRole={reviewRole}
          setReviewRole={setReviewRole}
          reviewCity={reviewCity}
          setReviewCity={setReviewCity}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
        />
      </div>
    </div>
  );
}
