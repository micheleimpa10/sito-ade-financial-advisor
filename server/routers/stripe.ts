import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { orders, licenses } from "../../drizzle/schema";
import { getProduct, PRODUCTS } from "../products";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { eq, desc, inArray } from "drizzle-orm";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stripe not configured" });
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session — no login required.
   * Stripe collects the customer email at checkout automatically.
   * After payment, the webhook records the order linked to the Stripe session ID.
   */
  createCheckout: publicProcedure
    .input(
      z.object({
        productKey: z.string(),
        /** Frontend origin used for success/cancel redirect URLs */
        origin: z.string().url(),
        /** Customer's preferred language for the thank-you email */
        language: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productKey);
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      // Premium plan is sold via official invoice, not Stripe
      if (input.productKey === "premium-plan") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "The Premium Plan is invoiced directly. Please book a consultation." });
      }

      const stripe = getStripe();

      // Pre-fill email if the user is already logged in, otherwise Stripe collects it
      const prefillEmail = ctx.user?.email ?? undefined;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        // Stripe will ask for email at checkout if not prefilled
        customer_email: prefillEmail,
        line_items: [
          {
            price_data: {
              currency: product.currency,
              unit_amount: product.amount,
              product_data: {
                name: product.name,
                description: product.description,
              },
            },
            quantity: 1,
          },
        ],
        // Store user id only if logged in; guests have no user_id
        client_reference_id: ctx.user ? ctx.user.id.toString() : undefined,
        metadata: {
          user_id: ctx.user ? ctx.user.id.toString() : "",
          product_key: product.key,
          customer_email: ctx.user?.email ?? "",
          customer_name: ctx.user?.name ?? "",
          language: input.language ?? "",
        },
        success_url: `${input.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/#shop`,
      });

      return { url: session.url };
    }),

  /**
   * Retrieve the current logged-in user's order history.
   * Guests can use verifySession to access their specific purchase.
   */
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));

    // Fetch license keys for BudgetManager orders
    const orderIds = rows.map((o) => o.id);
    let licenseMap: Record<number, string> = {};
    if (orderIds.length > 0) {
      const licenseRows = await db
        .select()
        .from(licenses)
        .where(inArray(licenses.orderId, orderIds));
      for (const lic of licenseRows) {
        licenseMap[lic.orderId] = lic.licenseKey;
      }
    }

    return rows.map((order) => ({
      ...order,
      product: getProduct(order.productKey),
      licenseKey: licenseMap[order.id] ?? null,
    }));
  }),

  /**
   * Verify a completed session and return basic info for the success page.
   * Works for both logged-in users and guests.
   * The Stripe session_id is a cryptographically random secret token —
   * possessing it is sufficient proof of purchase.
   */
  verifySession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      // If the caller is authenticated, verify the session belongs to them (if user_id was stored)
      if (ctx.user) {
        const sessionUserId = session.metadata?.user_id;
        if (sessionUserId && parseInt(sessionUserId, 10) !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Session does not belong to this user" });
        }
      }
      return {
        status: session.payment_status,
        productKey: session.metadata?.product_key ?? null,
        // Only return email if payment is completed
        customerEmail: session.payment_status === "paid" ? (session.customer_details?.email ?? null) : null,
      };
    }),

  /**
   * Retrieve the license key for a completed Stripe session.
   * The session_id acts as the proof of purchase — no login required.
   * Returns null if no license key exists for this session (non-BudgetManager products).
   */
  getLicenseBySession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { licenseKey: null };

      // Look up the order for this session
      const orderRows = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeSessionId, input.sessionId))
        .limit(1);

      if (orderRows.length === 0) return { licenseKey: null };

      const order = orderRows[0];

      // Look up the license for this order
      const licenseRows = await db
        .select()
        .from(licenses)
        .where(eq(licenses.orderId, order.id))
        .limit(1);

      if (licenseRows.length === 0) return { licenseKey: null };

      return { licenseKey: licenseRows[0].licenseKey };
    }),

  /**
   * Create a Stripe Checkout Session for multiple cart items.
   * Supports optional per-item discount percentages (e.g. 20% upsell discount).
   * No login required — Stripe collects customer email at checkout.
   */
  createCartCheckout: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productKey: z.string(),
            discountPct: z.number().min(0).max(100).optional(),
          })
        ).min(1),
        origin: z.string().url(),
        /** Customer's preferred language for the thank-you email */
        language: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      const productKeys: string[] = [];

      for (const cartItem of input.items) {
        const product = getProduct(cartItem.productKey);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: `Product not found: ${cartItem.productKey}` });
        }
        if (cartItem.productKey === "premium-plan") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "The Premium Plan is invoiced directly." });
        }
        const discountPct = cartItem.discountPct ?? 0;
        const discountedAmount = discountPct > 0
          ? Math.round(product.amount * (1 - discountPct / 100))
          : product.amount;
        const nameWithDiscount = discountPct > 0
          ? `${product.shortName ?? product.name} (${discountPct}% OFF)`
          : (product.shortName ?? product.name);
        lineItems.push({
          price_data: {
            currency: product.currency,
            unit_amount: discountedAmount,
            product_data: {
              name: nameWithDiscount,
              description: product.description,
            },
          },
          quantity: 1,
        });
        productKeys.push(cartItem.productKey);
      }

      const prefillEmail = ctx.user?.email ?? undefined;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        customer_email: prefillEmail,
        line_items: lineItems,
        client_reference_id: ctx.user ? ctx.user.id.toString() : undefined,
        metadata: {
          user_id: ctx.user ? ctx.user.id.toString() : "",
          product_keys: productKeys.join(","),
          product_key: productKeys[0] ?? "",
          customer_email: ctx.user?.email ?? "",
          customer_name: ctx.user?.name ?? "",
          language: input.language ?? "",
        },
        success_url: `${input.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/#shop`,
      });
      return { url: session.url };
    }),

  /**
   * Validate a license key against the database.
   * Used by the HTML files to check if a license is valid.
   */
  validateLicense: publicProcedure
    .input(z.object({ key: z.string(), product: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { valid: false };

      // Look up the license in the database
      const licenseRows = await db
        .select()
        .from(licenses)
        .where(eq(licenses.licenseKey, input.key))
        .limit(1);

      if (licenseRows.length === 0) return { valid: false };

      const license = licenseRows[0];
      // If product is specified, verify it matches
      if (input.product) {
        const expectedTier = input.product === 'family' ? 'family' : 'personal';
        if (license.tier !== expectedTier) return { valid: false };
      }

      return { valid: true };
    }),

  /** List all available products (public) */
  products: publicProcedure.query(() => {
    return Object.values(PRODUCTS);
  }),
});
