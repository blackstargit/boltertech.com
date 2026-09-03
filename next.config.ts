import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Enables app/global-not-found.tsx.
     *
     * Needed because this app's root layout lives under a top-level
     * dynamic segment (app/[locale]/layout.tsx) — the exact case Next
     * documents this flag for. Without it, a 404 renders in Next's error
     * shell with no stylesheet and no lang attribute: unstyled, and a
     * WCAG failure for missing document language.
     *
     * Experimental as of Next 16.3. If it is ever removed, the fallback is
     * a plain not-found.tsx with inline styles rather than Tailwind classes.
     */
    globalNotFound: true,
  },
};

export default nextConfig;
