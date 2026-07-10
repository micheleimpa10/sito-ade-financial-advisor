import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 42,
    openId: "test-user-openid",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("stripe.products", () => {
  it("returns the product catalogue without authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    const keys = products.map((p) => p.key);
    expect(keys).toContain("moving-guide");
    expect(keys).toContain("premium-plan");
  });

  it("each product has required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    for (const product of products) {
      expect(product.key).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.amount).toBeGreaterThan(0);
      expect(product.currency).toBeTruthy();
    }
  });

  it("moving-guide has correct price of CHF 9.90 (990 cents)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    const guide = products.find((p) => p.key === "moving-guide");
    expect(guide).toBeDefined();
    expect(guide?.amount).toBe(990);
    expect(guide?.currency).toBe("chf");
  });

  it("all 7 purchasable products are listed", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    const expectedKeys = [
      "moving-guide",
      "financial-agenda-couples",
      "financial-agenda-single",
      "budget-manager-personal",
      "budget-manager-family",
      "single-bundle",
      "family-bundle",
    ];
    for (const key of expectedKeys) {
      expect(products.find((p) => p.key === key)).toBeDefined();
    }
  });

  it("single-bundle has correct launch price of CHF 29.90 (2990 cents)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    const bundle = products.find((p) => p.key === "single-bundle");
    expect(bundle).toBeDefined();
    expect(bundle?.amount).toBe(2990);
    expect(bundle?.currency).toBe("chf");
  });

  it("family-bundle has correct launch price of CHF 39.90 (3990 cents)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    const bundle = products.find((p) => p.key === "family-bundle");
    expect(bundle).toBeDefined();
    expect(bundle?.amount).toBe(3990);
    expect(bundle?.currency).toBe("chf");
  });

  it("premium-plan has correct price of CHF 295.00 (29500 cents)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.stripe.products();
    const plan = products.find((p) => p.key === "premium-plan");
    expect(plan).toBeDefined();
    expect(plan?.amount).toBe(29500);
    expect(plan?.currency).toBe("chf");
  });
});

describe("stripe.createCheckout", () => {
  it("allows unauthenticated (guest) users to create a checkout session", async () => {
    // createCheckout is now a publicProcedure — no login required
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake_key_for_testing");
    const caller = appRouter.createCaller(createPublicContext());
    // Stripe will throw because the key is fake, but the auth check passes
    await expect(
      caller.stripe.createCheckout({
        productKey: "moving-guide",
        origin: "https://example.com",
      })
    ).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    vi.unstubAllEnvs();
  });

  it("throws NOT_FOUND for an unknown product key", async () => {
    // Mock Stripe so we don't need a real key for this test
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake_key_for_testing");
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.stripe.createCheckout({
        productKey: "nonexistent-product-xyz",
        origin: "https://example.com",
      })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    vi.unstubAllEnvs();
  });

  it("throws INTERNAL_SERVER_ERROR when STRIPE_SECRET_KEY is not set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const caller = appRouter.createCaller(createAuthContext());
    await expect(
      caller.stripe.createCheckout({
        productKey: "moving-guide",
        origin: "https://example.com",
      })
    ).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
    vi.unstubAllEnvs();
  });
});

describe("stripe.myOrders", () => {
  it("throws UNAUTHORIZED when user is not authenticated", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.stripe.myOrders()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("returns an array for authenticated users (empty when no DB)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    // When DB is not configured in test environment, getDb() returns null and myOrders returns []
    const result = await caller.stripe.myOrders();
    expect(Array.isArray(result)).toBe(true);
  });
});
