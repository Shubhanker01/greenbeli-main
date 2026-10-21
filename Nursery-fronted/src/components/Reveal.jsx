import React, { createContext, useContext } from "react";
import { motion, useReducedMotion } from "motion/react"; // or "framer-motion"

/**
 * Scroll-reveal helpers.
 *
 *  <Reveal>            one element that animates in when scrolled into view
 *  <RevealGroup>       a container that staggers the <Reveal>s inside it
 *
 * <Reveal> works on its own, or inside a <RevealGroup> (then the group
 * decides the timing). Groups can be nested: only the outermost one watches
 * the scroll position, the rest just pass the signal down.
 */

const EASE = [0.22, 1, 0.36, 1];

const EFFECTS = {
    none: { hidden: {}, show: {} },
    fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
    fadeUp: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
    rise: { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } },
    card: {
        hidden: { opacity: 0, y: 50, scale: 0.94 },
        show: { opacity: 1, y: 0, scale: 1 },
    },
    zoom: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
    slideLeft: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
    slideRight: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
};

// true once we are inside a RevealGroup
const InsideGroup = createContext(false);

function build(effect, transition) {
    const e = EFFECTS[effect] || EFFECTS.fadeUp;
    return { hidden: e.hidden, show: { ...e.show, transition } };
}

/** Props that make an element watch the scroll (only used by the outermost one). */
function useTrigger(inside, once, amount, margin) {
    const reduce = useReducedMotion();
    if (inside) return { reduce, trigger: {} };
    return {
        reduce,
        trigger: {
            initial: reduce ? "show" : "hidden",
            whileInView: "show",
            viewport: { once, amount, ...(margin ? { margin } : {}) },
        },
    };
}

/**
 * Container that reveals its children one after another.
 *
 * Props
 *  as        tag to render (default "div"; e.g. "section", "ul")
 *  effect    how the container itself appears: "none" (default) | "rise" | "fadeUp" | ...
 *  stagger   seconds between children (default 0.12)
 *  delay     seconds to wait before the first child (default 0.1)
 *  duration  seconds for the container's own effect (default 0.8)
 *  once      play only the first time it's seen (default true)
 *  amount    0-1, how much must be visible to trigger (default 0.15)
 *  margin    e.g. "0px 0px -100px 0px" to trigger later
 */
export function RevealGroup({
    as = "div",
    effect = "none",
    stagger = 0.12,
    delay = 0.1,
    duration = 0.8,
    once = true,
    amount = 0.15,
    margin,
    className,
    children,
    ...rest
}) {
    const inside = useContext(InsideGroup);
    const { trigger } = useTrigger(inside, once, amount, margin);
    const Tag = motion[as] || motion.div;

    const variants = build(effect, {
        duration,
        ease: EASE,
        when: "beforeChildren",
        staggerChildren: stagger,
        delayChildren: delay,
    });

    return (
        <InsideGroup.Provider value={true}>
            <Tag variants={variants} className={className} {...trigger} {...rest}>
                {children}
            </Tag>
        </InsideGroup.Provider>
    );
}

/**
 * A single element that fades/slides in.
 *
 * Props
 *  as        tag to render (default "div")
 *  effect    "fadeUp" (default) | "fade" | "rise" | "card" | "zoom" | "slideLeft" | "slideRight"
 *  delay     extra seconds to wait (default 0). Standalone only: inside a
 *            <RevealGroup> the group's `stagger` sets the timing instead
 *  duration  seconds (default 0.6)
 *  once / amount / margin  same as RevealGroup (used only when not inside a group)
 */
export function Reveal({
    as = "div",
    effect = "fadeUp",
    delay = 0,
    duration = 0.6,
    once = true,
    amount = 0.15,
    margin,
    className,
    children,
    ...rest
}) {
    const inside = useContext(InsideGroup);
    const { trigger } = useTrigger(inside, once, amount, margin);
    const Tag = motion[as] || motion.div;
    // Inside a group the group's stagger decides the timing. Setting `delay` here (even 0)
    // would override that slot, so it is only applied to standalone reveals.
    const variants = build(effect, {
        duration: effect === "card" ? 0.7 : duration,
        ease: EASE,
        ...(!inside && delay ? { delay } : {}),
    });

    return (
        <Tag variants={variants} className={className} {...trigger} {...rest}>
            {children}
        </Tag>
    );
}
