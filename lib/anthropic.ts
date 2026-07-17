import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-4-8";

/** Returns an Anthropic client, or null when no API key is configured (demo mode). */
export function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// ---------- Types ----------
export type Severity = "low" | "moderate" | "high";

export type Concern = {
  name: string;
  severity: Severity;
  note: string;
};

export type RoutineStep = {
  step: string;
  product: string;
  why: string;
};

export type Ingredient = {
  name: string;
  benefit: string;
};

export type Analysis = {
  skinType: string;
  summary: string;
  concerns: Concern[];
  routine: { am: RoutineStep[]; pm: RoutineStep[] };
  ingredients: Ingredient[];
  disclaimer: string;
};

// ---------- Structured-output JSON schema (for output_config.format) ----------
const routineStepSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    step: { type: "string" },
    product: { type: "string" },
    why: { type: "string" },
  },
  required: ["step", "product", "why"],
} as const;

export const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    skinType: { type: "string" },
    summary: { type: "string" },
    concerns: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          severity: { type: "string", enum: ["low", "moderate", "high"] },
          note: { type: "string" },
        },
        required: ["name", "severity", "note"],
      },
    },
    routine: {
      type: "object",
      additionalProperties: false,
      properties: {
        am: { type: "array", items: routineStepSchema },
        pm: { type: "array", items: routineStepSchema },
      },
      required: ["am", "pm"],
    },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          benefit: { type: "string" },
        },
        required: ["name", "benefit"],
      },
    },
    disclaimer: { type: "string" },
  },
  required: ["skinType", "summary", "concerns", "routine", "ingredients", "disclaimer"],
} as const;

// ---------- Prompts ----------
export const ANALYSIS_SYSTEM = `You are Lumi, a friendly and knowledgeable AI skincare specialist.
You give general, cosmetic skincare guidance based on a photo the user shares of their skin.

Rules:
- You are NOT a doctor and you do NOT diagnose medical conditions. Give cosmetic, over-the-counter
  guidance only (skin type, common concerns like dryness/oiliness/texture/dullness/visible pores,
  general routines, and ingredient suggestions).
- If you notice anything that could be a medical issue (a suspicious mole, a possible infection,
  severe or painful conditions), do NOT diagnose — gently recommend seeing a board-certified
  dermatologist, and reflect that in the relevant concern's note and in the disclaimer.
- Be warm, encouraging, and specific. Avoid absolute claims and fear-mongering.
- Base observations only on what is reasonably visible. If the photo is unclear, say so in the
  summary and keep concerns conservative.
- Recommend ingredient/product TYPES (e.g. "a gentle gel cleanser", "niacinamide serum"), not
  specific brands.
- Always fill every field. Provide 2-4 concerns, 3-5 AM steps, 3-5 PM steps, and 4-6 key ingredients.
- The disclaimer must state this is general cosmetic guidance, not medical advice, and suggest
  patch-testing new products and consulting a dermatologist for persistent concerns.`;

export function analysisUserText(notes?: string) {
  const base =
    "Analyze the skin in this photo and return a structured skincare assessment. Focus on what is visible.";
  return notes && notes.trim()
    ? `${base}\n\nThe person also shared these notes/goals — take them into account:\n"${notes.trim()}"`
    : base;
}

export function chatSystem(analysis: Analysis | null) {
  const context = analysis
    ? `\n\nHere is the skin analysis you produced for this user (use it as context, refer to it naturally):\n${JSON.stringify(
        analysis,
      )}`
    : "";
  return `You are Lumi, a warm, concise AI skincare specialist chatting with a user about their skincare.
Give general cosmetic guidance only — you are not a doctor and never diagnose. For anything that
sounds medical, severe, or persistent, gently suggest seeing a board-certified dermatologist.
Recommend ingredient/product TYPES, not brands. Keep replies short (2-5 sentences), friendly, and
practical. Respond with the final answer only — no meta-commentary about your reasoning.${context}`;
}

// ---------- Demo fallback (used when ANTHROPIC_API_KEY is not set) ----------
export const DEMO_ANALYSIS: Analysis = {
  skinType: "Combination",
  summary:
    "This is sample data shown because no AI key is configured. Your T-zone looks a little shiny while the cheeks read slightly dry — a classic combination pattern. Overall the skin looks healthy; the main opportunities are balancing hydration and smoothing texture.",
  concerns: [
    { name: "T-zone oiliness", severity: "moderate", note: "Visible shine across the forehead and nose suggests active oil in the T-zone." },
    { name: "Mild dryness on cheeks", severity: "low", note: "The cheeks look a touch dry and could use more consistent hydration." },
    { name: "Uneven texture", severity: "low", note: "Some surface unevenness that gentle exfoliation can help refine over time." },
  ],
  routine: {
    am: [
      { step: "Cleanse", product: "Gentle gel or foaming cleanser", why: "Removes overnight oil without stripping the drier areas." },
      { step: "Treat", product: "Niacinamide serum", why: "Helps balance oil and refine the look of pores." },
      { step: "Moisturize", product: "Lightweight gel-cream", why: "Hydrates the cheeks without overloading the T-zone." },
      { step: "Protect", product: "Broad-spectrum SPF 30+", why: "Daily sunscreen is the single most impactful anti-aging step." },
    ],
    pm: [
      { step: "Cleanse", product: "Same gentle cleanser", why: "Clears the day's oil, sunscreen, and buildup." },
      { step: "Exfoliate (2-3×/week)", product: "Low-strength BHA", why: "Keeps pores clear and smooths texture gradually." },
      { step: "Hydrate", product: "Hyaluronic acid serum", why: "Draws moisture into the drier cheek areas." },
      { step: "Moisturize", product: "Nourishing night cream", why: "Supports the skin barrier overnight." },
    ],
  },
  ingredients: [
    { name: "Niacinamide", benefit: "Balances oil and evens tone." },
    { name: "Hyaluronic acid", benefit: "Lightweight, layered hydration." },
    { name: "Salicylic acid (BHA)", benefit: "Clears pores and smooths texture." },
    { name: "Ceramides", benefit: "Reinforce the skin barrier." },
    { name: "SPF (zinc/mineral or modern chemical)", benefit: "Daily UV protection." },
  ],
  disclaimer:
    "Lumi provides general cosmetic guidance, not medical advice. Patch-test new products, introduce actives one at a time, and consult a board-certified dermatologist for persistent, painful, or changing skin concerns.",
};

export const DEMO_CHAT_REPLY =
  "This is a sample reply — no AI key is configured yet, so I can't chat live. Once an ANTHROPIC_API_KEY is added, I'll answer your skincare questions using your analysis as context. In the meantime: introduce new actives one at a time, always patch-test, and wear SPF every morning.";
