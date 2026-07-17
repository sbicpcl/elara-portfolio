export type ArtKind = "blobs" | "chart" | "circles" | "cards" | "grid" | "waves";

export type Project = {
  slug: string;
  title: string;
  year: string;
  discipline: "Mobile" | "Web App" | "Design System" | "Branding";
  tags: string[];
  gradient: [string, string];
  art: ArtKind;
  /** Optional real image in /public/projects (e.g. "/projects/nimbus.jpg"). Falls back to generated art. */
  image?: string;
  imageAlt?: string;
  summary: string;
  role: string;
  timeline: string;
  client: string;
  overview: string;
  challenge: string;
  approach: { title: string; body: string }[];
  outcomes: { num: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "nimbus-banking",
    title: "Nimbus Banking",
    year: "2026",
    discipline: "Mobile",
    tags: ["Fintech", "iOS"],
    gradient: ["#f0562b", "#7c1f10"],
    art: "blobs",
    summary:
      "A challenger banking app that turns anxious money moments into calm, confident ones.",
    role: "Lead Product Designer",
    timeline: "6 months · 2025–26",
    client: "Nimbus Financial",
    overview:
      "Nimbus wanted to launch a mobile-first bank for people who feel overwhelmed by their finances. The goal was an app that reduces anxiety rather than adding to it — clear balances, gentle nudges, and zero jargon.",
    challenge:
      "Early testing showed users abandoned onboarding at the identity-verification step and rarely returned to budgeting tools. Trust and clarity were the two things everything hinged on.",
    approach: [
      { title: "Reframed onboarding", body: "Broke a 9-step flow into a paced, reassuring sequence with progress that always felt within reach." },
      { title: "A calmer visual language", body: "Warm neutrals, soft depth, and generous spacing replaced dense dashboards with a single focal number per screen." },
      { title: "Predictive nudges", body: "Designed a nudge system that surfaces one helpful insight a day instead of a firehose of notifications." },
    ],
    outcomes: [
      { num: "+38%", label: "Onboarding completion" },
      { num: "4.9★", label: "App Store rating" },
      { num: "2.1×", label: "Weekly active use" },
    ],
  },
  {
    slug: "pulse-dashboard",
    title: "Pulse Dashboard",
    year: "2025",
    discipline: "Web App",
    tags: ["SaaS", "Analytics"],
    gradient: ["#8b7dff", "#221566"],
    art: "chart",
    summary:
      "A real-time analytics workspace that makes complex data feel legible at a glance.",
    role: "Product & Interaction Designer",
    timeline: "4 months · 2025",
    client: "Pulse Analytics",
    overview:
      "Pulse's power users loved the data but drowned in it. We redesigned the workspace around scannable summaries first, deep detail second — so decisions happen faster.",
    challenge:
      "The existing dashboard exposed every metric equally, so nothing stood out. Teams spent more time hunting than deciding.",
    approach: [
      { title: "Summary-first layout", body: "Introduced a state-aware hero row that surfaces what changed before the raw tables." },
      { title: "Encoded state in form", body: "Severity stripes, trend pills, and emphasized endpoints let users read status without reading numbers." },
      { title: "Composable widgets", body: "Built a flexible grid so teams could shape their own view without designer intervention." },
    ],
    outcomes: [
      { num: "−45%", label: "Time to insight" },
      { num: "+27%", label: "Feature adoption" },
      { num: "92", label: "System usability score" },
    ],
  },
  {
    slug: "verdant-care",
    title: "Verdant Care",
    year: "2025",
    discipline: "Web App",
    tags: ["Health", "Web"],
    gradient: ["#4bd6a0", "#0c5c42"],
    art: "circles",
    summary:
      "A telehealth platform designed around trust, accessibility, and unhurried care.",
    role: "Lead UX Designer",
    timeline: "5 months · 2024–25",
    client: "Verdant Health",
    overview:
      "Verdant connects patients with clinicians for ongoing care. We designed an experience that feels human and accessible to everyone — including people with low vision and low digital confidence.",
    challenge:
      "Healthcare interfaces are often clinical and cold. We needed warmth without sacrificing WCAG AA accessibility or clinical clarity.",
    approach: [
      { title: "Accessibility-first", body: "Designed to AA contrast, full keyboard paths, and screen-reader flows from the very first wireframe." },
      { title: "Conversational intake", body: "Replaced long forms with a paced, plain-language intake that adapts to answers." },
      { title: "Continuity of care", body: "A timeline that keeps every visit, note, and prescription in one calm, chronological place." },
    ],
    outcomes: [
      { num: "AA", label: "WCAG conformance" },
      { num: "+52%", label: "Appointment completion" },
      { num: "−31%", label: "Support tickets" },
    ],
  },
  {
    slug: "atlas-market",
    title: "Atlas Market",
    year: "2024",
    discipline: "Branding",
    tags: ["E-commerce", "Brand"],
    gradient: ["#ffb03c", "#7c4310"],
    art: "cards",
    summary:
      "A brand and storefront for a curated marketplace of independent makers.",
    role: "Brand & Product Designer",
    timeline: "3 months · 2024",
    client: "Atlas Market",
    overview:
      "Atlas champions small independent makers. We built a brand identity and storefront that puts craft front and centre and helps shoppers discover things they'll keep for years.",
    challenge:
      "The marketplace felt generic and the makers' stories were buried beneath a standard grid of products.",
    approach: [
      { title: "Editorial identity", body: "A warm, print-inspired system with a distinctive serif voice that lets each maker feel authored." },
      { title: "Story-led discovery", body: "Designed a browse experience that leads with makers and narratives, not just SKUs." },
      { title: "Considered checkout", body: "A frictionless, reassuring checkout that keeps craft visible right up to purchase." },
    ],
    outcomes: [
      { num: "+64%", label: "Add-to-cart rate" },
      { num: "+2.4×", label: "Time on site" },
      { num: "18", label: "Makers onboarded" },
    ],
  },
  {
    slug: "orbit-design-system",
    title: "Orbit",
    year: "2025",
    discipline: "Design System",
    tags: ["Systems", "Tokens"],
    gradient: ["#f0562b", "#8b7dff"],
    art: "grid",
    summary:
      "A token-driven design system that kept six product teams moving as one.",
    role: "Design Systems Lead",
    timeline: "Ongoing · 2024–26",
    client: "Orbit Software",
    overview:
      "As Orbit scaled to six product teams, their UI drifted apart. We built a single token-driven system — themeable, accessible, and documented — that teams actually want to use.",
    challenge:
      "Six teams, three codebases, and no shared language for colour, spacing, or components. Every screen looked slightly different.",
    approach: [
      { title: "Semantic tokens", body: "Defined a layered token model so light, dark, and brand themes derive from one source of truth." },
      { title: "Living documentation", body: "Paired each component with usage guidance, do/don't examples, and accessibility notes." },
      { title: "Adoption as design", body: "Treated rollout as a product — migration guides, office hours, and contribution paths." },
    ],
    outcomes: [
      { num: "6", label: "Teams aligned" },
      { num: "−58%", label: "UI inconsistencies" },
      { num: "120+", label: "Documented components" },
    ],
  },
  {
    slug: "field-and-form",
    title: "Field & Form",
    year: "2024",
    discipline: "Branding",
    tags: ["Editorial", "Identity"],
    gradient: ["#4bd6a0", "#8b7dff"],
    art: "waves",
    summary:
      "A digital-first identity for an independent design journal.",
    role: "Art Director & Designer",
    timeline: "2 months · 2024",
    client: "Field & Form",
    overview:
      "Field & Form is an independent journal about the craft of design. We created a flexible, expressive identity and reading experience built for long-form focus.",
    challenge:
      "Long-form reading online is often a chore. The brand needed personality and the reader needed calm — at the same time.",
    approach: [
      { title: "A voice in type", body: "Paired a characterful serif with a quiet grotesk to give every article an authored feel." },
      { title: "Reading-first layout", body: "Optimised measure, rhythm, and pacing so essays are a pleasure to read end to end." },
      { title: "Flexible covers", body: "A generative cover system gives each issue its own identity within one family." },
    ],
    outcomes: [
      { num: "+3.1×", label: "Read-through rate" },
      { num: "12k", label: "Subscribers in 6 mo" },
      { num: "FWA", label: "Site of the Day" },
    ],
  },
];

export const disciplines = [
  "All",
  "Mobile",
  "Web App",
  "Design System",
  "Branding",
] as const;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
