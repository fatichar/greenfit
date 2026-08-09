export const shopNavItems = [
  {
    title: "Overview",
    href: "/shop",
    description: "Browse all categories",
  },
  {
    title: "Supplements",
    href: "/shop/supplement",
    description: "Compare nutrients and test results",
  },
  {
    title: "Exercise & Fitness",
    href: "/shop/exercise-fitness",
    description: "Cardio, strength, and home workouts",
  },
  {
    title: "Kitchen",
    href: "/shop/kitchen",
    description: "Tools for plant-based cooking",
  },
  {
    title: "Wellness",
    href: "/shop/wellness",
    description: "Tracking, oral care, and home health",
  },
  {
    title: "Books",
    href: "/shop/books",
    description: "Nutrition, training, and vegan living",
  },
] as const;

export type ShopNavHref = (typeof shopNavItems)[number]["href"];
