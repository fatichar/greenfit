import productsData from "../../data/products.json";
import supplementsData from "../../data/supplements.json";

const itemImageFallback = "/images/greenfit-hero.jpg";

/**
 * Bump this when replacing any public item image in place so browsers and
 * Next's `/_next/image` optimizer do not keep serving stale optimized files.
 * Safe for both server and client components (no filesystem access).
 */
const IMAGE_ASSET_VERSION = "2026-08-19a";

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

const guideImages: Record<string, string> = {
  "protein-guide": "/images/items/guides/protein-sources.jpg",
  "b12-guide": "/images/items/guides/b12-guide.jpg",
  "bone-health-guide": "/images/items/guides/bone-health-guide.jpg",
  "replacing-paneer-curd-ghee-milk": "/images/items/guides/replacing-paneer-curd-ghee-milk.jpg",
  "omega-3-guide": "/images/items/guides/omega-3-guide.jpg",
  "iron-and-zinc-guide": "/images/items/guides/iron-and-zinc-guide.jpg",
};

function withImageCacheBust(imagePath: string): string {
  const sep = imagePath.includes("?") ? "&" : "?";
  return `${imagePath}${sep}v=${IMAGE_ASSET_VERSION}`;
}

export function getVersionedImagePath(imagePath: string) {
  return withImageCacheBust(imagePath);
}

export function getDietPlanImage(slug: string) {
  return withImageCacheBust(dietPlanImages[slug] ?? itemImageFallback);
}

export function getProductImage(slug: string) {
  const product = productsData.find((item) => item.slug === slug);
  return withImageCacheBust(product?.imagePath ?? itemImageFallback);
}

export function getSupplementImage(slug: string) {
  const supplement = supplementsData.find((item) => item.slug === slug);
  return withImageCacheBust(supplement?.imagePath ?? itemImageFallback);
}

export function getGuideImage(slug: string) {
  return withImageCacheBust(guideImages[slug] ?? itemImageFallback);
}
