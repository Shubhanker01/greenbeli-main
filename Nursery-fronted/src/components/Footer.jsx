import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Send,
  Heart,
  Globe,
  Share2,
  Sparkles
} from "lucide-react";
import { RevealGroup } from "./Reveal";

// Color Palette Tokens based on Greenbeli Figma Design
const GREEN = "#1f4a34";
const GREEN_DARK = "#163828";
const SAGE = "#e8ede1";

// Faint leaf veins drawn behind the footer content.
// A midrib runs from the bottom-left tip to the top-right tip, with side veins branching off it.
const VEIN_POINTS = [0.14, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86];
const MIDRIB = "M0 400 L1000 0";
const SIDE_VEINS = VEIN_POINTS.flatMap((t) => {
  const x = 1000 * t;
  const y = 400 * (1 - t);
  return [
    `M${x} ${y} L${x - 40} ${y - 150}`, // up-left
    `M${x} ${y} L${x + 190} ${y + 40}`, // down-right
  ];
});

function LeafVeins() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 400"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={MIDRIB} stroke="#6ee7b7" strokeOpacity="0.14" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      {SIDE_VEINS.map((d) => (
        <path key={d} d={d} stroke="#6ee7b7" strokeOpacity="0.07" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      ))}
    </svg>
  );
}

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
    <footer className="w-full pt-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. Newsletter Banner Section (Light Sage Card from Figma)    */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
        <div
          className="rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#d8d2bf]"
          style={{ backgroundColor: SAGE }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Heading & Subtext */}
            <div className="space-y-3 max-w-xl">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: GREEN_DARK }}
              >
                GOOD THINGS ARE GROWING
              </span>
              <h2
                className="serif-font text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
                style={{ color: GREEN_DARK }}
              >
                Let’s grow something together.
              </h2>
              <p className="text-slate-700 text-sm sm:text-base">
                Fresh arrivals, seasonal advice, and 10% off your first order.
              </p>
            </div>

            {/* Input Form matching Figma style */}
            <div className="w-full lg:max-w-md">
              {subscribed ? (
                <div
                  className="p-4 rounded-xl text-sm font-semibold text-emerald-900 border border-emerald-300"
                  style={{ backgroundColor: "var(--color-cream)" }}
                >
                  🎉 Thanks for joining! Check your inbox for your 10% discount.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl sm:rounded-full p-1.5 border border-[#c2bca8] shadow-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus:outline-none flex-1"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg sm:rounded-full transition hover:opacity-95 touch-active shrink-0 mt-2 sm:mt-0"
                      style={{ backgroundColor: GREEN_DARK }}
                    >
                      Count me in <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[12px] text-slate-500 pl-2">
                    Just the good stuff. Unsubscribe whenever you like.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Footer: a leaf shape (two opposite corners rounded,   */}
      {/*    the other two left as the leaf tips)                       */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-6 sm:pb-10">
        <div className="relative">
          <div
            className="relative overflow-hidden text-emerald-100/80
              rounded-tl-[72px] rounded-br-[72px] rounded-tr-[6px] rounded-bl-[6px]
              md:rounded-tl-[140px] md:rounded-br-[140px]
              lg:rounded-tl-[200px] lg:rounded-br-[200px]
              px-6 sm:px-12 lg:px-24 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-20"
            style={{ backgroundColor: GREEN_DARK }}
          >
            <LeafVeins />

            <div className="relative">
              <RevealGroup effect="fadeUp" stagger={0.1}>
                <div className="space-y-12 sm:space-y-16">

                  {/* Main Columns Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">

                    {/* Col 1: Brand Logo & Tagline */}
                    <div className="lg:col-span-2 space-y-4">
                      <Link to="/" className="inline-flex items-center gap-2 text-white">
                        <Sprout className="w-6 h-6 text-emerald-400" />
                        <span className="serif-font text-2xl font-bold tracking-tight">
                          Greenbeli
                        </span>
                      </Link>

                      <p className="text-sm text-emerald-200/70 max-w-xs leading-relaxed">
                        A little closer to nature. A little more at home.
                      </p>

                      {/* Social / Utility Icons from original imports */}
                      <div className="flex items-center gap-3 pt-2">
                        {/* <a
                          href="#"
                          aria-label="Website"
                          className="w-8 h-8 rounded-full border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-emerald-800 hover:text-white transition"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                        <a
                          href="#"
                          aria-label="Share"
                          className="w-8 h-8 rounded-full border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-emerald-800 hover:text-white transition"
                        >
                          <Share2 className="w-4 h-4" />
                        </a>
                        <a
                          href="#"
                          aria-label="Features"
                          className="w-8 h-8 rounded-full border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-emerald-800 hover:text-white transition"
                        >
                          <Sparkles className="w-4 h-4" />
                        </a> */}
                      </div>
                    </div>

                    {/* Col 2: Explore */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Explore
                      </h4>
                      <ul className="space-y-2.5 text-sm text-emerald-200/70">
                        <li><Link to="/category/indoor-plants" className="hover:text-white transition">All plants</Link></li>
                        <li><Link to="/category/pots-planters" className="hover:text-white transition">Pots & planters</Link></li>
                        <li><Link to="/category/plant-care" className="hover:text-white transition">Tools & essentials</Link></li>
                        <li><Link to="/gift-cards" className="hover:text-white transition">Gift cards</Link></li>
                      </ul>
                    </div>

                    {/* Col 3: Here to help */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Here to help
                      </h4>
                      <ul className="space-y-2.5 text-sm text-emerald-200/70">
                        <li><Link to="/plant-care-guides" className="hover:text-white transition">Plant care guides</Link></li>
                        <li><Link to="/shipping-returns" className="hover:text-white transition">Shipping & returns</Link></li>
                        <li><Link to="/faqs" className="hover:text-white transition">FAQs</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition">Contact us</Link></li>
                      </ul>
                    </div>

                    {/* Col 4: Our world */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Our world
                      </h4>
                      <ul className="space-y-2.5 text-sm text-emerald-200/70">
                        <li><Link to="/our-story" className="hover:text-white transition">Our story</Link></li>
                        <li><Link to="/our-growers" className="hover:text-white transition">Our growers</Link></li>
                        <li><Link to="/journal" className="hover:text-white transition">The journal</Link></li>
                        <li><a href="mailto:hello@greenbeli.com" className="hover:text-white transition">hello@greenbeli.com</a></li>
                      </ul>
                    </div>

                  </div>

                  {/* Bottom Copyright & Fine Print Bar */}
                  <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/50 gap-4">
                    <p>© {new Date().getFullYear()} Greenbeli. Rooted in the everyday.</p>

                    <div className="flex items-center gap-6">
                      <Link to="/privacy-policy" className="hover:text-emerald-200 transition">Privacy policy</Link>
                      <Link to="/terms-of-service" className="hover:text-emerald-200 transition">Terms of service</Link>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-300/40">
                      <span>Made with</span>
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>for plant lovers.</span>
                    </div>
                  </div>

                </div>
              </RevealGroup>
            </div>
          </div>

          {/* Little stem growing out of the bottom-left leaf tip */}
          <span
            aria-hidden="true"
            className="hidden sm:block absolute -left-10 bottom-0 h-1.5 w-10 origin-right -rotate-45 rounded-full"
            style={{ backgroundColor: GREEN_DARK }}
          />
        </div>
      </div>
    </footer>
  );
}