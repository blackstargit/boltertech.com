import { notFound } from "next/navigation";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getProject, getProjects } from "@/lib/projects";
import { localeCodes } from "@/lib/i18n";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return localeCodes.flatMap((locale) =>
    getProjects().map((p) => ({ locale, slug: p.slug })),
  );
}

/**
 * Per-case-study card. The client field follows the same withheld rule as
 * the page itself, so a private client never leaks into a social preview.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgImage({
    eyebrow: project.category.replace("-", " "),
    title: project.title,
    fields: [
      {
        label: project.client ? "Client" : "Sector",
        value: project.client || project.clientSector,
      },
      { label: "Year", value: String(project.year) },
      ...(project.duration
        ? [{ label: "Duration", value: project.duration }]
        : []),
    ],
  });
}
