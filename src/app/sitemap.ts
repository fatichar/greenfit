import type { MetadataRoute } from "next";
import { dietPlans, getGuides, getRecipes, products, supplements } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/diet-plans", "/tools", "/guides", "/recipes", "/supplements", "/about"];
  const productRoutes = products.map((item) => `/products/${item.slug}`);
  const dietPlanRoutes = dietPlans.map((item) => `/diet-plans/${item.slug}`);
  const guideRoutes = getGuides().map((item) => `/guides/${item.slug}`);
  const recipeRoutes = getRecipes().map((item) => `/recipes/${item.slug}`);
  const supplementRoutes = supplements.map((item) => `/supplements/${item.slug}`);

  return [...staticRoutes, ...productRoutes, ...dietPlanRoutes, ...guideRoutes, ...recipeRoutes, ...supplementRoutes].map((url) => ({
    url: siteUrl(url),
    lastModified: new Date("2026-06-12"),
  }));
}
