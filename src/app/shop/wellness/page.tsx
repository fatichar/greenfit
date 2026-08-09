import type { Metadata } from "next";
import { ShopCategoryPage } from "@/components/shop-category-page";
import { wellnessFeaturedProducts, wellnessProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Wellness products",
  description: "Practical wellness tools for tracking, sun protection, oral care, recovery, and home health—chosen for real use, not vanity gadgets.",
};

const tags = ["Tracking", "Sun protection", "Oral care", "Home health", "Recovery", "Everyday essentials"];

export default function WellnessPage() {
  return (
    <ShopCategoryPage
      title="Wellness"
      description="Focus on tools that support habits you already care about: clearer food portions, sun protection, oral care, recovery, and simple home health checks—not another drawer full of unused gadgets."
      note="Health note: home devices support awareness; they do not replace clinical care. For blood pressure, fever, or ongoing symptoms, follow medical advice and use validated devices as directed."
      tags={tags}
      products={wellnessProducts}
      featuredProducts={wellnessFeaturedProducts}
      itemSingular="product"
      itemPlural="products"
      activeHref="/shop/wellness"
    />
  );
}
