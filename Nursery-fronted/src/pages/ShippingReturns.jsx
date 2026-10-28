import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Box,
  Clock3,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const DELIVERY_STEPS = [
  {
    icon: Leaf,
    title: "Prepared with care",
    description:
      "We carefully prepare plants and gardening essentials before they set off, helping them arrive ready for their next home.",
  },
  {
    icon: Box,
    title: "Packed for the journey",
    description:
      "Plants need a little extra thought in transit. We use protective packaging designed to help keep your order secure on its way to you.",
  },
  {
    icon: Truck,
    title: "Delivered to your door",
    description:
      "Shipping availability and charges are shown during checkout. Keep an eye on your order updates for the latest delivery information.",
  },
];

const RETURN_STEPS = [
  {
    title: "Check your order when it arrives",
    description:
      "Unpack your plants promptly and take a moment to check their condition. A little settling-in time after the journey is normal.",
  },
  {
    title: "Tell us if something is wrong",
    description:
      "If a plant arrives damaged or unhealthy, contact us within 7 days of delivery with your order details and clear photos of the plant and packaging.",
  },
  {
    title: "We'll help with the next steps",
    description:
      "Our team will review the details and guide you through the available resolution in line with our 7-day transit guarantee.",
  },
];

export default function ShippingReturns() {
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
                Shipping &amp; returns
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                From our nursery to your home.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                Every order starts a new growing journey. Here’s what to expect
                as it makes its way to you, and what to do if a plant needs a
                little extra help when it arrives.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap gap-4 pt-2">
              <a
                href="#shipping"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Shipping details
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#returns"
                style={{ color: GREEN }}
                className="px-2 py-4 text-base font-semibold underline decoration-2 decoration-transparent underline-offset-4 transition hover:decoration-current"
              >
                Returns &amp; support
              </a>
            </Reveal>
          </RevealGroup>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-md rounded-bl-md bg-emerald-100/60 shadow-2xl shadow-emerald-950/10 sm:rounded-tl-[7rem] sm:rounded-br-[7rem]">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop"
                alt="Healthy houseplants packed and ready to bring greenery home"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 max-w-[230px] rounded-md border border-stone-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:-left-6 sm:p-5">
              <p
                style={{ color: GREEN }}
                className="serif-font text-lg font-bold"
              >
                A little peace of mind
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Our 7-day transit guarantee is here if a plant arrives damaged.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="shipping"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
      >
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              On the way to you
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Thoughtful from the first step.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              We take care at each stage so your order can make the journey
              from our nursery to your doorstep.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3"
        >
          {DELIVERY_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              key={title}
              className={`relative ${index > 0 ? "border-t border-stone-300/80 pt-8 sm:border-t-0 sm:pt-0" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span
                style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
              >
                <Icon className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
                Step {index + 1}
              </p>
              <h3
                style={{ color: GREEN }}
                className="serif-font mb-3 text-xl font-bold sm:text-2xl"
              >
                {title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-stone-600">
                {description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex items-start gap-3 border-t border-stone-300/80 pt-6 text-sm leading-relaxed text-stone-500 sm:mt-12">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4a34]" />
          <p>
            Delivery estimates can vary by destination and order. Please refer
            to the information shown at checkout and in your order updates for
            the latest details.
          </p>
        </Reveal>
      </section>

      <section
        id="returns"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-12 sm:px-8 sm:py-16"
      >
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              If your plant needs help
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              We’re here for the unexpected.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              Live plants can be sensitive to travel. If yours arrives damaged
              or unhealthy, let us know within 7 days of delivery so we can
              review it under our transit guarantee.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-8"
        >
          {RETURN_STEPS.map(({ title, description }, index) => (
            <Reveal
              key={title}
              className="border-t border-stone-300/80 pt-6 sm:pt-7"
            >
              <p
                style={{ color: GREEN }}
                className="serif-font mb-3 text-2xl font-bold"
              >
                0{index + 1}
              </p>
              <h3
                style={{ color: GREEN }}
                className="serif-font mb-3 text-lg font-bold sm:text-xl"
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                {description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex flex-col gap-5 rounded-xl border border-stone-200/80 bg-white/70 p-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span
              style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            >
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3
                style={{ color: GREEN }}
                className="serif-font text-xl font-bold"
              >
                Need help with an order?
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Include your order details and photos so our team can help
                promptly.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition hover:brightness-90 touch-active"
            style={{ backgroundColor: GREEN }}
          >
            <MessageCircle className="h-4 w-4" />
            Contact our team
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
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
              Here to help
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              Every plant deserves a good journey.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Have a question about delivery or need support with an arrival?
              We’d be happy to help.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
