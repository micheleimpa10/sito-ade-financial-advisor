# Adelaide Manta TODO

## Replica da GitHub
- [x] Copiare struttura client (pages, components, assets)
- [x] Copiare struttura server (routers, database helpers, webhook)
- [x] Copiare configurazione Tailwind e stili CSS
- [x] Copiare file di configurazione (vite, drizzle, tsconfig)
- [x] Copiare package.json dependencies e scripts
- [x] Build locale completato con successo

## Pagine e Componenti
- [x] Home.tsx - Landing page multi-lingua con hero, servizi, shop
- [x] PaymentSuccess.tsx - Pagina di conferma pagamento
- [x] Orders.tsx - Storico ordini utente
- [x] PrivacyPolicy.tsx - Pagina Privacy Policy
- [x] Terms.tsx - Pagina Termini di Servizio
- [x] Events.tsx - Sezione eventi/appuntamenti
- [x] ComponentShowcase.tsx - Showcase componenti

## Funzionalità Stripe
- [x] Integrare Stripe Checkout nel shop
- [x] Configurare webhook /api/stripe/webhook
- [x] Registrare ordini nel database TiDB
- [x] Testare flusso pagamento end-to-end

## Database e Autenticazione
- [x] Verificare schema users e orders su TiDB
- [x] Configurare Manus OAuth
- [x] Testare login/logout
- [x] Verificare protezione pagine autenticate

## Stile e Design
- [x] Configurare palette Swiss Minimalism (navy/crema/oro)
- [x] Implementare tipografia serif + sans-serif
- [x] Layout asimmetrico ed elegante
- [x] Hover effects e card reveals
- [x] Polaroid-style photo frames

## Multi-lingua
- [x] Implementare supporto IT, EN, FR, DE
- [x] Configurare language switcher
- [x] Tradurre contenuti principali

## Configurazione Finale
- [x] Verificare variabili d'ambiente (DATABASE_URL, STRIPE_*)
- [x] Testare build locale
- [x] Salvare checkpoint
- [x] Configurare visibilità pubblica
- [x] Pubblicare sito
