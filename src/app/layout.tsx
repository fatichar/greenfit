import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greenfit.in"),
  title: {
    default: "GreenFit",
    template: "%s | GreenFit",
  },
  description:
    "Practical nutrition guidance with diet plans, product checks, supplement comparisons, and evidence-based guides.",
  openGraph: {
    title: "GreenFit",
    description:
      "Practical nutrition guidance with diet plans, product checks, supplement comparisons, and evidence-based guides.",
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
      </body>
    </html>
  );
}
