/**
 * Compatibility shim.
 *
 * The motion system now lives in `components/providers/smooth-scroll.tsx`,
 * which adds the global depth camera and Motion scroll choreography on top of
 * Lenis wheel scrolling. Re-exported here so any remaining
 * import of `MotionProvider` keeps working.
 */
export { SmoothScrollProvider as MotionProvider } from "@/components/providers/smooth-scroll";
