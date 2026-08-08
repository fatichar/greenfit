import type { Metadata } from "next";
import { ShopCategoryPage } from "@/components/shop-category-page";
import { bookFeaturedProducts, bookProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Nutrition and fitness books",
  description: "Find books on plant-based nutrition, cooking, movement, and sustainable healthy habits.",
};

/** Keep filters short so the page stays scannable. */
const tags = ["Nutrition", "Training", "Veganism", "Cooking"];

export default function BooksPage() {
  return (
    <ShopCategoryPage
      title="Books worth making room for"
      description="A good book should help you make a better decision this week, not just add more rules. Use the filters to find reading that fits your goals and how you learn."
      note="Reading note: nutrition and fitness advice can age quickly. Prefer current editions, look for transparent references, and treat personal recommendations as context rather than medical advice."
      tags={tags}
      products={bookProducts}
      featuredProducts={bookFeaturedProducts}
      itemSingular="book"
      itemPlural="books"
      activeHref="/shop/books"
    />
  );
}
