# Adelaide Manta TODO

## Stripe Payment Integration

- [x] Install stripe npm package
- [x] Add orders table to database schema
- [x] Create server/products.ts with product/price definitions
- [x] Create server/routers/stripe.ts with checkout session and order history procedures
- [x] Register Stripe webhook endpoint at /api/stripe/webhook
- [x] Wire stripe router into appRouter
- [x] Create client/src/pages/PaymentSuccess.tsx
- [x] Create client/src/pages/Orders.tsx (payment history)
- [x] Update Home.tsx shop section to use Stripe checkout
- [x] Register new routes in App.tsx
- [x] Write vitest tests for stripe router
- [x] Add My Orders link to footer

## Cart & Upsell System

- [x] CartContext with global cart state, bundle suggestion logic
- [x] CartDrawer component with bundle upgrade UI
- [x] Add to Cart button on every product card (with "In Cart" state toggle)
- [x] Multi-item Stripe checkout via createCartCheckout procedure
- [x] Post-purchase upsell with 20% discount shown after every purchase
- [x] Automatic bundle upgrade suggestion when 2 compatible items are in cart
- [x] CartProvider + CartDrawer wired into App.tsx

## Email + Copy + Cart Icon

- [x] Resend thank-you email after Stripe purchase (with download link)
- [x] Rewrite all 7 product descriptions with conversion-focused copy
- [x] Cart icon with badge in the navbar

## License Keys & Multilingual Email

- [x] Add licenses table to drizzle schema and run db:push
- [x] Generate unique BM-XXXX-XXXX-XXXX-XXXX key per purchase in webhook
- [x] Translate thank-you email into EN, IT, FR, DE with language detection
- [x] Show license key on PaymentSuccess page
- [x] Show license key on Orders page
- [x] Pass current UI language to createCheckout and createCartCheckout so multilingual emails work end-to-end

## Cart UX Fix

- [x] Fix cart bundle suggestion: addItem no longer auto-opens drawer, toast confirmation shown instead, user can add multiple items before opening cart manually

## Hero & Gallery Redesign

- [x] Redesign hero section: remove split layout (photo left / text right), replace with full-width blurred background photos + centered text overlay
- [x] Replace GalleryCarousel with masonry/puzzle photo grid — all photos well-cropped, centered, visible, community feel

## Internal Product Screenshots & Key Alignment

- [x] Capture internal screenshots of Financial Agenda Single (6 shots: cover, January, budget, annual, habits, tips)
- [x] Capture internal screenshots of Financial Agenda Couples (3 shots: cover, January, partner split)
- [x] Bypass BudgetManager license and capture screenshots of Personal edition (3 shots: dashboard, populated, charts)
- [x] Bypass BudgetManager license and capture screenshots of Family edition (3 shots: dashboard, populated, charts)
- [x] Upload all 15 screenshots to webdev storage
- [x] Fix product key mismatch: add canonical keys (financial-agenda-*, budget-manager-*) + legacy aliases in ProductDetail.tsx
- [x] Update screenshot galleries in ProductDetail.tsx with correct storage URLs

## License Key Validation Fix

- [x] Root cause identified: license.js was calling Cloudflare Worker (external, unrelated) instead of the website's own /api/validate-license endpoint
- [x] Updated all 4 license.js files (SVIZZERA_MANUS/budget_personal, SVIZZERA_MANUS/budget_family, budget_personal, budget_family) to call https://finhub-swi-npjvpcwa.manus.space/api/validate-license
- [x] Changed fetch from POST /api/validate to GET /api/validate-license?key=...&product=...
- [x] Added CORS middleware (cors package) to /api/validate-license endpoint so locally-opened HTML files (file:// protocol) can call it
- [x] Added OPTIONS preflight handler for the validate-license route
- [x] Verified endpoint returns valid:true for correct key/tier, valid:false for wrong tier, valid:false for unknown key
- [x] Added vitest tests for license key format and validation logic (9 tests, all passing)
