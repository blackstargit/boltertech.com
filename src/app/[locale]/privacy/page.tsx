import type { Metadata } from "next";
import { LegalDocument, legalMetadata } from "@/components/pages/LegalDocument";
import type { Locale } from "@/lib/i18n";

const SLUG = "privacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, SLUG, "Privacy Policy");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalDocument locale={locale as Locale} slug={SLUG} />;
}
