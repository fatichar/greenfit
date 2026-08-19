import { catalogSupplements, kitchenDevices } from "@/lib/data";
import booksData from "../../data/books.json";
import exerciseData from "../../data/exercise.json";
import wellnessData from "../../data/wellness.json";

export type ShopProduct = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  detail: string;
  href: string;
  imagePath?: string;
  imageUrl?: string;
  visual: "supplement" | "exercise" | "kitchen" | "beauty" | "book";
  featuredOrder?: number;
  homepageFeaturedOrder?: number;
};

function getDevice(slug: string) {
  const device = kitchenDevices.find((item) => item.slug === slug);
  if (!device) throw new Error(`Missing device: ${slug}`);
  return device;
}

const supplementTagLabels: Record<string, string> = {
  "vitamin-b12": "Vitamin B12",
  "vitamin-d3": "Vitamin D3",
  calcium: "Calcium",
  "algal-omega-3": "Omega-3",
  iron: "Iron",
  zinc: "Zinc",
  "plant-protein": "Plant protein",
  "creatine-monohydrate": "Creatine",
};

export const supplementTags = [
  "Vitamin B12",
  "Vitamin D3",
  "Calcium",
  "Omega-3",
  "Iron",
  "Zinc",
  "Plant protein",
  "Creatine",
];

function catalogSupplementProduct(product: (typeof catalogSupplements)[number]): ShopProduct {
  const tag = supplementTagLabels[product.nutrient] ?? product.nutrient;
  return {
    id: product.id,
    name: product.title,
    category: "Supplements",
    tags: product.shopTags ?? [tag, product.form],
    description: product.shopDescription ?? product.veganEvidence,
    detail: product.shopDetail ?? `${product.form} · ${product.doseText} Check the current listing and any available test result before buying.`,
    href: product.amazonUrl,
    imagePath: product.imagePath,
    imageUrl: product.imageUrl,
    visual: "supplement",
    featuredOrder: product.featuredOrder,
    homepageFeaturedOrder: product.homepageFeaturedOrder,
  };
}

function deviceProduct(slug: string): ShopProduct {
  const device = getDevice(slug);
  if (!device.shopTags || !device.shopDescription || !device.shopDetail) {
    throw new Error(`Missing shop catalog fields for kitchen device: ${slug}`);
  }

  return {
    id: device.slug,
    name: device.name,
    category: "Kitchen",
    tags: device.shopTags,
    description: device.shopDescription,
    detail: device.shopDetail,
    href: device.amazonSearchUrl,
    imagePath: device.imagePath,
    visual: "kitchen",
    featuredOrder: device.featuredOrder,
    homepageFeaturedOrder: device.homepageFeaturedOrder,
  };
}

const orderedSupplementCatalog = [
  ...catalogSupplements.filter((product) => product.shopOrder !== undefined).sort((left, right) => (left.shopOrder ?? 0) - (right.shopOrder ?? 0)),
  ...catalogSupplements.filter((product) => product.shopOrder === undefined),
];

export const supplementProducts: ShopProduct[] = orderedSupplementCatalog.map(catalogSupplementProduct);

export const exerciseProducts = exerciseData as ShopProduct[];

export const kitchenProducts: ShopProduct[] = [...kitchenDevices]
  .filter((device) => device.shopOrder !== undefined)
  .sort((left, right) => (left.shopOrder ?? 0) - (right.shopOrder ?? 0))
  .map((device) => deviceProduct(device.slug));
export const wellnessProducts = wellnessData as ShopProduct[];

export const bookProducts = booksData as ShopProduct[];

function selectFeaturedProducts(products: ShopProduct[]) {
  return products
    .filter((product) => product.featuredOrder !== undefined)
    .toSorted((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0));
}

function selectHomepageProducts(products: ShopProduct[]) {
  return products
    .filter((product) => product.homepageFeaturedOrder !== undefined)
    .toSorted((left, right) => (left.homepageFeaturedOrder ?? 0) - (right.homepageFeaturedOrder ?? 0));
}

export const allShopProducts: ShopProduct[] = [
  ...supplementProducts,
  ...exerciseProducts,
  ...kitchenProducts,
  ...wellnessProducts,
  ...bookProducts,
];

export const supplementFeaturedProducts = selectFeaturedProducts(supplementProducts);
export const exerciseFeaturedProducts = selectFeaturedProducts(exerciseProducts);
export const kitchenFeaturedProducts = selectFeaturedProducts(kitchenProducts);
export const wellnessFeaturedProducts = selectFeaturedProducts(wellnessProducts);
export const bookFeaturedProducts = selectFeaturedProducts(bookProducts);
export const shopFeaturedProducts = selectHomepageProducts(allShopProducts);
