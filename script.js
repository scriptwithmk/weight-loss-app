const form = document.getElementById("calorieForm");
const weightInput = document.getElementById("weight");
const targetWeightInput = document.getElementById("targetWeight");
const timelineWeeksInput = document.getElementById("timelineWeeks");
const dietTypeInput = document.getElementById("dietType");
const activityInput = document.getElementById("activity");

const result = document.getElementById("result");
const timelineSummary = document.getElementById("timelineSummary");
const dailyPlan = document.getElementById("dailyPlan");
const planMeta = document.getElementById("planMeta");
const downloadPlanBtn = document.getElementById("downloadPlanBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const proteinOut = document.getElementById("proteinOut");
const carbsOut = document.getElementById("carbsOut");
const fatsOut = document.getElementById("fatsOut");
const foodMeta = document.getElementById("foodMeta");
const foodPlan = document.getElementById("foodPlan");
const bmiWeightInput = document.getElementById("bmiWeight");
const bmiHeightInput = document.getElementById("bmiHeight");
const bmiCalcBtn = document.getElementById("bmiCalcBtn");
const bmiResult = document.getElementById("bmiResult");
const bmiHint = document.getElementById("bmiHint");

let latestPlanText = "";
let latestPlanData = null;

const workoutTemplates = {
  beginner: [
    {
      title: "Day 1: 25 min full-body strength + 15 min walk",
      example: "Example: Squats, push-ups, rows, glute bridges (3 sets each)."
    },
    {
      title: "Day 2: 35 min brisk walk + mobility",
      example: "Example: 30 min brisk walk + 5 min hip and shoulder mobility."
    },
    {
      title: "Day 3: 25 min lower-body strength + 10 min core",
      example: "Example: Lunges, RDLs, step-ups, then plank/dead-bug core circuit."
    },
    {
      title: "Day 4: 40 min light cardio (walk/cycle)",
      example: "Example: Easy cycling or treadmill incline walk at conversational pace."
    },
    {
      title: "Day 5: 25 min upper-body strength + 15 min walk",
      example: "Example: Dumbbell press, rows, shoulder press, assisted pull-downs."
    },
    {
      title: "Day 6: 45 min easy steps + stretching",
      example: "Example: 8k-10k steps total + 10 min full-body stretch."
    },
    {
      title: "Day 7: Active recovery and 8k-10k steps",
      example: "Example: Leisure walk, light yoga, and recovery focus."
    }
  ],
  moderate: [
    {
      title: "Day 1: 35 min strength (full body) + 10 min incline walk",
      example: "Example: Compound lifts (squat/hinge/push/pull) with moderate load."
    },
    {
      title: "Day 2: 30 min intervals + 10 min core",
      example: "Example: 1 min hard / 2 min easy x 10 rounds on bike or treadmill."
    },
    {
      title: "Day 3: 40 min lower-body strength + mobility",
      example: "Example: Split squats, RDLs, leg press, calf raises + mobility."
    },
    {
      title: "Day 4: 45 min zone-2 cardio",
      example: "Example: Heart rate steady enough to talk in short sentences."
    },
    {
      title: "Day 5: 40 min upper-body strength + 10 min walk",
      example: "Example: Press, row, pull-down, arm superset, then cooldown walk."
    },
    {
      title: "Day 6: 30 min conditioning circuit + stretch",
      example: "Example: 4 rounds of kettlebell swings, step-ups, battle ropes, plank."
    },
    {
      title: "Day 7: Active recovery and 10k steps",
      example: "Example: Easy walk + mobility flow and breath work."
    }
  ],
  advanced: [
    {
      title: "Day 1: 45 min strength + 15 min incline cardio",
      example: "Example: Heavy compound lifts followed by incline treadmill finisher."
    },
    {
      title: "Day 2: 35 min HIIT intervals + 15 min core",
      example: "Example: Sprint intervals (10-12 rounds) + weighted core circuit."
    },
    {
      title: "Day 3: 50 min hypertrophy lower-body",
      example: "Example: Squat variation, RDL, leg press, ham curl, calves."
    },
    {
      title: "Day 4: 50 min zone-2 cardio",
      example: "Example: Long steady-state cardio to build aerobic base."
    },
    {
      title: "Day 5: 50 min hypertrophy upper-body",
      example: "Example: Pressing, pulling, shoulder accessories, and arms."
    },
    {
      title: "Day 6: 35 min metabolic conditioning + mobility",
      example: "Example: Circuit of sled pushes, rower, carries, and mobility cooldown."
    },
    {
      title: "Day 7: Active recovery and 12k steps",
      example: "Example: Easy movement day to recover for next week."
    }
  ]
};

const foodItems = {
  veg: [
    { name: "Paneer (100g)", protein: 22, carbs: 3, fats: 20 },
    { name: "Tofu (100g)", protein: 15, carbs: 2, fats: 9 },
    { name: "Lentils/Dal (100g cooked)", protein: 9, carbs: 20, fats: 0 },
    { name: "Chickpeas (100g cooked)", protein: 12, carbs: 27, fats: 3 },
    { name: "Soybean (100g cooked)", protein: 11, carbs: 11, fats: 6 },
    { name: "Greek yogurt (100g)", protein: 10, carbs: 4, fats: 5 },
    { name: "Egg (1 whole)", protein: 6, carbs: 1, fats: 5 },
    { name: "Milk (200ml)", protein: 6, carbs: 9, fats: 3 },
    { name: "Cheese (30g)", protein: 7, carbs: 0, fats: 9 },
    { name: "Brown rice (100g cooked)", protein: 3, carbs: 23, fats: 1 },
    { name: "Oats (50g)", protein: 5, carbs: 27, fats: 3 },
    { name: "Quinoa (100g cooked)", protein: 4, carbs: 21, fats: 4 },
    { name: "Whole wheat roti (60g)", protein: 4, carbs: 30, fats: 1 },
    { name: "Sweet potato (100g)", protein: 2, carbs: 20, fats: 0 },
    { name: "Banana (medium)", protein: 1, carbs: 27, fats: 0 },
    { name: "Apple (medium)", protein: 0, carbs: 25, fats: 0 },
    { name: "Almonds (25g)", protein: 6, carbs: 6, fats: 14 },
    { name: "Peanut butter (2 tbsp)", protein: 8, carbs: 7, fats: 16 },
    { name: "Olive oil (1 tbsp)", protein: 0, carbs: 0, fats: 14 },
    { name: "Spinach (100g)", protein: 3, carbs: 4, fats: 0 }
  ],
  nonveg: [
    { name: "Chicken breast (100g)", protein: 31, carbs: 0, fats: 3 },
    { name: "Fish/Salmon (100g)", protein: 25, carbs: 0, fats: 13 },
    { name: "Eggs (1 whole)", protein: 6, carbs: 1, fats: 5 },
    { name: "Ground meat (100g)", protein: 21, carbs: 0, fats: 15 },
    { name: "Shrimp (100g)", protein: 24, carbs: 0, fats: 0 },
    { name: "Turkey (100g)", protein: 29, carbs: 0, fats: 1 },
    { name: "Lean mutton (100g)", protein: 25, carbs: 0, fats: 9 },
    { name: "Cod (100g)", protein: 18, carbs: 0, fats: 1 },
    { name: "Greek yogurt (100g)", protein: 10, carbs: 4, fats: 5 },
    { name: "Milk (200ml)", protein: 6, carbs: 9, fats: 3 },
    { name: "Cottage cheese (100g)", protein: 11, carbs: 3, fats: 4 },
    { name: "Brown rice (100g cooked)", protein: 3, carbs: 23, fats: 1 },
    { name: "Oats (50g)", protein: 5, carbs: 27, fats: 3 },
    { name: "Sweet potato (100g)", protein: 2, carbs: 20, fats: 0 },
    { name: "Whole wheat roti (60g)", protein: 4, carbs: 30, fats: 1 },
    { name: "Banana (medium)", protein: 1, carbs: 27, fats: 0 },
    { name: "Broccoli (100g)", protein: 3, carbs: 7, fats: 0 },
    { name: "Almonds (25g)", protein: 6, carbs: 6, fats: 14 },
    { name: "Olive oil (1 tbsp)", protein: 0, carbs: 0, fats: 14 },
    { name: "Whey protein (30g)", protein: 25, carbs: 1, fats: 1 }
  ]
};

const getDietLabel = (dietType) => {
  if (dietType === "veg") return "Veg";
  if (dietType === "nonveg") return "Non-Veg";
  return "Mixed (Veg + Non-Veg)";
};

const choosePlanLevel = (activity, pace) => {
  if (activity <= 1.2 || pace <= 0.4) return "beginner";
  if (activity <= 1.55 || pace <= 0.7) return "moderate";
  return "advanced";
};

const renderWorkoutPlan = (activity, pace) => {
  const level = choosePlanLevel(activity, pace);
  const workouts = workoutTemplates[level];
  const items = workouts
    .map(
      (item) =>
        `<li><strong>${item.title}</strong><span class="exercise-example">${item.example}</span></li>`
    )
    .join("");

  const minutesByLevel = {
    beginner: "~180 to 210 active minutes/week",
    moderate: "~240 to 280 active minutes/week",
    advanced: "~300 to 340 active minutes/week"
  };

  planMeta.textContent = `Workout level: ${level}. This is a DAILY plan template for one week (${minutesByLevel[level]}).`;
  dailyPlan.innerHTML = items;

  return {
    level,
    minutesText: minutesByLevel[level],
    workouts
  };
};

const buildPlanText = (planData) => {
  const {
    currentWeight,
    targetWeight,
    timelineWeeks,
    pace,
    calories,
    protein,
    carbs,
    fats,
    timelineMessage,
    dietType,
    foodSuggestions,
    workoutLevel,
    workoutMinutes,
    workouts
  } = planData;

  const date = new Date().toLocaleDateString();
  const workoutLines = workouts
    .map((w) => `- ${w.title}\n  ${w.example}`)
    .join("\n");

  return [
    "ChunChu Weight Loss Services - Personalized Plan",
    `Generated on: ${date}`,
    "",
    "Profile and Goal",
    `- Current Weight: ${currentWeight} kg`,
    `- Target Weight: ${targetWeight} kg`,
    `- Timeline: ${timelineWeeks} weeks`,
    `- Selected Pace: ${pace.toFixed(1)} kg/week`,
    "",
    "Nutrition Targets (Daily)",
    `- Calories: ${calories} kcal/day`,
    `- Protein: ${protein} g/day`,
    `- Carbs: ${carbs} g/day`,
    `- Fats: ${fats} g/day`,
    "",
    "Timeline Check",
    `- ${timelineMessage}`,
    "",
    "Food Suggestions (Daily)",
    `- Preference: ${dietType}`,
    ...foodSuggestions.map((item) => `- ${item}`),
    "",
    "Workout Plan (Daily - 7 Day Template)",
    `- Level: ${workoutLevel}`,
    `- Weekly Activity: ${workoutMinutes}`,
    workoutLines
  ].join("\n");
};

const downloadLatestPlan = () => {
  if (!latestPlanText) {
    return;
  }

  const safeDate = new Date().toISOString().slice(0, 10);
  const blob = new Blob([latestPlanText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chunchu-weight-loss-plan-${safeDate}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

downloadPlanBtn.addEventListener("click", downloadLatestPlan);

const downloadColorPdf = () => {
  if (!latestPlanData || !window.jspdf) {
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 244, 230);
  doc.rect(0, 0, w, 842, "F");
  doc.setFillColor(242, 95, 41);
  doc.rect(0, 0, w, 78, "F");
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 78, w, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ChunChu Weight Loss Services", 34, 46);
  doc.setFontSize(11);
  doc.text("Personalized Nutrition + Workout Plan", 34, 64);

  let y = 118;
  const line = 18;

  const sectionTitle = (title) => {
    doc.setTextColor(19, 33, 26);
    doc.setFillColor(255, 230, 198);
    doc.roundedRect(28, y - 14, w - 56, 24, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, 38, y + 2);
    y += 26;
  };

  const bodyLine = (text) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 60, 52);
    const wrapped = doc.splitTextToSize(text, w - 76);
    doc.text(wrapped, 38, y);
    y += wrapped.length * line;
  };

  sectionTitle("Profile and Goal");
  bodyLine(`Current Weight: ${latestPlanData.currentWeight} kg`);
  bodyLine(`Target Weight: ${latestPlanData.targetWeight} kg`);
  bodyLine(`Timeline: ${latestPlanData.timelineWeeks} weeks`);
  bodyLine(`Selected Pace: ${latestPlanData.pace.toFixed(1)} kg/week`);

  sectionTitle("Daily Nutrition Targets");
  bodyLine(`Calories: ${latestPlanData.calories} kcal/day`);
  bodyLine(`Protein: ${latestPlanData.protein} g/day`);
  bodyLine(`Carbs: ${latestPlanData.carbs} g/day`);
  bodyLine(`Fats: ${latestPlanData.fats} g/day`);

  sectionTitle("Food Suggestions (Daily)");
  bodyLine(`Preference: ${latestPlanData.dietType}`);
  latestPlanData.foodSuggestions.forEach((item) => bodyLine(item));

  sectionTitle("Timeline and Projection");
  bodyLine(latestPlanData.timelineMessage);
  bodyLine(`90-day projected fat loss at selected pace: ${latestPlanData.projected90} kg`);

  sectionTitle("Workout Plan (7-Day Template)");
  bodyLine(`Level: ${latestPlanData.workoutLevel} | Weekly volume: ${latestPlanData.workoutMinutes}`);
  latestPlanData.workouts.forEach((wItem) => {
    bodyLine(`${wItem.title}`);
    bodyLine(`Example: ${wItem.example.replace(/^Example:\s*/i, "")}`);
  });

  const safeDate = new Date().toISOString().slice(0, 10);
  doc.save(`chunchu-weight-loss-plan-${safeDate}.pdf`);
};

downloadPdfBtn.addEventListener("click", downloadColorPdf);

const renderFoodSuggestions = (dietType, protein, carbs, fats, calories) => {
  const items =
    dietType === "mixed"
      ? [...foodItems.veg, ...foodItems.nonveg].filter(
          (item, index, arr) => index === arr.findIndex((candidate) => candidate.name === item.name)
        )
      : foodItems[dietType];
  
  // Sort items by protein content (descending) to emphasize protein sources
  const sorted = [...items].sort((a, b) => b.protein - a.protein);
  
  const suggestions = sorted.map(
    (item) => `${item.name} - ${item.protein}g protein, ${item.carbs}g carbs, ${item.fats}g fats`
  );

  foodMeta.textContent = `Pick from these ${getDietLabel(dietType)} items to build your daily ${calories} kcal target with ${protein}g protein, ${carbs}g carbs, ${fats}g fats.`;
  foodPlan.innerHTML = suggestions.map((item) => `<li>${item}</li>`).join("");

  return suggestions;
};



const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", advice: "Focus on strength training and nutrition quality." };
  if (bmi < 25) return { label: "Normal", advice: "Great range. Keep building fitness and consistency." };
  if (bmi < 30) return { label: "Overweight", advice: "A steady calorie deficit and training plan can help." };
  return { label: "Obesity", advice: "Use a gradual plan and consult a healthcare professional if needed." };
};

const calculateBmi = () => {
  const weight = Number(bmiWeightInput.value);
  const heightCm = Number(bmiHeightInput.value);

  if (!weight || !heightCm || weight < 30 || weight > 250 || heightCm < 120 || heightCm > 230) {
    bmiResult.textContent = "Enter valid weight (30-250 kg) and height (120-230 cm).";
    bmiHint.textContent = "BMI is a screening metric, not a diagnosis.";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = bmi.toFixed(1);
  const category = getBmiCategory(bmi);

  bmiResult.textContent = `BMI: ${rounded} (${category.label})`;
  bmiHint.textContent = `${category.advice} Healthy BMI range is approximately 18.5 to 24.9.`;
};

bmiCalcBtn.addEventListener("click", calculateBmi);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const weight = Number(weightInput.value);
  const targetWeight = Number(targetWeightInput.value);
  const timelineWeeks = Number(timelineWeeksInput.value);
  const dietType = dietTypeInput.value;
  const activity = Number(activityInput.value);

  if (!weight || weight < 30 || weight > 250) {
    result.textContent = "Enter a valid weight between 30 and 250 kg.";
    timelineSummary.textContent = "";
    downloadPlanBtn.disabled = true;
    downloadPdfBtn.disabled = true;
    return;
  }

  if (!targetWeight || targetWeight < 30 || targetWeight > 250 || targetWeight >= weight) {
    result.textContent = "Target weight must be lower than current weight and between 30 and 250 kg.";
    timelineSummary.textContent = "";
    downloadPlanBtn.disabled = true;
    downloadPdfBtn.disabled = true;
    return;
  }

  if (!timelineWeeks || timelineWeeks < 4 || timelineWeeks > 52) {
    result.textContent = "Timeline must be between 4 and 52 weeks.";
    timelineSummary.textContent = "";
    downloadPlanBtn.disabled = true;
    downloadPdfBtn.disabled = true;
    return;
  }

  const kilosToLose = Number((weight - targetWeight).toFixed(1));
  const pace = Math.max(Number((kilosToLose / timelineWeeks).toFixed(2)), 0.2);

  // Rough estimate: BMR derived from body weight.
  const estimatedBmr = 22 * weight;
  const maintenance = estimatedBmr * activity;
  const dailyDeficit = Math.round((pace * 7700) / 7);
  const fatLossTarget = Math.max(Math.round(maintenance - dailyDeficit), 1200);

  const protein = Math.round(weight * 1.8);
  const fatKcal = fatLossTarget * 0.27;
  const fat = Math.round(fatKcal / 9);
  const proteinKcal = protein * 4;
  const carbs = Math.max(Math.round((fatLossTarget - proteinKcal - fat * 9) / 4), 50);

  proteinOut.textContent = `${protein} g`;
  carbsOut.textContent = `${carbs} g`;
  fatsOut.textContent = `${fat} g`;
  result.textContent = `Estimated target: ${fatLossTarget} kcal/day for ${pace.toFixed(1)} kg/week fat loss. Macros shown are daily grams.`;

  let timelineMessage = "";
  if (pace > 0.9) {
    timelineMessage = `To lose ${kilosToLose} kg in ${timelineWeeks} weeks requires ${pace.toFixed(2)} kg/week, which is aggressive. Consider a longer timeline for sustainability.`;
  } else {
    timelineMessage = `Goal: Lose ${kilosToLose} kg in ${timelineWeeks} weeks at approximately ${pace.toFixed(2)} kg/week.`;
  }
  timelineSummary.textContent = timelineMessage;

  const workoutInfo = renderWorkoutPlan(activity, pace);
  const foodSuggestions = renderFoodSuggestions(dietType, protein, carbs, fat, fatLossTarget);
  const projected90 = Number(Math.min(kilosToLose, pace * (90 / 7)).toFixed(1));

  if (!bmiWeightInput.value) {
    bmiWeightInput.value = String(weight);
  }

  latestPlanText = buildPlanText({
    currentWeight: weight,
    targetWeight,
    timelineWeeks,
    pace,
    calories: fatLossTarget,
    protein,
    carbs,
    fats: fat,
    timelineMessage,
    dietType: getDietLabel(dietType),
    foodSuggestions,
    workoutLevel: workoutInfo.level,
    workoutMinutes: workoutInfo.minutesText,
    workouts: workoutInfo.workouts
  });

  latestPlanData = {
    currentWeight: weight,
    targetWeight,
    timelineWeeks,
    pace,
    calories: fatLossTarget,
    protein,
    carbs,
    fats: fat,
    timelineMessage,
    projected90,
    dietType: getDietLabel(dietType),
    foodSuggestions,
    workoutLevel: workoutInfo.level,
    workoutMinutes: workoutInfo.minutesText,
    workouts: workoutInfo.workouts
  };

  downloadPlanBtn.disabled = false;
  downloadPdfBtn.disabled = false;
});
