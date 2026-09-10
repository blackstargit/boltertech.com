import type { Metadata } from "next";

import { getMessages, localePath, type Locale } from "@/lib/i18n";
import { languageAlternates } from "@/lib/routes";
import { site } from "@/lib/site";
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
    // flush + a small custom padding, not the site's usual py-section: this
    // page's whole point is that the estimator itself is the first thing a
    // visitor sees, not a full marketing hero pushing it below the fold.
    <Band flush className="pt-8 pb-16 sm:pt-10">
      {/* The store is mounted here and nowhere else on this page, so the
          rest of the site still ships no Redux. */}
      <StoreProvider>
        <CostEstimator messages={m} email={site.email} />
      </StoreProvider>
    </Band>
  );
}
