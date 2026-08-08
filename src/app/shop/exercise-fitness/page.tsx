import type { Metadata } from "next";
import { ShopCategoryPage } from "@/components/shop-category-page";
import { exerciseFeaturedProducts, exerciseProducts } from "@/lib/shop-products";

export const metadata: Metadata = {
  title: "Exercise & Fitness products",
  description: "Practical guidance for choosing exercise and fitness equipment for strength, cardio, mobility, and recovery.",
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
      description="A good setup is the one that lowers the friction to move. Prefer equipment you will use weekly—cardio machines with a clear routine, strength tools that cover many lifts, and small accessories that remove friction—not gadgets that look clever once."
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
