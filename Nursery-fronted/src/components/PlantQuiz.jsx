import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Sun, Droplets, Heart, ArrowRight, RotateCcw } from "lucide-react";
import PlantCard from "./PlantCard";
import { FALLBACK_PRODUCTS } from "../utils/api";

/* Shared look for every answer option */
const OPTION =
  "group p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/75 backdrop-blur-md border border-teal-200/80 shadow-md hover:shadow-xl hover:bg-white hover:border-emerald-500 text-left transition duration-300 hover:-translate-y-1";
const OPTION_TITLE = "font-bold text-base sm:text-xl text-slate-900 leading-snug";
const OPTION_DESC = "text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed";
const ICON_CHIP = "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4";
const QUESTION = "text-xl sm:text-3xl font-bold text-slate-900 leading-snug";

export default function PlantQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    light: "",
    water: "",
    pet: null,
  });

  const [matches, setMatches] = useState([]);

  const handleSelect = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate match
      const filtered = FALLBACK_PRODUCTS.filter((p) => {
        let score = true;
        if (newAnswers.pet && p.petFriendly === false) score = false;
        return score;
      });
      setMatches(filtered.slice(0, 3));
      setStep(4);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ light: "", water: "", pet: null });
    setMatches([]);
  };

  return (
    // The wrapping <section id="plant-quiz"> lives in Home.jsx (the hero button scrolls to it),
    // so this root is a plain div: no duplicate id and no doubled side padding.
    <div>
      {/* Light teal glass panel: a cool counterpart to the sand and emerald sections */}
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-teal-100/60 via-cyan-50/40 to-emerald-100/50 backdrop-blur-sm border border-white/60 shadow-xl shadow-teal-900/10 ring-1 ring-teal-900/5 p-5 sm:p-10 lg:p-14">
        {/* Soft ambient glows for depth */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-300/25 rounded-full blur-3xl pointer-events-none" />

        {/* Results get a wider column so three cards fit comfortably */}
        <div className={`relative z-10 mx-auto text-center ${step === 4 ? "max-w-6xl" : "max-w-4xl"}`}>
          {/* Header */}
          <div className="relative isolate mb-8 sm:mb-10">
            {/* Soft glow so the heading stays crisp over the pattern */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 inset-x-0 -inset-y-6 mx-auto max-w-2xl rounded-full bg-white/60 blur-2xl"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/90 border border-teal-200 text-teal-800 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" /> Interactive Plant Match Finder
            </div>

            <h2 className="serif-font text-3xl sm:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
              Find the Perfect Plant for Your Space
            </h2>
            <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Answer 3 quick questions about your home environment, and our botanist algorithm will match you with ideal plant varieties!
            </p>
          </div>

          {/* Progress Indicator */}
          {step <= 3 && (
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`h-2.5 rounded-full transition-all duration-300 ${step === num
                        ? "w-12 bg-emerald-700"
                        : step > num
                          ? "w-5 bg-emerald-500"
                          : "w-5 bg-teal-900/15"
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-teal-800 mt-3">Question {step} of 3</p>
            </div>
          )}

          {/* Question 1: Lighting */}
          {step === 1 && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <h3 className={QUESTION}>
                1. How much natural sunlight does your plant spot receive?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { title: "Low / Indirect Light", desc: "North windows or shaded room corners", icon: Sun },
                  { title: "Bright Indirect", desc: "Filtered sunlight near East/West window", icon: Sun },
                  { title: "Full Direct Sun", desc: "Balcony or South facing sunny window", icon: Sun },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleSelect("light", item.title)}
                    className={OPTION}
                  >
                    <div className={`${ICON_CHIP} bg-amber-100`}>
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                    </div>
                    <h4 className={OPTION_TITLE}>{item.title}</h4>
                    <p className={OPTION_DESC}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Watering */}
          {step === 2 && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <h3 className={QUESTION}>
                2. What is your preferred watering routine?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { title: "Forgetful Plant Parent", desc: "Water every 2-3 weeks (Succulents/Sansevieria)", icon: Droplets },
                  { title: "Weekly Caretaker", desc: "Water once every 7-10 days", icon: Droplets },
                  { title: "Attentive Gardener", desc: "Daily or alternate day care", icon: Droplets },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleSelect("water", item.title)}
                    className={OPTION}
                  >
                    <div className={`${ICON_CHIP} bg-sky-100`}>
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-sky-600" />
                    </div>
                    <h4 className={OPTION_TITLE}>{item.title}</h4>
                    <p className={OPTION_DESC}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 3: Pet Safety */}
          {step === 3 && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <h3 className={QUESTION}>
                3. Do you have curious pets (Cats / Dogs) at home?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => handleSelect("pet", true)}
                  className={OPTION}
                >
                  <div className={`${ICON_CHIP} bg-rose-100`}>
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 fill-rose-500/30" />
                  </div>
                  <h4 className={OPTION_TITLE}>Yes, Pet Friendly Only</h4>
                  <p className={OPTION_DESC}>Show 100% non-toxic plants</p>
                </button>

                <button
                  onClick={() => handleSelect("pet", false)}
                  className={OPTION}
                >
                  <div className={`${ICON_CHIP} bg-emerald-100`}>
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                  </div>
                  <h4 className={OPTION_TITLE}>No Pets / High Shelves</h4>
                  <p className={OPTION_DESC}>Show all botanical varieties</p>
                </button>
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 4 && (
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-lg sm:text-2xl">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" /> Your Recommended Botanical Matches!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 text-left">
                {matches.map((product) => (
                  <PlantCard key={product._id} product={product} />
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border-2 border-emerald-700 bg-white/60 text-emerald-800 text-sm sm:text-base font-bold hover:bg-white transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> Retake Quiz
                </button>

                <Link
                  to="/products"
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border-2 border-emerald-800 bg-emerald-800 text-white text-sm sm:text-base font-extrabold hover:bg-emerald-900 hover:border-emerald-900 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  View All Plants <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}