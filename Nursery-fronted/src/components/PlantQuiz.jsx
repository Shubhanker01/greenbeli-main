import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Sun, Droplets, Heart, ArrowRight, RotateCcw } from "lucide-react";
import PlantCard from "./PlantCard";
import { getProducts } from "../utils/api";

/* Shared look for every answer option */
const OPTION =
  "group w-full min-w-0 p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-teal-200/80 shadow-md hover:shadow-xl hover:border-emerald-500 text-left transition duration-300 sm:hover:-translate-y-1 touch-manipulation";
const OPTION_TITLE = "font-bold text-sm sm:text-xl text-slate-900 leading-snug break-words";
const OPTION_DESC = "text-xs sm:text-base text-slate-600 mt-1 sm:mt-1.5 leading-relaxed break-words";
const ICON_CHIP = "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shrink-0";
const QUESTION = "text-lg sm:text-3xl font-bold text-slate-900 leading-snug px-1";

export default function PlantQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    light: "",
    water: "",
    pet: null,
  });

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchError, setMatchError] = useState("");

  const handleSelect = async (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4);
      setLoadingMatches(true);
      setMatchError("");
      try {
        const products = await getProducts();
        const filtered = products.filter((product) => (
          !newAnswers.pet || product.petFriendly !== false
        ));
        setMatches(filtered.slice(0, 3));
      } catch (error) {
        setMatchError(error.message || "Unable to find plant recommendations. Please try again.");
        setMatches([]);
      } finally {
        setLoadingMatches(false);
      }
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ light: "", water: "", pet: null });
    setMatches([]);
    setMatchError("");
  };

  return (
    // The wrapping <section id="plant-quiz"> lives in Home.jsx (the hero button scrolls to it),
    // so this root is a plain div: no duplicate id and no doubled side padding.
    <div className="w-full min-w-0">
      {/* Opaque enough on mobile so leaf clusters don't bleed through the panel */}
      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-[#e8f5f1] sm:bg-gradient-to-br sm:from-teal-100/90 sm:via-cyan-50/80 sm:to-emerald-100/90 border border-teal-200/50 sm:border-white/60 shadow-xl shadow-teal-900/10 ring-1 ring-teal-900/5 p-4 sm:p-10 lg:p-14">
        {/* Soft ambient glows — desktop only (they wash out mobile content) */}
        <div className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 rounded-full bg-teal-300/30 blur-3xl sm:block" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 hidden h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl sm:block" />

        {/* Results get a wider column so three cards fit comfortably */}
        <div className={`relative z-10 mx-auto w-full min-w-0 text-center ${step === 4 ? "max-w-6xl" : "max-w-4xl"}`}>
          {/* Header */}
          <div className="relative isolate mb-6 sm:mb-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 inset-x-0 -inset-y-6 mx-auto hidden max-w-2xl rounded-full bg-white/60 blur-2xl sm:block"
            />
            <div className="mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-200 bg-teal-100/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-800 sm:mb-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-teal-600 sm:h-5 sm:w-5" />
              <span className="truncate">Interactive Plant Match Finder</span>
            </div>

            <h2 className="serif-font mb-2 text-2xl font-bold leading-tight text-slate-900 sm:mb-4 sm:text-5xl">
              Find the Perfect Plant for Your Space
            </h2>
            <p className="mx-auto max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-lg">
              Answer 3 quick questions about your home environment, and our botanist algorithm will match you with ideal plant varieties!
            </p>
          </div>

          {/* Progress Indicator */}
          {step <= 3 && (
            <div className="mb-6 sm:mb-10">
              <div className="mx-auto flex max-w-[14rem] items-center justify-center gap-2 sm:max-w-xs">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`h-2 rounded-full transition-all duration-300 sm:h-2.5 ${step === num
                        ? "w-10 bg-emerald-700 sm:w-12"
                        : step > num
                          ? "w-4 bg-emerald-500 sm:w-5"
                          : "w-4 bg-teal-900/15 sm:w-5"
                      }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs font-semibold text-teal-800 sm:mt-3 sm:text-sm">Question {step} of 3</p>
            </div>
          )}

          {/* Question 1: Lighting */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4 sm:space-y-8">
              <h3 className={QUESTION}>
                1. How much natural sunlight does your plant spot receive?
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                {[
                  { title: "Low / Indirect Light", desc: "North windows or shaded room corners", icon: Sun },
                  { title: "Bright Indirect", desc: "Filtered sunlight near East/West window", icon: Sun },
                  { title: "Full Direct Sun", desc: "Balcony or South facing sunny window", icon: Sun },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelect("light", item.title)}
                    className={OPTION}
                  >
                    <div className={`${ICON_CHIP} bg-amber-100`}>
                      <item.icon className="h-5 w-5 text-amber-600 sm:h-7 sm:w-7" />
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
            <div className="animate-fade-in space-y-4 sm:space-y-8">
              <h3 className={QUESTION}>
                2. What is your preferred watering routine?
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                {[
                  { title: "Forgetful Plant Parent", desc: "Water every 2-3 weeks (Succulents/Sansevieria)", icon: Droplets },
                  { title: "Weekly Caretaker", desc: "Water once every 7-10 days", icon: Droplets },
                  { title: "Attentive Gardener", desc: "Daily or alternate day care", icon: Droplets },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelect("water", item.title)}
                    className={OPTION}
                  >
                    <div className={`${ICON_CHIP} bg-sky-100`}>
                      <item.icon className="h-5 w-5 text-sky-600 sm:h-7 sm:w-7" />
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
            <div className="animate-fade-in space-y-4 sm:space-y-8">
              <h3 className={QUESTION}>
                3. Do you have curious pets (Cats / Dogs) at home?
              </h3>
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                <button
                  type="button"
                  onClick={() => handleSelect("pet", true)}
                  className={OPTION}
                >
                  <div className={`${ICON_CHIP} bg-rose-100`}>
                    <Heart className="h-5 w-5 fill-rose-500/30 text-rose-500 sm:h-7 sm:w-7" />
                  </div>
                  <h4 className={OPTION_TITLE}>Yes, Pet Friendly Only</h4>
                  <p className={OPTION_DESC}>Show 100% non-toxic plants</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect("pet", false)}
                  className={OPTION}
                >
                  <div className={`${ICON_CHIP} bg-emerald-100`}>
                    <Sparkles className="h-5 w-5 text-emerald-600 sm:h-7 sm:w-7" />
                  </div>
                  <h4 className={OPTION_TITLE}>No Pets / High Shelves</h4>
                  <p className={OPTION_DESC}>Show all botanical varieties</p>
                </button>
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 4 && (
            <div className="animate-fade-in space-y-5 sm:space-y-8">
              {loadingMatches ? (
                <p role="status" className="text-sm text-slate-600 sm:text-base">Finding recommendations...</p>
              ) : matchError ? (
                <p role="alert" className="text-sm text-rose-700 sm:text-base">{matchError}</p>
              ) : (
                <>
                  <div className="inline-flex max-w-full items-center justify-center gap-2 px-1 text-base font-bold text-emerald-800 sm:text-2xl">
                    <Sparkles className="h-5 w-5 shrink-0 text-amber-500 sm:h-7 sm:w-7" />
                    <span className="leading-snug">Your Recommended Botanical Matches!</span>
                  </div>

                  {matches.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-8">
                      {matches.map((product) => (
                        <div key={product._id} className="min-w-0">
                          <PlantCard product={product} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 sm:text-base">No matching plants are available right now.</p>
                  )}
                </>
              )}

              <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-700 bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-teal-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                >
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" /> Retake Quiz
                </button>

                <Link
                  to="/products"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-800 bg-emerald-800 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:border-emerald-900 hover:bg-emerald-900 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                >
                  View All Plants <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
