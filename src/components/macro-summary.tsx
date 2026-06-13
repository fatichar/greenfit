import { Card, CardContent } from "@/components/ui/card";

export function MacroSummary({
  calories,
  protein,
  carbs,
  fat,
}: {
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
}) {
  const items = [
    ["Calories", `${calories} kcal`],
    ["Protein", `${protein} g`],
    ...(carbs ? [["Carbs", `${carbs} g`]] : []),
    ...(fat ? [["Fat", `${fat} g`]] : []),
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label} size="sm">
          <CardContent>
            <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
