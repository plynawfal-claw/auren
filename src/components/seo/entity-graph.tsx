import { practices } from "@/content/practices";
import { founder, site, siteUrl } from "@/config/site";

/**
 * The entity graph.
 *
 * One `@graph` carrying Organization, Person and ProfessionalService, with
 * stable `@id` anchors so every other page on the site can reference these
 * nodes instead of redeclaring them.
 *
 * The Person↔Organization link is the part that matters and the part most
 * agency sites skip. A studio is a string until a named person is attached to
 * it with resolvable profiles; after that it is an entity that a generative
 * retriever can cite rather than paraphrase.
 *
 * `sameAs` is emitted only when real profile URLs exist. An empty array is
 * better than an invented one.
 */
export function EntityGraph() {
  const org = `${siteUrl}/#organization`;
  const person = `${siteUrl}/#founder`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: site.name,
        legalName: site.legalName,
        url: siteUrl,
        description: site.description,
        slogan: site.tagline,
        founder: { "@id": person },
        knowsAbout: practices.flatMap((d) => d.disciplines),
        areaServed: [
          { "@type": "Country", name: "Morocco" },
          { "@type": "Place", name: "Worldwide" },
        ],
        ...(founder.sameAs.length ? { sameAs: founder.sameAs } : {}),
      },
      {
        "@type": "Person",
        "@id": person,
        name: founder.name,
        jobTitle: founder.role,
        worksFor: { "@id": org },
        ...(founder.sameAs.length ? { sameAs: founder.sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: site.name,
        url: siteUrl,
        description: site.description,
        parentOrganization: { "@id": org },
        areaServed: { "@type": "Country", name: "Morocco" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Capabilities",
          itemListElement: practices.map((d) => ({
            "@type": "OfferCatalog",
            name: d.label,
            description: d.definition,
            itemListElement: d.disciplines.map((c) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: c },
            })),
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: site.description,
        inLanguage: ["en", "fr-MA", "ar-MA"],
        publisher: { "@id": org },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
