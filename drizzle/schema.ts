import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table — stores only essential Stripe identifiers.
 * Full payment details (amount, card info, receipt URL) are fetched from Stripe API when needed.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** Internal user ID who made the purchase — null for guest purchases (no account required) */
  userId: int("userId"),
  /** Stripe Checkout Session ID — used to look up full session details */
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  /** Stripe Payment Intent ID (populated after checkout.session.completed webhook) */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  /** Product key from our products.ts catalogue (e.g. 'moving-guide') */
  productKey: varchar("productKey", { length: 64 }).notNull(),
  /** Amount paid in smallest currency unit (e.g. CHF cents) — cached for order history display */
  amountTotal: int("amountTotal"),
  /** ISO currency code, e.g. 'chf' */
  currency: varchar("currency", { length: 8 }),
  /** Stripe payment status: 'paid' | 'unpaid' | 'no_payment_required' */
  paymentStatus: varchar("paymentStatus", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
