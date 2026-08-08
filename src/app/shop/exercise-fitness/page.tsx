import type { Metadata } from "next";
import { ShopCategoryPage } from "@/components/shop-category-page";
import { exerciseFeaturedProducts, exerciseProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Exercise & Fitness products",
  description: "Guidance for choosing exercise equipment for strength, cardio, mobility, and recovery.",
};

const tags = [
  "Cardio",
  "Strength & resistance",
  "Small-space training",
  "Bodyweight training",
  "Mobility & recovery",
];

export default function ExerciseFitnessPage() {
  return (
    <ShopCategoryPage
      title="Exercise & Fitness"
      description="The best setup is the one you will use. Look for equipment that fits your routine, covers more than one exercise, and earns its space at home."
      note="Buying note: large machines are worth it only if space, noise, and service support fit your home. Check load limits, continuous motor rating, footprint, warranty, and return terms before buying. Skip one-trick machines you cannot picture using three times a week."
      tags={tags}
      products={exerciseProducts}
      featuredProducts={exerciseFeaturedProducts}
      itemSingular="item"
      itemPlural="items"
      activeHref="/shop/exercise-fitness"
    />
  );
}
