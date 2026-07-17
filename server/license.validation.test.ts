/**
 * Tests for the license key validation logic.
 *
 * These tests verify:
 * 1. A key stored in the DB is returned as valid for the correct tier.
 * 2. A key stored in the DB is rejected for the wrong tier.
 * 3. A key not in the DB is returned as invalid.
 * 4. The generateLicenseKey helper produces keys in BM-XXXX-XXXX-XXXX-XXXX format.
 */
import { describe, expect, it } from "vitest";

// ── Inline the key generator so we can test its format without importing the
//    entire server module (which would try to connect to a real DB).
function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `BM-${segment()}-${segment()}-${segment()}-${segment()}`;
}

// ── Inline the validation logic (mirrors server/_core/index.ts) so we can
//    unit-test it against a mock DB without a live connection.
interface LicenseRow {
  licenseKey: string;
  tier: "personal" | "family";
}

async function validateLicenseLogic(
  key: string,
  product: string | undefined,
  db: LicenseRow[]
): Promise<{ valid: boolean }> {
  if (!key) return { valid: false };
  const row = db.find((r) => r.licenseKey === key);
  if (!row) return { valid: false };
  if (product) {
    const expectedTier = product === "family" ? "family" : "personal";
    if (row.tier !== expectedTier) return { valid: false };
  }
  return { valid: true };
}

describe("License key format", () => {
  it("generates keys in BM-XXXX-XXXX-XXXX-XXXX format", () => {
    for (let i = 0; i < 20; i++) {
      const key = generateLicenseKey();
      expect(key).toMatch(/^BM-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    }
  });

  it("never contains ambiguous characters 0, O, 1, I", () => {
    for (let i = 0; i < 100; i++) {
      const key = generateLicenseKey();
      expect(key).not.toMatch(/[01OI]/);
    }
  });
});

describe("License validation logic", () => {
  const mockDb: LicenseRow[] = [
    { licenseKey: "BM-AAAA-BBBB-CCCC-DDDD", tier: "personal" },
    { licenseKey: "BM-EEEE-FFFF-GGGG-HHHH", tier: "family" },
  ];

  it("returns valid:true for a correct personal key with product=personal", async () => {
    const result = await validateLicenseLogic("BM-AAAA-BBBB-CCCC-DDDD", "personal", mockDb);
    expect(result.valid).toBe(true);
  });

  it("returns valid:true for a correct family key with product=family", async () => {
    const result = await validateLicenseLogic("BM-EEEE-FFFF-GGGG-HHHH", "family", mockDb);
    expect(result.valid).toBe(true);
  });

  it("returns valid:false when a personal key is used for product=family", async () => {
    const result = await validateLicenseLogic("BM-AAAA-BBBB-CCCC-DDDD", "family", mockDb);
    expect(result.valid).toBe(false);
  });

  it("returns valid:false when a family key is used for product=personal", async () => {
    const result = await validateLicenseLogic("BM-EEEE-FFFF-GGGG-HHHH", "personal", mockDb);
    expect(result.valid).toBe(false);
  });

  it("returns valid:true when no product is specified (tier check skipped)", async () => {
    const result = await validateLicenseLogic("BM-AAAA-BBBB-CCCC-DDDD", undefined, mockDb);
    expect(result.valid).toBe(true);
  });

  it("returns valid:false for a key not in the database", async () => {
    const result = await validateLicenseLogic("BM-ZZZZ-ZZZZ-ZZZZ-ZZZZ", "personal", mockDb);
    expect(result.valid).toBe(false);
  });

  it("returns valid:false for an empty key", async () => {
    const result = await validateLicenseLogic("", "personal", mockDb);
    expect(result.valid).toBe(false);
  });
});
