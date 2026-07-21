import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Download, ArrowLeft, Loader2, ShoppingBag, X, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// All download paths keyed by productKey
const DOWNLOAD_PATHS: Record<string, string> = {
  "moving-guide": "/manus-storage/01_Moving_to_Switzerland_a9ec67d4.zip",
  "financial-agenda-couples": "/manus-storage/02_Financial_Agenda_Couples_a51e7a1d.zip",
  "financial-agenda-single": "/manus-storage/03_Financial_Agenda_Single_e39b6d60.zip",
  "budget-manager-personal": "/manus-storage/04_BudgetManager_Personal_d54d5d0e.zip",
  "budget-manager-family": "/manus-storage/05_BudgetManager_Family_96909c61.zip",
  "single-bundle": "/manus-storage/06_Single_Bundle_917ab7e5.zip",
  "family-bundle": "/manus-storage/07_Family_Bundle_45dab881.zip",
};

function getDownloadLabel(productKey: string): string | null {
  if (!productKey || productKey === "premium-plan") return null;
  if (productKey.includes("bundle")) return "Download Your Bundle";
  if (productKey.includes("agenda")) return "Download Your Agenda";
  if (productKey.includes("budget")) return "Download BudgetManager Pro";
  return "Download Your Guide";
}

// Upsell product definitions — shown after each product purchase at 20% off
// Key = purchased product, value = array of upsell offers
const UPSELL_MAP: Record<string, Array<{
  productKey: string;
  name: string;
  desc: string;
  originalPrice: string;
  discountedPrice: string;
  discountPct: number;
}>> = {
  "moving-guide": [
    {
      productKey: "financial-agenda-single",
      name: "Financial Agenda 2026 — Single",
      desc: "Plan every day of your new Swiss life. 365 interactive pages.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
    {
      productKey: "budget-manager-personal",
      name: "BudgetManager Pro — Personal",
      desc: "Track every franc against Swiss benchmarks. Built for expats.",
      originalPrice: "CHF 29.90",
      discountedPrice: "CHF 23.92",
      discountPct: 20,
    },
  ],
  "financial-agenda-single": [
    {
      productKey: "budget-manager-personal",
      name: "BudgetManager Pro — Personal",
      desc: "Complete your toolkit: plan with the Agenda, track with BudgetManager.",
      originalPrice: "CHF 29.90",
      discountedPrice: "CHF 23.92",
      discountPct: 20,
    },
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "31 pages of verified 2026 data. Everything you need to settle in.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
  "financial-agenda-couples": [
    {
      productKey: "budget-manager-family",
      name: "BudgetManager Pro — Family",
      desc: "Complete your household toolkit: plan together, track together.",
      originalPrice: "CHF 34.90",
      discountedPrice: "CHF 27.92",
      discountPct: 20,
    },
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "31 pages of verified 2026 data for your Swiss relocation.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
  "budget-manager-personal": [
    {
      productKey: "financial-agenda-single",
      name: "Financial Agenda 2026 — Single",
      desc: "Plan your year, then track it with BudgetManager. The perfect pair.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "New to Switzerland? This guide answers every financial question.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
  "budget-manager-family": [
    {
      productKey: "financial-agenda-couples",
      name: "Financial Agenda 2026 — Couples",
      desc: "Plan your household year together. The perfect companion.",
      originalPrice: "CHF 24.90",
      discountedPrice: "CHF 19.92",
      discountPct: 20,
    },
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "New to Switzerland? This guide answers every financial question.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
  "single-bundle": [
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "Complete your Swiss toolkit with the relocation guide.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
  "family-bundle": [
    {
      productKey: "moving-guide",
      name: "Moving to Switzerland 2026 — Guide",
      desc: "Complete your family's Swiss toolkit with the relocation guide.",
      originalPrice: "CHF 19.90",
      discountedPrice: "CHF 15.92",
      discountPct: 20,
    },
  ],
};

function UpsellOffer({
  purchasedProductKey,
  onDismiss,
}: {
  purchasedProductKey: string;
  onDismiss: () => void;
}) {
  const offers = UPSELL_MAP[purchasedProductKey] ?? [];
  if (offers.length === 0) return null;

  const createCartCheckout = trpc.stripe.createCartCheckout.useMutation({
    onSuccess: (data) => {
      toast.info("Redirecting to checkout…");
      window.open(data.url ?? undefined, "_blank");
    },
    onError: (err) => {
      toast.error(err.message || "Could not start checkout. Please try again.");
    },
  });

  const handleUpsell = (productKey: string, discountPct: number) => {
    createCartCheckout.mutate({
      items: [{ productKey, discountPct }],
      origin: window.location.origin,
    });
  };

  return (
    <div className="mt-6 w-full bg-[#1a2744] rounded-2xl p-6 relative">
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c] rounded-t-2xl" />

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-white/30 hover:text-white/70 transition-colors"
        aria-label="Dismiss offer"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="h-3.5 w-3.5 text-[#c9a84c]" />
        <p className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest">
          Exclusive offer — 20% off, only on this page
        </p>
      </div>
      <h3
        className="text-lg font-bold text-white mb-2 leading-snug"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Complete your Swiss financial toolkit.
      </h3>
      <p className="text-white/55 text-xs mb-4 leading-relaxed">
        As a thank-you for your purchase, get these products at 20% off — available only right now.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {offers.map((offer) => (
          <div key={offer.productKey} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white text-sm font-bold mb-0.5 leading-snug">{offer.name}</p>
            <p className="text-white/50 text-xs mb-3 leading-relaxed">{offer.desc}</p>
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-[#c9a84c] font-bold text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {offer.discountedPrice}
                </span>
                <span className="ml-1.5 text-white/30 line-through text-xs">
                  {offer.originalPrice}
                </span>
              </div>
              <button
                onClick={() => handleUpsell(offer.productKey, offer.discountPct)}
                disabled={createCartCheckout.isPending}
                className="flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg disabled:opacity-60"
              >
                {createCartCheckout.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="h-3 w-3" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/25 text-[10px] text-center mt-3">
        This offer expires when you leave this page.
      </p>
    </div>
  );
}

/** License key display box with copy-to-clipboard */
function LicenseKeyBox({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      toast.success("License key copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Please select and copy manually.");
    }
  };

  return (
    <div className="w-full border border-[#c9a84c] rounded-xl p-5 bg-[#f8f5f0]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-[#c9a84c]">
          Your License Key
        </p>
      </div>

      {/* Key display + copy button */}
      <div className="flex items-center gap-3">
        <code
          className="flex-1 text-[#1a2744] font-mono font-bold text-lg tracking-widest select-all bg-white border border-[#1a2744]/10 rounded-lg px-4 py-3 text-center"
          style={{ letterSpacing: "0.15em" }}
        >
          {licenseKey}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 bg-[#1a2744] text-white px-3 py-3 rounded-lg hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all"
          title="Copy license key"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <p className="text-[#1a2744]/50 text-xs mt-3 text-center leading-relaxed">
        Keep this key safe — you will need it to activate BudgetManager Pro.
        It has also been sent to your email.
      </p>
    </div>
  );
}

export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id") ?? "";
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  const { data, isLoading, error } = trpc.stripe.verifySession.useQuery(
    { sessionId },
    { enabled: !!sessionId, retry: 2 }
  );

  // Fetch license key for any product that requires one (BudgetManager + bundles)
  const requiresLicenseKey =
    (data?.productKey?.includes("budget-manager") ||
      data?.productKey?.includes("bundle")) ??
    false;
  const { data: licenseData, isLoading: licenseLoading } = trpc.stripe.getLicenseBySession.useQuery(
    { sessionId },
    {
      enabled: !!sessionId && requiresLicenseKey && data?.status === "paid",
      retry: 3,
      retryDelay: 2000, // webhook may take a moment to process
    }
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save license key to localStorage when it becomes available
  useEffect(() => {
    if (licenseData?.licenseKey && data?.productKey) {
      const tier = data.productKey.includes("family") ? "family" : "personal";
      const storageKey = tier === "family" ? "sbpf-license" : "sbp-license";
      localStorage.setItem(storageKey, licenseData.licenseKey);
      console.log(`[PaymentSuccess] License saved to localStorage: ${storageKey}`);
    }
  }, [licenseData?.licenseKey, data?.productKey]);

  const downloadPath = data?.productKey ? DOWNLOAD_PATHS[data.productKey] : null;
  const downloadLabel = data?.productKey ? getDownloadLabel(data.productKey) : null;

  // Update download path for BudgetManager products to use v2 with license.js
  const finalDownloadPath = (() => {
    if (!data?.productKey) return downloadPath;
    // Use v2 files that require license validation
    const v2Paths: Record<string, string> = {
      "budget-manager-personal": "/manus-storage/04_BudgetManager_Personal_v2_e4c7fdce.zip",
      "budget-manager-family": "/manus-storage/05_BudgetManager_Family_v2_a065d0d1.zip",
      "single-bundle": "/manus-storage/06_Single_Bundle_v2_4834cc20.zip",
      "family-bundle": "/manus-storage/07_Family_Bundle_v2_3830bf65.zip",
    };
    return v2Paths[data.productKey] || downloadPath;
  })();

  // Show upsell for every product except bundles (bundles already contain multiple items)
  const showUpsell =
    !upsellDismissed &&
    !!data?.productKey &&
    data.status === "paid";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#f8f5f0", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-lg w-full">
        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#1a2744]/5 p-10 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-[#c9a84c] animate-spin" />
              <p className="text-[#1a2744]/60">Verifying your payment…</p>
            </div>
          ) : error || !data ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1
                className="text-2xl font-bold text-[#1a2744]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Unable to verify payment
              </h1>
              <p className="text-[#1a2744]/60 text-sm">
                If you completed your purchase, please check your email for a receipt or contact us.
              </p>
              <Link href="/">
                <Button
                  variant="outline"
                  className="mt-2 border-[#1a2744] text-[#1a2744] hover:bg-[#1a2744] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* Success icon */}
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>

              {/* Gold accent line */}
              <div className="w-12 h-0.5 bg-[#c9a84c]" />

              <h1
                className="text-3xl font-bold text-[#1a2744]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Payment Successful!
              </h1>

              <p className="text-[#1a2744]/70 leading-relaxed">
                Thank you for your purchase. A confirmation has been sent to{" "}
                <span className="font-semibold text-[#1a2744]">
                  {data.customerEmail ?? "your email"}
                </span>
                .
              </p>

              {/* License key — shown for BudgetManager and bundle products */}
              {requiresLicenseKey && (
                <div className="w-full">
                  {licenseLoading ? (
                    <div className="w-full border border-[#c9a84c]/40 rounded-xl p-5 bg-[#f8f5f0] flex items-center justify-center gap-2 text-[#1a2744]/50 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-[#c9a84c]" />
                      Generating your license key…
                    </div>
                  ) : licenseData?.licenseKey ? (
                    <LicenseKeyBox licenseKey={licenseData.licenseKey} />
                  ) : (
                    <div className="w-full border border-[#c9a84c]/40 rounded-xl p-5 bg-[#f8f5f0] text-center">
                      <p className="text-[#1a2744]/60 text-sm">
                        Your license key is being generated. Please check your email shortly, or{" "}
                        <button
                          onClick={() => window.location.reload()}
                          className="text-[#c9a84c] underline hover:no-underline"
                        >
                          refresh this page
                        </button>
                        .
                      </p>
                    </div>
                  )}
                </div>
              )}

              {finalDownloadPath && (
                <a
                  href={finalDownloadPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-[#1a2744] py-3.5 px-6 text-sm font-bold uppercase tracking-widest hover:bg-[#1a2744] hover:text-white transition-all rounded-xl shadow-md"
                >
                  <Download className="h-4 w-4" />
                  {downloadLabel ?? "Download"}
                </a>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Link href="/orders" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-[#1a2744]/20 text-[#1a2744] hover:border-[#1a2744] hover:bg-[#1a2744] hover:text-white"
                  >
                    View My Orders
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-[#1a2744]/20 text-[#1a2744] hover:border-[#1a2744] hover:bg-[#1a2744] hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Upsell offer — shown after every successful purchase */}
        {showUpsell && data?.productKey && (
          <UpsellOffer
            purchasedProductKey={data.productKey}
            onDismiss={() => setUpsellDismissed(true)}
          />
        )}
      </div>

      {/* Branding */}
      <p
        className="mt-8 text-[#1a2744]/40 text-sm"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Adelaide Manta · Financial Advisory
      </p>
    </div>
  );
}
