"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10"
      />
    </div>
  );
}

export function ToolsCalculators() {
  const [weight, setWeight] = useState(70);
  const [fatFreeMass, setFatFreeMass] = useState(55);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState(1.45);
  const [goalCalories, setGoalCalories] = useState(2200);

  const hasTracked = useRef(false);

  useEffect(() => {
    if (
      !hasTracked.current &&
      (weight !== 70 || fatFreeMass !== 55 || height !== 170 || age !== 30 || activity !== 1.45 || goalCalories !== 2200)
    ) {
      hasTracked.current = true;
      trackEvent("Calculator Used");
    }
  }, [weight, fatFreeMass, height, age, activity, goalCalories]);

  const results = useMemo(() => {
    const proteinGeneral = Math.round(weight * 0.8);
    const proteinActiveLow = Math.round(weight * 1.0);
    const proteinActiveHigh = Math.round(weight * 1.2);
    const proteinFfmLow = Math.round(fatFreeMass * 1.2);
    const proteinFfmHigh = Math.round(fatFreeMass * 1.6);
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    const calories = Math.round(bmr * activity);
    const proteinCalories = Math.round(proteinActiveHigh * 4);
    const fatCalories = Math.round(goalCalories * 0.25);
    const carbCalories = goalCalories - proteinCalories - fatCalories;

    return {
      proteinGeneral,
      proteinActiveLow,
      proteinActiveHigh,
      proteinFfmLow,
      proteinFfmHigh,
      calories,
      macroProtein: Math.round(proteinCalories / 4),
      macroFat: Math.round(fatCalories / 9),
      macroCarbs: Math.max(0, Math.round(carbCalories / 4)),
    };
  }, [activity, age, fatFreeMass, goalCalories, height, weight]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Protein calculator</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NumberField label="Body weight (kg)" value={weight} onChange={setWeight} />
            <NumberField label="Fat-free mass estimate (kg)" value={fatFreeMass} onChange={setFatFreeMass} />
            <div className="grid gap-3 rounded-xl bg-olive-50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">General baseline</p>
                <p className="text-2xl font-semibold">{results.proteinGeneral} g/day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active / higher-satiety range using body weight</p>
                <p className="text-2xl font-semibold">
                  {results.proteinActiveLow}-{results.proteinActiveHigh} g/day
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Higher target using fat-free mass</p>
                <p className="text-2xl font-semibold">
                  {results.proteinFfmLow}-{results.proteinFfmHigh} g/day
                </p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Treat 0.8 g/kg body weight as a general baseline. The 1.2x+ range is a higher target and is often
                more meaningful when applied to fat-free mass, or when training/dieting, not as the minimum for an
                average person.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calorie estimate</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NumberField label="Height (cm)" value={height} onChange={setHeight} />
            <NumberField label="Age" value={age} onChange={setAge} />
            <div className="flex flex-wrap gap-2">
              {[1.2, 1.45, 1.7].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={activity === value ? "default" : "outline"}
                  onClick={() => setActivity(value)}
                >
                  {value === 1.2 ? "Low" : value === 1.45 ? "Moderate" : "High"}
                </Button>
              ))}
            </div>
            <div className="rounded-xl bg-mint-50 p-4">
              <p className="text-sm text-muted-foreground">Estimated maintenance</p>
              <p className="text-2xl font-semibold">{results.calories} kcal</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Basic macro split</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <NumberField label="Target calories" value={goalCalories} onChange={setGoalCalories} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="font-semibold">{results.macroProtein} g</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="font-semibold">{results.macroCarbs} g</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="font-semibold">{results.macroFat} g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DisclaimerBox />
    </div>
  );
}
