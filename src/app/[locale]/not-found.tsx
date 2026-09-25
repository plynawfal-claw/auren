import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col justify-center pt-36 pb-20">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1 className="mt-6 max-w-[18ch] text-[length:var(--text-display)]">
          Nothing here.
        </h1>
        <p className="lead mt-7 max-w-[46ch]">
          The page you asked for does not exist. The work and the capabilities
          are both one click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href="/work"
            className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mineral underline-offset-4 hover:underline"
          >
            View work →
          </Link>
          <Link
            href="/services"
            className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mineral underline-offset-4 hover:underline"
          >
            Capabilities →
          </Link>
        </div>
      </div>
    </section>
  );
}
