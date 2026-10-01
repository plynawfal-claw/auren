import { practices } from "@/content/practices";
import { site, siteUrl } from "@/config/site";

/**
 * The entity graph.
 *
 * One `@graph` carrying Organization, WebSite and ProfessionalService, with
 * stable `@id` anchors so every other page on the site can reference these
 * nodes instead of redeclaring them. No person is named: the studio is
 * presented as an organisation only.
 */
export function EntityGraph() {
  const org = `${siteUrl}/#organization`;

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
        knowsAbout: practices.flatMap((d) => d.disciplines),
        areaServed: [
          { "@type": "Country", name: "Morocco" },
          { "@type": "Place", name: "Worldwide" },
        ],
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
