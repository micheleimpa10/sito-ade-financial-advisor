import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { orders } from "../../drizzle/schema";
import { getProduct, PRODUCTS } from "../products";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { eq, desc, inArray } from "drizzle-orm";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
  if (!key) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Stripe not configured" });
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
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

    return rows.map((order) => ({
      ...order,
      product: getProduct(order.productKey),
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

  /** List all available products (public) */
  products: publicProcedure.query(() => {
    return Object.values(PRODUCTS);
  }),
});
