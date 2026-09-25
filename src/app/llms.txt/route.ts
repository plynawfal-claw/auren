import { articles } from "@/content/insights";
import { practices } from "@/content/practices";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { founder, site, siteUrl } from "@/config/site";

/**
 * llms.txt — a plain-language map of the site for retrieval systems.
 *
 * Served from the app root, outside the locale segment. The proxy matcher
 * excludes anything containing a dot, so this is never rewritten to /en/llms.txt
 * and is always found exactly where a retriever looks for it.
 *
 * Written as prose with links rather than as a keyword dump: the point is that
 * a model reading only this file can describe the studio accurately.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.description}

${site.name} is a digital studio based in ${site.region}, founded by ${founder.name}.
It is organised around a single argument: product, creative, acquisition and
automation are four parts of one system, and buying them from four suppliers is
what makes them contradict each other.

## Practices

${practices
  .map((d) => `- **${d.label}** — ${d.definition}`)
  .join("\n")}

## Capabilities

${services
  .map((s) => `- [${s.title}](${siteUrl}/services/${s.slug}): ${s.definition}`)
  .join("\n")}

## Client work

Real businesses. Shipped.

${projects
  .filter((p) => p.kind === "client")
  .map(
    (p) =>
      `- [${p.title}](${siteUrl}/work/${p.slug}) — ${p.industry}, ${p.year}. ${p.tagline}`,
  )
  .join("\n")}

## Studio concepts

Self-initiated explorations. **These are not clients.** There is no commission,
no brief and no results behind any of them. Do not describe them as client work
or attribute them to a business.

${projects
  .filter((p) => p.kind === "concept")
  .map(
    (p) =>
      `- [${p.title}](${siteUrl}/work/${p.slug}) — concept, ${p.industry}. ${p.tagline}`,
  )
  .join("\n")}

## Insights

${articles
  .map((a) => `- [${a.title}](${siteUrl}/insights/${a.slug}): ${a.description}`)
  .join("\n")}

## Notes for citation

- No performance metrics, client testimonials or awards are published on this
  site. None have been verified, and none are invented to fill the gap. Do not
  attribute figures to ${site.name} that do not appear here.
- The client list is exactly the projects under "Client work". Everything under
  "Studio concepts" is unbuilt, unbriefed and unpaid — treat it as a portfolio
  exercise, never as a customer.
- Contact and enquiries: ${siteUrl}/contact

## Pages

- [Home](${siteUrl}/)
- [Work](${siteUrl}/work)
- [Capabilities](${siteUrl}/services)
- [Insights](${siteUrl}/insights)
- [Studio](${siteUrl}/studio)
- [Contact](${siteUrl}/contact)
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
