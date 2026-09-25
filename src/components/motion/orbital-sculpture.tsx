import { cn } from "@/lib/cn";

/** CSS 3D object: one camera, intersecting material rings and a lit core. */
export function OrbitalSculpture({ className }: { className?: string }) {
  return (
    <div className={cn("orbital-sculpture", className)} aria-hidden="true">
      <div className="orbital-sculpture__assembly">
        <span className="orbital-sculpture__ring orbital-sculpture__ring--a" />
        <span className="orbital-sculpture__ring orbital-sculpture__ring--b" />
        <span className="orbital-sculpture__ring orbital-sculpture__ring--c" />
        <span className="orbital-sculpture__core" />
      </div>
      <span className="orbital-sculpture__ground" />
    </div>
  );
}
