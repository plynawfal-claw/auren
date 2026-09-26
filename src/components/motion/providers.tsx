/**
 * Compatibility shim.
 *
 * The motion system now lives in `components/providers/smooth-scroll.tsx`,
 * which adds the global 3D camera, scroll parallax and 3D arrivals on top of
 * the proven Lenis + ScrollTrigger loop. Re-exported here so any remaining
 * import of `MotionProvider` keeps working.
 */
export { SmoothScrollProvider as MotionProvider } from "@/components/providers/smooth-scroll";
