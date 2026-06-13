import Link from "next/link";
import Image from "next/image";
import { MacroSummary } from "@/components/macro-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDietPlanImage } from "@/lib/images";
import type { DietPlan } from "@/lib/types";

export function DietPlanCard({ plan }: { plan: DietPlan }) {
  return (
    <Link href={`/diet-plans/${plan.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <Image
          src={getDietPlanImage(plan.slug)}
          alt=""
          width={900}
          height={675}
          className="aspect-[16/9] w-full object-cover"
        />
        <CardHeader>
          <CardTitle>{plan.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{plan.goal}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <MacroSummary calories={plan.calories} protein={plan.protein} />
          <dl className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">Difficulty</dt>
              <dd>{plan.difficulty}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Cuisine</dt>
              <dd>{plan.cuisineStyle}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Meals</dt>
              <dd>{plan.mealCount}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Cost</dt>
              <dd>{plan.affordability}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
