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

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const FAQ_SECTIONS = [
  {
    id: "plants",
    icon: Leaf,
    title: "Plants & plant care",
    questions: [
      {
        question: "How do I choose the right plant for my home?",
        answer:
          "Consider how much natural light your space gets, how much time you can give to care, and where you plan to place the plant. Check each product page for plant details, and contact our team if you would like help choosing.",
      },
      {
        question: "How should I care for a new plant when it arrives?",
        answer:
          "Unpack it gently and give it a little time to settle into its new surroundings. Check the soil before watering, choose a spot that suits its light needs, and avoid making several big changes at once.",
      },
      {
        question: "Where can I find plant-care advice?",
        answer:
          "Visit our Plant Care Guides for helpful starting points on watering, light, soil, and everyday plant care. Each plant can have different needs, so also check the care details on its product page.",
        link: { to: "/plant-care-guides", label: "Explore plant care guides" },
      },
    ],
  },
  {
    id: "orders",
    icon: PackageCheck,
    title: "Orders & delivery",
    questions: [
      {
        question: "How are plants prepared for delivery?",
        answer:
          "We take care to prepare and protect plants for their journey. Delivery estimates and any applicable shipping charges are shown during checkout and in your order updates.",
      },
      {
        question: "What should I do if my plant arrives damaged?",
        answer:
          "Please contact us within 7 days of delivery with your order details and clear photos of the plant and packaging. Our team will review the information and guide you through the next steps under the 7-day transit guarantee.",
        link: { to: "/shipping-returns", label: "Read shipping & returns details" },
      },
      {
        question: "Where can I check shipping and return information?",
        answer:
          "Our Shipping & Returns page explains what to expect during delivery and how to get help if your order arrives with an issue.",
        link: { to: "/shipping-returns", label: "Shipping & returns" },
      },
    ],
  },
  {
    id: "support",
    icon: Sprout,
    title: "Help & support",
    questions: [
      {
        question: "Can I get help with a plant-care question?",
        answer:
          "Yes. Send us a message with the plant name, a description of what you are noticing, and a photo if you can. Our team will do its best to point you in the right direction.",
        link: { to: "/contact", label: "Contact our team" },
      },
      {
        question: "Do you help with garden or office planting projects?",
        answer:
          "We accept custom landscape and planting inquiries for spaces such as balconies, homes, and offices. Share a few details about your project on our Proposals page and our team can follow up.",
        link: { to: "/proposals", label: "Make a project inquiry" },
      },
    ],
  },
];

export default function FAQs() {
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
        {FAQ_SECTIONS.map(({ id, icon: Icon, title, questions }) => (
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
                <Reveal key={question}>
                  <details className="group py-5">
                    <summary
                      style={{ color: GREEN }}
                      className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:text-lg"
                    >
                      <span>{question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <div className="max-w-3xl space-y-3 pr-8 pt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
                      <p>{answer}</p>
                      {link && (
                        <Link
                          to={link.to}
                          className="inline-flex items-center gap-1 font-semibold text-[#1f4a34] underline underline-offset-4 transition hover:text-emerald-700"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </details>
                </Reveal>
              ))}
            </RevealGroup>
          </section>
        ))}
      </div>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-8 sm:mt-24">
        <div
          style={{ backgroundColor: GREEN, color: "var(--color-cream)" }}
          className="relative overflow-hidden rounded-tl-[4.5rem] rounded-tr-xl rounded-b-xl p-7 shadow-2xl shadow-emerald-950/25 sm:rounded-tl-[8rem] sm:p-12 lg:rounded-tl-[10rem] lg:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]"
          />
          <Reveal className="relative z-10 mx-auto max-w-3xl space-y-5 py-5 text-center sm:py-8">
            <p
              style={{ color: SAGE }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              Still have a question?
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              We’re happy to help you grow.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Get in touch with our team and let us know what you need.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
            >
              Contact us
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
