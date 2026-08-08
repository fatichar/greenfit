export const shopNavItems = [
  {
    title: "Overview",
    href: "/shop",
    description: "All shop categories",
  },
  {
    title: "Supplements",
    href: "/shop/supplement",
    description: "Compare by nutrient and testing",
  },
  {
    title: "Exercise & Fitness",
    href: "/shop/exercise-fitness",
    description: "Cardio, strength, and home training",
  },
  {
    title: "Kitchen",
    href: "/shop/kitchen",
    description: "Devices for plant-based cooking",
  },
  {
    title: "Personal Care",
    href: "/shop/personal-care-beauty",
    description: "Everyday care and low-waste picks",
  },
  {
    title: "Books",
    href: "/shop/books",
    description: "Nutrition, training, and veganism",
  },
] as const;

export type ShopNavHref = (typeof shopNavItems)[number]["href"];
