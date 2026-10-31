import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const LEAF_COLORS = [
  "#14532d",
  "#166534",
  "#15803d",
  "#16a34a",
  "#22c55e",
  "#1f4a34",
  "#2f6b4a",
];

export const LEAF_PATHS = [
  "M50 3 C84 28 88 66 50 97 C12 66 16 28 50 3 Z",
  "M50 95 C8 70 4 30 30 14 C42 7 50 14 50 23 C50 14 58 7 70 14 C96 30 92 70 50 95 Z",
  "M50 1 C68 30 68 70 50 99 C32 70 32 30 50 1 Z",
];

/** Soft clusters parked in the cream background (corners / gutters), not over content. */
export const CLUSTERS = [
  { top: "4%", left: "-2%", count: 7 },
  { top: "8%", right: "-1%", count: 6 },
  { top: "38%", left: "-3%", count: 5 },
  { top: "42%", right: "-2%", count: 6 },
  { top: "72%", left: "0%", count: 5 },
  { top: "78%", right: "-1%", count: 6 },
];

export function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeClusterLeaves(clusterIndex, count) {
  const rand = mulberry32(2026 + clusterIndex * 97);
  const between = (a, b) => a + rand() * (b - a);

  return Array.from({ length: count }, (_, id) => ({
    id: `${clusterIndex}-${id}`,
    path: LEAF_PATHS[Math.floor(rand() * LEAF_PATHS.length)],
    color: LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)],
    x: between(-10, 110),
    y: between(-10, 110),
    size: Math.round(between(64, 120)),
    opacity: between(0.22, 0.38),
    rotate: between(-40, 40),
    floatX: between(6, 18) * (rand() > 0.5 ? 1 : -1),
    floatY: between(8, 22) * (rand() > 0.5 ? 1 : -1),
    tilt: between(6, 16) * (rand() > 0.5 ? 1 : -1),
    duration: between(5.5, 9.5),
    delay: between(0, 2.5),
  }));
}

export function SoftLeaf({ leaf, reduceMotion }) {
  const style = {
    left: `${leaf.x}%`,
    top: `${leaf.y}%`,
    width: leaf.size,
    height: leaf.size,
    opacity: leaf.opacity,
    color: leaf.color,
  };

  const svg = (
    <svg viewBox="0 0 100 100" className="block h-full w-full">
      <path d={leaf.path} fill="currentColor" />
      <path
        d="M50 14 L50 88"
        stroke="#f6f3ea"
        strokeOpacity="0.4"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ ...style, rotate: `${leaf.rotate}deg` }}
      >
        {svg}
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={style}
      initial={{ x: 0, y: 0, rotate: leaf.rotate }}
      animate={{
        x: [0, leaf.floatX, 0, -leaf.floatX * 0.6, 0],
        y: [0, -leaf.floatY, 0, leaf.floatY * 0.5, 0],
        rotate: [
          leaf.rotate,
          leaf.rotate + leaf.tilt,
          leaf.rotate,
          leaf.rotate - leaf.tilt,
          leaf.rotate,
        ],
      }}
      transition={{
        duration: leaf.duration,
        delay: leaf.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {svg}
    </motion.div>
  );
}

export default function LeafClusters() {
  const reduceMotion = useReducedMotion();
  const clusters = useMemo(
    () =>
      CLUSTERS.map((cluster, i) => ({
        ...cluster,
        leaves: makeClusterLeaves(i, cluster.count),
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {clusters.map((cluster, i) => (
        <div
          key={i}
          className="absolute h-72 w-72 sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem]"
          style={{
            top: cluster.top,
            left: cluster.left,
            right: cluster.right,
          }}
        >
          {cluster.leaves.map((leaf) => (
            <SoftLeaf key={leaf.id} leaf={leaf} reduceMotion={reduceMotion} />
          ))}
        </div>
      ))}
    </div>
  );
}
