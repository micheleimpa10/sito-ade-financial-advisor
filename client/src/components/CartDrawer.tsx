import { X, ShoppingCart, Trash2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, removeItem, clearCart, isOpen, closeCart, totalCents, bundleSuggestion, addItem, lang } =
    useCart();

  const createCartCheckout = trpc.stripe.createCartCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout…");
        window.open(data.url, "_blank");
        clearCart();
        closeCart();
      }
    },
    onError: (err) => {
      toast.error(err.message || "Could not start checkout. Please try again.");
    },
  });

  const handleCheckout = () => {
    if (items.length === 0) return;
    createCartCheckout.mutate({
      items: items.map((i) => ({ productKey: i.key, discountPct: i.discountPct })),
      origin: window.location.origin,
      // Pass the current UI language so the thank-you email is sent in the right language
      language: lang,
    });
  };

  const handleUpgradeToBundle = () => {
    if (!bundleSuggestion) return;
    // Remove the individual items that the bundle replaces and add the bundle
    const rule = getBundleRule(bundleSuggestion.bundleKey);
    if (rule) {
      rule.triggers.forEach((key) => removeItem(key));
    }
    addItem({
      key: bundleSuggestion.bundleKey,
      name: bundleSuggestion.bundleName,
      price: bundleSuggestion.bundlePrice,
      displayPrice: bundleSuggestion.bundleDisplayPrice,
    });
  };

  if (!isOpen) return null;

  const totalDisplay = `CHF ${(totalCents / 100).toFixed(2)}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2744]/8">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#1a2744]" />
            <h2
              className="text-lg font-bold text-[#1a2744]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="bg-[#c9a84c] text-[#1a2744] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-[#1a2744]/40 hover:text-[#1a2744] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#1a2744]/40">
              <ShoppingCart className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 bg-[#f8f5f0] rounded-xl p-3"
              >
                {item.cover && (
                  <img
                    src={item.cover}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a2744] leading-snug truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-[#c9a84c]">
                      {item.displayPrice}
                    </span>
                    {item.discountPct && (
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">
                        -{item.discountPct}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  className="text-[#1a2744]/30 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}

          {/* Bundle upgrade suggestion */}
          {bundleSuggestion && (
            <div className="bg-[#1a2744] rounded-xl p-4 mt-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#c9a84c]" />
                <p className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest">
                  Bundle Upgrade Available!
                </p>
              </div>
              <p className="text-white text-sm font-bold mb-1">
                {bundleSuggestion.bundleName}
              </p>
              <p className="text-white/60 text-xs mb-3">
                Replace your 2 items with the bundle and save{" "}
                <span className="text-[#c9a84c] font-bold">
                  CHF {(bundleSuggestion.saving / 100).toFixed(2)} ({bundleSuggestion.savingPct}%)
                </span>
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {bundleSuggestion.bundleDisplayPrice}
                  </span>
                  <span className="ml-2 text-white/30 line-through text-xs">
                    CHF {(bundleSuggestion.currentTotal / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleUpgradeToBundle}
                  className="flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg"
                >
                  Upgrade
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#1a2744]/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#1a2744]/60 text-sm">Total</span>
              <span
                className="text-2xl font-bold text-[#1a2744]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {totalDisplay}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={createCartCheckout.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2744] text-white py-3.5 text-sm font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-xl disabled:opacity-60"
            >
              {createCartCheckout.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Checkout — {totalDisplay}
                </>
              )}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-[#1a2744]/40 text-xs hover:text-red-500 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function getBundleRule(bundleKey: string) {
  const rules: Record<string, { triggers: string[] }> = {
    "single-bundle": { triggers: ["financial-agenda-single", "budget-manager-personal"] },
    "family-bundle": { triggers: ["financial-agenda-couples", "budget-manager-family"] },
  };
  return rules[bundleKey] ?? null;
}
