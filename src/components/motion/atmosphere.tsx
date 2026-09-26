/**
 * Atmosphere.
 *
 * Two layers, both fixed, both below the chrome and above the content: a
 * desaturated film grain and a soft vignette.
 *
 * Neither is decoration for its own sake. The grain gives the large flat ink
 * fields a surface — without it, an obsidian page at this size reads as a
 * screenshot of a page rather than as a printed surface. The vignette is what
 * keeps the eye in the middle of a 1440px layout.
 *
 * Pure CSS, no canvas, no JavaScript, nothing to run on the main thread. Both
 * are pointer-events:none, and neither carries meaning, so both are hidden
 * from assistive tech.
 */
export function Atmosphere() {
  return (
    <div className="au-atmosphere" aria-hidden="true">
      <div className="au-grain" />
      <div className="au-vignette" />
    </div>
  );
}
