import { affiliateSupplements, devices } from "@/lib/data";

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
};

function getSupplement(id: string) {
  const product = affiliateSupplements.find((item) => item.id === id);
  if (!product) throw new Error(`Missing affiliate supplement: ${id}`);
  return product;
}

function getDevice(slug: string) {
  const device = devices.find((item) => item.slug === slug);
  if (!device) throw new Error(`Missing device: ${slug}`);
  return device;
}

function supplementProduct(
  id: string,
  tags: string[],
  description: string,
  detail: string,
): ShopProduct {
  const product = getSupplement(id);
  return {
    id: product.id,
    name: product.title,
    category: "Supplements",
    tags,
    description,
    detail,
    href: product.amazonUrl,
    imageUrl: product.imageUrl,
    visual: "supplement",
  };
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

function directorySupplementProduct(product: (typeof affiliateSupplements)[number]): ShopProduct {
  const tag = supplementTagLabels[product.nutrient] ?? product.nutrient;
  return {
    id: product.id,
    name: product.title,
    category: "Supplements",
    tags: [tag, product.form],
    description: product.veganEvidence,
    detail: `${product.form} · ${product.doseText} Check the current listing and any available test result before buying.`,
    href: product.amazonUrl,
    imagePath: product.imagePath,
    imageUrl: product.imageUrl,
    visual: "supplement",
  };
}

function deviceProduct(
  slug: string,
  tags: string[],
  description: string,
  detail: string,
): ShopProduct {
  const device = getDevice(slug);
  return {
    id: device.slug,
    name: device.name,
    category: "Kitchen",
    tags,
    description,
    detail,
    href: device.amazonSearchUrl,
    imagePath: device.imagePath,
    visual: "kitchen",
  };
}

export const supplementProducts: ShopProduct[] = [
  supplementProduct(
    "unived-ovegha-vegan-omega-3",
    ["Omega-3", "Algae-based"],
    "A plant-based DHA option worth comparing with standard fish-oil listings.",
    "Check the labelled DHA amount, serving size, capsule material, and current vegan evidence.",
  ),
  supplementProduct(
    "origins-nutra-bone-alga",
    ["Calcium", "Algae-based"],
    "A less familiar algae-derived calcium format for people comparing plant-based options.",
    "Compare elemental calcium, added vitamin D or K, serving size, and whether the label suits your diet.",
  ),
  supplementProduct(
    "naturaltein-vegan-creatine",
    ["Creatine", "Training"],
    "Plain creatine monohydrate to evaluate separately from flavoured pre-workout blends.",
    "Look for a clearly stated serving, a short ingredient list, and current vegan suitability on the label.",
  ),
  ...affiliateSupplements
    .filter((product) => !["unived-ovegha-vegan-omega-3", "origins-nutra-bone-alga", "naturaltein-vegan-creatine"].includes(product.id))
    .map(directorySupplementProduct),
];

export const exerciseProducts: ShopProduct[] = [
  {
    id: "walking-pad",
    name: "Walking pad",
    category: "Exercise & Fitness",
    tags: ["Cardio", "Small-space training"],
    description: "A low-friction way to add daily steps at home—especially useful if outdoor walks are hard to fit in.",
    detail: "Buy this only if you will walk most days. Check max speed, noise level, deck length, remote or app controls, and whether it stores flat under furniture.",
    href: "https://www.amazon.in/s?k=walking+pad+for+home",
    imagePath: "/images/shop/exercise/walking-pad.jpg",
    visual: "exercise",
  },
  {
    id: "treadmill",
    name: "Treadmill",
    category: "Exercise & Fitness",
    tags: ["Cardio"],
    description: "Still one of the highest-use home cardio machines when weather, safety, or schedule make outdoor running unreliable.",
    detail: "Prioritize continuous motor power, belt size, shock absorption, fold mechanism, and local service. Avoid models you will not have space to leave accessible.",
    href: "https://www.amazon.in/s?k=foldable+motorized+treadmill+for+home",
    imagePath: "/images/shop/exercise/treadmill.jpg",
    visual: "exercise",
  },
  {
    id: "cross-trainer",
    name: "Cross trainer",
    category: "Exercise & Fitness",
    tags: ["Cardio"],
    description: "A joint-friendlier cardio option for steady sessions when impact from running is the main barrier.",
    detail: "Look for a smooth stride length, stable base, quiet drive, useful resistance levels, and a footprint you can live with long-term.",
    href: "https://www.amazon.in/s?k=cross+trainer+elliptical+home",
    imagePath: "/images/shop/exercise/cross-trainer.jpg",
    visual: "exercise",
  },
  {
    id: "exercise-bike",
    name: "Exercise bike",
    category: "Exercise & Fitness",
    tags: ["Cardio", "Small-space training"],
    description: "Reliable indoor cardio with a smaller footprint than most treadmills, and easier on joints for many people.",
    detail: "Compare seat comfort, resistance type, max user weight, noise, and whether you prefer upright, spin, or recumbent geometry.",
    href: "https://www.amazon.in/s?k=magnetic+exercise+bike+home",
    imagePath: "/images/shop/exercise/exercise-bike.jpg",
    visual: "exercise",
  },
  {
    id: "adjustable-dumbbells",
    name: "Adjustable dumbbells",
    category: "Exercise & Fitness",
    tags: ["Strength & resistance", "Small-space training"],
    description: "A space-saving pair that can cover most upper-body and lower-body dumbbell work as loads increase.",
    detail: "Compare the weight range, adjustment speed, lock security, and whether the length still works for floor presses.",
    href: "https://www.amazon.in/s?k=adjustable+dumbbells+home+gym",
    imagePath: "/images/shop/exercise/adjustable-dumbbells.jpg",
    visual: "exercise",
  },
  {
    id: "adjustable-bench",
    name: "Adjustable weight bench",
    category: "Exercise & Fitness",
    tags: ["Strength & resistance"],
    description: "The piece that makes dumbbells far more useful: presses, rows, step-ups, and supported work instead of only floor exercises.",
    detail: "Check incline/decline options, pad firmness, footprint when flat, weight rating, and how stable it feels under load.",
    href: "https://www.amazon.in/s?k=adjustable+weight+bench+home+gym",
    imagePath: "/images/shop/exercise/adjustable-bench.jpg",
    visual: "exercise",
  },
  {
    id: "adjustable-kettlebell",
    name: "Adjustable kettlebell",
    category: "Exercise & Fitness",
    tags: ["Strength & resistance", "Small-space training"],
    description: "One compact load that can cover swings, squats, carries, and presses as your routine develops.",
    detail: "Check the adjustment mechanism, lowest and highest loads, handle clearance, and how securely it locks.",
    href: "https://www.amazon.in/s?k=adjustable+kettlebell",
    imagePath: "/images/shop/exercise/adjustable-kettlebell.jpg",
    visual: "exercise",
  },
  {
    id: "suspension-trainer",
    name: "Suspension trainer",
    category: "Exercise & Fitness",
    tags: ["Strength & resistance", "Bodyweight training"],
    description: "A portable way to add rows, presses, split squats, and core work without a large rack.",
    detail: "Look for reliable door or anchor hardware, comfortable handles, length adjustment, and clear load guidance.",
    href: "https://www.amazon.in/s?k=suspension+trainer+home+gym",
    imagePath: "/images/shop/exercise/suspension-trainer.jpg",
    visual: "exercise",
  },
  {
    id: "resistance-bands",
    name: "Resistance bands set",
    category: "Exercise & Fitness",
    tags: ["Strength & resistance", "Small-space training"],
    description: "A low-cost way to add progressive tension for rows, presses, squats, and mobility work at home.",
    detail: "Look for clearly labelled resistance levels, durable handles or loops, and anchors that match how you plan to train.",
    href: "https://www.amazon.in/s?k=resistance+bands+set+home+workout",
    imagePath: "/images/shop/exercise/resistance-bands.jpg",
    visual: "exercise",
  },
  {
    id: "pull-up-bar",
    name: "Doorway pull-up bar",
    category: "Exercise & Fitness",
    tags: ["Bodyweight training", "Strength & resistance"],
    description: "A practical entry point for pull-ups, hanging, and scapular work without installing a full rack.",
    detail: "Check your doorframe width and depth, the mounting style, rated load, and whether it needs permanent hardware.",
    href: "https://www.amazon.in/s?k=doorway+pull+up+bar",
    imagePath: "/images/shop/exercise/pull-up-bar.jpg",
    visual: "exercise",
  },
  {
    id: "parallettes",
    name: "Low parallettes",
    category: "Exercise & Fitness",
    tags: ["Bodyweight training", "Strength & resistance"],
    description: "A pair of handles for incline push-ups, support holds, wrist-friendlier floor work, and controlled bodyweight progressions.",
    detail: "Choose a stable base, non-slip feet, a comfortable grip diameter, and a height that matches your experience.",
    href: "https://www.amazon.in/s?k=low+parallettes+push+up+bars",
    imagePath: "/images/shop/exercise/parallettes.jpg",
    visual: "exercise",
  },
  {
    id: "yoga-mat",
    name: "Yoga mat",
    category: "Exercise & Fitness",
    tags: ["Mobility & recovery", "Small-space training"],
    description: "A simple foundation for floor work, mobility drills, bodyweight sessions, and recovery days.",
    detail: "Compare thickness, grip when sweaty, ease of rolling, and whether the mat stays put on your floor surface.",
    href: "https://www.amazon.in/s?k=yoga+mat+exercise",
    imagePath: "/images/shop/exercise/yoga-mat.jpg",
    visual: "exercise",
  },
  {
    id: "foam-roller",
    name: "Foam roller",
    category: "Exercise & Fitness",
    tags: ["Mobility & recovery"],
    description: "Useful for post-session recovery work on calves, quads, glutes, and the upper back.",
    detail: "Choose a density that matches your tolerance, a length that fits your space, and a surface texture you will actually use.",
    href: "https://www.amazon.in/s?k=foam+roller+exercise",
    imagePath: "/images/shop/exercise/foam-roller.jpg",
    visual: "exercise",
  },
  {
    id: "jump-rope",
    name: "Jump rope",
    category: "Exercise & Fitness",
    tags: ["Cardio", "Small-space training"],
    description: "A compact conditioning tool that can fill short sessions when outdoor cardio is hard to fit in.",
    detail: "Look for adjustable length, comfortable handles, and a rope weight that matches your current skill level.",
    href: "https://www.amazon.in/s?k=skipping+rope+weighted",
    imagePath: "/images/shop/exercise/jump-rope.jpg",
    visual: "exercise",
  },
];

export const kitchenProducts: ShopProduct[] = [
  deviceProduct(
    "cold-press-juicer",
    ["Juicing", "Prep"],
    "A slower juicing format for people who want to experiment with fresh vegetable and fruit combinations at home.",
    "Compare yield, cleaning time, feed-chute size, pulp handling, service support, and how often you will realistically use it.",
  ),
  deviceProduct(
    "spice-grinder",
    ["Prep", "Small-space kitchen"],
    "A small grinder can make fresh masalas, seed blends, and roasted-legume toppings much easier to repeat.",
    "Use it for dry ingredients unless the manual explicitly supports wet blending, and clean between strong spice mixes.",
  ),
  deviceProduct(
    "electric-pressure-cooker",
    ["Batch cooking", "Cooking"],
    "A practical shortcut for dal, rajma, chickpeas, grains, and batch prep without watching a stovetop pot.",
    "Prioritize service support, sealing-ring availability, useful capacity, and clear pressure-release guidance.",
  ),
  {
    id: "wonderchef-automatic-cooking-machine",
    name: "Wonderchef automatic cooking machine",
    category: "Kitchen",
    tags: ["Cooking", "Batch cooking"],
    description: "An unusual hands-off option for chopping, sautéing, and guided cooking when meal prep is the part that creates friction.",
    detail: "Check the pre-loaded recipes, vessel capacity, cleaning steps, service coverage, and whether the guided modes fit your everyday meals.",
    href: "https://www.amazon.in/Wonderchef-Automatic-Chopping-Saut%C3%A9ing-Pre-Loaded/dp/B0D3HWB5B7",
    imagePath: "/images/shop/kitchen/wonderchef-automatic-cooking-machine.jpg",
    visual: "kitchen",
  },
  deviceProduct(
    "food-processor",
    ["Prep", "Batch cooking"],
    "Useful when chopping, grating, shredding, or blending vegetables and legumes is the part that stops you cooking.",
    "Compare bowl size, pulse control, included discs, storage footprint, and whether replacement parts are available.",
  ),
];

export const beautyProducts: ShopProduct[] = [
  {
    id: "silicone-scalp-massager",
    name: "Silicone scalp massager",
    category: "Personal Care & Beauty",
    tags: ["Hair care", "Low-waste routine"],
    description: "A simple shower tool that can make scalp cleansing more consistent without adding another formula.",
    detail: "Choose soft, flexible bristles, an easy-to-clean shape, and a grip that stays comfortable when wet.",
    href: "https://www.amazon.in/s?k=silicone+scalp+massager+shampoo+brush",
    imagePath: "/images/shop/beauty/silicone-scalp-massager.jpg",
    visual: "beauty",
  },
  {
    id: "reusable-facial-rounds",
    name: "Reusable facial rounds",
    category: "Personal Care & Beauty",
    tags: ["Low-waste routine", "Everyday essentials"],
    description: "Washable cotton or bamboo rounds can replace a small stream of disposable cotton pads in a daily routine.",
    detail: "Check the fabric, edge stitching, wash instructions, drying time, and whether the set comes with a laundry bag.",
    href: "https://www.amazon.in/s?k=reusable+makeup+remover+pads+washable",
    imagePath: "/images/shop/beauty/reusable-facial-rounds.jpg",
    visual: "beauty",
  },
  {
    id: "mineral-sunscreen-spf-50",
    name: "Mineral sunscreen SPF 50",
    category: "Personal Care & Beauty",
    tags: ["Sun protection", "Everyday essentials"],
    description: "A useful category to compare when you want a sunscreen with zinc oxide or titanium dioxide as the filter.",
    detail: "Check the current SPF/PA rating, full ingredient list, finish, reapplication guidance, and whether it suits your skin.",
    href: "https://www.amazon.in/s?k=mineral+sunscreen+spf+50+zinc+oxide",
    imagePath: "/images/shop/beauty/mineral-sunscreen-spf-50.jpg",
    visual: "beauty",
  },
];

export const bookProducts: ShopProduct[] = [
  {
    id: "how-not-to-die",
    name: "How Not to Die",
    category: "Books",
    tags: ["Nutrition"],
    description: "Michael Greger’s overview of diet-related chronic disease and the everyday plant foods he argues matter most.",
    detail: "A practical starting point if you want research-backed food patterns rather than another short-term diet plan.",
    href: "https://www.amazon.in/s?k=How+Not+to+Die+Michael+Greger",
    imagePath: "/images/shop/books/how-not-to-die.jpg",
    visual: "book",
  },
  {
    id: "the-proof-is-in-the-plants",
    name: "The Proof is in the Plants",
    category: "Books",
    tags: ["Nutrition"],
    description: "Simon Hill’s accessible case for a predominantly plant-based pattern, covering health, environment, and everyday eating.",
    detail: "Useful when you want a balanced, modern overview rather than a cookbook-first introduction.",
    href: "https://www.amazon.in/s?k=The+Proof+is+in+the+Plants+Simon+Hill",
    imagePath: "/images/shop/books/the-proof-is-in-the-plants.jpg",
    visual: "book",
  },
  {
    id: "how-not-to-diet",
    name: "How Not to Diet",
    category: "Books",
    tags: ["Nutrition"],
    description: "A deep look at the evidence around sustainable weight loss, appetite, and food quality beyond calorie slogans.",
    detail: "Best treated as a reference for habits and food choices rather than a rigid meal prescription.",
    href: "https://www.amazon.in/s?k=How+Not+to+Diet+Michael+Greger",
    imagePath: "/images/shop/books/how-not-to-diet.jpg",
    visual: "book",
  },
  {
    id: "the-china-study",
    name: "The China Study",
    category: "Books",
    tags: ["Nutrition"],
    description: "T. Colin Campbell’s influential book linking dietary patterns with long-term health outcomes and plant-forward eating.",
    detail: "A foundational text many people encounter early when exploring plant-based nutrition arguments.",
    href: "https://www.amazon.in/s?k=The+China+Study+T+Colin+Campbell",
    imagePath: "/images/shop/books/the-china-study.jpg",
    visual: "book",
  },
  {
    id: "whole-rethinking-nutrition",
    name: "Whole: Rethinking the Science of Nutrition",
    category: "Books",
    tags: ["Nutrition"],
    description: "T. Colin Campbell’s follow-up on how reductionist nutrition research can miss the bigger picture of whole foods.",
    detail: "A denser companion to The China Study if you want more on how nutrition science is framed and measured.",
    href: "https://www.amazon.in/Whole-Rethinking-Nutrition-Colin-Campbell-ebook/dp/B00APDFVLU",
    imagePath: "/images/shop/books/whole-rethinking-nutrition.jpg",
    visual: "book",
  },
  {
    id: "fiber-fueled",
    name: "Fiber Fueled",
    category: "Books",
    tags: ["Nutrition"],
    description: "Will Bulsiewicz on fibre, the gut microbiome, and why plant diversity can matter more than single superfoods.",
    detail: "A practical read when digestion, bloating, or building a more plant-rich plate is the main question.",
    href: "https://www.amazon.in/dp/059308456X",
    imagePath: "/images/shop/books/fiber-fueled.jpg",
    visual: "book",
  },
  {
    id: "ultra-processed-people",
    name: "Ultra-Processed People",
    category: "Books",
    tags: ["Nutrition"],
    description: "Chris van Tulleken’s investigation of ultra-processed food, how it is designed, and what it does to appetite and health.",
    detail: "Useful when the problem is not “more willpower” but understanding the food environment around you.",
    href: "https://www.amazon.in/s?k=Ultra-Processed+People+Chris+van+Tulleken",
    imagePath: "/images/shop/books/ultra-processed-people.jpg",
    visual: "book",
  },
  {
    id: "vegan-for-life",
    name: "Vegan for Life",
    category: "Books",
    tags: ["Nutrition", "Veganism"],
    description: "Jack Norris and Virginia Messina’s practical nutrition guide to staying healthy on a fully plant-based diet.",
    detail: "Strong on nutrients, planning, and day-to-day adequacy rather than recipes or ethics alone.",
    href: "https://www.amazon.in/Vegan-Life-Everything-Healthy-Plant-based-ebook/dp/B07XDRY8ZF",
    imagePath: "/images/shop/books/vegan-for-life.jpg",
    visual: "book",
  },
  {
    id: "forks-over-knives",
    name: "Forks Over Knives",
    category: "Books",
    tags: ["Cooking", "Nutrition"],
    description: "The companion-style introduction many people use after watching the film, focused on whole-food plant-based eating.",
    detail: "A lighter entry point if you want the broad idea before moving into denser nutrition books or Indian cookbooks.",
    href: "https://www.amazon.in/s?k=Forks+Over+Knives+book",
    imagePath: "/images/shop/books/forks-over-knives.jpg",
    visual: "book",
  },
  {
    id: "the-plant-based-athlete",
    name: "The Plant-Based Athlete",
    category: "Books",
    tags: ["Training"],
    description: "Matt Frazier and Robert Cheeke on training, recovery, and fueling for active people eating plant-based.",
    detail: "Helpful if your interest in plant-based eating is tied to strength, endurance, or everyday training consistency.",
    href: "https://www.amazon.in/s?k=The+Plant-Based+Athlete+Matt+Frazier+Robert+Cheeke",
    imagePath: "/images/shop/books/the-plant-based-athlete.jpg",
    visual: "book",
  },
  {
    id: "finding-ultra",
    name: "Finding Ultra",
    category: "Books",
    tags: ["Training"],
    description: "Rich Roll’s transformation story from midlife burnout into ultra-endurance sport and plant-based living.",
    detail: "A motivation-heavy memoir more than a training manual—useful if story and identity change are what you need first.",
    href: "https://www.amazon.in/s?k=Finding+Ultra+Rich+Roll",
    imagePath: "/images/shop/books/finding-ultra.jpg",
    visual: "book",
  },
  {
    id: "no-meat-athlete",
    name: "No Meat Athlete",
    category: "Books",
    tags: ["Training"],
    description: "Matt Frazier’s practical guide to plant-based running, strength, and building an active life without meat.",
    detail: "A good bridge between beginner plant-based eating and more sport-specific nutrition books.",
    href: "https://www.amazon.in/s?k=No+Meat+Athlete+Run+on+Plants+Matt+Frazier",
    imagePath: "/images/shop/books/no-meat-athlete.jpg",
    visual: "book",
  },
  {
    id: "plant-based-sports-nutrition",
    name: "Plant-Based Sports Nutrition",
    category: "Books",
    tags: ["Training", "Nutrition"],
    description: "D. Enette Larson-Meyer and Matt Ruscigno on fueling, recovery, and performance for plant-based athletes.",
    detail: "More textbook-style than memoir—best when you want nutrient detail rather than inspiration alone.",
    href: "https://www.amazon.in/s?k=Plant-Based+Sports+Nutrition+Larson-Meyer",
    imagePath: "/images/shop/books/plant-based-sports-nutrition.jpg",
    visual: "book",
  },
  {
    id: "vegan-athletes-nutrition-handbook",
    name: "The Vegan Athlete's Nutrition Handbook",
    category: "Books",
    tags: ["Training", "Veganism"],
    description: "Nichole Dandrea-Russert’s essential guide to plant-based performance, everyday fueling, and recovery basics.",
    detail: "A compact handbook format when you want clear nutrition principles without a long narrative.",
    href: "https://www.amazon.in/s?k=The+Vegan+Athlete%27s+Nutrition+Handbook",
    imagePath: "/images/shop/books/vegan-athletes-nutrition-handbook.jpg",
    visual: "book",
  },
  {
    id: "thrive",
    name: "Thrive",
    category: "Books",
    tags: ["Training"],
    description: "Brendan Brazier’s plant-based nutrition framework for energy, recovery, and high-performance everyday living.",
    detail: "One of the earlier mainstream plant-based athlete books; still useful for whole-food fueling ideas.",
    href: "https://www.amazon.in/s?k=Thrive+Brendan+Brazier",
    imagePath: "/images/shop/books/thrive.jpg",
    visual: "book",
  },
  {
    id: "shred-it",
    name: "Shred It!",
    category: "Books",
    tags: ["Training"],
    description: "Robert Cheeke’s step-by-step guide to burning fat and building muscle on a whole-food, plant-based diet.",
    detail: "Especially relevant if your goal is body composition and strength rather than endurance alone.",
    href: "https://www.amazon.in/s?k=Shred+It+Robert+Cheeke",
    imagePath: "/images/shop/books/shred-it.jpg",
    visual: "book",
  },
  {
    id: "the-plantpower-way",
    name: "The Plantpower Way",
    category: "Books",
    tags: ["Cooking", "Training"],
    description: "Rich Roll and Julie Piatt’s family-friendly plant-based recipes and guidance for everyday cooking.",
    detail: "A cookbook-first companion to the plant-based athlete world when you need meals, not only theory.",
    href: "https://www.amazon.in/s?k=The+Plantpower+Way+Rich+Roll",
    imagePath: "/images/shop/books/the-plantpower-way.jpg",
    visual: "book",
  },
  {
    id: "the-satvic-revolution",
    name: "The Satvic Revolution",
    category: "Books",
    tags: ["Nutrition"],
    description: "Subah and Harshvardhan Saraf on seven lifestyle habits aimed at simpler, more plant-forward daily living.",
    detail: "An India-rooted habits book for people who want structure around food, routine, and energy rather than only recipes.",
    href: "https://www.amazon.in/Satvic-Revolution-Life-Changing-Habits-Discover/dp/0143460382",
    imagePath: "/images/shop/books/the-satvic-revolution.jpg",
    visual: "book",
  },
  {
    id: "eating-animals",
    name: "Eating Animals",
    category: "Books",
    tags: ["Veganism"],
    description: "Jonathan Safran Foer’s investigation of industrial animal agriculture, ethics, and the personal decision of what to eat.",
    detail: "A narrative-driven ethics book rather than a nutrition manual—useful for the values side of the shift.",
    href: "https://www.amazon.in/s?k=Eating+Animals+Jonathan+Safran+Foer",
    imagePath: "/images/shop/books/eating-animals.jpg",
    visual: "book",
  },
  {
    id: "animal-liberation-now",
    name: "Animal Liberation Now",
    category: "Books",
    tags: ["Veganism"],
    description: "Peter Singer’s updated classic on animal ethics and why the case for reducing animal use still matters.",
    detail: "A denser philosophy-and-ethics read for people who want the intellectual foundation of modern animal advocacy.",
    href: "https://www.amazon.in/s?k=Animal+Liberation+Now+Peter+Singer",
    imagePath: "/images/shop/books/animal-liberation-now.jpg",
    visual: "book",
  },
  {
    id: "plant-based-india",
    name: "Plant-Based India",
    category: "Books",
    tags: ["Cooking"],
    description: "A strong introduction to fully vegan Indian cooking rooted in familiar regional dishes and techniques.",
    detail: "A good pick when you want plant-based meals to feel culturally familiar rather than like a separate cuisine.",
    href: "https://www.amazon.in/s?k=Plant-Based+India+Sheil+Shukla",
    imagePath: "/images/shop/books/plant-based-india.jpg",
    visual: "book",
  },
  {
    id: "the-modern-tiffin",
    name: "The Modern Tiffin",
    category: "Books",
    tags: ["Cooking"],
    description: "A useful angle on portable plant-based meals when lunch needs to travel well and stay interesting.",
    detail: "Look for the recipes that fit your container, commute, reheating options, and weekly prep time.",
    href: "https://www.amazon.in/s?k=The+Modern+Tiffin+Priyanka+Naik",
    imagePath: "/images/shop/books/the-modern-tiffin.jpg",
    visual: "book",
  },
  {
    id: "feast-on-a-leaf",
    name: "Feast on a Leaf",
    category: "Books",
    tags: ["Cooking"],
    description: "A less obvious regional pick for exploring the structure, variety, and hospitality of an Onam sadhya.",
    detail: "The book includes a vegan menu option, making it a useful bridge from traditional celebration cooking to plant-based hosting.",
    href: "https://www.amazon.in/s?k=Feast+on+a+Leaf+Onam+Sadhya+Cookbook",
    imagePath: "/images/shop/books/feast-on-a-leaf.jpg",
    visual: "book",
  },
];

export const allShopProducts: ShopProduct[] = [
  ...supplementProducts,
  ...exerciseProducts,
  ...kitchenProducts,
  ...beautyProducts,
  ...bookProducts,
];

export const supplementFeaturedProducts = supplementProducts.slice(0, 5);
export const exerciseFeaturedProducts = [
  exerciseProducts.find((p) => p.id === "walking-pad")!,
  exerciseProducts.find((p) => p.id === "treadmill")!,
  exerciseProducts.find((p) => p.id === "cross-trainer")!,
  exerciseProducts.find((p) => p.id === "exercise-bike")!,
  exerciseProducts.find((p) => p.id === "adjustable-dumbbells")!,
];
export const kitchenFeaturedProducts = kitchenProducts.slice(0, 3);
export const beautyFeaturedProducts = beautyProducts.slice(0, 3);
export const bookFeaturedProducts = bookProducts.slice(0, 5);

export const shopFeaturedProducts = [
  supplementProducts[0],
  exerciseProducts[1],
  kitchenProducts[0],
  beautyProducts[1],
  bookProducts[2],
];
