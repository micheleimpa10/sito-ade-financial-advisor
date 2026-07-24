import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CartItem = {
  key: string;
  name: string;
  price: number; // in CHF cents
  displayPrice: string;
  cover?: string;
  /** If this item was added at a discount (e.g. upsell 20% off) */
  discountPct?: number;
};

export type Lang = "en" | "it" | "fr" | "de";

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  isInCart: (key: string) => boolean;
  totalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Bundle upgrade suggestion: set when 2 compatible individual items are in cart */
  bundleSuggestion: BundleSuggestion | null;
  /** The current UI language — used to send multilingual thank-you emails */
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export type BundleSuggestion = {
  bundleKey: string;
  bundleName: string;
  bundlePrice: number; // cents
  bundleDisplayPrice: string;
  currentTotal: number; // cents of items it replaces
  saving: number; // cents saved
  savingPct: number;
};

// Bundle upgrade rules: which individual product keys trigger which bundle
const BUNDLE_RULES: Array<{
  triggers: string[];
  bundleKey: string;
  bundleName: string;
  bundlePrice: number;
  bundleDisplayPrice: string;
}> = [
  {
    // Single Money Bundle: agenda-single + budget-personal
    triggers: ["financial-agenda-single", "budget-manager-personal"],
    bundleKey: "single-bundle",
    bundleName: "Single Money Bundle",
    bundlePrice: 3990,
    bundleDisplayPrice: "CHF 39.90",
  },
  {
    // Family Money Bundle: agenda-couples + budget-family
    triggers: ["financial-agenda-couples", "budget-manager-family"],
    bundleKey: "family-bundle",
    bundleName: "Family Money Bundle",
    bundlePrice: 4990,
    bundleDisplayPrice: "CHF 49.90",
  },
];

function computeBundleSuggestion(items: CartItem[]): BundleSuggestion | null {
  const keys = new Set(items.map((i) => i.key));
  for (const rule of BUNDLE_RULES) {
    const allPresent = rule.triggers.every((t) => keys.has(t));
    if (!allPresent) continue;
    // Already has the bundle — no suggestion needed
    if (keys.has(rule.bundleKey)) continue;
    const currentTotal = items
      .filter((i) => rule.triggers.includes(i.key))
      .reduce((sum, i) => sum + i.price, 0);
    const saving = currentTotal - rule.bundlePrice;
    if (saving <= 0) continue;
    const savingPct = Math.round((saving / currentTotal) * 100);
    return {
      bundleKey: rule.bundleKey,
      bundleName: rule.bundleName,
      bundlePrice: rule.bundlePrice,
      bundleDisplayPrice: rule.bundleDisplayPrice,
      currentTotal,
      saving,
      savingPct,
    };
  }
  return null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.key === item.key)) return prev;
      return [...prev, item];
    });
    // Do NOT auto-open the drawer — let the user add multiple items first.
    // The cart icon badge updates immediately; the user opens the drawer manually.
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (key: string) => items.some((i) => i.key === key),
    [items]
  );

  const totalCents = items.reduce((sum, i) => sum + i.price, 0);
  const bundleSuggestion = computeBundleSuggestion(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        totalCents,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        bundleSuggestion,
        lang,
        setLang,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
