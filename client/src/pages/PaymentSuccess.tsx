import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Download, ArrowLeft, Loader2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// All download paths keyed by productKey
const DOWNLOAD_PATHS: Record<string, string> = {
  "moving-guide": "/manus-storage/01_Moving_to_Switzerland_21676289.zip",
  "financial-agenda-couples": "/manus-storage/02_Financial_Agenda_Couples_0faeb8a5.zip",
  "financial-agenda-single": "/manus-storage/03_Financial_Agenda_Single_cba36e60.zip",
  "budget-manager-personal": "/manus-storage/04_BudgetManager_Personal_da8b77b4.zip",
  "budget-manager-family": "/manus-storage/05_BudgetManager_Family_ed9ff527.zip",
  "single-bundle": "/manus-storage/06_Single_Bundle_b7398080.zip",
  "family-bundle": "/manus-storage/07_Family_Bundle_8dd57fd2.zip",
};

function getDownloadLabel(productKey: string): string | null {
  if (!productKey || productKey === "premium-plan") return null;
  if (productKey.includes("bundle")) return "Download Your Bundle";
  if (productKey.includes("agenda")) return "Download Your Agenda";
  if (productKey.includes("budget")) return "Download BudgetManager Pro";
  return "Download Your Guide";
}

// Upsell: shown only when user bought the moving guide
function UpsellOffer({ onDismiss }: { onDismiss: () => void }) {
  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      toast.info("Redirecting to checkout…");
      window.open(data.url || "", "_blank");
    },
    onError: (err) => {
      toast.error(err.message || "Could not start checkout. Please try again.");
    },
  });

  const handleUpsell = (productKey: string) => {
    createCheckout.mutate({ productKey, origin: window.location.origin });
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

      <p className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest mb-1">
        🎉 Welcome to Switzerland! One more thing…
      </p>
      <h3
        className="text-lg font-bold text-white mb-2 leading-snug"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Take control of your money from day one.
      </h3>
      <p className="text-white/55 text-xs mb-4 leading-relaxed">
        You just got the relocation guide. Now add the tools to plan every day and track every franc
        against Swiss benchmarks — at a special price, only on this page.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Single Bundle upsell */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white text-sm font-bold mb-0.5">Single Money Bundle</p>
          <p className="text-white/50 text-xs mb-3">
            Financial Agenda Single + BudgetManager Pro Personal
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                CHF 24.90
              </span>
              <span className="ml-1.5 text-white/30 line-through text-xs">CHF 29.90</span>
            </div>
            <button
              onClick={() => handleUpsell("single-bundle")}
              disabled={createCheckout.isPending}
              className="flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg disabled:opacity-60"
            >
              <ShoppingBag className="h-3 w-3" />
              Add
            </button>
          </div>
        </div>

        {/* Family Bundle upsell */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white text-sm font-bold mb-0.5">Family Money Bundle</p>
          <p className="text-white/50 text-xs mb-3">
            Financial Agenda Couples + BudgetManager Pro Family
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                CHF 33.90
              </span>
              <span className="ml-1.5 text-white/30 line-through text-xs">CHF 39.90</span>
            </div>
            <button
              onClick={() => handleUpsell("family-bundle")}
              disabled={createCheckout.isPending}
              className="flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg disabled:opacity-60"
            >
              <ShoppingBag className="h-3 w-3" />
              Add
            </button>
          </div>
        </div>
      </div>

      <p className="text-white/25 text-[10px] text-center mt-3">
        Special offer — only shown after your guide purchase.
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const downloadPath = data?.productKey ? DOWNLOAD_PATHS[data.productKey] : null;
  const downloadLabel = data?.productKey ? getDownloadLabel(data.productKey) : null;

  // Show upsell only when the purchased product is the moving guide
  const showUpsell = !upsellDismissed && data?.productKey === "moving-guide";

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

              {downloadPath && (
                <a
                  href={downloadPath}
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

        {/* Upsell offer — shown only after guide purchase */}
        {showUpsell && <UpsellOffer onDismiss={() => setUpsellDismissed(true)} />}
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
