import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShoppingBag, Download, Loader2, Package, Copy, Check, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const DOWNLOAD_PATHS: Record<string, string> = {
  "moving-guide": "/manus-storage/01_Moving_to_Switzerland_bc6ea1e4.zip",
  "financial-agenda-couples": "/manus-storage/02_Financial_Agenda_Couples_2b1157ed.zip",
  "financial-agenda-single": "/manus-storage/03_Financial_Agenda_Single_52388b82.zip",
  "budget-manager-personal": "/manus-storage/04_BudgetManager_Personal_93051c50.zip",
  "budget-manager-family": "/manus-storage/05_BudgetManager_Family_9d8db1bc.zip",
  "single-bundle": "/manus-storage/06_Single_Bundle_47a2cadd.zip",
  "family-bundle": "/manus-storage/07_Family_Bundle_bf86d0cc.zip",
};

function formatAmount(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null) return "—";
  const code = (currency ?? "chf").toUpperCase();
  return `${code} ${(amount / 100).toFixed(2)}`;
}

function statusBadge(status: string | null | undefined) {
  if (status === "paid") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
        Paid
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[#1a2744]/50">
      {status ?? "Unknown"}
    </Badge>
  );
}

/** Inline license key display with copy button */
function LicenseKeyInline({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      toast.success("License key copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Please select and copy manually.");
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2 bg-[#f8f5f0] border border-[#c9a84c]/40 rounded-lg px-3 py-2">
      <Key className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />
      <code className="flex-1 text-[#1a2744] font-mono text-xs font-bold tracking-wider select-all truncate">
        {licenseKey}
      </code>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 text-[#1a2744]/40 hover:text-[#c9a84c] transition-colors"
        title="Copy license key"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = trpc.stripe.myOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <Loader2 className="h-8 w-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#f8f5f0]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#1a2744]/5 p-10 text-center">
          <ShoppingBag className="h-12 w-12 text-[#c9a84c] mx-auto mb-4" />
          <h1
            className="text-2xl font-bold text-[#1a2744] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your downloads
          </h1>
          <p className="text-[#1a2744]/60 mb-4 text-sm leading-relaxed">
            After your purchase, Stripe sends a confirmation email with your receipt.
            Your download link is on the <strong>payment success page</strong> — bookmark it or check your email.
          </p>
          <p className="text-[#1a2744]/40 text-xs mb-6">
            If you created an account, sign in below to see your full order history.
          </p>
          <a
            href={getLoginUrl()}
            className="block w-full text-center bg-[#1a2744] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-xl mb-3"
          >
            Sign In
          </a>
          <Link href="/#shop">
            <button className="block w-full text-center border border-[#1a2744]/20 text-[#1a2744]/60 py-3 text-sm font-bold uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all rounded-xl">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f5f0] py-16 px-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#1a2744]/60 hover:text-[#1a2744] -ml-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="w-8 h-0.5 bg-[#c9a84c] mb-4" />
          <h1
            className="text-4xl font-bold text-[#1a2744]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Orders
          </h1>
          <p className="text-[#1a2744]/60 mt-2">Your purchase history</p>
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-[#c9a84c] animate-spin" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#1a2744]/5 shadow-sm p-16 text-center">
            <Package className="h-12 w-12 text-[#1a2744]/20 mx-auto mb-4" />
            <h2
              className="text-xl font-semibold text-[#1a2744] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No orders yet
            </h2>
            <p className="text-[#1a2744]/50 text-sm mb-6">
              Your purchases will appear here once you complete a payment.
            </p>
            <Link href="/#shop">
              <Button className="bg-[#1a2744] text-white hover:bg-[#c9a84c] hover:text-[#1a2744]">
                Browse Digital Resources
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const downloadPath = DOWNLOAD_PATHS[order.productKey];
              const haslicenseKey = !!order.licenseKey;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#1a2744]/5 shadow-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-[#1a2744]/5 flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-[#1a2744]" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1a2744] truncate">
                          {order.product?.name ?? order.productKey}
                        </h3>
                        {statusBadge(order.paymentStatus)}
                      </div>
                      <p className="text-[#1a2744]/50 text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-CH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[#c9a84c] font-bold mt-1">
                        {formatAmount(order.amountTotal, order.currency)}
                      </p>
                    </div>

                    {/* Download button */}
                    {downloadPath && order.paymentStatus === "paid" && (
                      <a
                        href={downloadPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#c9a84c] text-[#1a2744] px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#1a2744] hover:text-white transition-all rounded-xl flex-shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    )}
                  </div>

                  {/* License key — shown for BudgetManager orders */}
                  {haslicenseKey && order.paymentStatus === "paid" && (
                    <LicenseKeyInline licenseKey={order.licenseKey!} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
