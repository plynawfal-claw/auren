import { practices } from "@/content/practices";
import { contact, site, siteUrl } from "@/config/site";
import { siteConfig } from "@/config/siteConfig";
import { northCities } from "@/content/landings";

/**
 * The entity graph.
 *
 * One `@graph` carrying Organization, WebSite and ProfessionalService, with
 * stable `@id` anchors so every other page on the site can reference these
 * nodes instead of redeclaring them. No person is named: the studio is
 * presented as an organisation only.
 *
 * The ProfessionalService node is the LocalBusiness: based in Tangier, serving
 * the North in person and the rest of Morocco remotely. It is a service-area
 * business, so the address stops at the city — no street, no geo point, no
 * opening hours, because none of those are published anywhere else either.
 * Every value here must match the Google Business Profile word for word.
 */
export function EntityGraph() {
  const org = `${siteUrl}/#organization`;
  const logo = `${siteUrl}/brand/auren-logo.png`;
  const telephone = `+${contact.whatsapp}`;
  const address = {
    "@type": "PostalAddress",
    addressLocality: site.cityFr,
    addressRegion: site.adminRegion,
    addressCountry: site.country,
  };
  const sameAs = siteConfig.sameAs.length > 0 ? { sameAs: [...siteConfig.sameAs] } : {};

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
        logo: { "@type": "ImageObject", url: logo, width: 512, height: 512 },
        email: contact.email,
        telephone,
        address,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone,
          email: contact.email,
          areaServed: "MA",
          availableLanguage: ["French", "Arabic", "English"],
        },
        knowsAbout: practices.flatMap((d) => d.disciplines),
        areaServed: [
          { "@type": "Country", name: "Morocco" },
          { "@type": "Place", name: "Worldwide" },
        ],
        ...sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: site.name,
        url: siteUrl,
        description: site.description,
        parentOrganization: { "@id": org },
        image: logo,
        logo,
        email: contact.email,
        telephone,
        address,
        areaServed: [
          ...northCities.map((name) => ({ "@type": "City", name })),
          { "@type": "Country", name: "Morocco" },
        ],
        ...sameAs,
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
