export const SITE_URL = "https://greenfit.in";

export const siteUrl = (path = "") => `${SITE_URL}${path}`;

/** Metadata `alternates` for a page's canonical URL; resolved against `metadataBase` in the root layout. */
export const canonicalAlternates = (path: string) => ({ canonical: path });

export const SITE_NAME = "GreenFit";
export const SITE_DESCRIPTION =
  "Plant-based diet plans, nutrition guides, recipes, and honest product checks for everyday Indian eating.";
