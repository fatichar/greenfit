import type { Metadata } from "next";
import { ShopCategoryPage } from "@/components/shop-category-page";
import { beautyFeaturedProducts, beautyProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Personal Care & Beauty products",
  description: "Checks for vegan suitability, ingredients, and value when choosing personal care and beauty products.",
};

const tags = ["Hair care", "Low-waste routine", "Everyday essentials", "Sun protection"];

export default function PersonalCareBeautyPage() {
  return (
    <ShopCategoryPage
      title="Personal Care & Beauty"
      description="Use the same approach you use for food: read the label, match the product to your needs, and skip claims you do not need to pay for."
      note="Label note: vegan, natural, clean, and cruelty-free can mean different things across brands and markets. Verify current claims, ingredients, allergens, and suitability for your own skin or hair before buying."
      tags={tags}
      products={beautyProducts}
      featuredProducts={beautyFeaturedProducts}
      itemSingular="product"
      itemPlural="products"
      activeHref="/shop/personal-care-beauty"
    />
  );
}
