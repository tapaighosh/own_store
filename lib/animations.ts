import { gsap } from "gsap";
import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// GSAP Ease Presets
// ---------------------------------------------------------------------------

/**
 * Shared GSAP ease strings used throughout the project.
 * Define here to keep animations consistent and easy to tune globally.
 */
export const eases = {
  /** Primary ease for entrances — smooth deceleration */
  smooth: "power3.out",
  /** For subtle element reveals */
  gentle: "power2.out",
  /** Strong, punchy snap for hero text */
  snap: "expo.out",
  /** Elastic overshoot — use sparingly for playful moments */
  elastic: "elastic.out(1, 0.3)",
  /** Standard ease for exits */
  exit: "power2.in",
  /** For scroll-linked parallax */
  linear: "none",
} as const;

/**
 * Shared GSAP default duration in seconds.
 */
export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  extraSlow: 1.4,
} as const;

/**
 * Reusable GSAP stagger config for list/grid reveals.
 */
export const staggerConfig = {
  cards: { amount: 0.4, from: "start" },
  text: { amount: 0.2, from: "start" },
  hero: { amount: 0.15, from: "start" },
} as const;

// ---------------------------------------------------------------------------
// Framer Motion Variants
// ---------------------------------------------------------------------------
// Defined outside components to prevent recreation on every render.

/**
 * Fade up entrance — use for product cards and content blocks.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // power3.out cubic-bezier equivalent
    },
  },
};

/**
 * Simple fade in — use for overlays, backgrounds, images.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Container variant that staggers its children.
 * Pair with `fadeUp` on children for a cascading reveal effect.
 *
 * @example
 * <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={fadeUp}>{item.name}</motion.li>
 *   ))}
 * </motion.ul>
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Scale and fade — use for modals, popovers, dropdown entrances.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

// ---------------------------------------------------------------------------
// Motion Preference Helper
// ---------------------------------------------------------------------------

/**
 * Returns `true` if the user has requested reduced motion via OS settings.
 *
 * ALWAYS check this before initiating GSAP or Framer Motion animations:
 * ```ts
 * if (!motionCheck()) {
 *   // run animation
 * }
 * ```
 *
 * Must be called on the client side (inside useLayoutEffect or useEffect).
 */
export function motionCheck(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Creates a GSAP context scoped to a container ref.
 * Handles cleanup on unmount automatically.
 *
 * @example
 * useLayoutEffect(() => {
 *   if (motionCheck()) return;
 *   const ctx = createGSAPContext(containerRef, (self) => {
 *     gsap.from(".hero-text", { y: 60, opacity: 0, ease: eases.snap });
 *   });
 *   return () => ctx.revert();
 * }, []);
 */
export function createGSAPContext(
  scope: React.RefObject<Element | null>,
  fn: (self: gsap.Context) => void
): gsap.Context {
  const ctx = gsap.context(fn, scope);
  return ctx;
}

// Re-export gsap for convenience so components don't need a separate import
export { gsap };

// React import needed for the RefObject type above
import type React from "react";
