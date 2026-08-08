import type { Metadata } from "next";
import Image from "next/image";
import { DeviceDirectory } from "@/components/device-directory";
import { ShopProductCarousel } from "@/components/shop-product-carousel";
import { ShopShell } from "@/components/shop-shell";
import { devices } from "@/lib/data";
import { kitchenFeaturedProducts, kitchenProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Plant-Based Kitchen Devices",
  description: "Guides to blenders, cold-press juicers, food processors, pressure cookers, and other plant-based cooking tools.",
  keywords: [
    "plant based kitchen appliances",
    "vegan kitchen devices",
    "cold press juicer",
    "blender for smoothies",
    "plant based cooking appliances",
  ],
};

export default function KitchenPage() {
  return (
    <ShopShell activeHref="/shop/kitchen">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-primary">GreenFit shop · Kitchen</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold">Devices that make plant-based cooking easier</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            A focused shortlist of appliances for smoothies, homemade plant milk, legumes, sauces, batch prep, and the occasional fresh juice. Choose what you will use every week, not the appliance with the longest feature list.
          </p>
        </div>
        <Image
          src="/images/devices/plant-based-kitchen-devices.png"
          alt="Blender, cold-press juicer, and pressure cooker surrounded by leafy greens, citrus, carrots, chickpeas, and lentils"
          width={1600}
          height={1000}
          priority
          className="aspect-[16/10] w-full rounded-2xl border border-olive-200 object-cover shadow-sm"
        />
      </div>
      <ShopProductCarousel
        products={kitchenProducts}
        featuredProducts={kitchenFeaturedProducts}
        tags={["Prep", "Juicing", "Batch cooking", "Cooking"]}
        sourcePage="Kitchen"
        itemSingular="device"
        itemPlural="devices"
        description="Start with the tools that make plant-based prep easier to repeat."
      />
      <div className="rounded-xl border border-olive-200 bg-olive-50/70 px-5 py-4 text-sm leading-6 text-olive-800">
        Buying note: appliance prices, availability, warranties, and specifications change. Treat the Amazon link as an example to inspect, then verify the current listing and return policy before buying.
      </div>
      <DeviceDirectory devices={devices} />
      <p className="text-sm leading-6 text-muted-foreground">
        Amazon Associate disclosure: GreenFit may earn from qualifying purchases. Product links are provided as examples, not endorsements or a substitute for checking fit, safety, warranty, and after-sales support.
      </p>
    </ShopShell>
  );
}
