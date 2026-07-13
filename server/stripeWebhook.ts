import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { getProduct } from "./products";
import { ENV } from "./_core/env";

export function registerStripeWebhook(app: Express) {
  // MUST use express.raw BEFORE express.json for webhook signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const stripeKey = ENV.stripeSecretKey;

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

  // Upsert order to handle duplicate webhook deliveries gracefully
  try {
    await db
      .insert(orders)
      .values({
        // userId is null for guest purchases
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

    // Notify owner of new purchase
    try {
      const product = getProduct(productKey);
      const productName = product?.shortName ?? productKey;
      const amount = session.amount_total != null
        ? `CHF ${(session.amount_total / 100).toFixed(2)}`
        : "unknown amount";
      const customerEmail = session.metadata?.customer_email ?? session.customer_email ?? "unknown";
      await notifyOwner({
        title: `New purchase: ${productName}`,
        content: `${customerEmail} purchased **${productName}** for ${amount}.\n\nStripe session: ${session.id}`,
      });
    } catch (notifyErr) {
      // Notification failure must not block order processing
      console.warn("[Webhook] Owner notification failed:", notifyErr);
    }
  } catch (err) {
    console.error("[Webhook] Failed to record order:", err);
    throw err;
  }
}
