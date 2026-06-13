import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DietMeal } from "@/lib/types";

export function MealPlanTable({ meals }: { meals: DietMeal[] }) {
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
              <TableCell>{meal.items.join(", ")}</TableCell>
              <TableCell className="text-right">{meal.protein} g</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
