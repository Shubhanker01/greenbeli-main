import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
import { submitLead } from "../utils/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await submitLead(formData);
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
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
                  <p>GreenBeli Botanical Hub, Sector 18, City Gardens, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Phone Support</p>
                  <p>+91 9950711475</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Email Address</p>
                  <p>support@greenbeli.in</p>
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
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/10"
              >
                <Send className="w-4 h-4" /> {submitting ? "Submitting Inquiry..." : "Send Inquiry Now"}
              </button>
            </form>
          )}
        </div>
      </div>

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
