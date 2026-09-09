import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
import { PageHero } from "@/components/primitives/TitleBlock";
import { Band } from "@/components/primitives/Band";
import { StoreProvider } from "@/store/Provider";
import { CostEstimator } from "@/components/estimate/CostEstimator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);
  return {
    title: m.estimate.metaTitle,
    description: m.estimate.metaDescription,
    alternates: {
      canonical: localePath(locale as Locale, "/estimate"),
      languages: languageAlternates("/estimate"),
    },
  };
}

export default async function EstimatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  return (
    <Band>
      <div className="grid gap-12">
        <PageHero
          eyebrow={m.estimate.eyebrow}
          title={m.estimate.heading}
          lede={m.estimate.lede}
        />
        {/* The store is mounted here and nowhere else on this page, so the
            rest of the site still ships no Redux. */}
        <StoreProvider>
          <CostEstimator messages={m} email={site.email} />
        </StoreProvider>
      </div>
    </Band>
  );
}
