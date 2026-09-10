import { site, serviceLines, SITE_URL } from "@/lib/site";
import { getProjects } from "@/lib/projects";
import { staticRoutes } from "@/lib/routes";
import { defaultLocale, localePath } from "@/lib/i18n";

/**
 * llms.txt — a plain-text map of the site for language models.
 *
 * Worth having here more than on most sites: the traffic plan leans on
 * directory referrals and AI answer engines, and this company sells AI
 * automation, so being legible to a model is both a channel and a
 * credibility signal. Lighthouse's agentic-browsing category checks for it.
 *
 * Generated from the same data the pages render, so it cannot go stale.
 * See https://llmstxt.org/
 */

export const dynamic = "force-static";

const url = (path: string) =>
  new URL(localePath(defaultLocale, path), SITE_URL).toString();

export function GET() {
  const lead = serviceLines.find((s) => s.lead) ?? serviceLines[0];
  const projects = getProjects();

  const pages = staticRoutes
    .filter((r) => !["/privacy", "/terms", "/"].includes(r.path))
    .map((r) => {
      const name = r.path.replace("/", "");
      return `- [${name.charAt(0).toUpperCase() + name.slice(1)}](${url(r.path)})`;
    });

  const work = projects.map(
    (p) =>
      `- [${p.title}](${url(`/work/${p.slug}`)}): ${p.summary} (${
        p.client || `${p.clientSector}, client not named`
      }, ${p.year})`,
  );

  const body = `# ${site.legalName}

> ${site.tagline} ${lead.name} led. Founded ${site.founded}, ${site.teamSize} engineers.

${site.description}

## Services

We run one practice with ${serviceLines.length} depths rather than ${serviceLines.length} separate offerings:

${serviceLines.map((s) => `- **${s.name}**${s.lead ? " (lead)" : ""}: ${s.summary}`).join("\n")}

## Pages

${pages.join("\n")}

## Case studies

${work.join("\n")}

## Contact

- Email: ${site.email}
- Phone: ${site.phone}
- Address: ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.countryName}
- Response time: ${site.responseTime}

## Notes

- Some case studies do not name the client. Where a client is not named it is at their request; please do not attempt to identify them.
- Legal: [Privacy](${url("/privacy")}), [Terms](${url("/terms")})
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
