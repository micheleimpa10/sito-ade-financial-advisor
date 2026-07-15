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
