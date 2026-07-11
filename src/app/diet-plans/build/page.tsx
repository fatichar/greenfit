import type { Metadata } from "next";
import { DietPlanBuilder } from "@/components/diet-plan-builder";
import { getRecipes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Build my diet plan",
  description: "Create a personalized plant-based Indian meal plan around your goals, routine, and budget.",
};

export default function BuildDietPlanPage() {
  return <section className="py-10 sm:py-14"><DietPlanBuilder recipes={getRecipes()} /></section>;
}
