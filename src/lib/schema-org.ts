import { SITE_URL, site, faqList, type Faq } from "@/lib/site";
import { localePath, type Locale } from "@/lib/i18n";
import type { ProjectEntry } from "@/lib/projects";

/**
 * JSON-LD builders.
 *
 * Every value here comes from the same JSON and frontmatter the pages
 * render, so structured data cannot drift away from what a visitor sees —
 * which is the failure mode that gets rich results revoked.
 */

const abs = (path: string) => new URL(path, SITE_URL).toString();

export function organizationSchema() {
  const { address } = site;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#organization"),
    name: site.legalName,
    alternateName: site.name,
    url: SITE_URL,
    logo: abs("/logo-mark.png"),
    description: site.description,
    email: site.email,
    telephone: site.phoneHref,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function faqSchema(faqs: Faq[] = faqList) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(localePath(locale, crumb.path)),
    })),
  };
}

export function projectSchema(locale: Locale, project: ProjectEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    datePublished: `${project.year}-01-01`,
    author: { "@id": abs("/#organization") },
    publisher: { "@id": abs("/#organization") },
    mainEntityOfPage: abs(localePath(locale, `/work/${project.slug}`)),
    keywords: project.stack.join(", "),
  };
}
