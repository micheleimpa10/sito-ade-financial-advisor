/**
 * Centralised product catalogue.
 * Prices are in the smallest currency unit (CHF cents).
 * Download paths point to webdev storage.
 *
 * LAUNCH PRICING: After 10-20 sales, raise to regular prices and show launch price as strikethrough.
 * License key products: budget-manager-personal, budget-manager-family, single-bundle, family-bundle
 */
export interface Product {
  key: string;
  amount: number; // CHF cents (launch price)
  regularAmount?: number; // CHF cents (regular price, for display only)
  currency: string;
  name: string;
  shortName: string;
  description: string;
  features: string[];
  badge?: string;
  /** Whether this product requires a license key (BudgetManager + bundles) */
  requiresLicenseKey: boolean;
  /** License key tier: "personal" | "family" | null */
  licenseKeyTier?: "personal" | "family" | null;
  /** Relative path to the downloadable ZIP served from storage */
  downloadPath: string;
  /** Cover image path for the shop card */
  coverImage?: string;
  /** Category for grouping in the shop */
  category: "guide" | "agenda" | "budget" | "bundle";
}

export const PRODUCTS: Record<string, Product> = {
  // ─── 1. Moving to Switzerland Guide ─────────────────────────────────────────
  "moving-guide": {
    key: "moving-guide",
    amount: 990, // CHF 9.90 (launch)
    regularAmount: 1490, // CHF 14.90 (regular)
    currency: "chf",
    name: "Moving to Switzerland 2026 — The Complete Professional Relocation Guide",
    shortName: "Moving to Switzerland 2026",
    description:
      "Everything you need to move to Switzerland in 2026 — in one professional guide. 31 pages written by a financial advisor based in Switzerland. All 2026 data verified from official sources. No fluff, just what actually matters when you relocate.",
    features: [
      "Residence permits (L, B, C, G) + 2026 non-EU quotas",
      "Finding & renting an apartment — real 2026 prices by city",
      "Swiss tax system — tax at source vs. normal taxation",
      "Banking & mandatory health insurance",
      "3-pillar retirement system explained simply",
      "City profiles: Zurich, Geneva, Bern, Lausanne, Basel",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/01_Moving_to_Switzerland_bc6ea1e4.zip",
    coverImage: "/manus-storage/cover_01_Moving_to_Switzerland_0e4a6a19.png",
    category: "guide",
  },

  // ─── 2. Financial Agenda — Couples ──────────────────────────────────────────
  "financial-agenda-couples": {
    key: "financial-agenda-couples",
    amount: 1790, // CHF 17.90 (launch)
    regularAmount: 2290, // CHF 22.90 (regular)
    currency: "chf",
    name: "Your Financial Agenda 2026 — Couples Edition | Interactive Budget Planner",
    shortName: "Financial Agenda — Couples",
    description:
      "The ultimate interactive financial planner for couples living together. 365 daily pages with schedule, priorities, and spending tracker — all in your browser. No app to install, no account needed.",
    features: [
      "Customizable partner names & flexible expense split (50/50, 60/40, custom)",
      "Separate personal expenses per partner + 'Who paid?' tracking",
      "Combined savings dashboard + monthly budget with auto-calculating totals",
      "Swiss tax deadlines and Pillar 3a reminders",
      "No Spending Day tracker, wishlist & travel budget planner",
      "Works offline, installs as app on phone. Buy once, use forever.",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/02_Financial_Agenda_Couples_2b1157ed.zip",
    coverImage: "/manus-storage/cover_02_Financial_Agenda_Couples_ee1c3b93.png",
    category: "agenda",
  },

  // ─── 3. Financial Agenda — Single ───────────────────────────────────────────
  "financial-agenda-single": {
    key: "financial-agenda-single",
    amount: 1290, // CHF 12.90 (launch)
    regularAmount: 1690, // CHF 16.90 (regular)
    currency: "chf",
    name: "Your Financial Agenda 2026 — Single Edition | Interactive Budget Planner",
    shortName: "Financial Agenda — Single",
    description:
      "Your personal financial planner for 2026 — interactive, beautiful, and private. 365 daily pages with schedule, priorities, and spending tracker. Opens in your browser like an app.",
    features: [
      "365 daily planning pages + monthly budget with auto-calculating totals",
      "Savings goals and progress tracking",
      "Swiss tax deadlines and Pillar 3a reminders",
      "No Spending Day tracker, wishlist & travel budget planner",
      "Black Friday survival guide & Christmas gift planner",
      "No subscription. No cloud. 100% private.",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/03_Financial_Agenda_Single_52388b82.zip",
    coverImage: "/manus-storage/cover_03_Financial_Agenda_Single_01df94da.png",
    category: "agenda",
  },

  // ─── 4. BudgetManager Pro — Personal ────────────────────────────────────────
  "budget-manager-personal": {
    key: "budget-manager-personal",
    amount: 2490, // CHF 24.90 (launch)
    regularAmount: 2990, // CHF 29.90 (regular)
    currency: "chf",
    name: "BudgetManager Pro — Smart Budget Planner for Switzerland (Personal)",
    shortName: "BudgetManager Pro — Personal",
    description:
      "The only budget planner built for Swiss life. Track expenses, compare with Swiss averages, plan across months. One-time purchase — not a subscription. Other budgeting apps charge you every single month. This is yours forever.",
    features: [
      "Pre-built categories: Krankenkasse, Pillar 3a, GA Travelcard, taxes",
      "All 26 cantons with local benchmarks",
      "Compare spending against Swiss national averages",
      "Interactive charts (pie, bar, trend, radar) + PDF/CSV export",
      "Dark mode · 5 languages: EN, IT, FR, DE, ES",
      "License key included. No subscription. No cloud. 100% private.",
    ],
    badge: "BEST SELLER",
    requiresLicenseKey: true,
    licenseKeyTier: "personal",
    downloadPath: "/manus-storage/04_BudgetManager_Personal_93051c50.zip",
    coverImage: "/manus-storage/cover_04_BudgetManager_Personal_4b269c0e.png",
    category: "budget",
  },

  // ─── 5. BudgetManager Pro — Family ──────────────────────────────────────────
  "budget-manager-family": {
    key: "budget-manager-family",
    amount: 3490, // CHF 34.90 (launch)
    regularAmount: 3990, // CHF 39.90 (regular)
    currency: "chf",
    name: "BudgetManager Pro — Family & Couple Budget Planner for Switzerland",
    shortName: "BudgetManager Pro — Family",
    description:
      "Budget planning for Swiss families, couples, and shared households. Everything in Personal edition + powerful family features. One-time purchase, yours forever — no monthly fees.",
    features: [
      "Up to 4 family member profiles + combined household dashboard",
      "Per-person AND shared expense tracking",
      "Smart split calculator (equal or proportional to income)",
      "Childcare & school expense categories (Kita, school fees)",
      "Household comparison vs. Swiss family averages",
      "License key included. All 26 cantons, PDF/CSV export, dark mode.",
    ],
    requiresLicenseKey: true,
    licenseKeyTier: "family",
    downloadPath: "/manus-storage/05_BudgetManager_Family_9d8db1bc.zip",
    coverImage: "/manus-storage/cover_05_BudgetManager_Family_6468fbcc.png",
    category: "budget",
  },

  // ─── 6. Single Money Bundle ──────────────────────────────────────────────────
  "single-bundle": {
    key: "single-bundle",
    amount: 2990, // CHF 29.90 (launch, value CHF 37.80 → ~21% saving)
    regularAmount: 3780, // CHF 37.80 (individual value)
    currency: "chf",
    name: "Single Money Bundle 2026 — Financial Agenda + BudgetManager Pro (Switzerland)",
    shortName: "Single Money Bundle",
    description:
      "Plan and track your money in Switzerland — the complete toolkit for one. Save ~21%. Financial Agenda 2026 Single Edition + BudgetManager Pro Personal. Everything runs offline in your browser.",
    features: [
      "Financial Agenda 2026 — Single Edition (interactive 365-day planner)",
      "BudgetManager Pro — Personal (the budget app built for Swiss life)",
      "Plan every day, then track every franc against Swiss benchmarks",
      "Krankenkasse, Pillar 3a, all 26 cantons",
      "No subscription. No cloud. 100% private.",
      "BudgetManager license key included with purchase.",
    ],
    badge: "BUNDLE — SAVE 21%",
    requiresLicenseKey: true,
    licenseKeyTier: "personal",
    downloadPath: "/manus-storage/06_Single_Bundle_47a2cadd.zip",
    coverImage: "/manus-storage/cover_06_Single_Bundle_e23539c8.png",
    category: "bundle",
  },

  // ─── 7. Family Money Bundle ──────────────────────────────────────────────────
  "family-bundle": {
    key: "family-bundle",
    amount: 3990, // CHF 39.90 (launch, value CHF 52.80 → ~24% saving)
    regularAmount: 5280, // CHF 52.80 (individual value)
    currency: "chf",
    name: "Family Money Bundle 2026 — Financial Agenda Couples + BudgetManager Family (Switzerland)",
    shortName: "Family Money Bundle",
    description:
      "Run your household finances in Switzerland — the complete toolkit for two or more. Save ~24%. Financial Agenda 2026 Couples Edition + BudgetManager Pro Family. Everything runs offline in your browser.",
    features: [
      "Financial Agenda 2026 — Couples Edition (interactive 365-day planner for two)",
      "BudgetManager Pro — Family (up to 4 profiles, household dashboard)",
      "Run your household finances day by day against Swiss family benchmarks",
      "Krankenkasse, Pillar 3a, all 26 cantons, Kita categories",
      "No subscription. No cloud. 100% private.",
      "BudgetManager license key included with purchase.",
    ],
    badge: "BUNDLE — SAVE 24%",
    requiresLicenseKey: true,
    licenseKeyTier: "family",
    downloadPath: "/manus-storage/07_Family_Bundle_bf86d0cc.zip",
    coverImage: "/manus-storage/cover_07_Family_Bundle_d1432fd4.png",
    category: "bundle",
  },

  // ─── Premium Financial Plan (service — invoice only, NOT sold via Stripe) ────
  // CTA on the website sends users to WhatsApp / booking form. No Stripe checkout.
  "premium-plan": {
    key: "premium-plan",
    amount: 29500, // CHF 295.00
    currency: "chf",
    name: "Premium Financial Plan",
    shortName: "Premium Financial Plan",
    description:
      "Tailored financial plan based on your personal situation — insurance optimisation, pension planning (1st, 2nd & 3rd pillars), investment strategy & tax efficiency.",
    features: [
      "Tailored financial plan based on your personal situation",
      "Insurance optimisation with personalised options",
      "Pension planning (1st, 2nd and 3rd pillars)",
      "Investment strategy & tax efficiency",
      "Physical binder and app to keep everything under control",
    ],
    requiresLicenseKey: false,
    downloadPath: "",
    category: "guide",
  },
};

export function getProduct(key: string): Product | undefined {
  return PRODUCTS[key];
}
