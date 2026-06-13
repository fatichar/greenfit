const itemImageFallback = "/images/greenfit-hero.jpg";

const dietPlanImages: Record<string, string> = {
  "high-protein-diet": "/images/items/diet-plans/high-protein-diet.jpg",
  "weight-loss-diet": "/images/items/diet-plans/weight-loss-diet.jpg",
  "muscle-gain-diet": "/images/items/diet-plans/muscle-gain-diet.jpg",
  "budget-diet": "/images/items/diet-plans/budget-diet.jpg",
  "simple-beginner-plan": "/images/items/diet-plans/simple-beginner-plan.jpg",
  "south-indian-plan": "/images/items/diet-plans/south-indian-plan.jpg",
  "north-indian-plan": "/images/items/diet-plans/north-indian-plan.jpg",
  "no-onion-no-garlic-plan": "/images/items/diet-plans/no-onion-no-garlic-plan.jpg",
};

const productImages: Record<string, string> = {
  "sample-plant-protein": "/images/items/products/sample-plant-protein.jpg",
  "fortified-soy-milk": "/images/items/products/fortified-soy-milk.jpg",
  "masala-oats-pack": "/images/items/products/masala-oats-pack.jpg",
  "dairy-whey-isolate": "/images/items/products/dairy-whey-isolate.jpg",
  "peanut-curd-culture": "/images/items/products/peanut-curd-culture.jpg",
};

const supplementImages: Record<string, string> = {
  "sample-b12": "/images/items/supplements/sample-b12.jpg",
  "vegan-d3": "/images/items/supplements/vegan-d3.jpg",
  "algal-omega-3": "/images/items/supplements/algal-omega-3.jpg",
  "creatine-monohydrate": "/images/items/supplements/creatine-monohydrate.jpg",
  "basic-multivitamin": "/images/items/supplements/basic-multivitamin.jpg",
  "plant-protein-blend": "/images/items/supplements/plant-protein-blend.jpg",
};

const guideImages: Record<string, string> = {
  "protein-sources": "/images/items/guides/protein-sources.jpg",
  "b12-guide": "/images/items/guides/b12-guide.jpg",
  "bone-health-guide": "/images/items/guides/bone-health-guide.jpg",
  "replacing-paneer-curd-ghee-milk": "/images/items/guides/replacing-paneer-curd-ghee-milk.jpg",
  "omega-3-guide": "/images/items/guides/omega-3-guide.jpg",
  "iron-and-zinc-guide": "/images/items/guides/iron-and-zinc-guide.jpg",
};

export function getDietPlanImage(slug: string) {
  return dietPlanImages[slug] ?? itemImageFallback;
}

export function getProductImage(slug: string) {
  return productImages[slug] ?? itemImageFallback;
}

export function getSupplementImage(slug: string) {
  return supplementImages[slug] ?? itemImageFallback;
}

export function getGuideImage(slug: string) {
  return guideImages[slug] ?? itemImageFallback;
}
