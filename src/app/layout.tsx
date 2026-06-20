import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { UmamiAnalytics } from "@/components/umami-analytics";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greenfit.in"),
  title: {
    default: "GreenFit",
    template: "%s | GreenFit",
  },
  description:
    "Practical nutrition guidance with plant-based diet plans, vegan product checks, supplement comparisons, and evidence-based WFPB guides.",
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
    title: "GreenFit",
    description:
      "Practical nutrition guidance with plant-based diet plans, vegan product checks, supplement comparisons, and evidence-based WFPB guides.",
    url: "https://greenfit.in",
    siteName: "GreenFit",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} ${plusJakarta.variable} min-h-screen antialiased`}>
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
