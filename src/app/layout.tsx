import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { UmamiAnalytics } from "@/components/umami-analytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const webmasterVerification: NonNullable<Metadata["other"]> = {};

if (process.env.GOOGLE_SITE_VERIFICATION) {
  webmasterVerification["google-site-verification"] = process.env.GOOGLE_SITE_VERIFICATION;
}

if (process.env.BING_SITE_VERIFICATION) {
  webmasterVerification["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "vegan diet",
    "plant based diet",
    "WFPB",
    "whole food plant based",
    "diet plans",
    "veganism",
    "vegetarian",
    "nutrition",
    "protein",
    "vegan health",
    "plant based nutrition",
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  other: webmasterVerification,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: siteUrl("/logos/greenfit-logo-header.png"),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <html lang="en">
      <body className={`${plusJakarta.className} ${plusJakarta.variable} min-h-screen antialiased`}>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <UmamiAnalytics />
      </body>
    </html>
  );
}
