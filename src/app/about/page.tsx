import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "GreenFit helps people adopt practical nutrition using evidence, accessible foods, and transparent product checks.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-4xl font-semibold">About GreenFit</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          GreenFit helps people adopt practical nutrition through evidence, accessible foods, transparent product checks,
          and realistic diet planning.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Evidence", "Guides include references and reviewer placeholders so claims can improve over time."],
          ["Accessible foods", "Plans emphasize dals, chana, soy foods, grains, nuts, and practical dairy swaps."],
          ["Transparent checks", "Products use status and confidence instead of overconfident binary claims."],
        ].map(([title, description]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
      <DisclaimerBox />
    </section>
  );
}
