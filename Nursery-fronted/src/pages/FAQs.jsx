import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  HelpCircle,
  Leaf,
  PackageCheck,
  Sprout,
} from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";
import { getFaqsApi } from "../utils/api";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

export default function FAQs() {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function loadFaqs() {
      try {
        const items = await getFaqsApi();

        if (!cancelled && Array.isArray(items) && items.length > 0) {
          // Group DB FAQs by category
          const grouped = {};
          items.forEach((faq) => {
            const cat = faq.category || "General";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(faq);
          });
          const dynamicSections = Object.entries(grouped).map(([catName, questions], idx) => ({
            id: `faq-cat-${idx}`,
            icon: Leaf,
            title: catName,
            questions,
          }));
          setSections(dynamicSections);
        }
      } catch (e) {
        console.log(e)
        setError("Some Error occured while loading FAQs.")
        // Fall back to default sections
      }
    }
    loadFaqs();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-slate-800">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-cream pb-20 text-slate-800 sm:pb-28">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.8),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-8 sm:py-20 lg:py-24">
          <RevealGroup stagger={0.12} delay={0.05} className="mx-auto max-w-3xl space-y-5">
            <Reveal>
              <span
                style={{ color: GREEN }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
              >
                <HelpCircle className="h-4 w-4" />
                Here to help
              </span>
            </Reveal>
            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Frequently asked questions.
              </h1>
            </Reveal>
            <Reveal>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                Find answers to common questions about choosing plants, caring
                for your order, and getting support from GreenBeli.
              </p>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-8 sm:space-y-16">
        {sections.map(({ id, icon: Icon, title, questions }) => (
          <section key={id} id={id} className="scroll-mt-8">
            <Reveal className="mb-5 flex items-center gap-4 border-b border-stone-300/80 pb-5">
              <span
                style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <h2
                style={{ color: GREEN }}
                className="serif-font text-2xl font-bold sm:text-3xl"
              >
                {title}
              </h2>
            </Reveal>

            <RevealGroup stagger={0.08} className="divide-y divide-stone-300/80">
              {questions.map(({ question, answer, link }) => (
                <Reveal key={question} className="py-6 sm:py-8">
                  <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-left">
                      <h3
                        style={{ color: GREEN }}
                        className="serif-font text-xl font-bold leading-snug sm:text-2xl"
                      >
                        {question}
                      </h3>
                      <span
                        style={{ color: GREEN }}
                        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200/60 transition group-open:rotate-180"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="pt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
                      <p>{answer}</p>
                      {link && (
                        <div className="pt-4">
                          <Link
                            to={link.to}
                            style={{ color: GREEN }}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
                          >
                            {link.label}
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </details>
                </Reveal>
              ))}
            </RevealGroup>
          </section>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-8">
        <div
          style={{ backgroundColor: SAGE }}
          className="rounded-2xl p-8 text-center sm:p-12"
        >
          <h2
            style={{ color: GREEN }}
            className="serif-font text-2xl font-bold sm:text-3xl"
          >
            Still have a question?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600 sm:text-base">
            Reach out to our plant experts anytime. We are happy to help you find
            the right plant or troubleshoot any care issue.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              style={{ backgroundColor: GREEN }}
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-90"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
