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
- [ ] Integrare Stripe Checkout nel shop
- [ ] Configurare webhook /api/stripe/webhook
- [ ] Registrare ordini nel database TiDB
- [ ] Testare flusso pagamento end-to-end

## Database e Autenticazione
- [ ] Verificare schema users e orders su TiDB
- [ ] Configurare Manus OAuth
- [ ] Testare login/logout
- [ ] Verificare protezione pagine autenticate

## Stile e Design
- [ ] Configurare palette Swiss Minimalism (navy/crema/oro)
- [ ] Implementare tipografia serif + sans-serif
- [ ] Layout asimmetrico ed elegante
- [ ] Hover effects e card reveals
- [ ] Polaroid-style photo frames

## Multi-lingua
- [ ] Implementare supporto IT, EN, FR, DE
- [ ] Configurare language switcher
- [ ] Tradurre contenuti principali

## Configurazione Finale
- [ ] Verificare variabili d'ambiente (DATABASE_URL, STRIPE_*)
- [ ] Testare build locale
- [ ] Salvare checkpoint
- [ ] Configurare visibilità pubblica
- [ ] Pubblicare sito
