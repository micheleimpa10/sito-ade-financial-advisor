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
      "Moving to Switzerland without the right information costs you thousands — in wrong insurance, missed tax deadlines, and avoidable permit mistakes. This 31-page guide, written by a Swiss-based financial advisor, gives you every number, rule, and deadline you actually need for 2026. No fluff. No outdated content. Just the facts that save you money and stress from day one.",
    features: [
      "Residence permits (L, B, C, G) explained — including 2026 non-EU quotas",
      "Apartment hunting: real 2026 rental prices by city, what landlords expect, red flags",
      "Swiss tax system demystified — tax at source vs. ordinary taxation, who pays what",
      "Banking setup + mandatory health insurance: cheapest legal options by canton",
      "3-pillar pension system explained in plain language — what you must do in year one",
      "City profiles: Zurich, Geneva, Bern, Lausanne, Basel — costs, lifestyle, commute",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/01_Moving_to_Switzerland_a9ec67d4.zip",
    coverImage: "/manus-storage/cover_01_moving_guide_a405895d.png",
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
      "Money is the #1 source of conflict in relationships — usually because there is no shared system. This interactive planner gives you and your partner one place to track every franc, split expenses fairly, and build savings together. It runs entirely in your browser, installs as an app on your phone, and requires no subscription, no account, and no cloud. Buy once, use for the entire year.",
    features: [
      "Customisable partner names + flexible split: 50/50, 60/40, or fully custom percentages",
      "Separate personal expense tracking per partner + 'Who paid?' log to settle debts",
      "Combined savings dashboard with shared goals and monthly budget auto-totals",
      "Swiss tax deadlines and Pillar 3a contribution reminders built in",
      "No Spending Day challenge, travel budget planner, and Christmas gift tracker",
      "100% offline, installs as an app on any phone. No subscription. Yours forever.",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/02_Financial_Agenda_Couples_a51e7a1d.zip",
    coverImage: "/manus-storage/cover_02_agenda_couples_2b96edd1.png",
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
      "Most people in Switzerland have no idea where their money actually goes each month. This interactive planner fixes that. 365 daily pages, a monthly budget with auto-calculating totals, and savings goal tracking — all running privately in your browser with no account, no subscription, and no data leaving your device. One purchase covers the entire year.",
    features: [
      "365 daily planning pages with schedule, priorities, and daily spending log",
      "Monthly budget overview with auto-calculating totals and category breakdown",
      "Savings goals tracker with visual progress bars",
      "Swiss tax deadlines and Pillar 3a contribution reminders built in",
      "No Spending Day challenge, wishlist, travel budget, and Christmas gift planner",
      "100% private — no cloud, no account, no subscription. Yours forever.",
    ],
    requiresLicenseKey: false,
    downloadPath: "/manus-storage/03_Financial_Agenda_Single_e39b6d60.zip",
    coverImage: "/manus-storage/cover_03_agenda_single_5f95d98d.png",
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
      "Generic budgeting apps were not built for Switzerland. They do not know what Krankenkasse is, they have no Pillar 3a category, and they cannot tell you whether your rent is high for Zurich or normal for Basel. BudgetManager Pro was. Track every franc, see exactly how your spending compares to Swiss national averages by canton, and export a clean PDF for your tax advisor — all without paying a monthly fee. Ever.",
    features: [
      "Pre-built Swiss categories: Krankenkasse, Pillar 3a, GA Travelcard, cantonal taxes",
      "All 26 cantons with local cost-of-living benchmarks — know if you are overspending",
      "Compare your spending against Swiss national averages by category",
      "Interactive charts (pie, bar, trend, radar) + PDF/CSV export for your tax advisor",
      "Dark mode · 5 languages: English, Italian, French, German, Spanish",
      "License key included. One-time purchase. No subscription. No cloud. 100% private.",
    ],
    badge: "BEST SELLER",
    requiresLicenseKey: true,
    licenseKeyTier: "personal",
    downloadPath: "/manus-storage/04_BudgetManager_Personal_d54d5d0e.zip",
    coverImage: "/manus-storage/cover_04_budget_personal_d21e2676.png",
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
      "Running a household in Switzerland is expensive — and without a shared system, it is nearly impossible to know where the money goes or who owes what. BudgetManager Pro Family gives every member their own profile, tracks shared and personal expenses separately, and shows you exactly how your household compares to Swiss family averages by canton. One purchase, no monthly fees, no data in the cloud.",
    features: [
      "Up to 4 family member profiles with individual dashboards + combined household view",
      "Per-person AND shared expense tracking — always know who paid what",
      "Smart split calculator: equal or proportional to each member's income",
      "Childcare and school expense categories: Kita fees, school supplies, activities",
      "Household spending vs. Swiss family averages by canton — see where you stand",
      "License key included. All 26 cantons, PDF/CSV export, dark mode. No subscription.",
    ],
    requiresLicenseKey: true,
    licenseKeyTier: "family",
    downloadPath: "/manus-storage/05_BudgetManager_Family_96909c61.zip",
    coverImage: "/manus-storage/cover_05_budget_family_b9cb2af0.png",
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
      "The complete financial toolkit for one person living in Switzerland. Plan your days and goals with the Financial Agenda, then track every franc against Swiss benchmarks with BudgetManager Pro. Bought separately these cost CHF 37.80 — together you pay CHF 29.90. Both run offline in your browser, require no subscription, and are yours forever. One purchase, full control.",
    features: [
      "Financial Agenda 2026 — Single Edition: 365 daily pages, monthly budget, savings goals",
      "BudgetManager Pro — Personal: the budget app built specifically for Swiss life",
      "Plan every day with the Agenda, then track every franc with BudgetManager",
      "Krankenkasse, Pillar 3a, all 26 cantons, Swiss tax reminders — all included",
      "Both tools run 100% offline. No subscription. No cloud. No account needed.",
      "BudgetManager license key included. Save ~21% vs buying separately.",
    ],
    badge: "BUNDLE — SAVE 21%",
    requiresLicenseKey: true,
    licenseKeyTier: "personal",
    downloadPath: "/manus-storage/06_Single_Bundle_917ab7e5.zip",
    coverImage: "/manus-storage/cover_06_single_bundle_0aadc427.png",
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
      "The complete financial toolkit for couples and families in Switzerland. Plan your shared year with the Couples Agenda, then track every household franc against Swiss family averages with BudgetManager Pro Family. Bought separately these cost CHF 52.80 — together you pay CHF 39.90. Both tools run offline, require no subscription, and handle everything from Kita fees to Pillar 3a. One purchase, full household control.",
    features: [
      "Financial Agenda 2026 — Couples Edition: 365 daily pages, shared savings, partner split",
      "BudgetManager Pro — Family: up to 4 profiles, household dashboard, smart split calculator",
      "Track shared and personal expenses separately — always know who paid what",
      "Krankenkasse, Pillar 3a, all 26 cantons, Kita categories — everything Swiss families need",
      "Both tools run 100% offline. No subscription. No cloud. No account needed.",
      "BudgetManager license key included. Save ~24% vs buying separately.",
    ],
    badge: "BUNDLE — SAVE 24%",
    requiresLicenseKey: true,
    licenseKeyTier: "family",
    downloadPath: "/manus-storage/07_Family_Bundle_45dab881.zip",
    coverImage: "/manus-storage/cover_07_family_bundle_72494c46.png",
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
