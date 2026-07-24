import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { randomBytes } from "crypto";
import { getDb } from "./db";
import { orders, licenses } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { getProduct } from "./products";
import { sendPurchaseConfirmationEmail } from "./email";

export function registerStripeWebhook(app: Express) {
  // TEST ENDPOINT: Simulate webhook for development
  app.post(
    "/api/stripe/webhook/test",
    express.json(),
    async (req: Request, res: Response) => {
      console.log("[Webhook TEST] Simulating checkout.session.completed event");
      const session = req.body as Stripe.Checkout.Session;
      try {
        await handleCheckoutCompleted(session);
        res.json({ success: true, message: "Test webhook processed" });
      } catch (err) {
        console.error("[Webhook TEST] Error:", err);
        res.status(500).json({ error: "Test webhook failed", details: String(err) });
      }
    }
  );

  // MUST use express.raw BEFORE express.json for webhook signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const stripeKey = process.env.STRIPE_SECRET_KEY;

      if (!stripeKey) {
        console.error("[Webhook] STRIPE_SECRET_KEY not configured");
        res.status(500).json({ error: "Stripe not configured" });
        return;
      }

      const stripe = new Stripe(stripeKey, { apiVersion: "2026-06-24.dahlia" });

      let event: Stripe.Event;

      try {
        if (webhookSecret && sig) {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
          // No webhook secret — parse raw body as JSON (dev/test only)
          event = JSON.parse(req.body.toString()) as Stripe.Event;
        }
      } catch (err) {
        console.error("[Webhook] Signature verification failed:", err);
        res.status(400).json({ error: "Webhook signature verification failed" });
        return;
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      // Test events: return verification response immediately
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      try {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("[Webhook] Processing checkout.session.completed:", session.id);
          await handleCheckoutCompleted(session);
        } else {
          console.log("[Webhook] Event type not handled:", event.type);
        }
      } catch (err) {
        console.error("[Webhook] Error processing event:", err);
        res.status(500).json({ error: "Webhook processing failed" });
        return;
      }

      res.json({ received: true });
    }
  );
}

/**
 * Generate a unique license key in the format BM-XXXX-XXXX-XXXX-XXXX
 * Uses cryptographically random bytes for uniqueness.
 */
function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const segment = () =>
    Array.from({ length: 4 }, () => chars[randomBytes(1)[0] % chars.length]).join("");
  return `BM-${segment()}-${segment()}-${segment()}-${segment()}`;
}

/**
 * Detect the customer's preferred language from Stripe session metadata.
 * Falls back to "en" if not set or unrecognised.
 */
function detectLanguage(session: Stripe.Checkout.Session): string {
  const lang = session.metadata?.language ?? session.locale ?? "en";
  if (["it", "fr", "de"].includes(lang)) return lang;
  return "en";
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Support both single-product (product_key) and multi-product cart (product_keys)
  const productKeysRaw = session.metadata?.product_keys ?? session.metadata?.product_key ?? "";
  const productKeys = productKeysRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (productKeys.length === 0) {
    console.warn("[Webhook] Missing product_key(s) in session metadata:", session.id);
    return;
  }

  // userId is optional — guests have no account
  const rawUserId = session.metadata?.user_id;
  const userId = rawUserId ? parseInt(rawUserId, 10) : null;

  const db = await getDb();
  if (!db) {
    console.warn("[Webhook] Database not available, skipping order creation");
    return;
  }

  const customerEmail =
    session.customer_details?.email ??
    session.metadata?.customer_email ??
    null;
  const customerName =
    session.customer_details?.name ??
    session.metadata?.customer_name ??
    undefined;
  const language = detectLanguage(session);

  // Amount per product: divide total evenly across all products
  const amountPerProduct = session.amount_total != null
    ? Math.round(session.amount_total / productKeys.length)
    : 0;

  // Collect all generated license keys for the owner notification
  const allLicenseKeys: string[] = [];

  // Process each product in the cart
  for (const productKey of productKeys) {
    const product = getProduct(productKey);

    try {
      // Upsert order — composite unique index (stripeSessionId, productKey) prevents duplicates
      const result = await db
        .insert(orders)
        .values({
          userId: userId ?? undefined,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? undefined),
          productKey,
          amountTotal: amountPerProduct,
          currency: session.currency ?? "chf",
          paymentStatus: session.payment_status ?? "unpaid",
        })
        .onDuplicateKeyUpdate({
          set: {
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : (session.payment_intent?.id ?? undefined),
            paymentStatus: session.payment_status ?? "unpaid",
          },
        });

      console.log(`[Webhook] Order recorded — user: ${userId ?? "guest"}, product: ${productKey}`);

      // ── Generate license key for BudgetManager products ───────────────────────
      let licenseKey: string | undefined;

      if (product?.requiresLicenseKey) {
        try {
          const tier = productKey.includes("family") ? "family" : "personal";

          // When onDuplicateKeyUpdate fires, MySQL returns insertId=0.
          // In that case we must fetch the real orderId from the DB.
          let orderId = (result as any).insertId ?? 0;
          if (orderId === 0) {
            const existingOrder = await db
              .select({ id: orders.id })
              .from(orders)
              .where(eq(orders.stripeSessionId, session.id))
              .limit(1);
            orderId = existingOrder[0]?.id ?? 0;
          }

          // Check if a license already exists for this order (idempotent)
          const existingLicense = await db
            .select({ licenseKey: licenses.licenseKey })
            .from(licenses)
            .where(eq(licenses.orderId, orderId))
            .limit(1);

          if (existingLicense.length > 0) {
            // Reuse the existing license key — do not generate a new one
            licenseKey = existingLicense[0].licenseKey;
            console.log(`[Webhook] Reusing existing license key for order ${orderId}: ${licenseKey}`);
          } else {
            licenseKey = generateLicenseKey();
            await db.insert(licenses).values({
              licenseKey,
              orderId,
              productKey,
              tier,
              customerEmail: customerEmail ?? undefined,
            });
            console.log(`[Webhook] License key generated: ${licenseKey} for product ${productKey}`);
          }

          allLicenseKeys.push(licenseKey);
        } catch (licErr) {
          console.warn("[Webhook] License key generation failed:", licErr);
          licenseKey = undefined;
        }
      }

      // ── Send one thank-you email per product ──────────────────────────────
      // Each product gets its own email so each license key is delivered separately.
      try {
        if (customerEmail && product) {
          const siteOrigin = (() => {
            try {
              return new URL(session.success_url ?? "").origin;
            } catch {
              return "https://adelaidemanta-financialadvisor.ch";
            }
          })();
          const downloadUrl = `${siteOrigin}/payment-success?session_id=${session.id}`;
          const productAmount = productKeys.length > 1 ? amountPerProduct : (session.amount_total ?? product.amount);
          await sendPurchaseConfirmationEmail({
            customerEmail,
            customerName,
            productName: product.name,
            productShortName: product.shortName,
            downloadUrl,
            licenseKey,
            amountPaid: productAmount,
            currency: session.currency ?? product.currency,
            language,
          });
        }
      } catch (emailErr) {
        console.warn(`[Webhook] Thank-you email failed for ${productKey}:`, emailErr);
      }
    } catch (err) {
      console.error(`[Webhook] Failed to record order for product ${productKey}:`, err);
      // Continue processing other products even if one fails
    }
  }

  // ── Notify owner of new purchase ──────────────────────────────────────────
  try {
    const productNames = productKeys
      .map((k) => getProduct(k)?.shortName ?? k)
      .join(", ");
    const amount =
      session.amount_total != null
        ? `CHF ${(session.amount_total / 100).toFixed(2)}`
        : "unknown amount";
    const licenseInfo = allLicenseKeys.length > 0
      ? `\n\nLicense key(s): ${allLicenseKeys.map((k) => `\`${k}\``).join(", ")}`
      : "";
    await notifyOwner({
      title: `New purchase: ${productNames}`,
      content: `${customerEmail ?? "unknown"} purchased **${productNames}** for ${amount}.${licenseInfo}\n\nStripe session: ${session.id}`,
    });
  } catch (notifyErr) {
    console.warn("[Webhook] Owner notification failed:", notifyErr);
  }
}
