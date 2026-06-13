const itemImageFallback = "/images/greenfit-hero.png";

const dietPlanImages: Record<string, string> = {
  "high-protein-diet": "/images/items/diet-plans/high-protein-diet.png",
  "weight-loss-diet": "/images/items/diet-plans/weight-loss-diet.png",
  "muscle-gain-diet": "/images/items/diet-plans/muscle-gain-diet.png",
  "budget-diet": "/images/items/diet-plans/budget-diet.png",
  "simple-beginner-plan": "/images/items/diet-plans/simple-beginner-plan.png",
  "south-indian-plan": "/images/items/diet-plans/south-indian-plan.png",
  "north-indian-plan": "/images/items/diet-plans/north-indian-plan.png",
  "no-onion-no-garlic-plan": "/images/items/diet-plans/no-onion-no-garlic-plan.png",
};

const productImages: Record<string, string> = {
  "sample-plant-protein": "/images/items/products/sample-plant-protein.png",
  "fortified-soy-milk": "/images/items/products/fortified-soy-milk.png",
  "masala-oats-pack": "/images/items/products/masala-oats-pack.png",
  "dairy-whey-isolate": "/images/items/products/dairy-whey-isolate.png",
  "peanut-curd-culture": "/images/items/products/peanut-curd-culture.png",
};

const supplementImages: Record<string, string> = {
  "sample-b12": "/images/items/supplements/sample-b12.png",
  "vegan-d3": "/images/items/supplements/vegan-d3.png",
  "algal-omega-3": "/images/items/supplements/algal-omega-3.png",
  "creatine-monohydrate": "/images/items/supplements/creatine-monohydrate.png",
  "basic-multivitamin": "/images/items/supplements/basic-multivitamin.png",
  "plant-protein-blend": "/images/items/supplements/plant-protein-blend.png",
};

const guideImages: Record<string, string> = {
  "protein-sources": "/images/items/guides/protein-sources.png",
  "b12-guide": "/images/items/guides/b12-guide.png",
  "bone-health-guide": "/images/items/guides/bone-health-guide.png",
  "replacing-paneer-curd-ghee-milk": "/images/items/guides/replacing-paneer-curd-ghee-milk.png",
  "omega-3-guide": "/images/items/guides/omega-3-guide.png",
  "iron-and-zinc-guide": "/images/items/guides/iron-and-zinc-guide.png",
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
