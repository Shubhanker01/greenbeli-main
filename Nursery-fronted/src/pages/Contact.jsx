import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { submitLead } from "../utils/api";
import { useSystemSettings } from "../context/SystemSettingsContext";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const {state} = useSystemSettings();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // ignore double clicks
    setError("");
    setSubmitting(true);

    try {
      const result = await submitLead(formData);

      // submitLead should throw on failure; also treat an explicit { success: false } as failure
      if (result && result.success === false) {
        throw new Error(result.message || "Submission failed");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      // Keep what the user typed so they can try again; show one generic message
      setError("Some error occurred while submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How are live plants packaged for transit?",
      a: "Our plants are secured in specially engineered eco-cardboard containers with moist soil root retainers to guarantee 100% fresh delivery.",
    },
    {
      q: "What if a plant arrives damaged?",
      a: "We offer a 7-day hassle-free replacement guarantee. Send us a photo of the damaged plant via WhatsApp or email, and we will ship a replacement free of charge.",
    },
    {
      q: "Do you offer garden design & office plant installation?",
      a: "Yes! We specialize in custom landscape proposals for balcony gardens, villas, and corporate offices. Submit a proposal request on our Proposals page.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" /> We are here to help
        </span>
        <h1 className="serif-font text-3xl sm:text-5xl font-bold text-slate-900">
          Get in Touch with Botanist Experts
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have questions about plant care, order delivery, or garden landscaping? Reach out to us anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <h3 className="serif-font text-xl font-bold">Nursery Hub Details</h3>

            <div className="space-y-4 text-xs text-emerald-200/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Nursery Location</p>
                  <p>{state.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Phone Support</p>
                  <p>{state.supportPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Email Address</p>
                  <p>{state.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-emerald-900 pt-4">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Visiting Hours</p>
                  <p>Mon - Sun: 8:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-6">
          <h3 className="serif-font font-bold text-3xl text-slate-900">Send an Inquiry</h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-lg">Inquiry Submitted Successfully!</h4>
              <p className="text-sm text-slate-600">
                Thank you for contacting GreenBeli. One of our botanist specialists will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm font-bold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium p-4 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Roy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="General Inquiry">General Plant Inquiry</option>
                    <option value="Order Status">Order Delivery Help</option>
                    <option value="Bulk Order">Bulk Corporate Plants</option>
                    <option value="Plant Care">Botanist Advice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist your plant journey?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {submitting ? "Submitting Inquiry..." : "Send Inquiry Now"}
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Visit us
          </p>
          <h2 className="serif-font text-3xl font-bold text-slate-900">
            Find GreenBeli Gardeniya
          </h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-emerald-100 shadow-sm">
          <iframe
            title="Map showing GreenBeli Gardeniya"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3521.2612989202153!2d76.700684!3d28.047045200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4d083178d5cb%3A0xce5f7399909f8a00!2sGreenBeli%20Gardeniya!5e0!3m2!1sen!2sin!4v1793181617355!5m2!1sen!2sin"
            className="block h-[320px] w-full sm:h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-6">
        <h3 className="serif-font text-3xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-700" /> Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">{faq.q}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}