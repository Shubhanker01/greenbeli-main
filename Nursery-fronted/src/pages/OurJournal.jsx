import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Droplets, Leaf, Sun } from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";
import { getJournalArticlesApi } from "../utils/api";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const DEFAULT_NOTES = [
  {
    category: "Plant care",
    title: "A gentler way to water",
    description:
      "Good watering starts with noticing. Check the soil before reaching for your watering can, and let each plant tell you when it is ready.",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Water droplets on the leaves of a green houseplant",
  },
  {
    category: "Light & living",
    title: "Find the light your plant loves",
    description:
      "A bright room can have many different light levels. Notice where the sun falls through the day to find a comfortable spot for your plant.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Houseplants growing in a softly lit home",
  },
  {
    category: "Growing well",
    title: "Make room for new growth",
    description:
      "New leaves are a lovely sign of progress. Give them space, keep their care consistent, and enjoy the small changes along the way.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Fresh green foliage growing toward the light",
  },
];

export default function OurJournal() {
  const [articles, setArticles] = useState(DEFAULT_NOTES);

  useEffect(() => {
    let cancelled = false;
    async function fetchJournal() {
      try {
        const data = await getJournalArticlesApi();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      } catch (e) {
        // Fall back to default articles
      }
    }
    fetchJournal();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-cream pb-20 text-slate-800 sm:pb-28">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.8),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <RevealGroup stagger={0.12} delay={0.05} className="space-y-6 sm:space-y-7">
            <Reveal>
              <p
                style={{ color: GREEN }}
                className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
              >
                The GreenBeli journal
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                Notes for a greener everyday.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                A growing collection of simple ideas for living with plants.
                Explore thoughtful care tips, learn to read the little signs
                your plants give you, and make your home feel a little more
                alive.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
              <a
                href="#journal-notes"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90"
              >
                Read latest notes
                <ArrowUpRight className="h-5 w-5 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>

              <Link
                to="/products"
                style={{ color: GREEN }}
                className="text-base font-semibold underline underline-offset-4 decoration-2 decoration-transparent transition hover:decoration-current"
              >
                Browse all plants
              </Link>
            </Reveal>
          </RevealGroup>

          <Reveal effect="rise" duration={0.9} delay={0.25} className="relative">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-tl-[5rem] rounded-tr-lg rounded-b-lg shadow-2xl shadow-stone-900/15 sm:rounded-tl-[8rem] lg:aspect-[6/5] lg:rounded-tl-[10rem]">
              <img
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop"
                alt="A quiet reading corner with potted plants"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="journal-notes"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
      >
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              From the journal
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Little things that help plants thrive.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              Start with the basics, follow what feels useful, and let your
              confidence grow one leaf at a time.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((item, index) => {
            const title = item.title || "Plant Note";
            const category = item.category || "Plant care";
            const description = item.description || "";
            const image = item.image || "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1000&auto=format&fit=crop";
            const imageAlt = item.imageAlt || title;

            return (
              <Reveal
                key={item._id || item.slug || title + index}
                className="group overflow-hidden rounded-xl border border-stone-200/80 bg-white/75 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              >
                <div className="aspect-[16/10] overflow-hidden bg-emerald-100/60">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                    >
                      <Leaf className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <p
                      style={{ color: GREEN }}
                      className="text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      {category}
                    </p>
                  </div>
                  <h3
                    style={{ color: GREEN }}
                    className="serif-font text-2xl font-bold leading-snug"
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                    {description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          style={{ backgroundColor: GREEN, color: "var(--color-cream)" }}
          className="relative overflow-hidden rounded-tl-[4.5rem] rounded-tr-xl rounded-b-xl p-7 shadow-2xl shadow-emerald-950/25 sm:rounded-tl-[8rem] sm:p-12 lg:rounded-tl-[10rem] lg:p-16"
        >
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
            <h2 className="serif-font text-3xl font-medium leading-tight sm:text-5xl">
              Want more plant care ideas delivered quietly?
            </h2>
            <p className="text-base leading-relaxed opacity-90 sm:text-lg">
              Explore our plant catalog or consult our nursery experts whenever you
              need tips for your space.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-base font-semibold text-[#1f4a34] shadow-md transition hover:bg-stone-100"
              >
                Browse catalog
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
