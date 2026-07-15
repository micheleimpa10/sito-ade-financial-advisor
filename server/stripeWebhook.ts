import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { randomBytes } from "crypto";
import { getDb } from "./db";
import { orders, licenses } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";
import { getProduct } from "./products";
import { sendPurchaseConfirmationEmail } from "./email";

export function registerStripeWebhook(app: Express) {
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

      // CRITICAL: test events must return verified:true for webhook verification to pass
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        res.json({ verified: true });
        return;
      }

      console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

      try {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session);
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const productKey = session.metadata?.product_key;
  // userId is optional — guests have no account
  const rawUserId = session.metadata?.user_id;
  const userId = rawUserId ? parseInt(rawUserId, 10) : null;

  if (!productKey) {
    console.warn("[Webhook] Missing product_key in session metadata:", session.id);
    return;
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Webhook] Database not available, skipping order creation");
    return;
  }

  const product = getProduct(productKey);
  const customerEmail =
    session.customer_details?.email ??
    session.metadata?.customer_email ??
    null;
  const customerName =
    session.customer_details?.name ??
    session.metadata?.customer_name ??
    undefined;
  const language = detectLanguage(session);

  // Upsert order to handle duplicate webhook deliveries gracefully
  try {
    const result = await db
      .insert(orders)
      .values({
        userId: userId,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
        productKey,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      })
      .onDuplicateKeyUpdate({
        set: {
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
          paymentStatus: session.payment_status,
        },
      });

    console.log(`[Webhook] Order recorded — user: ${userId ?? "guest"}, product: ${productKey}`);

    // ── Generate license key for BudgetManager products ───────────────────────
    let licenseKey: string | undefined;

    if (product?.requiresLicenseKey) {
      try {
        const tier = productKey.includes("family") ? "family" : "personal";
        const orderId = (result as any).insertId ?? 0;
        licenseKey = generateLicenseKey();

        await db.insert(licenses).values({
          licenseKey,
          orderId,
          productKey,
          tier,
          customerEmail: customerEmail ?? undefined,
        }).onDuplicateKeyUpdate({
          // If duplicate (retry), keep existing key — do not overwrite
          set: { productKey },
        });

        console.log(`[Webhook] License key generated: ${licenseKey} for order ${orderId}`);
      } catch (licErr) {
        console.warn("[Webhook] License key generation failed:", licErr);
        licenseKey = undefined;
      }
    }

    // ── Send thank-you email to customer ──────────────────────────────────────
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

        await sendPurchaseConfirmationEmail({
          customerEmail,
          customerName,
          productName: product.name,
          productShortName: product.shortName,
          downloadUrl,
          licenseKey,
          amountPaid: session.amount_total ?? product.amount,
          currency: session.currency ?? product.currency,
          language,
        });
      }
    } catch (emailErr) {
      // Email failure must never block order processing
      console.warn("[Webhook] Thank-you email failed:", emailErr);
    }

    // ── Notify owner of new purchase ──────────────────────────────────────────
    try {
      const productName = product?.shortName ?? productKey;
      const amount =
        session.amount_total != null
          ? `CHF ${(session.amount_total / 100).toFixed(2)}`
          : "unknown amount";
      await notifyOwner({
        title: `New purchase: ${productName}`,
        content: `${customerEmail ?? "unknown"} purchased **${productName}** for ${amount}.${licenseKey ? `\n\nLicense key: \`${licenseKey}\`` : ""}\n\nStripe session: ${session.id}`,
      });
    } catch (notifyErr) {
      console.warn("[Webhook] Owner notification failed:", notifyErr);
    }
  } catch (err) {
    console.error("[Webhook] Failed to record order:", err);
    throw err;
  }
}
