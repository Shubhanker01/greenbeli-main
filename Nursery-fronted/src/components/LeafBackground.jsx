// components/LeafBackground.jsx
// Soft falling/swaying leaves behind the whole page. Pure CSS animation (transform only),
// so it stays smooth, never blocks clicks, and switches itself off for "reduce motion".
import React from "react";

const PALETTE = ["#1f4a34", "#2f6b4a", "#4f7d57", "#8fb08a", "#cfe3c8"]; // deep green -> sage, all sit well on #f6f3ea

// Tiny seeded random generator: same leaves on every render and every reload (no flicker, no re-layout)
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeLeaves(count) {
  const rand = mulberry32(2026);
  const between = (a, b) => a + rand() * (b - a);
  return Array.from({ length: count }, (_, i) => {
    const size = Math.round(between(26, 86));
    const far = size > 60; // big leaves = "out of focus" foreground: fainter and blurred
    const fall = between(30, 58);
    return {
      id: i,
      shape: ["a", "b", "c"][Math.floor(rand() * 3)],
      left: between(-2, 100),
      size,
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      opacity: far ? between(0.06, 0.1) : between(0.1, 0.2),
      blur: far ? between(1.5, 3) : between(0, 0.8),
      fall,
      delay: -rand() * fall,                 // negative = already mid-fall at page load
      sway: between(5, 9),
      swayDelay: -rand() * 8,
      swing: Math.round(between(22, 55)),    // px drift left/right
      tilt: Math.round(between(18, 45)),     // degrees rocking
      startRot: Math.round(between(0, 360)),
    };
  });
}

const CSS = `
.leafbg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: -10; }
.leafbg-fall { position: absolute; top: 0; will-change: transform;
  animation: leafbg-fall var(--fall) linear var(--delay) infinite; }
.leafbg-sway { width: 100%; height: 100%; will-change: transform;
  animation: leafbg-sway var(--sway) ease-in-out var(--sway-delay) infinite alternate; }
.leafbg-sway svg { display: block; width: 100%; height: 100%; transform: rotate(var(--rot)); }
.leafbg-extra { display: none; }
@keyframes leafbg-fall { from { transform: translate3d(0, -14vh, 0); } to { transform: translate3d(0, 114vh, 0); } }
@keyframes leafbg-sway {
  from { transform: translateX(calc(var(--swing) * -1)) rotate(calc(var(--tilt) * -1deg)); }
  to   { transform: translateX(var(--swing)) rotate(calc(var(--tilt) * 1deg)); }
}
@media (min-width: 640px) { .leafbg-extra { display: block; } }
@media (prefers-reduced-motion: reduce) {
  .leafbg-fall, .leafbg-sway { animation: none; }
  .leafbg-fall { top: calc(var(--rest) * 1vh); }
}
`;

export default function LeafBackground({ count = 16, intensity = 1, className = "" }) {
  const leaves = React.useMemo(() => makeLeaves(count), [count]);

  return (
    <div aria-hidden="true" className={`leafbg ${className}`}>
      <style>{CSS}</style>

      {/* Shapes defined once, reused by every leaf */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <symbol id="leafbg-a" viewBox="0 0 100 100">
            <path d="M50 3 C84 28 88 66 50 97 C12 66 16 28 50 3 Z" fill="currentColor" />
            <path d="M50 14 L50 90 M50 40 L34 28 M50 56 L68 42 M50 70 L34 58" stroke="#f6f3ea" strokeOpacity=".55" strokeWidth="2" fill="none" strokeLinecap="round" />
          </symbol>
          <symbol id="leafbg-b" viewBox="0 0 100 100">
            <path d="M50 95 C8 70 4 30 30 14 C42 7 50 14 50 23 C50 14 58 7 70 14 C96 30 92 70 50 95 Z" fill="currentColor" />
            <path d="M50 90 L50 28 M50 62 L28 42 M50 62 L72 42" stroke="#f6f3ea" strokeOpacity=".55" strokeWidth="2" fill="none" strokeLinecap="round" />
          </symbol>
          <symbol id="leafbg-c" viewBox="0 0 100 100">
            <path d="M50 1 C68 30 68 70 50 99 C32 70 32 30 50 1 Z" fill="currentColor" />
            <path d="M50 10 L50 92" stroke="#f6f3ea" strokeOpacity=".55" strokeWidth="2" fill="none" strokeLinecap="round" />
          </symbol>
        </defs>
      </svg>

      {leaves.map((l, i) => (
        <div
          key={l.id}
          className={`leafbg-fall ${i >= 9 ? "leafbg-extra" : ""}`}
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            opacity: Math.min(l.opacity * intensity, 0.5),
            filter: l.blur ? `blur(${l.blur}px)` : undefined,
            color: l.color,
            "--fall": `${l.fall}s`,
            "--delay": `${l.delay}s`,
            "--rest": (l.id * 37) % 100, // where it rests when motion is reduced
          }}
        >
          <div
            className="leafbg-sway"
            style={{ "--sway": `${l.sway}s`, "--sway-delay": `${l.swayDelay}s`, "--swing": `${l.swing}px`, "--tilt": l.tilt }}
          >
            <svg style={{ "--rot": `${l.startRot}deg` }}>
              <use href={`#leafbg-${l.shape}`} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}