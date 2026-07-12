"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { DisclaimerBox } from "@/components/disclaimer-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Sex = "female" | "male" | "unspecified";
type ActivityKey = "sedentary" | "light" | "moderate" | "high" | "athlete";
type GoalKey = "lose" | "maintain" | "gain" | "muscle";
type ProteinGoal = "general" | "active" | "muscle" | "cut";

const ACTIVITY_FACTORS: Record<ActivityKey, { label: string; factor: number; hint: string }> = {
  sedentary: { label: "Sedentary", factor: 1.2, hint: "Desk work, little intentional exercise" },
  light: { label: "Light", factor: 1.375, hint: "Walks or 1–3 light sessions / week" },
  moderate: { label: "Moderate", factor: 1.55, hint: "3–5 training days or active job" },
  high: { label: "High", factor: 1.725, hint: "Hard training most days" },
  athlete: { label: "Very high", factor: 1.9, hint: "Intense training + physical job" },
};

const PROTEIN_RANGES: Record<ProteinGoal, { label: string; low: number; high: number; note: string }> = {
  general: {
    label: "General health",
    low: 0.8,
    high: 1.0,
    note: "A practical baseline for most adults not in a hard cut or bulk.",
  },
  active: {
    label: "Active / satiety",
    low: 1.0,
    high: 1.4,
    note: "Useful when training regularly or wanting fuller meals.",
  },
  muscle: {
    label: "Muscle gain",
    low: 1.4,
    high: 1.8,
    note: "Higher target often used while building muscle with resistance training.",
  },
  cut: {
    label: "Fat loss",
    low: 1.4,
    high: 2.0,
    note: "Higher protein can help preserve muscle and appetite control in a deficit.",
  },
};

const PLANT_FOODS = [
  { id: "dal", name: "Cooked dal", unit: "katori (150 g)", protein: 10, calories: 160 },
  { id: "chana", name: "Cooked chana / rajma", unit: "katori (150 g)", protein: 12, calories: 200 },
  { id: "tofu", name: "Tofu", unit: "100 g", protein: 8, calories: 80 },
  { id: "soy-chunks", name: "Soy chunks (dry)", unit: "30 g", protein: 16, calories: 100 },
  { id: "besan", name: "Besan (dry)", unit: "40 g", protein: 9, calories: 150 },
  { id: "paneer-swap", name: "Peanut / soy curd", unit: "150 g", protein: 7, calories: 120 },
  { id: "oats", name: "Oats (dry)", unit: "50 g", protein: 6, calories: 190 },
  { id: "peanuts", name: "Peanuts", unit: "30 g", protein: 7, calories: 170 },
  { id: "roti", name: "Wheat roti", unit: "1 medium", protein: 3, calories: 110 },
  { id: "rice", name: "Cooked rice", unit: "1 katori (150 g)", protein: 4, calories: 195 },
  { id: "sprouts", name: "Sprouts", unit: "100 g", protein: 7, calories: 100 },
  { id: "protein-powder", name: "Plant protein powder", unit: "1 scoop (30 g)", protein: 22, calories: 120 },
] as const;

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  suffix?: string;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // Sync draft text from parent when not editing (avoid setState-in-effect).
  if (!focused && value !== prevValue) {
    setPrevValue(value);
    setText(String(value));
  }

  function commit(raw: string) {
    if (raw.trim() === "") {
      setText(String(value));
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      setText(String(value));
      return;
    }

    const next =
      min !== undefined || max !== undefined
        ? clampNumber(parsed, min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY, value)
        : parsed;
    onChange(next);
    setText(String(next));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={text}
          min={min}
          max={max}
          step={step}
          onFocus={() => setFocused(true)}
          onChange={(event) => {
            const next = event.target.value;
            setText(next);
            // Keep parent state valid while typing; empty field stays empty in the UI.
            if (next.trim() === "") return;
            const parsed = Number(next);
            if (!Number.isFinite(parsed)) return;
            onChange(
              min !== undefined || max !== undefined
                ? clampNumber(parsed, min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY, value)
                : parsed
            );
          }}
          onBlur={() => {
            setFocused(false);
            commit(text);
          }}
          className={cn("h-10", suffix && "pr-12")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ChoiceRow<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ id: T; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant={value === option.id ? "default" : "outline"}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ResultBlock({
  label,
  value,
  detail,
  tone = "olive",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "olive" | "mint" | "muted";
}) {
  const toneClass =
    tone === "mint" ? "bg-mint-50" : tone === "muted" ? "bg-muted" : "bg-olive-50";

  return (
    <div className={cn("rounded-xl p-4", toneClass)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export const TOOL_ITEMS = [
  {
    id: "protein",
    label: "Protein",
    title: "Protein target",
    summary: "Estimate a daily protein range from body weight or fat-free mass and your training goal.",
  },
  {
    id: "calories",
    label: "Calories",
    title: "Calorie & TDEE estimate",
    summary: "Mifflin–St Jeor BMR with activity and a simple goal adjustment for lose, maintain, gain, or muscle.",
  },
  {
    id: "macros",
    label: "Macros",
    title: "Macro split",
    summary: "Turn calories into protein, carbs, and fat using g/kg protein and a fat percentage you choose.",
  },
  {
    id: "plate",
    label: "Plate protein",
    title: "Protein plate",
    summary: "Stack common Indian plant foods and see approximate protein and calories for the day.",
  },
  {
    id: "fiber",
    label: "Fiber",
    title: "Fiber target",
    summary: "Combine a per-calorie rule of thumb with common sex-based reference ranges.",
  },
  {
    id: "bmi",
    label: "BMI",
    title: "BMI & weight range",
    summary: "Quick BMI calculation plus the weight band that maps to BMI 18.5–24.9 for your height.",
  },
  {
    id: "hydration",
    label: "Hydration",
    title: "Hydration estimate",
    summary: "A rough daily fluid target from weight, activity, and heat—useful as a baseline only.",
  },
] as const;

export type ToolId = (typeof TOOL_ITEMS)[number]["id"];

const DEFAULT_OPEN_ID: ToolId = "protein";
const TOOL_IDS = new Set<string>(TOOL_ITEMS.map((item) => item.id));

function isToolId(value: string): value is ToolId {
  return TOOL_IDS.has(value);
}

function readToolHash(): ToolId | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return isToolId(hash) ? hash : null;
}

function ToolPanel({
  id,
  title,
  summary,
  open,
  onOpenChange,
  children,
}: {
  id: ToolId;
  title: string;
  summary: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-28 rounded-xl border bg-card shadow-sm open:border-primary/30 open:shadow-md"
      open={open}
      onToggle={(event) => {
        onOpenChange(event.currentTarget.open);
      }}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:items-center sm:p-6">
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-semibold sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="border-t px-5 pb-5 pt-5 sm:px-6 sm:pb-6">{children}</div>
    </details>
  );
}

export function ToolsNavChips({ activeId }: { activeId?: ToolId | null }) {
  return (
    <nav aria-label="Jump to a tool" className="flex flex-wrap gap-2 text-sm">
      {TOOL_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "rounded-full border px-3 py-1 transition",
              isActive
                ? "border-primary/40 bg-mint-100 font-medium text-primary"
                : "bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

function useTrackOnChange(isDirty: boolean) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!isDirty || hasTracked.current) return;
    hasTracked.current = true;
    trackEvent("Calculator Used");
  }, [isDirty]);
}

function ProteinTool() {
  const [weight, setWeight] = useState(70);
  const [goal, setGoal] = useState<ProteinGoal>("active");
  const [useFfm, setUseFfm] = useState(false);
  const [fatFreeMass, setFatFreeMass] = useState(55);

  useTrackOnChange(weight !== 70 || goal !== "active" || useFfm || fatFreeMass !== 55);

  const results = useMemo(() => {
    const safeWeight = clampNumber(weight, 30, 250, 70);
    const base = useFfm ? clampNumber(fatFreeMass, 25, 200, 55) : safeWeight;
    const range = PROTEIN_RANGES[goal];
    const low = Math.round(base * range.low);
    const high = Math.round(base * range.high);
    const perMeal = Math.round((low + high) / 2 / 3);

    return { low, high, perMeal, note: range.note, baseLabel: useFfm ? "fat-free mass" : "body weight" };
  }, [fatFreeMass, goal, useFfm, weight]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Body weight"
          value={weight}
          onChange={setWeight}
          min={30}
          max={250}
          suffix="kg"
        />
        <ChoiceRow
          label="Primary focus"
          value={goal}
          onChange={setGoal}
          options={Object.entries(PROTEIN_RANGES).map(([id, meta]) => ({
            id: id as ProteinGoal,
            label: meta.label,
          }))}
        />
        <div className="sm:col-span-2">
          <ChoiceRow
            label="Calculate using"
            value={useFfm ? "ffm" : "bw"}
            onChange={(value) => setUseFfm(value === "ffm")}
            options={[
              { id: "bw", label: "Body weight" },
              { id: "ffm", label: "Fat-free mass" },
            ]}
          />
        </div>
        {useFfm ? (
          <NumberField
            label="Fat-free mass estimate"
            value={fatFreeMass}
            onChange={setFatFreeMass}
            min={25}
            max={200}
            suffix="kg"
            hint="If you know lean mass from a DEXA or similar estimate. Optional."
          />
        ) : null}
      </div>
      <div className="grid gap-3">
        <ResultBlock
          label={`Daily protein range (${results.baseLabel})`}
          value={`${results.low}–${results.high} g`}
          detail={results.note}
        />
        <ResultBlock
          label="Rough per-meal target (3 meals)"
          value={`~${results.perMeal} g`}
          detail="Spread intake across the day when possible. Plant protein from dals, soy, and pulses stacks well."
          tone="mint"
        />
      </div>
    </div>
  );
}

function CalorieTool() {
  const [sex, setSex] = useState<Sex>("unspecified");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [goal, setGoal] = useState<GoalKey>("maintain");

  useTrackOnChange(
    sex !== "unspecified" || age !== 30 || height !== 170 || weight !== 70 || activity !== "moderate" || goal !== "maintain"
  );

  const results = useMemo(() => {
    const w = clampNumber(weight, 30, 250, 70);
    const h = clampNumber(height, 120, 230, 170);
    const a = clampNumber(age, 13, 100, 30);
    const sexOffset = sex === "female" ? -161 : sex === "male" ? 5 : -78;
    const bmr = Math.round(10 * w + 6.25 * h - 5 * a + sexOffset);
    const maintenance = Math.round(bmr * ACTIVITY_FACTORS[activity].factor);
    const goalDelta =
      goal === "lose" ? -400 : goal === "gain" ? 300 : goal === "muscle" ? 250 : 0;
    const target = Math.max(1200, maintenance + goalDelta);

    return {
      bmr,
      maintenance,
      target,
      activityHint: ACTIVITY_FACTORS[activity].hint,
      goalNote:
        goal === "lose"
          ? "About 300–500 kcal below maintenance is a common starting deficit."
          : goal === "gain" || goal === "muscle"
            ? "A modest surplus supports weight or muscle gain with fewer excess fat gains."
            : "Maintenance is an estimate—adjust based on 2–3 weeks of weight trend.",
    };
  }, [activity, age, goal, height, sex, weight]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceRow
          label="Sex (for BMR formula)"
          value={sex}
          onChange={setSex}
          options={[
            { id: "female", label: "Female" },
            { id: "male", label: "Male" },
            { id: "unspecified", label: "Prefer not to say" },
          ]}
        />
        <NumberField label="Age" value={age} onChange={setAge} min={13} max={100} suffix="yrs" />
        <NumberField label="Height" value={height} onChange={setHeight} min={120} max={230} suffix="cm" />
        <NumberField label="Weight" value={weight} onChange={setWeight} min={30} max={250} suffix="kg" />
        <div className="sm:col-span-2">
          <ChoiceRow
            label="Activity level"
            value={activity}
            onChange={setActivity}
            options={Object.entries(ACTIVITY_FACTORS).map(([id, meta]) => ({
              id: id as ActivityKey,
              label: meta.label,
            }))}
          />
          <p className="mt-2 text-xs text-muted-foreground">{ACTIVITY_FACTORS[activity].hint}</p>
        </div>
        <div className="sm:col-span-2">
          <ChoiceRow
            label="Goal adjustment"
            value={goal}
            onChange={setGoal}
            options={[
              { id: "lose", label: "Lose weight" },
              { id: "maintain", label: "Maintain" },
              { id: "gain", label: "Gain weight" },
              { id: "muscle", label: "Build muscle" },
            ]}
          />
        </div>
      </div>
      <div className="grid gap-3">
        <ResultBlock label="Estimated BMR" value={`${results.bmr} kcal`} detail="Resting energy using Mifflin–St Jeor." />
        <ResultBlock
          label="Estimated maintenance"
          value={`${results.maintenance} kcal`}
          detail={results.activityHint}
          tone="mint"
        />
        <ResultBlock
          label="Suggested daily target"
          value={`${results.target} kcal`}
          detail={results.goalNote}
          tone="muted"
        />
      </div>
    </div>
  );
}

function MacroTool() {
  const [calories, setCalories] = useState(2200);
  const [weight, setWeight] = useState(70);
  const [proteinPerKg, setProteinPerKg] = useState(1.4);
  const [fatPercent, setFatPercent] = useState(25);

  useTrackOnChange(calories !== 2200 || weight !== 70 || proteinPerKg !== 1.4 || fatPercent !== 25);

  const results = useMemo(() => {
    const kcal = clampNumber(calories, 1000, 5000, 2200);
    const proteinG = Math.round(clampNumber(weight, 30, 250, 70) * clampNumber(proteinPerKg, 0.6, 2.5, 1.4));
    const proteinKcal = proteinG * 4;
    const fatKcal = Math.round(kcal * (clampNumber(fatPercent, 15, 40, 25) / 100));
    const fatG = Math.round(fatKcal / 9);
    const carbKcal = Math.max(0, kcal - proteinKcal - fatKcal);
    const carbG = Math.round(carbKcal / 4);

    return {
      proteinG,
      fatG,
      carbG,
      proteinPct: Math.round((proteinKcal / kcal) * 100),
      fatPct: Math.round((fatKcal / kcal) * 100),
      carbPct: Math.round((carbKcal / kcal) * 100),
    };
  }, [calories, fatPercent, proteinPerKg, weight]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Daily calories" value={calories} onChange={setCalories} min={1000} max={5000} step={50} suffix="kcal" />
        <NumberField label="Body weight" value={weight} onChange={setWeight} min={30} max={250} suffix="kg" />
        <NumberField
          label="Protein target"
          value={proteinPerKg}
          onChange={setProteinPerKg}
          min={0.6}
          max={2.5}
          step={0.1}
          suffix="g/kg"
          hint="1.2–1.6 g/kg is a common active range on plant-based diets."
        />
        <NumberField
          label="Fat share of calories"
          value={fatPercent}
          onChange={setFatPercent}
          min={15}
          max={40}
          suffix="%"
          hint="Remaining calories go to carbohydrates."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <ResultBlock label="Protein" value={`${results.proteinG} g`} detail={`${results.proteinPct}% of calories`} />
        <ResultBlock label="Carbohydrates" value={`${results.carbG} g`} detail={`${results.carbPct}% of calories`} tone="mint" />
        <ResultBlock label="Fat" value={`${results.fatG} g`} detail={`${results.fatPct}% of calories`} tone="muted" />
      </div>
    </div>
  );
}

function BmiTool() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);

  useTrackOnChange(height !== 170 || weight !== 70);

  const results = useMemo(() => {
    const hM = clampNumber(height, 120, 230, 170) / 100;
    const w = clampNumber(weight, 30, 250, 70);
    const bmi = w / (hM * hM);
    const low = 18.5 * hM * hM;
    const high = 24.9 * hM * hM;
    let category = "Within the common 'healthy weight' BMI band";
    if (bmi < 18.5) category = "Below the common underweight BMI threshold";
    else if (bmi < 25) category = "Within the common healthy-weight BMI band";
    else if (bmi < 30) category = "Within the common overweight BMI band";
    else category = "Within the common obesity BMI band";

    return {
      bmi: bmi.toFixed(1),
      category,
      range: `${Math.round(low)}–${Math.round(high)} kg`,
    };
  }, [height, weight]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Height" value={height} onChange={setHeight} min={120} max={230} suffix="cm" />
        <NumberField label="Weight" value={weight} onChange={setWeight} min={30} max={250} suffix="kg" />
      </div>
      <div className="grid gap-3">
        <ResultBlock label="BMI" value={results.bmi} detail={results.category} />
        <ResultBlock
          label="BMI 18.5–24.9 weight range"
          value={results.range}
          detail="BMI is a rough population tool. Athletes, older adults, and many clinical contexts need better measures."
          tone="mint"
        />
      </div>
    </div>
  );
}

function FiberTool() {
  const [calories, setCalories] = useState(2200);
  const [sex, setSex] = useState<Sex>("unspecified");

  useTrackOnChange(calories !== 2200 || sex !== "unspecified");

  const results = useMemo(() => {
    const fromCalories = Math.round((clampNumber(calories, 1000, 5000, 2200) / 1000) * 14);
    const sexTarget = sex === "female" ? 25 : sex === "male" ? 38 : 30;
    const low = Math.min(fromCalories, sexTarget);
    const high = Math.max(fromCalories, sexTarget + 5);

    return {
      fromCalories,
      sexTarget,
      range: `${low}–${high} g`,
    };
  }, [calories, sex]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Daily calories"
          value={calories}
          onChange={setCalories}
          min={1000}
          max={5000}
          step={50}
          suffix="kcal"
          hint="A common rule of thumb is about 14 g fiber per 1,000 kcal."
        />
        <ChoiceRow
          label="Sex-based reference"
          value={sex}
          onChange={setSex}
          options={[
            { id: "female", label: "Female (~25 g)" },
            { id: "male", label: "Male (~38 g)" },
            { id: "unspecified", label: "General (~30 g)" },
          ]}
        />
      </div>
      <div className="grid gap-3">
        <ResultBlock label="Suggested fiber range" value={results.range} detail="Increase gradually and drink enough water." />
        <ResultBlock
          label="From calorie rule"
          value={`${results.fromCalories} g`}
          detail={`Sex reference used for comparison: ~${results.sexTarget} g/day.`}
          tone="mint"
        />
      </div>
    </div>
  );
}

function ServingCountInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // Sync draft text from parent when not editing (avoid setState-in-effect).
  if (!focused && value !== prevValue) {
    setPrevValue(value);
    setText(String(value));
  }

  return (
    <Input
      type="number"
      min={0}
      max={12}
      value={text}
      aria-label={`${label} servings`}
      onFocus={() => setFocused(true)}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        if (next.trim() === "") return;
        const parsed = Number(next);
        if (!Number.isFinite(parsed)) return;
        onChange(clampNumber(parsed, 0, 12, value));
      }}
      onBlur={() => {
        setFocused(false);
        if (text.trim() === "" || !Number.isFinite(Number(text))) {
          setText(String(value));
          return;
        }
        const next = clampNumber(Number(text), 0, 12, value);
        onChange(next);
        setText(String(next));
      }}
      className="h-8 w-16 text-center"
    />
  );
}

function PlateProteinTool() {
  const [servings, setServings] = useState<Record<string, number>>(() =>
    Object.fromEntries(PLANT_FOODS.map((food) => [food.id, food.id === "dal" || food.id === "roti" ? 1 : 0]))
  );

  const isDirty = useMemo(
    () =>
      PLANT_FOODS.some((food) => {
        const defaultCount = food.id === "dal" || food.id === "roti" ? 1 : 0;
        return (servings[food.id] ?? 0) !== defaultCount;
      }),
    [servings]
  );
  useTrackOnChange(isDirty);

  const totals = useMemo(() => {
    return PLANT_FOODS.reduce(
      (acc, food) => {
        const count = clampNumber(servings[food.id] ?? 0, 0, 12, 0);
        acc.protein += food.protein * count;
        acc.calories += food.calories * count;
        acc.count += count;
        return acc;
      },
      { protein: 0, calories: 0, count: 0 }
    );
  }, [servings]);

  function setCount(id: string, value: number) {
    setServings((current) => ({ ...current, [id]: clampNumber(value, 0, 12, 0) }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="grid gap-3">
        {PLANT_FOODS.map((food) => (
          <div
            key={food.id}
            className="flex flex-col gap-3 rounded-lg border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium">{food.name}</p>
              <p className="text-xs text-muted-foreground">
                {food.unit} · ~{food.protein} g protein · ~{food.calories} kcal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() => setCount(food.id, (servings[food.id] ?? 0) - 1)}
                aria-label={`Decrease ${food.name}`}
              >
                −
              </Button>
              <ServingCountInput
                value={servings[food.id] ?? 0}
                onChange={(value) => setCount(food.id, value)}
                label={food.name}
              />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() => setCount(food.id, (servings[food.id] ?? 0) + 1)}
                aria-label={`Increase ${food.name}`}
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 self-start lg:sticky lg:top-24">
        <ResultBlock
          label="Total protein"
          value={`${Math.round(totals.protein)} g`}
          detail={`${totals.count} serving${totals.count === 1 ? "" : "s"} selected`}
        />
        <ResultBlock
          label="Approximate calories"
          value={`${Math.round(totals.calories)} kcal`}
          detail="Values are estimates for planning, not lab-precise labels."
          tone="mint"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setServings(Object.fromEntries(PLANT_FOODS.map((food) => [food.id, 0])))}
        >
          Clear plate
        </Button>
      </div>
    </div>
  );
}

function HydrationTool() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [climate, setClimate] = useState<"mild" | "hot">("mild");

  useTrackOnChange(weight !== 70 || activity !== "moderate" || climate !== "mild");

  const results = useMemo(() => {
    const base = clampNumber(weight, 30, 250, 70) * 30;
    const activityBonus =
      activity === "sedentary" ? 0 : activity === "light" ? 250 : activity === "moderate" ? 500 : activity === "high" ? 750 : 1000;
    const climateBonus = climate === "hot" ? 500 : 0;
    const totalMl = Math.round(base + activityBonus + climateBonus);
    const glasses = Math.round(totalMl / 250);

    return { totalMl, liters: (totalMl / 1000).toFixed(1), glasses };
  }, [activity, climate, weight]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Body weight" value={weight} onChange={setWeight} min={30} max={250} suffix="kg" />
        <ChoiceRow
          label="Climate / heat"
          value={climate}
          onChange={setClimate}
          options={[
            { id: "mild", label: "Mild / AC most of day" },
            { id: "hot", label: "Hot / outdoor heat" },
          ]}
        />
        <div className="sm:col-span-2">
          <ChoiceRow
            label="Activity"
            value={activity}
            onChange={setActivity}
            options={Object.entries(ACTIVITY_FACTORS).map(([id, meta]) => ({
              id: id as ActivityKey,
              label: meta.label,
            }))}
          />
        </div>
      </div>
      <div className="grid gap-3">
        <ResultBlock
          label="Fluid target"
          value={`${results.liters} L`}
          detail={`About ${results.totalMl} ml, or roughly ${results.glasses} glasses of 250 ml.`}
        />
        <ResultBlock
          label="How to use this"
          value="Starting point"
          detail="Thirst, urine colour, and medical conditions matter more than any fixed rule. Includes water from food and other drinks in a broad sense—adjust to comfort."
          tone="mint"
        />
      </div>
    </div>
  );
}

const TOOL_CONTENT: Record<ToolId, ReactNode> = {
  protein: <ProteinTool />,
  calories: <CalorieTool />,
  macros: <MacroTool />,
  plate: <PlateProteinTool />,
  fiber: <FiberTool />,
  bmi: <BmiTool />,
  hydration: <HydrationTool />,
};

export function ToolsCalculators() {
  const [openIds, setOpenIds] = useState<Set<ToolId>>(() => new Set([DEFAULT_OPEN_ID]));
  const [activeHash, setActiveHash] = useState<ToolId | null>(null);

  useEffect(() => {
    function openFromHash(shouldScroll: boolean) {
      const hashId = readToolHash();
      setActiveHash(hashId);

      if (!hashId) return;

      setOpenIds((current) => {
        if (current.has(hashId)) return current;
        const next = new Set(current);
        next.add(hashId);
        return next;
      });

      if (!shouldScroll) return;

      window.setTimeout(() => {
        document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }

    openFromHash(true);
    const onHashChange = () => openFromHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function handleOpenChange(id: ToolId, open: boolean) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

    if (open) {
      setActiveHash(id);
      if (window.location.hash !== `#${id}`) {
        // Shareable URL without stacking a history entry on every expand.
        window.history.replaceState(null, "", `#${id}`);
      }
      return;
    }

    if (window.location.hash === `#${id}`) {
      setActiveHash(null);
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ToolsNavChips activeId={activeHash} />
      {TOOL_ITEMS.map((item) => (
        <ToolPanel
          key={item.id}
          id={item.id}
          title={item.title}
          summary={item.summary}
          open={openIds.has(item.id)}
          onOpenChange={(open) => handleOpenChange(item.id, open)}
        >
          {TOOL_CONTENT[item.id]}
        </ToolPanel>
      ))}
      <DisclaimerBox />
    </div>
  );
}
