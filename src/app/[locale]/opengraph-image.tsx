import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { site, serviceLines } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.name} — ${site.tagline}`;

/** Site-wide card. Inherited by every page that does not define its own. */
export default function OpengraphImage() {
  const lead = serviceLines.find((s) => s.lead) ?? serviceLines[0];
  return renderOgImage({
    eyebrow: lead.name,
    title: site.tagline,
    fields: [
      { label: "Est.", value: String(site.founded) },
      { label: "Practice", value: lead.name },
    ],
  });
}
