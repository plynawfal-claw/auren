import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A project shown as the thing it actually is: a site.
 *
 * Each project carries its own small motion language, played only while it is
 * the one in focus. The frame is shared; the behaviour inside it is not, so
 * the six projects do not read as six screenshots in the same box.
 *
 * All of it is transform and opacity, all of it stops under reduced motion,
 * and none of it plays on a card that is not in front.
 */
export type FrameMotion = "scan" | "scroll" | "panels" | "menu" | "crop" | "spatial";

const MOTION_CLASS: Record<FrameMotion, string> = {
  scan: "au-m-scan",
  scroll: "au-m-scroll",
  panels: "au-m-panels",
  menu: "au-m-menu",
  crop: "au-m-crop",
  spatial: "au-m-spatial",
};

export function BrowserFrame({
  src,
  alt,
  domain,
  badge,
  motion,
  active = false,
  priority = false,
  sizes = "(max-width: 768px) 86vw, 46vw",
  className,
}: {
  src: string;
  alt: string;
  domain?: string;
  /** Rendered for studio concepts so they are never mistaken for client work. */
  badge?: string;
  motion?: FrameMotion;
  active?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "spatial-object overflow-hidden rounded-xl border border-line bg-graphite shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-graphite-hi px-3.5 py-2.5">
        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </span>
        {domain && (
          <span className="ml-1 truncate font-mono text-[0.6rem] tracking-[0.08em] text-grey-deep">
            {domain}
          </span>
        )}
        {badge && (
          // This is the honesty label. It is never allowed to be the smallest
          // or faintest thing in the frame.
          <span className="ml-auto shrink-0 rounded-full border border-silver/45 px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-silver">
            {badge}
          </span>
        )}
      </div>

      <div className="relative aspect-[1440/838] w-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            motion && active && MOTION_CLASS[motion],
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
        </div>

        {/* The scan pass belongs to the plant app: it is what the product does. */}
        {motion === "scan" && active && (
          <span className="au-scanline pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />
        )}

        {/* Panels wipe like a window opening — PromoStore's actual product. */}
        {motion === "panels" && active && (
          <span className="au-panels pointer-events-none absolute inset-0" aria-hidden="true">
            <i /><i /><i />
          </span>
        )}
      </div>
    </figure>
  );
}

/** The same site on a phone. Used beside the desktop frame on case studies. */
export function DeviceFrame({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 40vw, 200px",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure
      className={cn(
        "spatial-object overflow-hidden rounded-[1.6rem] border border-line bg-graphite p-1.5 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div className="relative aspect-[460/926] w-full overflow-hidden rounded-[1.25rem]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </figure>
  );
}
