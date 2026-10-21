import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"; // if you installed "framer-motion" instead, import from "framer-motion"
import { Sparkles, Grid, ArrowRight, Compass, Sprout, ShieldCheck, Leaf } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared animation settings                                           */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 150, damping: 18, mass: 0.3 };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const headline = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const word = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

/* Drifting decorative leaves in the background */
const LEAVES = [
  { top: "12%", left: "46%", size: 28, dur: 9, delay: 0, rot: 20 },
  { top: "70%", left: "8%", size: 22, dur: 11, delay: 1.5, rot: -25 },
  { top: "20%", left: "90%", size: 34, dur: 10, delay: 0.8, rot: 15 },
  { top: "82%", left: "55%", size: 24, dur: 12, delay: 2.2, rot: -18 },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** Headline words that rise and un-blur one after another. */
function Words({ text, className = "" }) {
  return text.split(" ").map((w, i) => (
    <motion.span key={i} variants={word} className={`inline-block mr-[0.25em] ${className}`}>
      {w}
    </motion.span>
  ));
}

/** Numbers that count up once they scroll into view. */
function CountUp({ to, decimals = 0, suffix = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const text = useTransform(
    value,
    (v) =>
      v.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: reduce ? 0 : 1.8,
      delay: reduce ? 0 : 0.6,
      ease: EASE,
    });
    return () => controls.stop();
  }, [inView, to, reduce, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

/** Wrapper that gently pulls its child toward the mouse pointer. */
function Magnetic({ children, className = "", strength = 0.25 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const move = (e) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** 3D tilt that follows the cursor, with a moving light glare. */
function TiltCard({ children, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0); // -0.5 .. 0.5
  const y = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`;

  const enter = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    animate(hover, 1, { duration: 0.3 });
  };
  const move = (e) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
    animate(hover, 0, { duration: 0.4 });
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full flex justify-center">
      <motion.div
        ref={ref}
        onPointerEnter={enter}
        onPointerMove={move}
        onPointerLeave={leave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
        <motion.div
          aria-hidden="true"
          style={{ background: glare, opacity: hover }}
          className="pointer-events-none absolute inset-0 rounded-3xl"
        />
      </motion.div>
    </div>
  );
}

/** Glass tag that pops in, then floats; sits "above" the photo in 3D. */
function FloatingTag({ className = "", delay = 0, duration = 4, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      style={{ z: 60 }}
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay: 0.9 + delay },
        scale: { type: "spring", stiffness: 200, damping: 14, delay: 0.9 + delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay: 1.2 + delay },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const reduce = useReducedMotion();

  // Mouse position over the whole hero (-0.5 .. 0.5) drives the background parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });
  const orb1X = useTransform(smx, [-0.5, 0.5], [-50, 50]);
  const orb1Y = useTransform(smy, [-0.5, 0.5], [-30, 30]);
  const orb2X = useTransform(smx, [-0.5, 0.5], [40, -40]);
  const orb2Y = useTransform(smy, [-0.5, 0.5], [25, -25]);
  const bgX = useTransform(smx, [-0.5, 0.5], [12, -12]);
  const bgY = useTransform(smy, [-0.5, 0.5], [8, -8]);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex items-center overflow-hidden"
    >
      {/* Background image with slow parallax */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=2000&q=80"
          alt="Botanical Nursery Background"
          style={{ x: bgX, y: bgY, scale: 1.08 }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ambient glow orbs that drift with the cursor */}
      <motion.div style={{ x: orb1X, y: orb1Y }} className="absolute top-1/4 left-10 pointer-events-none">
        <div className="w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-soft" />
      </motion.div>
      <motion.div style={{ x: orb2X, y: orb2Y }} className="absolute bottom-10 right-10 pointer-events-none">
        <div className="w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Slowly drifting leaves */}
      {!reduce &&
        LEAVES.map((l, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            style={{ top: l.top, left: l.left }}
            animate={{ y: [0, -24, 0], x: [0, 10, -6, 0], rotate: [0, l.rot, -l.rot / 2, 0] }}
            transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut" }}
            className="hidden sm:block absolute pointer-events-none text-emerald-300/20"
          >
            <Leaf style={{ width: l.size, height: l.size }} strokeWidth={1.5} />
          </motion.div>
        ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        {/* Left Hero Content */}
        <motion.div
          variants={container}
          initial={reduce ? "show" : "hidden"}
          animate="show"
          className="lg:col-span-7 space-y-5 sm:space-y-7 text-white text-center lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-800/70 border border-emerald-500/40 text-emerald-200 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> Premium Hand-Reared Botanical Collection
          </motion.div>

          <motion.h1
            variants={headline}
            className="serif-font text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight"
          >
            <Words text="Bring Nature Home with" />
            <Words text="Organic Botanical Care" className="text-emerald-400 italic" />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-emerald-100/90 text-xs sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
          >
            Discover pristine air-purifying indoor greenery, flowering balcony blooms, handcrafted ceramic planters, and customized landscape design delivered fresh from our nursery.
          </motion.p>

          {/* CTAs (magnetic) */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
          >
            <Magnetic className="w-full sm:w-auto">
              <Link
                to="/products"
                className="w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-emerald-950 font-extrabold px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group touch-active"
              >
                <Grid className="w-4 h-4" /> Explore All Plants{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            <Magnetic className="w-full sm:w-auto">
              <a
                href="#plant-quiz"
                className="w-full bg-emerald-900/80 border border-emerald-700/60 hover:bg-emerald-800 text-emerald-100 font-bold px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md touch-active"
              >
                <Compass className="w-4 h-4 text-emerald-400" /> Take Plant Matcher Quiz
              </a>
            </Magnetic>
          </motion.div>

          {/* Live Metrics (count up) */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-emerald-800/70 max-w-lg mx-auto lg:mx-0"
          >
            <div>
              <span className="serif-font text-xl sm:text-3xl font-extrabold text-amber-400">
                <CountUp to={12500} suffix="+" />
              </span>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/80 font-medium">Happy Parents</p>
            </div>
            <div>
              <span className="serif-font text-xl sm:text-3xl font-extrabold text-emerald-400">
                <CountUp to={100} suffix="%" />
              </span>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/80 font-medium">Organic Nursery</p>
            </div>
            <div>
              <span className="serif-font text-xl sm:text-3xl font-extrabold text-amber-400">
                <CountUp to={4.9} decimals={1} suffix=" ★" />
              </span>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/80 font-medium">Rating</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Hero Visual Feature: 3D tilt card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <TiltCard className="relative w-full max-w-sm sm:max-w-md aspect-[4/5]">
            {/* Photo (clipped); tags sit outside this wrapper so they can float in 3D */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Swiss Cheese Monstera Plant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Benefit Tag 1 */}
            <FloatingTag
              duration={4}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 glass-dark p-2.5 sm:p-3.5 rounded-2xl flex items-center gap-2.5 text-white shadow-xl"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                <Sprout className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold">Monstera Deliciosa</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-300">Air Purifier • Easy Care</p>
              </div>
            </FloatingTag>

            {/* Floating Benefit Tag 2 */}
            <FloatingTag
              delay={0.3}
              duration={5}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 glass-dark p-2.5 sm:p-3 rounded-2xl flex items-center gap-2 text-white shadow-xl"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span className="text-[10px] sm:text-xs font-semibold">7-Day Guarantee</span>
            </FloatingTag>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
