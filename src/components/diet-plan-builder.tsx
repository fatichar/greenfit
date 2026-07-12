"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Download, Info, Minus, Plus, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { DietBuilderInputs, DietBuilderTargets, MealType, Recipe, SelectedPlanItem, ServingMode } from "@/lib/types";
import { ADD_ON_RECIPE_ROLES, calculateSuggestedTargets, calculateTotals, DEFAULT_INPUTS, DEFAULT_TARGETS, DIET_BUILDER_STORAGE_KEY, generateWeekVariations, getMealSuggestions, isMainMealSlot, MEAL_SLOTS, portionGuidance, safeLoadBuilderState, scaleRecipeNutrition, servingLabel, targetRatio, targetWarning } from "@/lib/diet-plan-builder";

type Variation = { day: number; selections: Record<string, SelectedPlanItem[]> };
type SavedState = { inputs: DietBuilderInputs; targets: DietBuilderTargets; servingMode: ServingMode; selections: Record<string, SelectedPlanItem[]>; skipped: Record<string, boolean>; step: number; confirmed: boolean; variations: Variation[] };
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function inr(value: number) { return INR.format(Math.max(0, value)); }

export function DietPlanBuilder({ recipes }: { recipes: Recipe[] }) {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [servingMode, setServingMode] = useState<ServingMode>("household");
  const [selections, setSelections] = useState<Record<string, SelectedPlanItem[]>>({});
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState(0);
  const [openMeal, setOpenMeal] = useState<MealType | null>("breakfast");
  const [confirmed, setConfirmed] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = safeLoadBuilderState<SavedState | null>(null);
      if (saved) {
        setInputs({ ...DEFAULT_INPUTS, ...saved.inputs });
        setTargets({ ...DEFAULT_TARGETS, ...saved.targets });
        setServingMode(saved.servingMode ?? "household");
        setSelections(saved.selections ?? {});
        setSkipped(saved.skipped ?? {});
        setStep(saved.step ?? 0);
        setConfirmed(saved.confirmed ?? false);
        setVariations(saved.variations ?? []);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const saved: SavedState = { inputs, targets, servingMode, selections, skipped, step, confirmed, variations };
    window.localStorage.setItem(DIET_BUILDER_STORAGE_KEY, JSON.stringify(saved));
  }, [confirmed, hydrated, inputs, selections, servingMode, skipped, step, targets, variations]);

  const totals = useMemo(() => calculateTotals(selections, recipes), [recipes, selections]);
  const guidance = useMemo(() => portionGuidance(totals, targets), [targets, totals]);
  const warning = useMemo(() => targetWarning(totals, targets), [targets, totals]);
  const suggestedTargets = useMemo(() => calculateSuggestedTargets(inputs), [inputs]);

  function updateInput<K extends keyof DietBuilderInputs>(key: K, value: DietBuilderInputs[K]) { setInputs((current) => ({ ...current, [key]: value })); }
  function startTargets() { if (inputs.heightCm < 100 || inputs.weightKg < 25 || inputs.age < 13 || inputs.age > 100 || (inputs.workout && !inputs.workoutTime)) return; setTargets(calculateSuggestedTargets(inputs)); setStep(1); }
  function addItem(mealType: MealType, recipe: Recipe) { setSelections((current) => ({ ...current, [mealType]: [...(current[mealType] ?? []), { id: `${mealType}-${recipe.slug}-${Date.now()}`, recipeSlug: recipe.slug, mealType, portionMultiplier: 1 }] })); setSkipped((current) => ({ ...current, [mealType]: false })); }
  function removeItem(mealType: string, id: string) { setSelections((current) => ({ ...current, [mealType]: (current[mealType] ?? []).filter((item) => item.id !== id) })); }
  function changePortion(mealType: string, id: string, delta: number) { setSelections((current) => ({ ...current, [mealType]: (current[mealType] ?? []).map((item) => item.id === id ? { ...item, portionMultiplier: Math.min(3, Math.max(0.5, Math.round((item.portionMultiplier + delta) * 2) / 2)) } : item) })); }
  function toggleSkip(mealType: MealType) { const next = !skipped[mealType]; setSkipped((current) => ({ ...current, [mealType]: next })); if (next) setSelections((current) => ({ ...current, [mealType]: [] })); }
  function confirmPlan() { setConfirmed(true); setStep(3); }
  function createVariations() { setVariations(generateWeekVariations(selections, recipes, inputs)); }
  function regenerateDay(day: number) { const generated = generateWeekVariations(selections, recipes, inputs)[day]; setVariations((current) => current.map((variation) => variation.day === day ? generated : variation)); }
  function updateVariationPortion(day: number, mealType: string, id: string, delta: number) { setVariations((current) => current.map((variation) => variation.day === day ? { ...variation, selections: { ...variation.selections, [mealType]: (variation.selections[mealType] ?? []).map((item) => item.id === id ? { ...item, portionMultiplier: Math.min(3, Math.max(0.5, Math.round((item.portionMultiplier + delta) * 2) / 2)) } : item) } } : variation)); }
  function reset() { setInputs(DEFAULT_INPUTS); setTargets(DEFAULT_TARGETS); setServingMode("household"); setSelections({}); setSkipped({}); setStep(0); setConfirmed(false); setVariations([]); }

  return <div className="diet-builder print-root">
    <div className="print-hidden mx-auto flex max-w-7xl items-center justify-between border-b px-4 pb-5 sm:px-6 lg:px-8"><div><p className="text-sm font-medium text-primary">GreenFit / Personal tool</p><h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Build my diet plan</h1><p className="mt-2 max-w-2xl text-muted-foreground">A practical plant-based plan built around your body, goals, routine, and Indian grocery budget.</p></div><div className="hidden items-center gap-2 text-sm text-olive-800 sm:flex"><ShieldCheck className="size-4" /> Saved on this device</div></div>
    <ProgressSteps step={step} />
    {step === 0 ? <DetailsStep inputs={inputs} updateInput={updateInput} onContinue={startTargets} /> : null}
    {step === 1 ? <TargetsStep targets={targets} suggestedTargets={suggestedTargets} setTargets={setTargets} onBack={() => setStep(0)} onContinue={() => setStep(2)} /> : null}
    {step === 2 ? <BuildStep recipes={recipes} inputs={inputs} targets={targets} selections={selections} skipped={skipped} openMeal={openMeal} setOpenMeal={setOpenMeal} servingMode={servingMode} setServingMode={setServingMode} totals={totals} guidance={guidance} addItem={addItem} removeItem={removeItem} changePortion={changePortion} toggleSkip={toggleSkip} onBack={() => setStep(1)} onReview={() => setStep(3)} /> : null}
    {step === 3 ? <ReviewStep recipes={recipes} inputs={inputs} targets={targets} selections={selections} totals={totals} warning={warning} guidance={guidance} confirmed={confirmed} variations={variations} editingDay={editingDay} setEditingDay={setEditingDay} onBack={() => { setConfirmed(false); setStep(2); }} onConfirm={confirmPlan} onCreateVariations={createVariations} onRegenerateDay={regenerateDay} onUpdateVariationPortion={updateVariationPortion} onPrint={() => window.print()} onReset={reset} /> : null}
  </div>;
}


function StepNav({ onBack, onNext, nextLabel, backLabel = "Back", showBack = true, showNext = true }: { onBack?: () => void; onNext?: () => void; nextLabel?: string; backLabel?: string; showBack?: boolean; showNext?: boolean }) {
  return (
    <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
      {showBack && onBack ? (
        <Button type="button" variant="outline" onClick={onBack}><ArrowLeft /> {backLabel}</Button>
      ) : (
        <span className="hidden sm:block" />
      )}
      {showNext && onNext && nextLabel ? (
        <Button type="button" size="lg" onClick={onNext}>{nextLabel} <ArrowRight /></Button>
      ) : (
        <span className="hidden sm:block" />
      )}
    </div>
  );
}

function ProgressSteps({ step }: { step: number }) { return <div className="print-hidden mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">{["Your details", "Targets", "Build meals", "Review"].map((label, index) => <div key={label} className="flex min-w-max items-center gap-2 text-sm"><span className={`flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${index <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span><span className={index === step ? "font-semibold" : "text-muted-foreground"}>{label}</span>{index < 3 ? <span className="mx-2 h-px w-8 bg-border sm:w-16" /> : null}</div>)}</div>; }

// The compact form below keeps the builder's first step easy to scan while preserving the existing design system.
function DetailsStep({ inputs, updateInput, onContinue }: { inputs: DietBuilderInputs; updateInput: <K extends keyof DietBuilderInputs>(key: K, value: DietBuilderInputs[K]) => void; onContinue: () => void }) {
  return <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8"><Card><CardHeader><CardTitle className="text-xl">Tell us about yourself</CardTitle><p className="text-sm text-muted-foreground">These details stay in your browser and help us make a useful starting point.</p></CardHeader><CardContent className="grid gap-6"><StepNav showBack={false} onNext={onContinue} nextLabel="Suggest my targets" /><div className="grid gap-4 sm:grid-cols-2"><NumberField label="Height (cm)" value={inputs.heightCm} min={100} max={240} onChange={(value) => updateInput("heightCm", value)} /><NumberField label="Weight (kg)" value={inputs.weightKg} min={25} max={300} onChange={(value) => updateInput("weightKg", value)} /><NumberField label="Age" value={inputs.age} min={13} max={100} onChange={(value) => updateInput("age", value)} /><Field label="Gender"><select className="control" value={inputs.gender} onChange={(event) => updateInput("gender", event.target.value as DietBuilderInputs["gender"])}><option value="female">Female</option><option value="male">Male</option><option value="other">Prefer not to say / other</option></select></Field></div><Field label="What is your main goal?"><div className="grid gap-2 sm:grid-cols-2">{[{ id: "lose", label: "Lose weight" }, { id: "maintain", label: "Maintain weight" }, { id: "gain", label: "Gain weight" }, { id: "fitness", label: "Improve fitness" }, { id: "muscle", label: "Build muscle" }].map((goal) => <button type="button" key={goal.id} onClick={() => updateInput("goal", goal.id as DietBuilderInputs["goal"])} className={`choice ${inputs.goal === goal.id ? "choice-active" : ""}`}>{goal.label}</button>)}</div></Field><div className="grid gap-4 sm:grid-cols-2"><NumberField label="Target weight (optional, kg)" value={inputs.targetWeightKg ?? ""} min={25} max={300} onChange={(value) => updateInput("targetWeightKg", value || null)} placeholder="Optional" /><NumberField label="Duration (optional, weeks)" value={inputs.durationWeeks ?? ""} min={1} max={104} onChange={(value) => updateInput("durationWeeks", value || null)} placeholder="Optional" /></div><div className="grid gap-4 sm:grid-cols-2"><TextField label="Allergies (comma separated)" value={inputs.allergies} onChange={(value) => updateInput("allergies", value)} placeholder="e.g. peanuts, soy" /><TextField label="Foods you dislike (comma separated)" value={inputs.dislikes} onChange={(value) => updateInput("dislikes", value)} placeholder="e.g. mushrooms" /></div><div className="grid gap-4 sm:grid-cols-[1fr_220px] sm:items-end"><Field label="Do you work out?"><div className="flex gap-2"><Button type="button" variant={inputs.workout ? "default" : "outline"} onClick={() => updateInput("workout", true)}>Yes</Button><Button type="button" variant={!inputs.workout ? "default" : "outline"} onClick={() => { updateInput("workout", false); updateInput("workoutTime", ""); }}>No</Button></div></Field>{inputs.workout ? <Field label="Workout time"><select className="control" value={inputs.workoutTime} onChange={(event) => updateInput("workoutTime", event.target.value)}><option value="">Select time</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="late-evening">Late evening</option></select></Field> : null}</div><div className="grid gap-4 sm:grid-cols-[1fr_220px] sm:items-end"><NumberField label="Approx. daily food budget (₹)" value={inputs.dailyBudgetInr} min={50} max={5000} onChange={(value) => updateInput("dailyBudgetInr", value)} /><p className="text-sm leading-6 text-muted-foreground">We will prioritize options that fit this approximate daily budget.</p></div><div className="border-t pt-5"><StepNav showBack={false} onNext={onContinue} nextLabel="Suggest my targets" /></div></CardContent></Card><AsideNote title="A useful starting point"><p>We use your details to estimate a starting calorie, protein, and fiber target. You can adjust every target yourself in the next step.</p><p className="mt-3">For pregnancy, medical conditions, eating disorders, or medication-related concerns, speak with a qualified professional.</p></AsideNote></div>;
}

function TargetsStep({ targets, suggestedTargets, setTargets, onBack, onContinue }: { targets: DietBuilderTargets; suggestedTargets: DietBuilderTargets; setTargets: Dispatch<SetStateAction<DietBuilderTargets>>; onBack: () => void; onContinue: () => void }) {
  const controls = [{ key: "calories", label: "Calories", unit: "kcal", step: 50 }, { key: "protein", label: "Protein", unit: "g", step: 5 }, { key: "fiber", label: "Fiber", unit: "g", step: 1 }] as const;
  useEffect(() => { const handler = () => setTargets(suggestedTargets); window.addEventListener("greenfit-reset-targets", handler); return () => window.removeEventListener("greenfit-reset-targets", handler); }, [setTargets, suggestedTargets]);
  return <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8"><Card><CardHeader><CardTitle className="text-xl">Set your daily targets</CardTitle><p className="text-sm text-muted-foreground">We suggested these values from your answers. Move the sliders to make the plan yours.</p></CardHeader><CardContent className="grid gap-7"><StepNav onBack={onBack} onNext={onContinue} nextLabel="Build my meals" />{controls.map((control) => { const range = targetRange(control.key, suggestedTargets[control.key]); const tone = targetTone(control.key, targets[control.key], suggestedTargets[control.key]); const toneText = tone === "bg-destructive" ? "text-destructive" : tone === "bg-amber-500" ? "text-amber-700" : "text-muted-foreground"; return <div key={control.key} className="rounded-xl border p-5"><div className="flex items-start justify-between gap-3"><div><Label>{control.label}</Label><p className={`mt-1 text-sm ${toneText}`}>{targetSubtitle(control.key, targets[control.key], suggestedTargets[control.key])}</p></div><div className="flex items-center gap-2"><TargetNumberInput value={targets[control.key]} min={range.min} max={range.max} onChange={(value) => setTargets((current) => ({ ...current, [control.key]: clampTarget(control.key, value, suggestedTargets[control.key]) }))} /><span className="text-sm font-medium text-muted-foreground">{control.unit}/day</span></div></div><Slider className="mt-5" min={range.min} max={range.max} step={control.step} value={[targets[control.key]]} indicatorClassName={tone} onValueChange={(value) => setTargets((current) => ({ ...current, [control.key]: clampTarget(control.key, Array.isArray(value) ? value[0] : value, suggestedTargets[control.key]) }))} /><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{range.min} {control.unit}</span><span>{range.max} {control.unit}</span></div></div>; })}<Alert className="border-olive-200 bg-olive-50/70"><Info className="size-4" /><AlertTitle>Use these as flexible targets</AlertTitle><AlertDescription>Small day-to-day differences are normal. You can always edit portions while building your meals.</AlertDescription></Alert><div className="border-t pt-5"><StepNav onBack={onBack} onNext={onContinue} nextLabel="Build my meals" /></div></CardContent></Card><AsideNote title="Targets are adjustable"><p>There is no single perfect number. Start with the suggestion, then tune it for your hunger, routine, and preferences.</p></AsideNote></div>;
}

function targetRange(key: "calories" | "protein" | "fiber", suggested: number) { if (key === "calories") return { min: Math.max(1200, Math.round(suggested * 0.75 / 50) * 50), max: Math.min(3200, Math.round(suggested * 1.35 / 50) * 50) }; if (key === "protein") return { min: Math.max(40, Math.round(suggested * 0.75 / 5) * 5), max: Math.min(180, Math.round(suggested * 1.35 / 5) * 5) }; return { min: Math.max(20, Math.round(suggested * 0.75)), max: Math.min(70, Math.round(suggested * 1.35)) }; }
function clampTarget(key: "calories" | "protein" | "fiber", value: number, suggested: number) { const range = targetRange(key, suggested); return Math.min(range.max, Math.max(range.min, value)); }
type TargetKey = keyof DietBuilderTargets;
type TargetBand = "very-low" | "low" | "recommended" | "high" | "very-high";

const TARGET_MESSAGES: Record<TargetKey, Record<TargetBand, string>> = {
  calories: {
    "very-low": "Far below the recommendation. Sustained under-eating can cause fatigue, weakness, nutrient deficiencies, and muscle loss.",
    low: "Below the recommendation. You may have less energy, poorer workout recovery, and stronger hunger between meals.",
    recommended: "Within the recommended range for your current details and goal.",
    high: "Above the recommendation. A sustained calorie surplus can cause unwanted fat gain over time.",
    "very-high": "Far above the recommendation. Persistent excess calorie intake raises the risk of obesity and related conditions such as type 2 diabetes and heart disease.",
  },
  protein: {
    "very-low": "Far below the recommendation. Too little protein can lead to loss of muscle and strength, slower recovery, and malnutrition over time.",
    low: "Below the recommendation. It may not adequately support muscle maintenance, fullness, or workout recovery.",
    recommended: "Within the recommended range for muscle maintenance, fullness, and recovery.",
    high: "Above the recommendation. More protein may not add extra benefit and can cause digestive discomfort; people with kidney disease need individual guidance.",
    "very-high": "Far above the recommendation. Excess protein creates more waste for the kidneys to remove and can worsen kidney problems in people with impaired kidney function.",
  },
  fiber: {
    "very-low": "Far below the recommendation. Too little fiber can contribute to constipation and make regular bowel movements harder to maintain.",
    low: "Below the recommendation. Stools may be harder to pass, and meals may feel less filling.",
    recommended: "Within the recommended range for bowel regularity and a varied, filling diet.",
    high: "Above the recommendation. Increasing fiber quickly can cause gas, bloating, and abdominal discomfort.",
    "very-high": "Far above the recommendation. Too much fiber too quickly can cause marked gas, bloating, and cramps; without enough fluid, constipation may worsen.",
  },
};

function targetBand(value: number, suggested: number): TargetBand {
  const ratio = suggested ? value / suggested : 1;
  if (ratio < 0.8) return "very-low";
  if (ratio < 0.9) return "low";
  if (ratio <= 1.1) return "recommended";
  if (ratio <= 1.2) return "high";
  return "very-high";
}

function targetTone(key: TargetKey, value: number, suggested: number) {
  const band = targetBand(value, suggested);
  void key;
  if (band === "very-low" || band === "very-high") return "bg-destructive";
  if (band === "low" || band === "high") return "bg-amber-500";
  return "bg-primary";
}

function targetSubtitle(key: TargetKey, value: number, suggested: number) {
  return TARGET_MESSAGES[key][targetBand(value, suggested)];
}

function BuildStep({ recipes, inputs, targets, selections, skipped, openMeal, setOpenMeal, servingMode, setServingMode, totals, guidance, addItem, removeItem, changePortion, toggleSkip, onBack, onReview }: { recipes: Recipe[]; inputs: DietBuilderInputs; targets: DietBuilderTargets; selections: Record<string, SelectedPlanItem[]>; skipped: Record<string, boolean>; openMeal: MealType | null; setOpenMeal: (meal: MealType | null) => void; servingMode: ServingMode; setServingMode: (mode: ServingMode) => void; totals: ReturnType<typeof calculateTotals>; guidance: string | null; addItem: (meal: MealType, recipe: Recipe) => void; removeItem: (meal: string, id: string) => void; changePortion: (meal: string, id: string, delta: number) => void; toggleSkip: (meal: MealType) => void; onBack: () => void; onReview: () => void }) {
  const slots = MEAL_SLOTS.filter((slot) => inputs.workout || !["pre-workout", "post-workout"].includes(slot.id));
  return <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8"><div className="grid gap-3"><Card><CardHeader className="border-b"><div className="flex flex-wrap items-center justify-between gap-3"><div><CardTitle className="text-xl">Build your day, meal by meal</CardTitle><p className="mt-1 text-sm text-muted-foreground">Add options, adjust portions, or skip any slot.</p></div><div className="inline-flex rounded-lg border p-1 text-xs"><button type="button" className={`rounded-md px-3 py-1.5 ${servingMode === "household" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => setServingMode("household")}>Everyday measures</button><button type="button" className={`rounded-md px-3 py-1.5 ${servingMode === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => setServingMode("metric")}>Grams / ml</button></div></div></CardHeader><CardContent className="grid gap-2 pt-4"><div className="pb-2"><StepNav onBack={onBack} onNext={onReview} nextLabel="Continue to review" /></div>{slots.map((slot) => <MealAccordion key={slot.id} slot={slot} recipes={recipes} inputs={inputs} skipped={skipped[slot.id] ?? false} open={openMeal === slot.id} items={selections[slot.id] ?? []} servingMode={servingMode} onToggle={() => setOpenMeal(openMeal === slot.id ? null : slot.id)} onSkip={() => toggleSkip(slot.id)} onAdd={(recipe) => addItem(slot.id, recipe)} onRemove={(id) => removeItem(slot.id, id)} />)}</CardContent></Card><StepNav onBack={onBack} onNext={onReview} nextLabel="Continue to review" /></div><SummaryCard recipes={recipes} targets={targets} selections={selections} totals={totals} guidance={guidance} servingMode={servingMode} changePortion={changePortion} removeItem={removeItem} onReview={onReview} /></div>;
}

function RecipeSuggestionGrid({ recipes, items, servingMode, onAdd, onRemove }: { recipes: Recipe[]; items: SelectedPlanItem[]; servingMode: ServingMode; onAdd: (recipe: Recipe) => void; onRemove: (id: string) => void }) {
  return <div className="grid gap-2 sm:grid-cols-2">{recipes.map((recipe) => { const added = items.some((item) => item.recipeSlug === recipe.slug); const nutrition = scaleRecipeNutrition(recipe, 1); return <div key={recipe.slug} className="rounded-lg border bg-card p-3"><p className="font-medium">{recipe.title}</p><p className="mt-1 text-xs text-muted-foreground">{servingLabel(recipe, servingMode)}</p><p className="mt-2 text-xs">{nutrition.calories} kcal / {nutrition.protein} g protein / {nutrition.fiber} g fiber</p><div className="mt-3 flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{inr(nutrition.costInr)}</span><Button type="button" size="xs" variant={added ? "secondary" : "outline"} onClick={() => added ? onRemove(items.find((item) => item.recipeSlug === recipe.slug)?.id ?? "") : onAdd(recipe)}>{added ? <><Check /> Added</> : "Add"}</Button></div></div>; })}</div>;
}

function MealAccordion({ slot, recipes, inputs, skipped, open, items, servingMode, onToggle, onSkip, onAdd, onRemove }: { slot: typeof MEAL_SLOTS[number]; recipes: Recipe[]; inputs: DietBuilderInputs; skipped: boolean; open: boolean; items: SelectedPlanItem[]; servingMode: ServingMode; onToggle: () => void; onSkip: () => void; onAdd: (recipe: Recipe) => void; onRemove: (id: string) => void }) {
  const suggestions = getMealSuggestions(slot.id, recipes, inputs);
  const addOns = isMainMealSlot(slot.id) ? getMealSuggestions(slot.id, recipes, inputs, { roles: ADD_ON_RECIPE_ROLES, limit: 4 }) : [];
  return <div className={`overflow-hidden rounded-xl border ${open ? "border-primary/60 bg-olive-50/25" : "bg-card"}`}><button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-4 text-left"><span className="flex size-9 items-center justify-center rounded-full bg-olive-100 text-lg text-olive-800">{slot.icon}</span><span className="min-w-0 flex-1"><span className="block font-semibold">{slot.label}</span><span className="block text-xs text-muted-foreground">{skipped ? "Skipped" : items.length ? `${items.length} item${items.length === 1 ? "" : "s"} added` : slot.helper}</span></span>{items.length ? <span className="text-sm font-medium text-primary">{items.length} added</span> : null}{open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</button>{open ? <div className="border-t px-4 pb-4 pt-3"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Choose options that fit your preferences and budget.</p><Button type="button" size="sm" variant="ghost" onClick={onSkip}>{skipped ? "Include slot" : "Skip slot"}</Button></div>{skipped ? <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">This slot is skipped. You can include it again at any time.</div> : <div className="grid gap-5"><RecipeSuggestionGrid recipes={suggestions} items={items} servingMode={servingMode} onAdd={onAdd} onRemove={onRemove} />{addOns.length ? <div className="grid gap-2 border-t pt-4"><p className="text-sm font-semibold">Add a side or extra</p><RecipeSuggestionGrid recipes={addOns} items={items} servingMode={servingMode} onAdd={onAdd} onRemove={onRemove} /></div> : null}</div>}</div> : null}</div>;
}

function SummaryCard({ recipes, targets, selections, totals, guidance, servingMode, changePortion, removeItem, onReview }: { recipes: Recipe[]; targets: DietBuilderTargets; selections: Record<string, SelectedPlanItem[]>; totals: ReturnType<typeof calculateTotals>; guidance: string | null; servingMode: ServingMode; changePortion: (meal: string, id: string, delta: number) => void; removeItem: (meal: string, id: string) => void; onReview: () => void }) { return <Card className="sticky top-6"><CardHeader className="border-b"><div className="flex items-center justify-between"><CardTitle className="text-lg">Your plan</CardTitle><span className="text-xs text-muted-foreground">{inr(totals.costInr)} / day</span></div></CardHeader><CardContent className="grid gap-4 pt-4">{MEAL_SLOTS.map((slot) => { const items = selections[slot.id] ?? []; return <div key={slot.id} className="grid gap-2 border-b pb-3"><div className="flex justify-between text-sm font-semibold"><span>{slot.label}</span><span className="text-primary">{items.length ? items.length : "-"}</span></div>{items.map((item) => { const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug); if (!recipe) return null; const nutrition = scaleRecipeNutrition(recipe, item.portionMultiplier); return <div key={item.id} className="rounded-lg bg-muted/60 p-2.5 text-xs"><div className="flex items-start gap-2"><span className="min-w-0 flex-1 font-medium">{recipe.title}</span><button type="button" aria-label={`Remove ${recipe.title}`} onClick={() => removeItem(slot.id, item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button></div><p className="mt-1 text-muted-foreground">{servingLabel(recipe, servingMode, item.portionMultiplier)} / {nutrition.calories} kcal / {nutrition.protein} g protein</p><div className="mt-2 flex items-center justify-between"><span className="text-muted-foreground">Portion</span><span className="flex items-center gap-1"><Button type="button" size="icon-xs" variant="outline" aria-label="Decrease portion" onClick={() => changePortion(slot.id, item.id, -0.5)}><Minus /></Button><span className="w-7 text-center">{item.portionMultiplier}x</span><Button type="button" size="icon-xs" variant="outline" aria-label="Increase portion" onClick={() => changePortion(slot.id, item.id, 0.5)}><Plus /></Button></span></div></div>; })}</div>; })}<div className="rounded-xl bg-olive-50 p-4"><p className="mb-3 text-sm font-semibold">Daily total so far</p><ProgressMetric label="Calories" value={totals.calories} target={targets.calories} unit="kcal" /><ProgressMetric label="Protein" value={totals.protein} target={targets.protein} unit="g" /><ProgressMetric label="Fiber" value={totals.fiber} target={targets.fiber} unit="g" />{guidance ? <p className="mt-3 text-xs leading-5 text-olive-800">{guidance}</p> : null}</div><Button className="w-full" type="button" onClick={onReview}>Continue to review <ArrowRight /></Button></CardContent></Card>; }

function ReviewStep({ recipes, inputs, targets, selections, totals, warning, guidance, confirmed, variations, editingDay, setEditingDay, onBack, onConfirm, onCreateVariations, onRegenerateDay, onUpdateVariationPortion, onPrint, onReset }: { recipes: Recipe[]; inputs: DietBuilderInputs; targets: DietBuilderTargets; selections: Record<string, SelectedPlanItem[]>; totals: ReturnType<typeof calculateTotals>; warning: ReturnType<typeof targetWarning>; guidance: string | null; confirmed: boolean; variations: Variation[]; editingDay: number | null; setEditingDay: (day: number | null) => void; onBack: () => void; onConfirm: () => void; onCreateVariations: () => void; onRegenerateDay: (day: number) => void; onUpdateVariationPortion: (day: number, mealType: string, id: string, delta: number) => void; onPrint: () => void; onReset: () => void }) {
  return <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8"><div className="grid gap-5"><div className="print-hidden grid gap-4"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-heading text-2xl font-semibold">Review your plan</h2><p className="mt-1 text-muted-foreground">Check portions and targets before saving.</p></div><Button type="button" variant="outline" onClick={onPrint}><Download /> Save as PDF</Button></div><StepNav onBack={onBack} backLabel="Back to editing" showNext={false} /></div>{warning.hasWarning && !confirmed ? <Alert className="print-hidden border-amber-300 bg-amber-50 text-amber-950"><Info className="size-4" /><AlertTitle>Your plan is outside the flexible target range</AlertTitle><AlertDescription><p>{guidance ?? "One or more totals are more than 10% away from target."}</p><div className="mt-4"><Button type="button" onClick={onConfirm}>Confirm plan</Button></div></AlertDescription></Alert> : null}{confirmed ? <Alert className="print-hidden border-olive-200 bg-olive-50/80"><Check className="size-4" /><AlertTitle>Master plan saved on this device</AlertTitle><AlertDescription>Make changes any time, or create a varied week.</AlertDescription></Alert> : null}<PlanTable recipes={recipes} selections={selections} title="Your daily plan" cost={totals.costInr} /></div><div className="grid gap-5"><Card className="sticky top-6"><CardHeader><CardTitle>Daily targets</CardTitle></CardHeader><CardContent className="grid gap-5"><ProgressMetric label="Calories" value={totals.calories} target={targets.calories} unit="kcal" /><ProgressMetric label="Protein" value={totals.protein} target={targets.protein} unit="g" /><ProgressMetric label="Fiber" value={totals.fiber} target={targets.fiber} unit="g" /><div className="border-t pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Daily budget</span><span className="font-semibold">{inr(inputs.dailyBudgetInr)}</span></div><div className="mt-1 flex justify-between"><span className="text-muted-foreground">Plan estimate</span><span className="font-semibold">{inr(totals.costInr)}</span></div></div></CardContent></Card><DisclaimerPrint /></div>{confirmed ? <Card className="print-hidden lg:col-span-2"><CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5"><div><CardTitle>Create 7-day variations</CardTitle><p className="mt-1 text-sm text-muted-foreground">Keep the same direction while rotating foods.</p></div><Button type="button" onClick={onCreateVariations}>{variations.length ? "Regenerate week" : "Generate 7-day variations"}</Button></CardContent></Card> : null}{variations.length ? <Card className="print-hidden lg:col-span-2"><CardHeader><CardTitle>7-day plan overview</CardTitle><p className="text-sm text-muted-foreground">Small differences are intentional. Each day can be edited.</p></CardHeader><CardContent className="grid gap-2">{variations.map((variation) => { const dayTotals = calculateTotals(variation.selections, recipes); return <div key={variation.day} className="rounded-lg border px-3 py-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{DAYS[variation.day]}</p><p className="text-xs text-muted-foreground">{dayTotals.calories} kcal / {Math.round(dayTotals.protein)} g protein / {Math.round(dayTotals.fiber)} g fiber / {inr(dayTotals.costInr)}</p></div><div className="print-hidden flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setEditingDay(editingDay === variation.day ? null : variation.day)}>{editingDay === variation.day ? "Done" : "Edit day"}</Button><Button type="button" variant="ghost" size="sm" onClick={() => onRegenerateDay(variation.day)}><RotateCcw /> Regenerate</Button></div></div>{editingDay === variation.day ? <div className="mt-3 grid gap-2 border-t pt-3">{Object.entries(variation.selections).flatMap(([mealType, items]) => items.map((item) => { const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug); return recipe ? <div key={item.id} className="flex items-center gap-2 text-sm"><span className="min-w-0 flex-1">{recipe.title}</span><span className="text-muted-foreground">{mealType}</span><Button type="button" size="icon-xs" variant="outline" onClick={() => onUpdateVariationPortion(variation.day, mealType, item.id, -0.5)}><Minus /></Button><span className="w-7 text-center">{item.portionMultiplier}x</span><Button type="button" size="icon-xs" variant="outline" onClick={() => onUpdateVariationPortion(variation.day, mealType, item.id, 0.5)}><Plus /></Button></div> : null; }))}</div> : null}</div>; })}</CardContent></Card> : null}<div className="print-hidden lg:col-span-2"><StepNav onBack={onBack} backLabel="Back to editing" showNext={false} /></div><div className="print-only print-page-break grid gap-6"><div className="border-b pb-4"><h2 className="font-heading text-2xl font-semibold">GreenFit 7-day meal plan</h2><p className="mt-1 text-sm text-muted-foreground">Full weekly printout - targets: {targets.calories} kcal - {targets.protein} g protein - {targets.fiber} g fiber</p></div>{variations.map((variation) => <div key={"print-" + variation.day} className="print-day grid gap-3"><div className="flex items-center justify-between border-b pb-2"><h3 className="font-heading text-lg font-semibold">{DAYS[variation.day]}</h3><span className="text-sm text-muted-foreground">{Math.round(calculateTotals(variation.selections, recipes).calories)} kcal - {Math.round(calculateTotals(variation.selections, recipes).protein)} g protein - {Math.round(calculateTotals(variation.selections, recipes).fiber)} g fiber</span></div>{MEAL_SLOTS.map((slot) => { const items = variation.selections[slot.id] ?? []; return items.length ? <div key={variation.day + "-" + slot.id} className="grid gap-1"><p className="text-sm font-semibold">{slot.label}</p>{items.map((item) => { const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug); if (!recipe) return null; const nutrition = scaleRecipeNutrition(recipe, item.portionMultiplier); return <div key={item.id} className="flex justify-between gap-3 border-b border-dashed py-1 text-sm"><span>{recipe.title} / {servingLabel(recipe, "metric", item.portionMultiplier)}</span><span>{nutrition.calories} kcal / {nutrition.protein} g protein / {nutrition.fiber} g fiber</span></div>; })}</div> : null; })}</div>)}</div><p className="print-hidden text-xs leading-5 text-muted-foreground">Values are approximate and may vary by ingredients, recipe, and preparation. This plan is general information, not medical advice.</p><div className="print-hidden flex justify-end gap-3 lg:col-span-2"><Button type="button" variant="ghost" onClick={onReset}>Start over</Button></div></div>;
}

function PlanTable({ recipes, selections, title, cost }: { recipes: Recipe[]; selections: Record<string, SelectedPlanItem[]>; title: string; cost: number }) { return <Card><CardHeader><CardTitle>{title}</CardTitle><p className="text-sm text-muted-foreground">Approximate cost: {inr(cost)} per day</p></CardHeader><CardContent className="grid gap-4">{MEAL_SLOTS.map((slot) => { const items = selections[slot.id] ?? []; return items.length ? <div key={slot.id} className="rounded-xl border"><div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3 font-semibold"><span>{slot.label}</span><span className="text-sm text-muted-foreground">{items.reduce((sum, item) => { const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug); return sum + (recipe ? scaleRecipeNutrition(recipe, item.portionMultiplier).calories : 0); }, 0)} kcal</span></div>{items.map((item) => { const recipe = recipes.find((candidate) => candidate.slug === item.recipeSlug); if (!recipe) return null; const nutrition = scaleRecipeNutrition(recipe, item.portionMultiplier); return <div key={item.id} className="flex flex-wrap items-center gap-3 border-b px-4 py-3 text-sm last:border-b-0"><span className="min-w-40 flex-1 font-medium">{recipe.title}</span><span className="text-muted-foreground">{servingLabel(recipe, "metric", item.portionMultiplier)}</span><span>{nutrition.calories} kcal</span><span>{nutrition.protein} g protein</span><span>{nutrition.fiber} g fiber</span></div>; })}</div> : null; })}</CardContent></Card>; }

function ProgressMetric({ label, value, target, unit }: { label: string; value: number; target: number; unit: string }) { const percentage = targetRatio(value, target); const width = Math.min(100, percentage / 1.5); const over = percentage > 100; return <div className="grid gap-1.5"><div className="flex items-end justify-between gap-2 text-sm"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{Math.round(value)} / {Math.round(target)} {unit} <span className={over ? "text-amber-700" : "text-primary"}>({percentage}%)</span></span></div><div className="relative h-2.5 overflow-visible rounded-full bg-border" role="progressbar" aria-label={`${label} progress`} aria-valuemin={0} aria-valuemax={150} aria-valuenow={Math.min(percentage, 150)}><div className={`h-full rounded-full ${over ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${width}%` }} />{percentage >= 100 ? <span className="absolute top-[-3px] h-4 w-0.5 bg-foreground" style={{ left: `${100 / 1.5}%` }} aria-hidden="true" /> : null}</div><div className="flex justify-between text-[10px] text-muted-foreground"><span>0%</span><span>100% target</span><span>150%+</span></div></div>; }
function TargetNumberInput({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (value: number) => void }) {
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
      className="h-10 w-24 text-right"
      type="number"
      value={text}
      min={min}
      max={max}
      onFocus={() => setFocused(true)}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        if (next.trim() === "") return;
        const parsed = Number(next);
        if (!Number.isFinite(parsed)) return;
        onChange(parsed);
      }}
      onBlur={() => {
        setFocused(false);
        if (text.trim() === "" || !Number.isFinite(Number(text))) {
          setText(String(value));
          return;
        }
        const parsed = Number(text);
        onChange(parsed);
        setText(String(parsed));
      }}
    />
  );
}

function NumberField({ label, value, min, max, onChange, placeholder }: { label: string; value: number | string; min?: number; max?: number; onChange: (value: number) => void; placeholder?: string }) {
  const displayFromValue = value === "" || value === null || value === undefined ? "" : String(value);
  const [text, setText] = useState(displayFromValue);
  const [focused, setFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const numericValue = typeof value === "number" && Number.isFinite(value) ? value : null;

  // Sync draft text from parent when not editing (avoid setState-in-effect).
  if (!focused && value !== prevValue) {
    setPrevValue(value);
    setText(displayFromValue);
  }

  return (
    <Field label={label}>
      <Input
        className="h-10"
        type="number"
        value={text}
        min={min}
        max={max}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          if (next.trim() === "") return;
          const parsed = Number(next);
          if (!Number.isFinite(parsed)) return;
          onChange(parsed);
        }}
        onBlur={() => {
          setFocused(false);
          if (text.trim() === "") {
            // Optional fields (placeholder present) clear to empty; required ones restore last valid number.
            if (placeholder !== undefined || numericValue === null) {
              setText("");
              // Callers for optional fields use `value || null`, so 0 clears the stored optional.
              if (placeholder !== undefined) onChange(0);
              return;
            }
            setText(String(numericValue));
            return;
          }
          const parsed = Number(text);
          if (!Number.isFinite(parsed)) {
            setText(numericValue === null ? "" : String(numericValue));
            return;
          }
          const clamped =
            min !== undefined || max !== undefined
              ? Math.min(max ?? parsed, Math.max(min ?? parsed, parsed))
              : parsed;
          onChange(clamped);
          setText(String(clamped));
        }}
      />
    </Field>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <Field label={label}><Input className="h-10" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></Field>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="grid gap-2"><Label>{label}</Label>{children}</div>; }
function AsideNote({ title, children }: { title: string; children: ReactNode }) { return <Card className="h-fit bg-mint-50/70"><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{children}{title === "Targets are adjustable" ? <Button className="mt-4" type="button" size="sm" onClick={() => window.dispatchEvent(new Event("greenfit-reset-targets"))}>Reset to recommended</Button> : null}</CardContent></Card>; }
function DisclaimerPrint() { return <Alert className="print-hidden border-olive-200 bg-olive-50/60"><ShieldCheck className="size-4" /><AlertTitle>General information only</AlertTitle><AlertDescription>For medical conditions, pregnancy, children, elderly people, eating disorders, kidney disease, diabetes, or medication-related concerns, consult a qualified doctor or registered dietitian.</AlertDescription></Alert>; }
