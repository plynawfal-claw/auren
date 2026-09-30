import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden pt-36 pb-20">
      {/* The studio motif: seven hairlines converging on a single point, the
          same gesture used in the contact CTA. Here the lines arrive at a
          dead-end dot rather than a promise — a visual joke that costs nothing
          and tells the visitor this is a designed page, not a server default. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        className="au-404-lines pointer-events-none absolute inset-x-0 top-24 h-[30%] w-full"
      >
        {[2, 18, 34, 50, 66, 82, 98].map((x, i) => (
          <line key={x} x1={x} y1={0} x2={50} y2={36} opacity={i === 3 ? 0.38 : 0.16} />
        ))}
        <circle cx="50" cy="36" r="1.1" fill="var(--color-grey-deep)" opacity="0.6" />
      </svg>

      <div className="shell relative z-10">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-grey-deep">
          Error 404
        </p>

        <h1 className="mt-8 max-w-[14ch] font-display text-[length:var(--text-statement)] leading-[0.92] tracking-[-0.03em]">
          Nothing lives<br />
          <em className="italic text-grey">at this address.</em>
        </h1>

        <p className="mt-8 max-w-[46ch] text-[length:var(--text-lead)] leading-relaxed text-silver">
          The page you asked for does not exist. Everything that does is one of
          these two clicks away.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-mineral px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink transition-transform duration-[var(--dur)] ease-[var(--ease)] hover:bg-mineral-hi active:scale-[0.97] active:duration-[120ms]"
          >
            View work
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/"
            className="magnetic-btn inline-flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mineral transition-colors duration-[var(--dur)] hover:border-silver active:scale-[0.97] active:duration-[120ms]"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-16 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-grey-deep">
          If you followed a link from our site,{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:text-mineral transition-colors">
            let us know
          </Link>{" "}
          and we will fix it.
        </p>
      </div>
    </section>
  );
}
