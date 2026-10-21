import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Send,
  ShieldCheck,
  Truck,
  Leaf,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Heart,
  Globe,
  Share2,
  Sparkles
} from "lucide-react";
import { RevealGroup } from "./Reveal";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-12 sm:pt-16 pb-24 sm:pb-8 border-t border-emerald-900">
      <RevealGroup effect="fadeUp" stagger={0.1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12 border-b border-emerald-900/80">
            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">100% Healthy Plants</h4>
                <p className="text-xs text-emerald-300/80">Grown organically & hand-inspected.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">Eco Secure Packaging</h4>
                <p className="text-xs text-emerald-300/80">Custom potted plant transit protection.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">7-Day Replacement</h4>
                <p className="text-xs text-emerald-300/80">Hassle-free guarantee for all shipments.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">Botanist Support</h4>
                <p className="text-xs text-emerald-300/80">Free plant care consultation anytime.</p>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 py-8 sm:py-12 border-b border-emerald-900/80">

            {/* Brand & Newsletter */}
            <div className="sm:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="serif-font text-[22px] sm:text-[26px] font-bold text-white">GreenBeli</span>
              </Link>
              <p className="text-sm text-emerald-200/70 leading-relaxed max-w-sm">
                We are a premier botanical nursery dedicated to bringing pristine indoor greenery, garden landscaping, and sustainable planting accessories directly to your home.
              </p>

              <div className="pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Join the Green Club & Get 15% OFF
                </h5>
                {subscribed ? (
                  <div className="bg-emerald-900/80 text-emerald-200 text-sm p-3 rounded-xl border border-emerald-700">
                    🎉 Thank you for subscribing! Check your inbox for your discount code.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      required
                      className="bg-emerald-900/60 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500 flex-1"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 touch-active"
                    >
                      Subscribe <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="serif-font font-bold text-white text-base sm:text-lg mb-3 sm:mb-4">Plant Collections</h4>
              <ul className="space-y-2 text-sm text-emerald-200/70">
                <li><Link to="/category/indoor-plants" className="hover:text-emerald-400 transition">Indoor Air Purifiers</Link></li>
                <li><Link to="/category/outdoor-plants" className="hover:text-emerald-400 transition">Outdoor Garden Plants</Link></li>
                <li><Link to="/category/pots-planters" className="hover:text-emerald-400 transition">Ceramic & Terracotta Pots</Link></li>
                <li><Link to="/category/plant-care" className="hover:text-emerald-400 transition">Organic Plant Care & Fertilizers</Link></li>
                <li><Link to="/category/seeds-bulbs" className="hover:text-emerald-400 transition">Exotic Flower & Herb Seeds</Link></li>
                <li><Link to="/products" className="hover:text-emerald-400 transition">Best Seller Plants</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="serif-font font-bold text-white text-base sm:text-lg mb-3 sm:mb-4">Services & Help</h4>
              <ul className="space-y-2 text-sm text-emerald-200/70">
                <li><Link to="/proposals" className="hover:text-emerald-400 transition">Custom Landscape Proposals</Link></li>
                <li><Link to="/gallery" className="hover:text-emerald-400 transition">Nursery Project Gallery</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact Botanist Support</Link></li>
                <li><Link to="/orders" className="hover:text-emerald-400 transition">Track Your Order</Link></li>
                <li><Link to="/profile" className="hover:text-emerald-400 transition">My Account Profile</Link></li>
                <li><a href="#plant-quiz" className="hover:text-emerald-400 transition">Plant Match Quiz</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="serif-font font-bold text-white text-base sm:text-lg mb-3 sm:mb-4">Nursery Location</h4>
              <ul className="space-y-2.5 text-sm text-emerald-200/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>GreenBeli Botanical Hub, Sector 18, City Gardens, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>support@greenbeli.in</span>
                </li>
              </ul>

              <div className="mt-4 sm:mt-6 flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 hover:bg-emerald-700 hover:text-white transition">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 hover:bg-emerald-700 hover:text-white transition">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 hover:bg-emerald-700 hover:text-white transition">
                  <Sparkles className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-emerald-400/60 gap-3">
            <p>© {new Date().getFullYear()} GreenBeli Nursery Store. All Rights Reserved.</p>
            <div className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for Plant Lovers.</span>
            </div>
          </div>
        </div>
      </RevealGroup>

    </footer>
  );
}
