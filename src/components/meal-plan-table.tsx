import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DietMeal } from "@/lib/types";

export function MealPlanTable({
  meals,
  recipeLinks = {},
}: {
  meals: DietMeal[];
  /** Meal item label → recipe slug when a recipe exists */
  recipeLinks?: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meal</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Protein</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.map((meal) => (
            <TableRow key={meal.name}>
              <TableCell className="font-medium">{meal.name}</TableCell>
              <TableCell>
                <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
                  {meal.items.map((item, index) => {
                    const slug = recipeLinks[item];
                    const separator = index < meal.items.length - 1 ? "," : null;
                    return (
                      <span key={`${meal.name}-${item}`} className="inline-flex items-center">
                        {slug ? (
                          <Link
                            href={`/recipes/${slug}`}
                            className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                          >
                            {item}
                          </Link>
                        ) : (
                          <span>{item}</span>
                        )}
                        {separator ? <span className="text-muted-foreground">{separator}&nbsp;</span> : null}
                      </span>
                    );
                  })}
                </span>
              </TableCell>
              <TableCell className="text-right">{meal.protein} g</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
