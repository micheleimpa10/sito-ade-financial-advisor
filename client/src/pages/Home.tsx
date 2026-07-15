/**
 * Adelaide Manta Financial Advisory - Main Landing Page
 * Design: Swiss Minimalism meets Editorial Luxury
 * Colors: Navy (#1a2744) + Warm Cream (#f8f5f0) + Gold (#c9a84c)
 * Typography: Playfair Display (serif headings) + DM Sans (body)
 * 
 * LANGUAGE BUG FIXES:
 * - EN: Fixed testimonials title and content (was in Italian)
 * - IT: Fixed testimonials title (was mixed IT/ES), fixed about bio (had Spanish phrases)
 * - IT: Fixed shop subtitle (was in English), fixed testimonials (mixed languages)
 * - FR: Fixed booking section (was in Spanish), fixed footer (was in German)
 * - FR: Fixed about bio (mixed Spanish/French), fixed services (had Spanish text)
 * - DE: Added complete German translations (was missing, only ES existed)
 * - All: Fixed character encoding issues (Ã©, Ã¨ etc → proper UTF-8)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart, type Lang } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  ShieldCheck,
  HeartPulse,
  TrendingUp,
  Home,
  PiggyBank,
  Briefcase,
  Menu,
  X,
  Instagram,
  ChevronDown,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  Package,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  Quote,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ─── TRANSLATIONS (all bugs fixed) ────────────────────────────────────────────
const translations = {
  en: {
    nav: {
      about: "ABOUT",
      services: "SERVICES",
      plans: "PLANS",
      shop: "SHOP",
      events: "EVENTS",
      cta: "BOOK A FREE CONSULTATION",
    },
    hero: {
      title: "Your Financial Future, Tailored in Switzerland",
      subtitle:
        "Expert guidance for private individuals and corporate solutions. Navigating the Swiss financial landscape with clarity and confidence.",
      cta: "BOOK A FREE CONSULTATION",
    },
    about: {
      title: "Meet Adelaide Manta",
      bio: "I am a dedicated financial advisor with a clear mission: to help individuals and businesses take control of their financial future. I believe that true financial freedom begins with awareness and intelligent management of your resources. After thorough training, I built my financial advisory practice from scratch, with one goal: to make financial advice accessible and effective for everyone by providing personalized solutions available in the Swiss market.",
      mission: "Together we can:",
      points: [
        "Manage your savings wisely",
        "Plan your investments strategically",
        "Analyze your insurance coverage",
        "Secure your financial future",
      ],
      closing:
        "Because one thing is certain: Everyone deserves a safe and confident financial future! Ready to take the first step? Let's build your financial future together.",
      stats: {
        clients: "300+",
        clientsLabel: "Clients",
        years: "2+",
        yearsLabel: "Years",
        languages: "3",
        languagesLabel: "Languages",
      },
      instagram: "@adelaide_manta",
    },
    services: {
      title: "Comprehensive Solutions",
      subtitle: "Tailored financial services for every stage of your life",
      health: {
        title: "Health Insurance",
        desc: "Optimized coverage for you and your family.",
      },
      personal: {
        title: "Personal Insurance",
        desc: "Protecting what matters most in life.",
      },
      financial: {
        title: "Financial Investments",
        desc: "Strategic wealth management and growth.",
      },
      realestate: {
        title: "Real Estate",
        desc: "Investing in the Swiss property market.",
      },
      pension: {
        title: "Pension Planning",
        desc: "Third pillar 3a and 3b with different partners.",
      },
      corporate: {
        title: "Corporate Solutions",
        desc: "Tailored advice for Swiss businesses.",
      },
      learnMore: "Learn more",
    },
    plans: {
      title: "Choose Your Plan",
      subtitle: "The first consultation is always free to build trust and understanding your goals",
      free: {
        name: "Basic Plan",
        price: "Free",
        desc: "",
        features: [
          "Free initial consultation with full explanation of my services",
          "Optimization of your insurance coverages",
          "Access to different investment opportunities",
          "Focus on client's requests and needs, no full personal financial analysis",
        ],
        cta: "Book a Free Consultation",
      },
      premium: {
        name: "Premium Plan",
        price: "CHF 295",
        desc: "one-time fee",
        features: [
          "Everything included in basic plan",
          "Tailored financial plan based on your personal situation",
          "Insurance optimization with personalised options",
          "Pension planning (1st, 2nd and 3rd pillars)",
          "Investment strategy & tax efficiency",
          "Physical binder and app to keep everything under control",
        ],
        cta: "Get Premium Plan",
        badge: "Recommended",
      },
    },
    booking: {
      title: "Ready to Start?",
      subtitle:
        "Choose a time that works for you. Available in-office, at your preferred location, or online.",
      calendlyTitle: "Prefer Calendly?",
      calendlySubtitle:
        "Book directly into my calendar for an instant confirmation.",
      whatsappTitle: "WhatsApp",
      whatsappSubtitle: "Direct message for quick contact",
      whatsappCta: "CONTACT",
    },
    shop: {
      title: "Digital Resources",
      subtitle: "Digital tools and expert guides to manage your finances and settle in Switzerland with confidence.",
      buyNow: "Buy Now",
      addToCart: "Add to Cart",
      cartTitle: "Your Cart",
      cartEmpty: "Your cart is empty.",
      cartTotal: "Total",
      checkout: "Proceed to Checkout",
      bundleTitle: "Bundle & Save",
      bundleDesc: "Add all guides together and save 20% automatically.",
      bundleCta: "Get the Full Bundle",
      bundleSave: "Save 20%",
      upsellTitle: "Complete Your Collection",
      upsellDesc: "Since you added a guide, get your next one at 15% off.",
      upsellCta: "Add at 15% off",
      upsellDecline: "No thanks",
      inCart: "In Cart",
      remove: "Remove",
      new: "NEW",
    },
    testimonials: {
      title: "What My Clients Say",
      items: [
        {
          quote:
            "Adelaide's guidance was a turning point for our family's financial security. She explains complex Swiss regulations with so much patience and clarity.",
          author: "Sarah & David W.",
          role: "Private Clients",
        },
        {
          quote:
            "I've worked with many advisors, but Adelaide's personal touch and deep market knowledge are unmatched. She truly listens to your goals.",
          author: "Luca B.",
          role: "Entrepreneur",
        },
        {
          quote:
            "Navigating the 3rd pillar and health insurance felt overwhelming until I met Adelaide. She made the process seamless and optimized everything.",
          author: "Marie L.",
          role: "Expat in Zurich",
        },
        {
          quote:
            "Trust is everything in finance. Adelaide has earned ours through consistent, honest, and highly effective investment strategies.",
          author: "Robert K.",
          role: "Investor",
        },
        {
          quote:
            "Her corporate solutions helped my startup find the right insurance and pension balance. A true partner in our growth journey.",
          author: "Alessandro M.",
          role: "CEO, Tech Startup",
        },
        {
          quote:
            "Adelaide went above and beyond. She didn't just fix my finances; she helped me understand the Swiss job market and even gave me tips on finding my first apartment in Lugano.",
          author: "Elena S.",
          role: "Expat from Spain",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "How do I schedule a consultation with you?",
          a: "You can book directly through the form below, selecting your preferred meeting type (in-office, on-site, or online) and date/time. I'll confirm your appointment shortly after submission.",
        },
        {
          q: "Do you work with expats and international clients?",
          a: "Yes, I specialize in supporting expats in Switzerland. I help with insurance optimization, pension planning (Third pillar 3a and 3b), investments, and also provide guidance on navigating the Swiss job market and lifestyle.",
        },
        {
          q: "What areas of Switzerland do you serve?",
          a: "I'm based in Zurich city and regularly serve clients in Zurich canton, Basel, Lugano and across Switzerland. Consultations can be held in-office, at your preferred location, or online.",
        },
        {
          q: "What languages do you speak?",
          a: "I'm a native Italian-French speaker and I'm fluent in English, making it easy to communicate in your preferred language.",
        },
        {
          q: "How much does a consultation cost?",
          a: "The first consultation is completely free, as are my basic financial services. For a comprehensive 360-degree financial analysis (CHF 295 one-time fee), I create a deeply personalized plan based on your complete profile. No additional fees are applied to clients.",
        },
        {
          q: "Can you help with health insurance selection?",
          a: "Absolutely! I help clients find optimal health insurance coverage, including basic and complementary insurance options tailored to your specific situation and budget.",
        },
        {
          q: "Do you provide ongoing financial management?",
          a: "Yes, I offer both one-time consultations and ongoing advisory relationships. Many clients appreciate regular check-ins to review and optimize their financial strategy.",
        },
      ],
    },
    footer: {
      contact: "Contact Details",
      legal: "© 2026 Adelaide Manta. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
  },

  // ─── ITALIAN (IT) ────────────────────────────────────────────────────────────
  it: {
    nav: {
      about: "CHI SONO",
      services: "SERVIZI",
      plans: "PIANI",
      shop: "NEGOZIO",
      events: "EVENTI",
      cta: "PRENOTA UNA CONSULENZA GRATUITA",
    },
    hero: {
      title: "Il Tuo Futuro Finanziario, Su Misura in Svizzera",
      subtitle:
        "Guida esperta per privati e soluzioni aziendali. Navigare nel panorama finanziario svizzero con chiarezza e fiducia.",
      cta: "PRENOTA UNA CONSULENZA GRATUITA",
    },
    about: {
      title: "Conosci Adelaide Manta",
      bio: "Sono una consulente finanziaria dedicata con una missione chiara: aiutare privati e aziende a prendere il controllo del loro futuro finanziario. Credo che la vera libertà finanziaria inizi con la consapevolezza e una gestione intelligente delle tue risorse. Dopo una formazione approfondita, ho costruito la mia pratica di consulenza finanziaria da zero, con un obiettivo: rendere la consulenza finanziaria accessibile ed efficace per tutti fornendo soluzioni personalizzate disponibili nel mercato svizzero.",
      mission: "Insieme possiamo:",
      points: [
        "Gestire i tuoi risparmi saggiamente",
        "Pianificare i tuoi investimenti strategicamente",
        "Analizzare la tua copertura assicurativa",
        "Garantire il tuo futuro finanziario",
      ],
      closing:
        "Perché una cosa è certa: Ognuno merita un futuro finanziario sicuro e sereno! Pronto a fare il primo passo? Costruiamo insieme il tuo futuro finanziario.",
      stats: {
        clients: "300+",
        clientsLabel: "Clienti",
        years: "2+",
        yearsLabel: "Anni",
        languages: "3",
        languagesLabel: "Lingue",
      },
      instagram: "@adelaide_manta",
    },
    services: {
      title: "Soluzioni Complete",
      subtitle: "Servizi finanziari su misura per ogni fase della tua vita",
      health: {
        title: "Assicurazione Sanitaria",
        desc: "Copertura ottimizzata per te e la tua famiglia.",
      },
      personal: {
        title: "Assicurazioni Personali",
        desc: "Proteggere ciò che conta di più nella vita.",
      },
      financial: {
        title: "Investimenti Finanziari",
        desc: "Gestione strategica del patrimonio e crescita.",
      },
      realestate: {
        title: "Investimenti Immobiliari",
        desc: "Investire nel mercato immobiliare svizzero.",
      },
      pension: {
        title: "Previdenza",
        desc: "Soluzioni Pilastro 3a e 3b con diversi partner.",
      },
      corporate: {
        title: "Soluzioni Aziendali",
        desc: "Consulenza su misura per le imprese svizzere.",
      },
      learnMore: "Scopri di più",
    },
    plans: {
      title: "Scegli il Tuo Piano",
      subtitle: "La prima consulenza è sempre gratuita per costruire fiducia e comprendere i tuoi obiettivi",
      free: {
        name: "Piano Base",
        price: "Gratuito",
        desc: "",
        features: [
          "Consulenza iniziale gratuita con spiegazione completa dei miei servizi",
          "Ottimizzazione delle coperture assicurative",
          "Accesso a diverse opportunità di investimento",
          "Focus sulle richieste e necessità del cliente, senza analisi finanziaria personale completa",
        ],
        cta: "Prenota una Consulenza Gratuita",
      },
      premium: {
        name: "Piano Premium",
        price: "CHF 295",
        desc: "tariffa una tantum",
        features: [
          "Tutto incluso nel piano base",
          "Piano finanziario su misura basato sulla tua situazione personale",
          "Ottimizzazione assicurativa con opzioni personalizzate",
          "Pianificazione pensionistica (1°, 2° e 3° pilastro)",
          "Strategia di investimento ed efficienza fiscale",
          "Raccoglitore fisico e app per tenere tutto sotto controllo",
        ],
        cta: "Ottieni Piano Premium",
        badge: "Consigliato",
      },
    },
    booking: {
      title: "Pronto per Iniziare?",
      subtitle:
        "Scegli l'orario che preferisci. Disponibile in ufficio, presso la tua sede o online.",
      calendlyTitle: "Preferisci Calendly?",
      calendlySubtitle:
        "Prenota direttamente nel mio calendario per una conferma istantanea.",
      whatsappTitle: "WhatsApp",
      whatsappSubtitle: "Messaggio diretto per un contatto rapido",
      whatsappCta: "CONTATTA",
    },
    shop: {
      title: "Risorse Digitali",
      subtitle: "Strumenti digitali e guide esperte per gestire le tue finanze e vivere in Svizzera con fiducia.",
      buyNow: "Acquista",
      addToCart: "Aggiungi al carrello",
      cartTitle: "Il tuo carrello",
      cartEmpty: "Il carrello è vuoto.",
      cartTotal: "Totale",
      checkout: "Procedi al pagamento",
      bundleTitle: "Bundle & Risparmia",
      bundleDesc: "Aggiungi tutte le guide insieme e risparmia automaticamente il 20%.",
      bundleCta: "Ottieni il bundle completo",
      bundleSave: "Risparmia il 20%",
      upsellTitle: "Completa la tua collezione",
      upsellDesc: "Hai aggiunto una guida — ottieni la prossima con il 15% di sconto.",
      upsellCta: "Aggiungi con il 15% di sconto",
      upsellDecline: "No grazie",
      inCart: "Nel carrello",
      remove: "Rimuovi",
      new: "NUOVO",
    },
    testimonials: {
      title: "Cosa Dicono i Miei Clienti",
      items: [
        {
          quote:
            "La guida di Adelaide è stata un punto di svolta per la sicurezza finanziaria della nostra famiglia. Spiega le complesse normative svizzere con tanta pazienza e chiarezza.",
          author: "Sarah & David W.",
          role: "Clienti Privati",
        },
        {
          quote:
            "Ho lavorato con molti consulenti, ma il tocco personale di Adelaide e la sua profonda conoscenza del mercato sono incomparabili. Ascolta veramente i tuoi obiettivi.",
          author: "Luca B.",
          role: "Imprenditore",
        },
        {
          quote:
            "Navigare nel terzo pilastro e nell'assicurazione sanitaria mi sembrava travolgente finché non ho incontrato Adelaide. Ha reso il processo senza intoppi e ha ottimizzato tutto.",
          author: "Marie L.",
          role: "Espatriata a Zurigo",
        },
        {
          quote:
            "La fiducia è tutto nella finanza. Adelaide se l'è guadagnata attraverso strategie di investimento coerenti, oneste e altamente efficaci.",
          author: "Robert K.",
          role: "Investitore",
        },
        {
          quote:
            "Le sue soluzioni aziendali hanno aiutato la mia startup a trovare il giusto equilibrio tra assicurazioni e pensioni. Un vero partner nel nostro percorso di crescita.",
          author: "Alessandro M.",
          role: "CEO, Tech Startup",
        },
        {
          quote:
            "Adelaide ha fatto più del previsto. Non solo ha sistemato le mie finanze; mi ha aiutato a capire il mercato del lavoro svizzero e mi ha dato consigli per trovare il mio primo appartamento a Lugano.",
          author: "Elena S.",
          role: "Espatriata dalla Spagna",
        },
      ],
    },
    faq: {
      title: "Domande Frequenti",
      items: [
        {
          q: "Come posso prenotare una consulenza con Adelaide?",
          a: "Puoi prenotare direttamente tramite il modulo qui sotto, selezionando il tipo di riunione preferito (in ufficio, in loco o online) e la data/ora. Confermo il tuo appuntamento poco dopo l'invio.",
        },
        {
          q: "Lavori con espatriati e clienti internazionali?",
          a: "Sì, mi specializzo nel supporto agli espatriati in Svizzera. Ti aiuto con l'ottimizzazione assicurativa, la pianificazione previdenziale (Pilastro 3a e 3b), gli investimenti e fornisco anche indicazioni su come navigare il mercato del lavoro svizzero e lo stile di vita.",
        },
        {
          q: "Quali aree della Svizzera servi?",
          a: "Sono basata a Zurigo e servo regolarmente clienti a Zurigo, Basilea, Lugano e in tutta la Svizzera. Le consultazioni possono essere tenute in ufficio, nel luogo da te preferito, o online.",
        },
        {
          q: "Quali lingue parli?",
          a: "Sono madrelingua italiano-francese e sono fluente in inglese, il che facilita la comunicazione nella tua lingua preferita.",
        },
        {
          q: "Quanto costa una consulenza?",
          a: "La prima consulenza è completamente gratuita, così come i miei servizi finanziari di base. Per un'analisi finanziaria completa a 360 gradi (tariffa una tantum di CHF 295), creo un piano profondamente personalizzato basato sul tuo profilo completo. Nessun costo aggiuntivo applicato ai clienti.",
        },
        {
          q: "Puoi aiutarmi a scegliere un'assicurazione sanitaria?",
          a: "Assolutamente! Ti aiuto a trovare una copertura assicurativa sanitaria ottimale, incluse opzioni di assicurazione di base e complementare personalizzate in base alla tua situazione specifica e al tuo budget.",
        },
        {
          q: "Offri una gestione finanziaria continuativa?",
          a: "Sì, offro sia consultazioni una tantum che relazioni di consulenza continue. Molti clienti apprezzano i controlli regolari per rivedere e ottimizzare la loro strategia finanziaria.",
        },
      ],
    },
    footer: {
      contact: "Dati di Contatto",
      legal: "© 2026 Adelaide Manta. Tutti i diritti riservati.",
      privacyPolicy: "Informativa sulla Privacy",
      termsOfService: "Termini di Servizio",
    },
  },

  // ─── FRENCH (FR) ─────────────────────────────────────────────────────────────
  fr: {
    nav: {
      about: "À PROPOS",
      services: "SERVICES",
      plans: "PLANS",
      shop: "BOUTIQUE",
      events: "ÉVÉNEMENTS",
      cta: "RÉSERVER UNE CONSULTATION GRATUITE",
    },
    hero: {
      title: "Votre Avenir Financier, Sur Mesure en Suisse",
      subtitle:
        "Conseils d'experts pour les particuliers et solutions d'entreprise. Naviguer dans le paysage financier suisse avec clarté et confiance.",
      cta: "RÉSERVER UNE CONSULTATION GRATUITE",
    },
    about: {
      title: "Rencontrez Adelaide Manta",
      bio: "Je suis une conseillère financière dévouée avec une mission claire : aider les particuliers et les entreprises à prendre le contrôle de leur avenir financier. Je crois que la véritable liberté financière commence par la conscience et une gestion intelligente de vos ressources. Après une formation approfondie, j'ai construit ma pratique de conseil financier à partir de zéro, avec un objectif : rendre les conseils financiers accessibles et efficaces pour tous en fournissant des solutions personnalisées disponibles sur le marché suisse.",
      mission: "Ensemble, nous pouvons :",
      points: [
        "Gérer vos épargnes judicieusement",
        "Planifier vos investissements stratégiquement",
        "Analyser votre couverture d'assurance",
        "Assurer votre avenir financier",
      ],
      closing:
        "Parce qu'une chose est certaine : Tous méritent un avenir financier sûr et confiant ! Prêt à faire le premier pas ? Construisons ensemble votre avenir financier.",
      stats: {
        clients: "300+",
        clientsLabel: "Clients",
        years: "2+",
        yearsLabel: "Ans",
        languages: "3",
        languagesLabel: "Langues",
      },
      instagram: "@adelaide_manta",
    },
    services: {
      title: "Solutions Complètes",
      subtitle: "Services financiers sur mesure pour chaque étape de votre vie",
      health: {
        title: "Assurance Maladie",
        desc: "Couverture optimisée pour vous et votre famille.",
      },
      personal: {
        title: "Assurances Personnelles",
        desc: "Protéger ce qui compte le plus dans la vie.",
      },
      financial: {
        title: "Investissements Financiers",
        desc: "Gestion stratégique du patrimoine et croissance.",
      },
      realestate: {
        title: "Immobilier",
        desc: "Investir dans le marché immobilier suisse.",
      },
      pension: {
        title: "Prévoyance",
        desc: "Solutions Pilier 3a et 3b avec différents partenaires.",
      },
      corporate: {
        title: "Solutions d'Entreprise",
        desc: "Conseils personnalisés pour les entreprises suisses.",
      },
      learnMore: "En savoir plus",
    },
    plans: {
      title: "Choisissez Votre Plan",
      subtitle: "La première consultation est toujours gratuite pour établir la confiance et comprendre vos objectifs",
      free: {
        name: "Plan de Base",
        price: "Gratuit",
        desc: "",
        features: [
          "Consultation initiale gratuite avec explication complète de mes services",
          "Optimisation de vos couvertures d'assurance",
          "Accès à différentes opportunités d'investissement",
          "Focus sur les demandes et besoins du client, sans analyse financière personnelle complète",
        ],
        cta: "Réserver une Consultation Gratuite",
      },
      premium: {
        name: "Plan Premium",
        price: "CHF 295",
        desc: "frais uniques",
        features: [
          "Tout ce qui est inclus dans le plan de base",
          "Plan financier personnalisé basé sur votre situation personnelle",
          "Optimisation des assurances avec des options personnalisées",
          "Planification de la retraite (1er, 2e et 3e piliers)",
          "Stratégie d'investissement et efficacité fiscale",
          "Classeur physique et application pour tout garder sous contrôle",
        ],
        cta: "Obtenir le Plan Premium",
        badge: "Recommandé",
      },
    },
    booking: {
      title: "Prêt à Commencer ?",
      subtitle:
        "Choisissez un horaire qui vous convient. Disponible au bureau, à votre lieu préféré ou en ligne.",
      calendlyTitle: "Vous Préférez Calendly ?",
      calendlySubtitle:
        "Réservez directement dans mon calendrier pour une confirmation instantanée.",
      whatsappTitle: "WhatsApp",
      whatsappSubtitle: "Message direct pour un contact rapide",
      whatsappCta: "CONTACTER",
    },
    shop: {
      title: "Ressources Numériques",
      subtitle: "Outils numériques et guides experts pour gérer vos finances et vous installer en Suisse avec confiance.",
      buyNow: "Acheter",
      addToCart: "Ajouter au panier",
      cartTitle: "Votre panier",
      cartEmpty: "Votre panier est vide.",
      cartTotal: "Total",
      checkout: "Passer à la caisse",
      bundleTitle: "Bundle & Économisez",
      bundleDesc: "Ajoutez tous les guides ensemble et économisez 20% automatiquement.",
      bundleCta: "Obtenir le bundle complet",
      bundleSave: "Économisez 20%",
      upsellTitle: "Complétez votre collection",
      upsellDesc: "Vous avez ajouté un guide — obtenez le suivant à 15% de réduction.",
      upsellCta: "Ajouter à 15% de réduction",
      upsellDecline: "Non merci",
      inCart: "Dans le panier",
      remove: "Supprimer",
      new: "NOUVEAU",
    },
    testimonials: {
      title: "Ce Que Disent Mes Clients",
      items: [
        {
          quote:
            "Les conseils d'Adelaide ont été un tournant pour la sécurité financière de notre famille. Elle explique les réglementations suisses complexes avec tant de patience et de clarté.",
          author: "Sarah & David W.",
          role: "Clients Privés",
        },
        {
          quote:
            "J'ai travaillé avec de nombreux conseillers, mais la touche personnelle d'Adelaide et sa profonde connaissance du marché sont incomparables. Elle écoute vraiment vos objectifs.",
          author: "Luca B.",
          role: "Entrepreneur",
        },
        {
          quote:
            "Naviguer dans le 3e pilier et l'assurance maladie semblait accablant jusqu'à ce que je rencontre Adelaide. Elle a rendu le processus transparent et a tout optimisé.",
          author: "Marie L.",
          role: "Expatriée à Zurich",
        },
        {
          quote:
            "La confiance est tout en finance. Adelaide l'a gagnée grâce à des stratégies d'investissement cohérentes, honnêtes et hautement efficaces.",
          author: "Robert K.",
          role: "Investisseur",
        },
        {
          quote:
            "Ses solutions d'entreprise ont aidé ma startup à trouver le bon équilibre entre assurances et retraite. Un vrai partenaire dans notre parcours de croissance.",
          author: "Alessandro M.",
          role: "PDG, Startup Tech",
        },
        {
          quote:
            "Adelaide a fait plus que prévu. Non seulement elle a arrangé mes finances ; elle m'a aidé à comprendre le marché du travail suisse et m'a même donné des conseils pour trouver mon premier appartement à Lugano.",
          author: "Elena S.",
          role: "Expatriée d'Espagne",
        },
      ],
    },
    faq: {
      title: "Questions Fréquemment Posées",
      items: [
        {
          q: "Comment puis-je programmer une consultation avec Adelaide ?",
          a: "Vous pouvez réserver directement via le formulaire ci-dessous, en sélectionnant votre type de réunion préféré (au bureau, sur place ou en ligne) et la date/heure. Je confirmerai votre rendez-vous peu après la soumission.",
        },
        {
          q: "Travaillez-vous avec des expatriés et des clients internationaux ?",
          a: "Oui, je me spécialise dans le soutien aux expatriés en Suisse. Je vous aide à optimiser les assurances, à planifier la retraite (pilier 3a et 3b), les investissements et je fournis également des conseils pour naviguer le marché du travail suisse et le mode de vie.",
        },
        {
          q: "Quelles régions de Suisse servez-vous ?",
          a: "Je suis basée à Zurich et je sers régulièrement des clients à Zurich, Bâle, Lugano et dans toute la Suisse. Les consultations peuvent se tenir au bureau, à votre lieu préféré ou en ligne.",
        },
        {
          q: "Quelles langues parlez-vous ?",
          a: "Je suis italo-francophone de naissance et je suis couramment anglais, ce qui facilite la communication dans votre langue préférée.",
        },
        {
          q: "Combien coûte une consultation ?",
          a: "L'appel découverte initial est complètement gratuit, tout comme mes services financiers de base. Pour une analyse financière complète à 360 degrés (tarif unique de CHF 295), je crée un plan profondément personnalisé basé sur votre profil complet. Aucun frais supplémentaire appliqué aux clients.",
        },
        {
          q: "Pouvez-vous m'aider à choisir une assurance maladie ?",
          a: "Absolument ! Je vous aide à trouver une couverture d'assurance maladie optimale, y compris des options d'assurance de base et complémentaire personnalisées selon votre situation spécifique et votre budget.",
        },
        {
          q: "Offrez-vous une gestion financière continue ?",
          a: "Oui, j'offre à la fois des consultations ponctuelles et des relations de conseil continu. De nombreux clients apprécient les révisions régulières pour examiner et optimiser leur stratégie financière.",
        },
      ],
    },
    footer: {
      contact: "Coordonnées",
      legal: "© 2026 Adelaide Manta. Tous droits réservés.",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
    },
  },

  // ─── GERMAN (DE) ─────────────────────────────────────────────────────────────
  de: {
    nav: {
      about: "ÜBER MICH",
      services: "LEISTUNGEN",
      plans: "PLÄNE",
      shop: "SHOP",
      events: "VERANSTALTUNGEN",
      cta: "KOSTENLOSE BERATUNG BUCHEN",
    },
    hero: {
      title: "Ihre Finanzielle Zukunft, Massgeschneidert in der Schweiz",
      subtitle:
        "Expertenberatung für Privatpersonen und Unternehmenslösungen. Navigieren Sie die Schweizer Finanzlandschaft mit Klarheit und Vertrauen.",
      cta: "KOSTENLOSE BERATUNG BUCHEN",
    },
    about: {
      title: "Lernen Sie Adelaide Manta Kennen",
      bio: "Ich bin eine engagierte Finanzberaterin mit einer klaren Mission: Privatpersonen und Unternehmen dabei zu helfen, die Kontrolle über ihre finanzielle Zukunft zu übernehmen. Ich glaube, dass echte finanzielle Freiheit mit Bewusstsein und intelligenter Verwaltung Ihrer Ressourcen beginnt. Nach gründlicher Ausbildung habe ich meine Finanzberatungspraxis von Grund auf aufgebaut, mit einem Ziel: Finanzberatung für alle zugänglich und effektiv zu machen, indem ich personalisierte Lösungen auf dem Schweizer Markt anbiete.",
      mission: "Zusammen können wir:",
      points: [
        "Ihre Ersparnisse weise verwalten",
        "Ihre Investitionen strategisch planen",
        "Ihre Versicherungsabdeckung analysieren",
        "Ihre finanzielle Zukunft sichern",
      ],
      closing:
        "Denn eines ist sicher: Jeder verdient eine sichere und selbstbewusste finanzielle Zukunft! Bereit, den ersten Schritt zu machen? Lassen Sie uns gemeinsam Ihre finanzielle Zukunft aufbauen.",
      stats: {
        clients: "300+",
        clientsLabel: "Kunden",
        years: "2+",
        yearsLabel: "Jahre",
        languages: "3",
        languagesLabel: "Sprachen",
      },
      instagram: "@adelaide_manta",
    },
    services: {
      title: "Umfassende Lösungen",
      subtitle:
        "Massgeschneiderte Finanzdienstleistungen für jede Lebensphase",
      health: {
        title: "Krankenversicherung",
        desc: "Optimierter Versicherungsschutz für Sie und Ihre Familie.",
      },
      personal: {
        title: "Privatversicherungen",
        desc: "Schutz für das, was im Leben am wichtigsten ist.",
      },
      financial: {
        title: "Finanzinvestitionen",
        desc: "Strategisches Vermögensmanagement und Wachstum.",
      },
      realestate: {
        title: "Immobilien",
        desc: "Investieren in den Schweizer Immobilienmarkt.",
      },
      pension: {
        title: "Altersvorsorge",
        desc: "Säule 3a und 3b Lösungen mit verschiedenen Partnern.",
      },
      corporate: {
        title: "Unternehmenslösungen",
        desc: "Massgeschneiderte Beratung für Schweizer Unternehmen.",
      },
      learnMore: "Mehr erfahren",
    },
    plans: {
      title: "Wählen Sie Ihren Plan",
      subtitle: "Die erste Beratung ist immer kostenlos, um Vertrauen aufzubauen und Ihre Ziele zu verstehen",
      free: {
        name: "Basisplan",
        price: "Kostenlos",
        desc: "",
        features: [
          "Kostenlose Erstberatung mit vollständiger Erklärung meiner Dienstleistungen",
          "Optimierung Ihrer Versicherungsdeckungen",
          "Zugang zu verschiedenen Anlagemöglichkeiten",
          "Fokus auf Kundenwünsche und -bedürfnisse, keine vollständige persönliche Finanzanalyse",
        ],
        cta: "Kostenlose Beratung Buchen",
      },
      premium: {
        name: "Premium Plan",
        price: "CHF 295",
        desc: "einmalige Gebühr",
        features: [
          "Alles im Basisplan enthalten",
          "Massgeschneiderter Finanzplan basierend auf Ihrer persönlichen Situation",
          "Versicherungsoptimierung mit personalisierten Optionen",
          "Rentenplanung (1., 2. und 3. Säule)",
          "Anlagestrategie und Steuereffizienz",
          "Physischer Ordner und App, um alles unter Kontrolle zu behalten",
        ],
        cta: "Premium Plan Erhalten",
        badge: "Empfohlen",
      },
    },
    booking: {
      title: "Bereit Anzufangen?",
      subtitle:
        "Wählen Sie einen Termin, der Ihnen passt. Verfügbar im Büro, an Ihrem bevorzugten Standort oder online.",
      calendlyTitle: "Bevorzugen Sie Calendly?",
      calendlySubtitle:
        "Buchen Sie direkt in meinen Kalender für eine sofortige Bestätigung.",
      whatsappTitle: "WhatsApp",
      whatsappSubtitle: "Direktnachricht für schnellen Kontakt",
      whatsappCta: "KONTAKT",
    },
    shop: {
      title: "Digitale Ressourcen",
      subtitle: "Digitale Tools und Expertenratgeber für Ihre Finanzen und einen gelungenen Start in der Schweiz.",
      buyNow: "Jetzt Kaufen",
      addToCart: "In den Warenkorb",
      cartTitle: "Ihr Warenkorb",
      cartEmpty: "Ihr Warenkorb ist leer.",
      cartTotal: "Gesamt",
      checkout: "Zur Kasse",
      bundleTitle: "Bundle & Sparen",
      bundleDesc: "Fügen Sie alle Ratgeber zusammen hinzu und sparen Sie automatisch 20%.",
      bundleCta: "Vollständiges Bundle erhalten",
      bundleSave: "20% sparen",
      upsellTitle: "Vervollständigen Sie Ihre Sammlung",
      upsellDesc: "Sie haben einen Ratgeber hinzugefügt — erhalten Sie den nächsten mit 15% Rabatt.",
      upsellCta: "Mit 15% Rabatt hinzufügen",
      upsellDecline: "Nein danke",
      inCart: "Im Warenkorb",
      remove: "Entfernen",
      new: "NEU",
    },
    testimonials: {
      title: "Was Meine Kunden Sagen",
      items: [
        {
          quote:
            "Adelaides Beratung war ein Wendepunkt für die finanzielle Sicherheit unserer Familie. Sie erklärt die komplexen Schweizer Vorschriften mit so viel Geduld und Klarheit.",
          author: "Sarah & David W.",
          role: "Privatkunden",
        },
        {
          quote:
            "Ich habe mit vielen Beratern zusammengearbeitet, aber Adelaides persönliche Note und ihr tiefes Marktwissen sind unvergleichlich. Sie hört wirklich auf Ihre Ziele.",
          author: "Luca B.",
          role: "Unternehmer",
        },
        {
          quote:
            "Die 3. Säule und die Krankenversicherung zu navigieren schien überwältigend, bis ich Adelaide traf. Sie machte den Prozess reibungslos und optimierte alles.",
          author: "Marie L.",
          role: "Expatriierte in Zürich",
        },
        {
          quote:
            "Vertrauen ist alles in der Finanzwelt. Adelaide hat es sich durch konsistente, ehrliche und hocheffektive Anlagestrategien verdient.",
          author: "Robert K.",
          role: "Investor",
        },
        {
          quote:
            "Ihre Unternehmenslösungen halfen meinem Startup, das richtige Gleichgewicht zwischen Versicherungen und Altersvorsorge zu finden. Ein echter Partner auf unserem Wachstumskurs.",
          author: "Alessandro M.",
          role: "CEO, Tech-Startup",
        },
        {
          quote:
            "Adelaide hat mehr getan als erwartet. Sie hat nicht nur meine Finanzen in Ordnung gebracht; sie hat mir geholfen, den Schweizer Arbeitsmarkt zu verstehen und mir sogar Tipps gegeben, wie ich meine erste Wohnung in Lugano finden kann.",
          author: "Elena S.",
          role: "Expatriierte aus Spanien",
        },
      ],
    },
    faq: {
      title: "Häufig Gestellte Fragen",
      items: [
        {
          q: "Wie kann ich eine Beratung mit Adelaide vereinbaren?",
          a: "Sie können direkt über das untenstehende Formular buchen, indem Sie Ihren bevorzugten Besprechungstyp (im Büro, vor Ort oder online) und Datum/Uhrzeit auswählen. Ich bestätige Ihren Termin kurz nach der Einreichung.",
        },
        {
          q: "Arbeiten Sie mit Expatriierten und internationalen Kunden?",
          a: "Ja, ich spezialisiere mich auf die Unterstützung von Expatriierten in der Schweiz. Ich helfe bei der Versicherungsoptimierung, Rentenplanung (3. Säule 3a und 3b), Investitionen und gebe auch Orientierungshilfe beim Navigieren des Schweizer Arbeitsmarkts und Lebensstils.",
        },
        {
          q: "Welche Regionen der Schweiz bedienen Sie?",
          a: "Ich bin in Zürich ansässig und betreue regelmässig Kunden in Zürich, Basel, Lugano und in der ganzen Schweiz. Beratungen können im Büro, an Ihrem bevorzugten Standort oder online stattfinden.",
        },
        {
          q: "Welche Sprachen sprechen Sie?",
          a: "Ich bin Muttersprachlerin in Italienisch und Französisch und spreche fliessend Englisch, was die Kommunikation in Ihrer bevorzugten Sprache erleichtert.",
        },
        {
          q: "Was kostet eine Beratung?",
          a: "Das erste Beratungsgespräch ist völlig kostenlos, ebenso wie meine grundlegenden Finanzdienstleistungen. Für eine umfassende 360-Grad-Finanzanalyse (einmalige Gebühr von CHF 295) erstelle ich einen tiefgreifend personalisierten Plan basierend auf Ihrem vollständigen Profil. Keine zusätzlichen Gebühren für Kunden.",
        },
        {
          q: "Können Sie bei der Auswahl einer Krankenversicherung helfen?",
          a: "Absolut! Ich helfe Kunden, optimalen Krankenversicherungsschutz zu finden, einschliesslich Grund- und Zusatzversicherungsoptionen, die auf Ihre spezifische Situation und Ihr Budget zugeschnitten sind.",
        },
        {
          q: "Bieten Sie laufendes Finanzmanagement an?",
          a: "Ja, ich biete sowohl Einmalberatungen als auch laufende Beratungsbeziehungen an. Viele Kunden schätzen regelmässige Check-ins, um ihre Finanzstrategie zu überprüfen und zu optimieren.",
        },
      ],
    },
    footer: {
      contact: "Kontaktdaten",
      legal: "© 2026 Adelaide Manta. Alle Rechte vorbehalten.",
      privacyPolicy: "Datenschutzrichtlinie",
      termsOfService: "Nutzungsbedingungen",
    },
  },
};

// ─── TYPES ─────────────────────────────────────────────────────────────────────
// ─── IMAGES ────────────────────────────────────────────────────────────────────
const HERO_BG = "/manus-storage/services-phone_5451249b.png";
const ABOUT_PORTRAIT = "/manus-storage/adelaide-card_0d905b7a.png";
const SERVICES_BG = "/manus-storage/consultation-cafe_26ad27a5.png";
const PHOTO_OUTDOOR_MEETING = "/manus-storage/photo-outdoor-meeting_1333fbfb.jpg";
const PHOTO_VIDEO_CALL = "/manus-storage/photo-video-call_b3d73909.jpg";
const PHOTO_CAFE_MEETING = "/manus-storage/photo-cafe-meeting_777984eb.jpg";
const PHOTO_PHONE_CALL = "/manus-storage/photo-phone-call_ad4e596b.jpg";
const PHOTO_ZURICH_TERRACE = "/manus-storage/photo-zurich-terrace_2c3e9ead.jpg";
const PHOTO_CITY_PHONE = "/manus-storage/photo-city-phone_6bb4d1a5.jpg";
const CONSULTATION_ALPS = "/manus-storage/consultation-alps_42619a86.png";
const PHOTO_SOFA_CONSULT = "/manus-storage/consultation-sofa_5d10909b.jpg";
const PHOTO_REDSOFA_CONSULT = "/manus-storage/consultation-redsofa_7d10391a.jpg";
const PHOTO_WORKING_DESK = "/manus-storage/working-desk_ebdc9f86.webp";
const ADELAIDE_CIRCLE = "/manus-storage/adelaide-circle_950fb421.png";

// ─── SERVICE ICONS ─────────────────────────────────────────────────────────────
const SERVICE_ICONS = [
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Home,
  PiggyBank,
  Briefcase,
];
const SERVICE_KEYS = [
  "health",
  "personal",
  "financial",
  "realestate",
  "pension",
  "corporate",
] as const;

// ─── HOOK: Scroll Reveal ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── COMPONENT: RevealDiv ──────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function HomePage() {
  const [lang, setLocalLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openProductFaq, setOpenProductFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // ─── AUTH & STRIPE ──────────────────────────────────────────────────────────
  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        toast.info(lang === "it" ? "Reindirizzamento al pagamento…" : lang === "fr" ? "Redirection vers le paiement…" : lang === "de" ? "Weiterleitung zur Zahlung…" : "Redirecting to checkout…");
        window.open(url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleBuyNow = useCallback((productKey: string) => {
    // No login required — Stripe collects the customer email at checkout
    // Pass the current UI language so the thank-you email is sent in the right language
    createCheckout.mutate({ productKey, origin: window.location.origin, language: lang });
  }, [createCheckout, lang]);

  // ─── CART ───────────────────────────────────────────────────────────────────
  const { addItem, isInCart, openCart, items: cartItems, setLang: setCartLang } = useCart();
  const totalItems = cartItems.length;

  // Keep CartContext lang in sync with local lang state
  // so CartDrawer can pass the right language to the cart checkout
  const setLang = useCallback((l: Lang) => {
    setLocalLang(l);
    setCartLang(l);
  }, [setCartLang]);

  // ─── SHOP PRODUCTS ─────────────────────────────────────────────────────────
  const SHOP_PRODUCTS = [
    {
      key: "moving-guide",
      price: "CHF 9.90",
      regularPrice: "CHF 14.90",
      badge: "NEW",
      cover: "/manus-storage/cover_01_moving_guide_e2310553.png",
      name: lang === "it" ? "Trasferirsi in Svizzera 2026 — Guida Completa"
        : lang === "fr" ? "S'installer en Suisse 2026 — Guide Complet"
        : lang === "de" ? "Umzug in die Schweiz 2026 — Vollständiger Ratgeber"
        : "Moving to Switzerland 2026 — Complete Guide",
      desc: lang === "it" ? "31 pagine scritte da una consulente finanziaria in Svizzera. Tutti i dati 2026 verificati da fonti ufficiali."
        : lang === "fr" ? "31 pages rédigées par une conseillère financière en Suisse. Toutes les données 2026 vérifiées."
        : lang === "de" ? "31 Seiten von einer Finanzberaterin in der Schweiz. Alle 2026-Daten aus offiziellen Quellen."
        : "31 pages by a financial advisor in Switzerland. All 2026 data verified from official sources.",
    },
    {
      key: "financial-agenda-couples",
      price: "CHF 17.90",
      regularPrice: "CHF 22.90",
      badge: null,
      cover: "/manus-storage/cover_02_agenda_couples_ac15af51.png",
      name: lang === "it" ? "Agenda Finanziaria 2026 — Coppia"
        : lang === "fr" ? "Agenda Financier 2026 — Couple"
        : lang === "de" ? "Finanzagenda 2026 — Paar"
        : "Financial Agenda 2026 — Couples",
      desc: lang === "it" ? "365 pagine interattive per coppie. Divisione spese flessibile, dashboard risparmi condivisa. Funziona nel browser, nessuna app."
        : lang === "fr" ? "365 pages interactives pour couples. Répartition flexible des dépenses, tableau de bord épargne commun."
        : lang === "de" ? "365 interaktive Seiten für Paare. Flexible Ausgabenteilung, gemeinsames Spar-Dashboard."
        : "365 interactive daily pages for couples. Flexible expense split, combined savings dashboard. Works in browser.",
    },
    {
      key: "financial-agenda-single",
      price: "CHF 12.90",
      regularPrice: "CHF 16.90",
      badge: null,
      cover: "/manus-storage/cover_03_agenda_single_e56a59cc.png",
      name: lang === "it" ? "Agenda Finanziaria 2026 — Single"
        : lang === "fr" ? "Agenda Financier 2026 — Célibataire"
        : lang === "de" ? "Finanzagenda 2026 — Einzelperson"
        : "Financial Agenda 2026 — Single",
      desc: lang === "it" ? "Il tuo pianificatore finanziario personale per il 2026. 365 pagine, obiettivi di risparmio, scadenze fiscali svizzere."
        : lang === "fr" ? "Votre planificateur financier personnel pour 2026. 365 pages, objectifs d'épargne, échéances fiscales suisses."
        : lang === "de" ? "Ihr persönlicher Finanzplaner für 2026. 365 Seiten, Sparziele, Schweizer Steuerfristen."
        : "Your personal financial planner for 2026. 365 pages, savings goals, Swiss tax deadlines.",
    },
    {
      key: "budget-manager-personal",
      price: "CHF 24.90",
      regularPrice: "CHF 29.90",
      badge: lang === "it" ? "PIÙ VENDUTO" : lang === "fr" ? "BEST-SELLER" : lang === "de" ? "BESTSELLER" : "BEST SELLER",
      cover: "/manus-storage/cover_04_budget_personal_e8c7a1ae.png",
      name: lang === "it" ? "BudgetManager Pro — Personale"
        : lang === "fr" ? "BudgetManager Pro — Personnel"
        : lang === "de" ? "BudgetManager Pro — Persönlich"
        : "BudgetManager Pro — Personal",
      desc: lang === "it" ? "L'unico budget planner costruito per la vita svizzera. Tutti i 26 cantoni, categorie Krankenkasse e Pilastro 3a, grafici interattivi."
        : lang === "fr" ? "Le seul planificateur budgétaire conçu pour la vie suisse. 26 cantons, catégories Krankenkasse et Pilier 3a."
        : lang === "de" ? "Der einzige Budgetplaner für das Schweizer Leben. Alle 26 Kantone, Krankenkasse- und Säule-3a-Kategorien."
        : "The only budget planner built for Swiss life. All 26 cantons, Krankenkasse & Pillar 3a categories, interactive charts.",
    },
    {
      key: "budget-manager-family",
      price: "CHF 34.90",
      regularPrice: "CHF 39.90",
      badge: null,
      cover: "/manus-storage/cover_05_budget_family_7bdf6a1b.png",
      name: lang === "it" ? "BudgetManager Pro — Famiglia"
        : lang === "fr" ? "BudgetManager Pro — Famille"
        : lang === "de" ? "BudgetManager Pro — Familie"
        : "BudgetManager Pro — Family",
      desc: lang === "it" ? "Pianificazione per famiglie e coppie svizzere. Fino a 4 profili, dashboard familiare, categorie Kita e scuola."
        : lang === "fr" ? "Planification pour familles et couples suisses. Jusqu'à 4 profils, tableau de bord familial, catégories Kita."
        : lang === "de" ? "Planung für Schweizer Familien und Paare. Bis zu 4 Profile, Familien-Dashboard, Kita-Kategorien."
        : "Budget planning for Swiss families & couples. Up to 4 profiles, household dashboard, Kita & school categories.",
    },
  ];

  const t = translations[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % t.testimonials.items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [t.testimonials.items.length]);

  const langLabels: Record<Lang, string> = {
    en: "EN",
    it: "IT",
    fr: "FR",
    de: "DE",
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── HEADER ──────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            className={`text-xl font-bold tracking-tight flex-shrink-0 transition-colors ${
              scrolled ? "text-[#1a2744]" : "text-white"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Adelaide Manta
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {(["about", "services", "plans", "shop"] as const).map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className={`text-xs font-semibold tracking-widest transition-colors hover:text-[#c9a84c] ${
                  scrolled ? "text-[#1a2744]" : "text-white/90"
                }`}
              >
                {t.nav[key]}
              </a>
            ))}
            <Link
              href="/events"
              className={`text-xs font-semibold tracking-widest transition-colors hover:text-[#c9a84c] ${
                scrolled ? "text-[#1a2744]" : "text-white/90"
              }`}
            >
              {t.nav.events}
            </Link>
          </nav>

          {/* Language + Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {(["en", "it", "fr", "de"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-bold uppercase transition-all px-1 py-0.5 rounded ${
                  lang === l
                    ? "text-[#c9a84c] border-b border-[#c9a84c]"
                    : scrolled
                    ? "text-[#1a2744]/50 hover:text-[#1a2744]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
            <a
              href="https://www.instagram.com/adelaide_manta/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                scrolled ? "text-[#1a2744] hover:text-[#c9a84c]" : "text-white hover:text-[#c9a84c]"
              }`}
            >
              <Instagram className="h-4 w-4" />
            </a>
            {/* Cart icon — desktop */}
            <button
              onClick={openCart}
              className={`relative transition-colors ${
                scrolled ? "text-[#1a2744] hover:text-[#c9a84c]" : "text-white hover:text-[#c9a84c]"
              }`}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c9a84c] text-[#1a2744] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href="#book"
              className="bg-[#1a2744] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-sm shadow-md"
            >
              {t.nav.cta}
            </a>
          </div>
          {/* Mobile cart icon */}
          <button
            onClick={openCart}
            className={`lg:hidden relative transition-colors ${
              scrolled ? "text-[#1a2744] hover:text-[#c9a84c]" : "text-white hover:text-[#c9a84c]"
            }`}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a84c] text-[#1a2744] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </button>
          {/* Mobile toggle */}
          <button
            className={`lg:hidden transition-colors ${
              scrolled ? "text-[#1a2744]" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-5">
            {(["about", "services", "plans", "shop"] as const).map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-[#1a2744] hover:text-[#c9a84c] transition-colors"
              >
                {t.nav[key]}
              </a>
            ))}
            <Link
              href="/events"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-[#1a2744] hover:text-[#c9a84c] transition-colors"
            >
              {t.nav.events}
            </Link>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              {(["en", "it", "fr", "de"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setMenuOpen(false); }}
                  className={`text-xs font-bold uppercase px-2 py-1 rounded transition-all ${
                    lang === l
                      ? "bg-[#c9a84c] text-white"
                      : "text-[#1a2744]/50 hover:text-[#1a2744]"
                  }`}
                >
                  {langLabels[l]}
                </button>
              ))}
            </div>
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="bg-[#1a2744] text-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-center hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-sm"
            >
              {t.nav.cta}
            </a>
          </div>
        )}
      </header>

      {/* ─── TRUST INTRO BANNER ──────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2744] overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[85vh] lg:min-h-[92vh]">
          {/* Left: Adelaide's "I'm your financial advisor" portrait — full bleed */}
          <div className="relative lg:w-[42%] h-[55vw] lg:h-auto flex-shrink-0">
            <img
              src={ADELAIDE_CIRCLE}
              alt="Adelaide Manta — Your Financial Advisor"
              className="w-full h-full object-cover object-top"
              style={{ objectPosition: 'center top' }}
            />
            {/* Subtle right-side fade into navy */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1a2744]/60 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744]/70 via-transparent to-transparent lg:hidden" />
            {/* FINMA badge — bottom-left of portrait */}
            <div className="absolute bottom-6 left-6 bg-[#1a2744]/90 border border-[#c9a84c] rounded-full px-4 py-2 flex items-center gap-2 shadow-xl backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0">
                <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
                  <path d="M1.5 4.5L4 7L8.5 1.5" stroke="#1a2744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[#c9a84c] text-[11px] font-black uppercase tracking-widest">FINMA &amp; BX Certified</span>
            </div>
          </div>

          {/* Right: headline, subtitle, CTA */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-0">
            <div className="w-12 h-0.5 bg-[#c9a84c] mb-8" />
            <h1
              className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-lg font-light">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="inline-block bg-[#c9a84c] text-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg text-center rounded-sm"
              >
                {t.hero.cta}
              </a>
              <a
                href="https://www.instagram.com/adelaide_manta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-[#c9a84c] transition-colors text-sm font-medium self-center"
              >
                <Instagram className="h-4 w-4" />
                @adelaide_manta
              </a>
            </div>
            {/* Trust signals row */}
            <div className="mt-12 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                <div className="w-1 h-4 bg-[#c9a84c]" />
                Switzerland
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                <div className="w-1 h-4 bg-[#c9a84c]" />
                EN · IT · FR · DE
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest">
                <div className="w-1 h-4 bg-[#c9a84c]" />
                Free First Consultation
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden lg:flex">
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── ABOUT ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-[#1a2744] text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Portrait */}
            <Reveal className="relative">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#c9a84c]/10 rounded-full blur-2xl" />
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#c9a84c]/20 relative z-10">
                  <img
                    src={ABOUT_PORTRAIT}
                    alt="Adelaide Manta"
                    className="w-full object-cover"
                    style={{ maxHeight: "520px", objectPosition: "top" }}
                  />
                  {/* FINMA Badge */}
                  <div className="absolute bottom-4 left-4 bg-[#1a2744] border border-[#c9a84c]/60 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl backdrop-blur-sm">
                    <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7L5.5 10.5L12 3" stroke="#1a2744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[#c9a84c] text-xs font-black uppercase tracking-widest leading-none">FINMA &amp; BX</div>
                      <div className="text-white/80 text-[10px] font-medium tracking-wide leading-tight mt-0.5">Certified Advisor</div>
                    </div>
                  </div>
                </div>
                {/* Stats overlay */}
                <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
                  {[
                    { num: t.about.stats.clients, label: t.about.stats.clientsLabel },
                    { num: t.about.stats.years, label: t.about.stats.yearsLabel },
                    { num: t.about.stats.languages, label: t.about.stats.languagesLabel },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                    >
                      <div
                        className="text-3xl font-bold text-[#c9a84c]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {s.num}
                      </div>
                      <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Content */}
            <Reveal delay={150} className="flex flex-col gap-6">
              <div>
                <div className="w-8 h-0.5 bg-[#c9a84c] mb-4" />
                <h2
                  className="text-4xl md:text-5xl text-white mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.about.title}
                </h2>
              </div>
              <p className="text-white/75 leading-relaxed text-base">{t.about.bio}</p>
              <div>
                <p className="font-semibold text-white/90 mb-3">{t.about.mission}</p>
                <ul className="space-y-2">
                  {t.about.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/75">
                      <span className="text-[#c9a84c] mt-1 flex-shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-white/75 italic leading-relaxed text-sm border-l-2 border-[#c9a84c]/40 pl-4">
                "{t.about.closing}"
              </p>
              {/* Certification badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-[#c9a84c]/30 rounded-lg px-4 py-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
                      <path d="M1.5 4.5L4 7L8.5 1.5" stroke="#1a2744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest leading-none">FINMA Certified</div>
                    <div className="text-white/50 text-[10px] tracking-wide mt-0.5">N° F01552257</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-[#c9a84c]/30 rounded-lg px-4 py-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
                      <path d="M1.5 4.5L4 7L8.5 1.5" stroke="#1a2744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest leading-none">BX Certified</div>
                    <div className="text-white/50 text-[10px] tracking-wide mt-0.5">BX Swiss AG · 64775</div>
                  </div>
                </div>
              </div>
              <a
                href="https://www.instagram.com/adelaide_manta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-white transition-colors text-sm font-medium"
              >
                <Instagram className="h-4 w-4" />
                {t.about.instagram}
              </a>
            </Reveal>
          </div>

          {/* ─── TRUST PHOTO GALLERY ───────────────────────────────────────────────── */}
          <Reveal delay={200} className="mt-16">
            {/* Row A: wide (2/3) + portrait (1/3) */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2 overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_SOFA_CONSULT} alt="Adelaide Manta consulting a client" className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 30%' }} />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_REDSOFA_CONSULT} alt="Adelaide Manta in a consultation" className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 40%' }} />
              </div>
            </div>
            {/* Row B: 3 equal */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_WORKING_DESK} alt="Adelaide Manta at her desk" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 35%' }} />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={CONSULTATION_ALPS} alt="Adelaide Manta consulting in the Alps" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 45%' }} />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={SERVICES_BG} alt="Adelaide Manta with a client" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 30%' }} />
              </div>
            </div>
            {/* Row C: portrait (1/3) + wide (2/3) */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_ZURICH_TERRACE} alt="Adelaide Manta in Zurich" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 40%' }} />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_CAFE_MEETING} alt="Adelaide Manta with a client at a café" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 35%' }} />
              </div>
            </div>
            {/* Row D: 3 equal */}
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_OUTDOOR_MEETING} alt="Adelaide Manta meeting a client outdoors" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 45%' }} />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={PHOTO_PHONE_CALL} alt="Adelaide Manta on a call" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 40%' }} />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-md border border-white/10 group">
                <img src={HERO_BG} alt="Adelaide Manta at work" className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 35%' }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-[#f8f5f0] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `url(${SERVICES_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#f8f5f0]/92" />
        <div className="container mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-[#1a2744] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.services.title}
            </h2>
            <p className="text-[#1a2744]/60 max-w-xl mx-auto">{t.services.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_KEYS.map((key, i) => {
              const Icon = SERVICE_ICONS[i];
              const service = t.services[key];
              return (
                <Reveal key={key} delay={i * 80}>
                  <div className="group bg-white rounded-xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#1a2744]/5 hover:border-[#c9a84c]/30 cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-[#1a2744]/5 group-hover:bg-[#c9a84c]/10 flex items-center justify-center mb-5 transition-colors">
                      <Icon className="h-6 w-6 text-[#1a2744] group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-[#1a2744] mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-[#1a2744]/60 text-sm leading-relaxed mb-4">
                      {service.desc}
                    </p>
                    <a
                      href="#book"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider hover:gap-2 transition-all"
                    >
                      {t.services.learnMore}
                      <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PLANS ───────────────────────────────────────────────────────────── */}
      <section id="plans" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-[#1a2744] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.plans.title}
            </h2>
            <p className="text-[#1a2744]/60 max-w-xl mx-auto">{t.plans.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Reveal>
              <div className="border border-gray-200 rounded-2xl p-8 h-full flex flex-col bg-white">
                <div className="mb-8">
                  <h3 className="text-lg font-black text-[#1a2744] uppercase tracking-widest mb-3">
                    {t.plans.free.name}
                  </h3>
                  <div
                    className="text-5xl font-bold text-[#c9a84c]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t.plans.free.price}
                  </div>
                </div>
                <ul className="space-y-5 flex-1 mb-10">
                  {t.plans.free.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#1a2744]/80 text-base leading-snug">
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 border-[#c9a84c] flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#book"
                  className="block text-center bg-[#1a2744] text-white px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-xl"
                >
                  {t.plans.free.cta}
                </a>
              </div>
            </Reveal>

            {/* Premium Plan */}
            <Reveal delay={100}>
              <div className="bg-[#1a2744] rounded-2xl p-8 h-full flex flex-col relative">
                {/* Recommended badge — positioned outside top-right corner */}
                <div className="absolute -top-4 right-6 bg-[#c9a84c] text-[#1a2744] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-md">
                  {t.plans.premium.badge}
                </div>
                <div className="mb-8 mt-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-3">
                    {t.plans.premium.name}
                  </h3>
                  <div
                    className="text-5xl font-bold text-[#c9a84c]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t.plans.premium.price}
                  </div>
                  <p className="text-white/50 text-sm mt-1">{t.plans.premium.desc}</p>
                </div>
                <ul className="space-y-5 flex-1 mb-10">
                  {t.plans.premium.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/85 text-base leading-snug">
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 border-[#c9a84c] flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Premium Plan: invoice-only — no Stripe checkout */}
                <a
                  href="#book"
                  className="block w-full text-center bg-[#c9a84c] text-[#1a2744] px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl"
                >
                  {t.plans.premium.cta}
                </a>
                <p className="text-white/40 text-xs text-center mt-2">
                  {lang === "it" ? "Pagamento tramite fattura ufficiale" :
                   lang === "fr" ? "Paiement par facture officielle" :
                   lang === "de" ? "Zahlung per offizieller Rechnung" :
                   "Payment by official invoice"}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#f8f5f0]">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-[#1a2744]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.testimonials.title}
            </h2>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Quote className="h-10 w-10 text-[#c9a84c]/30 mb-4 mx-auto" />
              <div className="text-center min-h-[120px] flex items-center justify-center">
                <p
                  className="text-lg md:text-xl text-[#1a2744]/80 italic leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "{t.testimonials.items[activeTestimonial].quote}"
                </p>
              </div>
              <div className="mt-6 text-center">
                <p className="font-semibold text-[#1a2744]">
                  {t.testimonials.items[activeTestimonial].author}
                </p>
                <p className="text-sm text-[#1a2744]/50 mt-1">
                  {t.testimonials.items[activeTestimonial].role}
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {t.testimonials.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all ${
                    i === activeTestimonial
                      ? "w-6 h-2 bg-[#c9a84c]"
                      : "w-2 h-2 bg-[#1a2744]/20 hover:bg-[#1a2744]/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-[#1a2744]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.faq.title}
            </h2>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-3">
            {t.faq.items.map((item, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="border border-[#1a2744]/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f8f5f0] transition-colors"
                  >
                    <span className="font-semibold text-[#1a2744] pr-4">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#c9a84c] flex-shrink-0 transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-[#1a2744]/70 text-sm leading-relaxed border-t border-[#1a2744]/5">
                      <p className="pt-4">{item.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING ─────────────────────────────────────────────────────────── */}
      <section id="book" className="py-24 bg-[#1a2744]">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.booking.title}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">{t.booking.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Calendly */}
            <Reveal>
              <a
                href="https://calendly.com/adelaidemanta"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#c9a84c]/40 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                  <Calendar className="h-7 w-7 text-[#c9a84c]" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{t.booking.calendlyTitle}</p>
                  <p className="text-white/50 text-sm">{t.booking.calendlySubtitle}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] flex items-center gap-1">
                  CALENDLY <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </Reveal>

            {/* WhatsApp */}
            <Reveal delay={100}>
              <a
                href="https://wa.me/41000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#c9a84c]/40 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                  <MessageSquare className="h-7 w-7 text-[#c9a84c]" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{t.booking.whatsappTitle}</p>
                  <p className="text-white/50 text-sm">{t.booking.whatsappSubtitle}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">
                  {t.booking.whatsappCta}
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SHOP ────────────────────────────────────────────────────────────── */}
      <section id="shop" className="py-24 bg-[#f8f5f0]">
        <div className="container mx-auto px-6">
          {/* Header */}
          <Reveal className="text-center mb-14">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl text-[#1a2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.shop.title}
            </h2>
            <p className="text-[#1a2744]/60 max-w-xl mx-auto">{t.shop.subtitle}</p>
          </Reveal>

          {/* Product grid — 5 individual products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {SHOP_PRODUCTS.map((product) => (
              <Reveal key={product.key}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1a2744]/8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full relative">
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-10 bg-[#c9a84c] text-[#1a2744] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  {/* Cover image or icon placeholder */}
                  {product.cover ? (
                    <div className="h-44 overflow-hidden bg-[#1a2744]/5">
                      <img src={product.cover} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-[#1a2744] to-[#1a2744]/80 flex items-center justify-center">
                      <Package className="h-14 w-14 text-[#c9a84c]/60" />
                    </div>
                  )}
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-[#1a2744] mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {product.name}
                    </h3>
                    <p className="text-[#1a2744]/55 text-sm leading-relaxed mb-5 flex-1">
                      {product.desc}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-[#c9a84c]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {product.price}
                          </span>
                          {product.regularPrice && (
                            <span className="ml-2 text-sm text-[#1a2744]/35 line-through">{product.regularPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isInCart(product.key) ? (
                          <button
                            onClick={openCart}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-all rounded-lg"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {lang === "it" ? "Nel Carrello" : lang === "fr" ? "Dans le Panier" : lang === "de" ? "Im Warenkorb" : "In Cart"}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              addItem({
                                key: product.key,
                                name: product.name,
                                price: Math.round(parseFloat(product.price.replace("CHF ", "")) * 100),
                                displayPrice: product.price,
                                cover: product.cover,
                              });
                              toast.success(
                                lang === "it" ? `"${product.name}" aggiunto al carrello` :
                                lang === "fr" ? `"${product.name}" ajouté au panier` :
                                lang === "de" ? `"${product.name}" zum Warenkorb hinzugefügt` :
                                `"${product.name}" added to cart`,
                                { duration: 2500 }
                              );
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-[#1a2744] text-[#1a2744] px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2744] hover:text-white transition-all rounded-lg"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {t.shop.addToCart}
                          </button>
                        )}
                        <button
                          onClick={() => handleBuyNow(product.key)}
                          disabled={createCheckout.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a2744] text-white px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {createCheckout.isPending ? "…" : t.shop.buyNow}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Two bundle cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Money Bundle */}
            <Reveal>
              <div className="bg-[#1a2744] rounded-2xl p-7 relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c]" />
                <div className="flex items-start gap-4 mb-5">
                  <div className="hidden sm:block flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden shadow-md">
                    <img src="/manus-storage/cover_06_single_bundle_0e05fcaa.png" alt="Single Money Bundle" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                      <Sparkles className="h-2.5 w-2.5" />
                      {lang === "it" ? "BUNDLE — RISPARMIA 21%" : lang === "fr" ? "BUNDLE — ÉCONOMISEZ 21%" : lang === "de" ? "BUNDLE — SPARE 21%" : "BUNDLE — SAVE 21%"}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {lang === "it" ? "Single Money Bundle 2026" : lang === "fr" ? "Single Money Bundle 2026" : lang === "de" ? "Single Money Bundle 2026" : "Single Money Bundle 2026"}
                    </h3>
                  </div>
                </div>
                <p className="text-white/55 text-sm mb-4">
                  {lang === "it" ? "Agenda Finanziaria Single + BudgetManager Pro Personale. Pianifica ogni giorno, traccia ogni franco."
                    : lang === "fr" ? "Agenda Financier Single + BudgetManager Pro Personnel. Planifiez chaque jour, suivez chaque franc."
                    : lang === "de" ? "Finanzagenda Single + BudgetManager Pro Persönlich. Jeden Tag planen, jeden Franken verfolgen."
                    : "Financial Agenda Single + BudgetManager Pro Personal. Plan every day, track every franc."}
                </p>
                <ul className="space-y-1.5 text-white/65 text-sm mb-6 flex-1">
                  {[
                    lang === "it" ? "Agenda Finanziaria 2026 — Single" : lang === "fr" ? "Agenda Financier 2026 — Célibataire" : lang === "de" ? "Finanzagenda 2026 — Einzelperson" : "Financial Agenda 2026 — Single",
                    lang === "it" ? "BudgetManager Pro — Personale" : lang === "fr" ? "BudgetManager Pro — Personnel" : lang === "de" ? "BudgetManager Pro — Persönlich" : "BudgetManager Pro — Personal",
                    lang === "it" ? "Tutti i 26 cantoni · Pilastro 3a · Krankenkasse" : lang === "fr" ? "26 cantons · Pilier 3a · Krankenkasse" : lang === "de" ? "26 Kantone · Säule 3a · Krankenkasse" : "All 26 cantons · Pillar 3a · Krankenkasse",
                    lang === "it" ? "Nessun abbonamento. 100% privato." : lang === "fr" ? "Aucun abonnement. 100% privé." : lang === "de" ? "Kein Abo. 100% privat." : "No subscription. 100% private.",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-3xl font-bold text-[#c9a84c]" style={{ fontFamily: "'Playfair Display', serif" }}>CHF 29.90</p>
                    <p className="text-white/35 line-through text-xs">CHF 37.80</p>
                  </div>
                  <button
                    onClick={() => handleBuyNow("single-bundle")}
                    disabled={createCheckout.isPending}
                    className="flex items-center gap-2 bg-[#c9a84c] text-[#1a2744] px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {lang === "it" ? "Acquista" : lang === "fr" ? "Acheter" : lang === "de" ? "Kaufen" : "Get Bundle"}
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Family Money Bundle */}
            <Reveal>
              <div className="bg-[#1a2744] rounded-2xl p-7 relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c]" />
                <div className="flex items-start gap-4 mb-5">
                  <div className="hidden sm:block flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden shadow-md">
                    <img src="/manus-storage/cover_07_family_bundle_df0f6cce.png" alt="Family Money Bundle" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-[#c9a84c] text-[#1a2744] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                      <Sparkles className="h-2.5 w-2.5" />
                      {lang === "it" ? "BUNDLE — RISPARMIA 24%" : lang === "fr" ? "BUNDLE — ÉCONOMISEZ 24%" : lang === "de" ? "BUNDLE — SPARE 24%" : "BUNDLE — SAVE 24%"}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {lang === "it" ? "Family Money Bundle 2026" : lang === "fr" ? "Family Money Bundle 2026" : lang === "de" ? "Family Money Bundle 2026" : "Family Money Bundle 2026"}
                    </h3>
                  </div>
                </div>
                <p className="text-white/55 text-sm mb-4">
                  {lang === "it" ? "Agenda Finanziaria Coppia + BudgetManager Pro Famiglia. Gestisci le finanze di casa insieme."
                    : lang === "fr" ? "Agenda Financier Couple + BudgetManager Pro Famille. Gérez les finances du foyer ensemble."
                    : lang === "de" ? "Finanzagenda Paar + BudgetManager Pro Familie. Haushaltsfinanzen gemeinsam verwalten."
                    : "Financial Agenda Couples + BudgetManager Pro Family. Run your household finances together."}
                </p>
                <ul className="space-y-1.5 text-white/65 text-sm mb-6 flex-1">
                  {[
                    lang === "it" ? "Agenda Finanziaria 2026 — Coppia" : lang === "fr" ? "Agenda Financier 2026 — Couple" : lang === "de" ? "Finanzagenda 2026 — Paar" : "Financial Agenda 2026 — Couples",
                    lang === "it" ? "BudgetManager Pro — Famiglia (fino a 4 profili)" : lang === "fr" ? "BudgetManager Pro — Famille (jusqu'à 4 profils)" : lang === "de" ? "BudgetManager Pro — Familie (bis zu 4 Profile)" : "BudgetManager Pro — Family (up to 4 profiles)",
                    lang === "it" ? "Categorie Kita, scuola, spese condivise" : lang === "fr" ? "Catégories Kita, école, dépenses partagées" : lang === "de" ? "Kita-, Schul- und geteilte Ausgabenkategorien" : "Kita, school & shared expense categories",
                    lang === "it" ? "Nessun abbonamento. 100% privato." : lang === "fr" ? "Aucun abonnement. 100% privé." : lang === "de" ? "Kein Abo. 100% privat." : "No subscription. 100% private.",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-3xl font-bold text-[#c9a84c]" style={{ fontFamily: "'Playfair Display', serif" }}>CHF 39.90</p>
                    <p className="text-white/35 line-through text-xs">CHF 52.80</p>
                  </div>
                  <button
                    onClick={() => handleBuyNow("family-bundle")}
                    disabled={createCheckout.isPending}
                    className="flex items-center gap-2 bg-[#c9a84c] text-[#1a2744] px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-xl disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {lang === "it" ? "Acquista" : lang === "fr" ? "Acheter" : lang === "de" ? "Kaufen" : "Get Bundle"}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT FAQ ───────────────────────────────────────────────────── */}
      <section id="product-faq" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="w-8 h-0.5 bg-[#c9a84c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl text-[#1a2744] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lang === "it" ? "Guida ai Prodotti Digitali"
                : lang === "fr" ? "Guide des Produits Numériques"
                : lang === "de" ? "Leitfaden für Digitale Produkte"
                : "Digital Products Guide"}
            </h2>
            <p className="text-[#1a2744]/60 max-w-xl mx-auto text-sm">
              {lang === "it" ? "Tutto quello che devi sapere su download, utilizzo e compatibilità dei nostri strumenti."
                : lang === "fr" ? "Tout ce que vous devez savoir sur le téléchargement, l'utilisation et la compatibilité de nos outils."
                : lang === "de" ? "Alles, was Sie über Download, Nutzung und Kompatibilität unserer Tools wissen müssen."
                : "Everything you need to know about downloading, using, and getting the most from our digital tools."}
            </p>
          </Reveal>

          {/* Two-column layout: categories on left, accordion on right */}
          <div className="max-w-4xl mx-auto">
            {([
              {
                icon: "📦",
                label: lang === "it" ? "Download & Accesso" : lang === "fr" ? "Téléchargement & Accès" : lang === "de" ? "Download & Zugang" : "Download & Access",
                items: [
                  {
                    q: lang === "it" ? "Come ricevo il file dopo l'acquisto?"
                      : lang === "fr" ? "Comment je reçois le fichier après l'achat ?"
                      : lang === "de" ? "Wie erhalte ich die Datei nach dem Kauf?"
                      : "How do I receive my file after purchase?",
                    a: lang === "it" ? "Dopo il pagamento, verrai reindirizzato alla pagina di conferma dove troverai il pulsante di download immediato. Puoi anche accedere a tutti i tuoi acquisti in qualsiasi momento dalla sezione \"I miei ordini\" nel footer del sito."
                      : lang === "fr" ? "Après le paiement, vous serez redirigé vers la page de confirmation où vous trouverez le bouton de téléchargement immédiat. Vous pouvez également accéder à tous vos achats à tout moment depuis la section \"Mes commandes\" dans le pied de page."
                      : lang === "de" ? "Nach der Zahlung werden Sie zur Bestätigungsseite weitergeleitet, wo Sie den sofortigen Download-Button finden. Sie können auch jederzeit auf alle Ihre Käufe im Bereich \"Meine Bestellungen\" in der Fußzeile zugreifen."
                      : "After payment you are redirected to the confirmation page where you will find an instant download button. You can also access all your purchases at any time from the \"My Orders\" section in the footer.",
                  },
                  {
                    q: lang === "it" ? "Il link di download scade?"
                      : lang === "fr" ? "Le lien de téléchargement expire-t-il ?"
                      : lang === "de" ? "Läuft der Download-Link ab?"
                      : "Does the download link expire?",
                    a: lang === "it" ? "No. I tuoi download sono disponibili per sempre nella sezione \"I miei ordini\". Puoi scaricare il file quante volte vuoi, in qualsiasi momento."
                      : lang === "fr" ? "Non. Vos téléchargements sont disponibles pour toujours dans la section \"Mes commandes\". Vous pouvez télécharger le fichier autant de fois que vous le souhaitez."
                      : lang === "de" ? "Nein. Ihre Downloads sind dauerhaft im Bereich \"Meine Bestellungen\" verfügbar. Sie können die Datei beliebig oft herunterladen."
                      : "No. Your downloads are available permanently in \"My Orders\". You can download the file as many times as you like, whenever you need it.",
                  },
                  {
                    q: lang === "it" ? "Cosa contiene il file ZIP?"
                      : lang === "fr" ? "Que contient le fichier ZIP ?"
                      : lang === "de" ? "Was enthält die ZIP-Datei?"
                      : "What is inside the ZIP file?",
                    a: lang === "it" ? "Il file ZIP contiene il prodotto digitale (HTML interattivo, PDF o foglio Excel a seconda del prodotto), una guida rapida all'utilizzo in PDF e le istruzioni di installazione per usarlo come app sul telefono."
                      : lang === "fr" ? "Le fichier ZIP contient le produit numérique (HTML interactif, PDF ou feuille Excel selon le produit), un guide de démarrage rapide en PDF et les instructions d'installation pour l'utiliser comme application sur téléphone."
                      : lang === "de" ? "Die ZIP-Datei enthält das digitale Produkt (interaktives HTML, PDF oder Excel je nach Produkt), eine Schnellstartanleitung als PDF und Installationsanweisungen zur Nutzung als App auf dem Smartphone."
                      : "The ZIP file contains the digital product (interactive HTML, PDF, or Excel depending on the product), a quick-start guide in PDF, and installation instructions to use it as an app on your phone.",
                  },
                ],
              },
              {
                icon: "💻",
                label: lang === "it" ? "Utilizzo & Compatibilità" : lang === "fr" ? "Utilisation & Compatibilité" : lang === "de" ? "Nutzung & Kompatibilität" : "Usage & Compatibility",
                items: [
                  {
                    q: lang === "it" ? "Su quali dispositivi funzionano i prodotti?"
                      : lang === "fr" ? "Sur quels appareils les produits fonctionnent-ils ?"
                      : lang === "de" ? "Auf welchen Geräten funktionieren die Produkte?"
                      : "Which devices do the products work on?",
                    a: lang === "it" ? "Tutti i prodotti funzionano su PC, Mac, tablet e smartphone. Le Agende Finanziarie e BudgetManager Pro sono file HTML che si aprono direttamente nel browser (Chrome, Safari, Firefox, Edge) — nessuna app da installare. La Guida Moving to Switzerland è un PDF leggibile su qualsiasi dispositivo."
                      : lang === "fr" ? "Tous les produits fonctionnent sur PC, Mac, tablette et smartphone. Les Agendas Financiers et BudgetManager Pro sont des fichiers HTML qui s'ouvrent directement dans le navigateur (Chrome, Safari, Firefox, Edge) — aucune application à installer. Le Guide S'installer en Suisse est un PDF lisible sur n'importe quel appareil."
                      : lang === "de" ? "Alle Produkte funktionieren auf PC, Mac, Tablet und Smartphone. Die Finanzagenden und BudgetManager Pro sind HTML-Dateien, die direkt im Browser (Chrome, Safari, Firefox, Edge) geöffnet werden — keine App-Installation erforderlich. Der Ratgeber Umzug in die Schweiz ist ein PDF, das auf jedem Gerät lesbar ist."
                      : "All products work on PC, Mac, tablet, and smartphone. The Financial Agendas and BudgetManager Pro are HTML files that open directly in your browser (Chrome, Safari, Firefox, Edge) — no app to install. The Moving to Switzerland Guide is a PDF readable on any device.",
                  },
                  {
                    q: lang === "it" ? "Posso usare i prodotti offline?"
                      : lang === "fr" ? "Puis-je utiliser les produits hors ligne ?"
                      : lang === "de" ? "Kann ich die Produkte offline nutzen?"
                      : "Can I use the products offline?",
                    a: lang === "it" ? "Sì. Una volta scaricato il file ZIP e aperto il file HTML nel browser, tutto funziona completamente offline. I dati vengono salvati nel browser (localStorage) e rimangono disponibili anche senza connessione internet. Puoi anche installarlo come app sul telefono tramite la funzione \"Aggiungi alla schermata home\"."
                      : lang === "fr" ? "Oui. Une fois le fichier ZIP téléchargé et le fichier HTML ouvert dans le navigateur, tout fonctionne entièrement hors ligne. Les données sont sauvegardées dans le navigateur (localStorage) et restent disponibles même sans connexion internet. Vous pouvez également l'installer comme application sur votre téléphone via la fonction \"Ajouter à l'écran d'accueil\"."
                      : lang === "de" ? "Ja. Sobald Sie die ZIP-Datei heruntergeladen und die HTML-Datei im Browser geöffnet haben, funktioniert alles vollständig offline. Die Daten werden im Browser (localStorage) gespeichert und bleiben auch ohne Internetverbindung verfügbar. Sie können es auch als App auf Ihrem Smartphone über \"Zum Startbildschirm hinzufügen\" installieren."
                      : "Yes. Once you download the ZIP and open the HTML file in your browser, everything works fully offline. Data is saved in your browser (localStorage) and remains available even without an internet connection. You can also install it as an app on your phone via \"Add to Home Screen\".",
                  },
                  {
                    q: lang === "it" ? "Come installo il prodotto come app sul telefono?"
                      : lang === "fr" ? "Comment installer le produit comme application sur mon téléphone ?"
                      : lang === "de" ? "Wie installiere ich das Produkt als App auf meinem Smartphone?"
                      : "How do I install the product as an app on my phone?",
                    a: lang === "it" ? "Su iPhone/iPad: apri il file HTML in Safari, tocca l'icona di condivisione e seleziona \"Aggiungi alla schermata Home\". Su Android: apri il file in Chrome, tocca il menu (⋮) e seleziona \"Aggiungi alla schermata Home\". Il prodotto apparirà come un'app normale e si aprirà in modalità a schermo intero."
                      : lang === "fr" ? "Sur iPhone/iPad : ouvrez le fichier HTML dans Safari, appuyez sur l'icône de partage et sélectionnez \"Sur l'écran d'accueil\". Sur Android : ouvrez le fichier dans Chrome, appuyez sur le menu (⋮) et sélectionnez \"Ajouter à l'écran d'accueil\". Le produit apparaîtra comme une application normale et s'ouvrira en plein écran."
                      : lang === "de" ? "Auf iPhone/iPad: Öffnen Sie die HTML-Datei in Safari, tippen Sie auf das Teilen-Symbol und wählen Sie \"Zum Home-Bildschirm\". Auf Android: Öffnen Sie die Datei in Chrome, tippen Sie auf das Menü (⋮) und wählen Sie \"Zum Startbildschirm hinzufügen\". Das Produkt erscheint wie eine normale App und öffnet sich im Vollbildmodus."
                      : "On iPhone/iPad: open the HTML file in Safari, tap the share icon, and select \"Add to Home Screen\". On Android: open the file in Chrome, tap the menu (⋮) and select \"Add to Home Screen\". The product will appear like a normal app and open in full-screen mode.",
                  },
                ],
              },
              {
                icon: "📊",
                label: lang === "it" ? "BudgetManager Pro" : lang === "fr" ? "BudgetManager Pro" : lang === "de" ? "BudgetManager Pro" : "BudgetManager Pro",
                items: [
                  {
                    q: lang === "it" ? "Qual è la differenza tra la versione Personal e Family?"
                      : lang === "fr" ? "Quelle est la différence entre la version Personal et Family ?"
                      : lang === "de" ? "Was ist der Unterschied zwischen der Personal- und der Family-Version?"
                      : "What is the difference between the Personal and Family versions?",
                    a: lang === "it" ? "La versione Personal è progettata per una singola persona: traccia le tue spese, confronta con le medie svizzere e pianifica il budget mensile. La versione Family supporta fino a 4 profili familiari, ha un dashboard condiviso, un calcolatore di divisione spese (uguale o proporzionale) e categorie specifiche per famiglie come Kita e spese scolastiche."
                      : lang === "fr" ? "La version Personal est conçue pour une seule personne : suivez vos dépenses, comparez avec les moyennes suisses et planifiez votre budget mensuel. La version Family prend en charge jusqu'à 4 profils familiaux, dispose d'un tableau de bord partagé, d'un calculateur de répartition des dépenses et de catégories spécifiques aux familles comme la Kita et les frais scolaires."
                      : lang === "de" ? "Die Personal-Version ist für eine einzelne Person konzipiert: Verfolgen Sie Ihre Ausgaben, vergleichen Sie mit Schweizer Durchschnittswerten und planen Sie Ihr Monatsbudget. Die Family-Version unterstützt bis zu 4 Familienprofile, hat ein gemeinsames Dashboard, einen Ausgabenaufteilungsrechner und familienspezifische Kategorien wie Kita und Schulkosten."
                      : "The Personal version is designed for a single person: track your expenses, compare with Swiss averages, and plan your monthly budget. The Family version supports up to 4 family profiles, has a shared dashboard, an expense-split calculator (equal or proportional), and family-specific categories like Kita and school costs.",
                  },
                  {
                    q: lang === "it" ? "I miei dati sono al sicuro? Dove vengono salvati?"
                      : lang === "fr" ? "Mes données sont-elles en sécurité ? Où sont-elles sauvegardées ?"
                      : lang === "de" ? "Sind meine Daten sicher? Wo werden sie gespeichert?"
                      : "Is my data safe? Where is it stored?",
                    a: lang === "it" ? "I tuoi dati vengono salvati esclusivamente nel tuo browser (localStorage) — non vengono mai inviati a server esterni. Nessun account richiesto, nessun cloud, 100% privato. Ti consigliamo di esportare regolarmente i dati in PDF o CSV come backup."
                      : lang === "fr" ? "Vos données sont sauvegardées exclusivement dans votre navigateur (localStorage) — elles ne sont jamais envoyées à des serveurs externes. Aucun compte requis, aucun cloud, 100% privé. Nous vous recommandons d'exporter régulièrement vos données en PDF ou CSV comme sauvegarde."
                      : lang === "de" ? "Ihre Daten werden ausschließlich in Ihrem Browser (localStorage) gespeichert — sie werden niemals an externe Server gesendet. Kein Konto erforderlich, keine Cloud, 100% privat. Wir empfehlen, Ihre Daten regelmäßig als PDF oder CSV zu exportieren."
                      : "Your data is saved exclusively in your browser (localStorage) — it is never sent to external servers. No account required, no cloud, 100% private. We recommend regularly exporting your data as PDF or CSV as a backup.",
                  },
                  {
                    q: lang === "it" ? "Posso usarlo in italiano, francese o tedesco?"
                      : lang === "fr" ? "Puis-je l'utiliser en français, italien ou allemand ?"
                      : lang === "de" ? "Kann ich es auf Deutsch, Italienisch oder Französisch nutzen?"
                      : "Is BudgetManager Pro available in multiple languages?",
                    a: lang === "it" ? "Sì! BudgetManager Pro è disponibile in 5 lingue: italiano, inglese, francese, tedesco e spagnolo. Puoi cambiare la lingua direttamente dall'interfaccia del prodotto in qualsiasi momento."
                      : lang === "fr" ? "Oui ! BudgetManager Pro est disponible en 5 langues : français, anglais, italien, allemand et espagnol. Vous pouvez changer la langue directement depuis l'interface du produit à tout moment."
                      : lang === "de" ? "Ja! BudgetManager Pro ist in 5 Sprachen verfügbar: Deutsch, Englisch, Italienisch, Französisch und Spanisch. Sie können die Sprache jederzeit direkt in der Produktoberfläche ändern."
                      : "Yes! BudgetManager Pro is available in 5 languages: English, Italian, French, German, and Spanish. You can change the language directly from the product interface at any time.",
                  },
                ],
              },
              {
                icon: "📅",
                label: lang === "it" ? "Agenda Finanziaria" : lang === "fr" ? "Agenda Financier" : lang === "de" ? "Finanzagenda" : "Financial Agenda",
                items: [
                  {
                    q: lang === "it" ? "Qual è la differenza tra l'Agenda Single e quella Coppia?"
                      : lang === "fr" ? "Quelle est la différence entre l'Agenda Single et Couples ?"
                      : lang === "de" ? "Was ist der Unterschied zwischen der Single- und der Paar-Agenda?"
                      : "What is the difference between the Single and Couples Agenda?",
                    a: lang === "it" ? "L'Agenda Single è pensata per una persona: 365 pagine giornaliere con budget mensile, obiettivi di risparmio, scadenze fiscali svizzere e tracker No-Spending-Day. L'Agenda Coppia aggiunge la gestione condivisa: nomi partner personalizzabili, divisione flessibile delle spese, dashboard risparmi combinata e sezione \"chi ha pagato?\" per ogni spesa."
                      : lang === "fr" ? "L'Agenda Single est conçu pour une personne : 365 pages quotidiennes avec budget mensuel, objectifs d'épargne, échéances fiscales suisses et tracker No-Spending-Day. L'Agenda Couple ajoute la gestion partagée : noms de partenaires personnalisables, répartition flexible des dépenses, tableau de bord épargne combiné et section \"qui a payé ?\" pour chaque dépense."
                      : lang === "de" ? "Die Single-Agenda ist für eine Person konzipiert: 365 Tagesseiten mit Monatsbudget, Sparzielen, Schweizer Steuerfristen und No-Spending-Day-Tracker. Die Paar-Agenda fügt gemeinsames Management hinzu: anpassbare Partnernamen, flexible Ausgabenteilung, kombiniertes Spar-Dashboard und \"Wer hat bezahlt?\"-Abschnitt für jede Ausgabe."
                      : "The Single Agenda is designed for one person: 365 daily pages with monthly budget, savings goals, Swiss tax deadlines, and a No-Spending-Day tracker. The Couples Agenda adds shared management: customisable partner names, flexible expense split, combined savings dashboard, and a \"who paid?\" section for each expense.",
                  },
                  {
                    q: lang === "it" ? "I dati dell'agenda vengono persi se cambio browser o dispositivo?"
                      : lang === "fr" ? "Les données de l'agenda sont-elles perdues si je change de navigateur ou d'appareil ?"
                      : lang === "de" ? "Gehen die Agenda-Daten verloren, wenn ich Browser oder Gerät wechsle?"
                      : "Will I lose my Agenda data if I change browser or device?",
                    a: lang === "it" ? "I dati sono salvati nel localStorage del browser, quindi sono legati al browser e al dispositivo specifico. Se cambi browser o dispositivo, i dati non si trasferiscono automaticamente. Ti consigliamo di usare sempre lo stesso browser e di esportare regolarmente i dati tramite la funzione di backup integrata nel prodotto."
                      : lang === "fr" ? "Les données sont sauvegardées dans le localStorage du navigateur, donc elles sont liées au navigateur et à l'appareil spécifique. Si vous changez de navigateur ou d'appareil, les données ne se transfèrent pas automatiquement. Nous vous recommandons d'utiliser toujours le même navigateur et d'exporter régulièrement vos données via la fonction de sauvegarde intégrée au produit."
                      : lang === "de" ? "Die Daten werden im localStorage des Browsers gespeichert und sind daher an den spezifischen Browser und das Gerät gebunden. Wenn Sie Browser oder Gerät wechseln, werden die Daten nicht automatisch übertragen. Wir empfehlen, immer denselben Browser zu verwenden und Daten regelmäßig über die integrierte Backup-Funktion zu exportieren."
                      : "Data is saved in the browser's localStorage, so it is tied to the specific browser and device. If you change browser or device, data does not transfer automatically. We recommend always using the same browser and regularly exporting your data via the built-in backup function.",
                  },
                ],
              },
              {
                icon: "💬",
                label: lang === "it" ? "Supporto" : lang === "fr" ? "Support" : lang === "de" ? "Support" : "Support",
                items: [
                  {
                    q: lang === "it" ? "Cosa faccio se ho problemi con il download o l'utilizzo?"
                      : lang === "fr" ? "Que faire si j'ai des problèmes avec le téléchargement ou l'utilisation ?"
                      : lang === "de" ? "Was soll ich tun, wenn ich Probleme beim Download oder der Nutzung habe?"
                      : "What should I do if I have issues with the download or usage?",
                    a: lang === "it" ? "Contattami direttamente su WhatsApp o via email. Rispondo entro 24 ore nei giorni lavorativi. Per problemi tecnici, specifica il dispositivo e il browser che stai usando — risolviamo tutto insieme."
                      : lang === "fr" ? "Contactez-moi directement sur WhatsApp ou par e-mail. Je réponds dans les 24 heures les jours ouvrables. Pour les problèmes techniques, précisez l'appareil et le navigateur que vous utilisez — nous résolvons tout ensemble."
                      : lang === "de" ? "Kontaktieren Sie mich direkt über WhatsApp oder per E-Mail. Ich antworte innerhalb von 24 Stunden an Werktagen. Bei technischen Problemen geben Sie bitte das Gerät und den Browser an, den Sie verwenden — wir lösen alles gemeinsam."
                      : "Contact me directly on WhatsApp or by email. I respond within 24 hours on working days. For technical issues, please specify the device and browser you are using — we will sort it out together.",
                  },
                  {
                    q: lang === "it" ? "È possibile ottenere un rimborso?"
                      : lang === "fr" ? "Est-il possible d'obtenir un remboursement ?"
                      : lang === "de" ? "Ist eine Rückerstattung möglich?"
                      : "Is a refund possible?",
                    a: lang === "it" ? "Data la natura digitale dei prodotti, i rimborsi non sono previsti dopo il download. Tuttavia, se riscontri un problema tecnico serio o il prodotto non corrisponde alla descrizione, contattami e troveremo una soluzione."
                      : lang === "fr" ? "En raison de la nature numérique des produits, les remboursements ne sont pas prévus après le téléchargement. Cependant, si vous rencontrez un problème technique sérieux ou si le produit ne correspond pas à la description, contactez-moi et nous trouverons une solution."
                      : lang === "de" ? "Aufgrund der digitalen Natur der Produkte sind nach dem Download keine Rückerstattungen vorgesehen. Wenn Sie jedoch ein ernstes technisches Problem haben oder das Produkt nicht der Beschreibung entspricht, kontaktieren Sie mich und wir finden eine Lösung."
                      : "Due to the digital nature of the products, refunds are not available after download. However, if you encounter a serious technical issue or the product does not match the description, contact me and we will find a solution.",
                  },
                ],
              },
            ] as { icon: string; label: string; items: { q: string; a: string }[] }[]).map((category, catIdx) => (
              <Reveal key={catIdx} delay={catIdx * 60}>
                <div className="mb-8">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h3
                      className="text-lg font-bold text-[#1a2744]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {category.label}
                    </h3>
                    <div className="flex-1 h-px bg-[#1a2744]/10" />
                  </div>
                  {/* Accordion items */}
                  <div className="space-y-2 pl-9">
                    {category.items.map((item, itemIdx) => {
                      const globalIdx = catIdx * 10 + itemIdx;
                      return (
                        <div
                          key={itemIdx}
                          className="border border-[#1a2744]/10 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenProductFaq(openProductFaq === globalIdx ? null : globalIdx)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f8f5f0] transition-colors"
                          >
                            <span className="font-medium text-[#1a2744] text-sm pr-4">{item.q}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-[#c9a84c] flex-shrink-0 transition-transform ${
                                openProductFaq === globalIdx ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openProductFaq === globalIdx && (
                            <div className="px-4 pb-4 text-[#1a2744]/70 text-sm leading-relaxed border-t border-[#1a2744]/5">
                              <p className="pt-3">{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a2744] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <h3
                className="text-2xl text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Adelaide Manta
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {lang === "en" && "Independent financial advisor based in Zurich, Switzerland."}
                {lang === "it" && "Consulente finanziaria indipendente con sede a Zurigo, Svizzera."}
                {lang === "fr" && "Conseillère financière indépendante basée à Zurich, Suisse."}
                {lang === "de" && "Unabhängige Finanzberaterin mit Sitz in Zürich, Schweiz."}
              </p>
              <a
                href="https://www.instagram.com/adelaide_manta/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-white transition-colors text-sm"
              >
                <Instagram className="h-4 w-4" />
                @adelaide_manta
              </a>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                {t.footer.contact}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  Zurich, Switzerland
                </div>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <Mail className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  adelaide.manta@swisslife-select.ch
                </div>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <Phone className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  +41 76 788 95 13
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                {lang === "en" ? "Language" : lang === "it" ? "Lingua" : lang === "fr" ? "Langue" : "Sprache"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(["en", "it", "fr", "de"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all ${
                      lang === l
                        ? "bg-[#c9a84c] text-[#1a2744]"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? ["English", "Italiano", "Français", "Deutsch"][["en","it","fr","de"].indexOf(l)] :
                     lang === "it" ? ["Inglese", "Italiano", "Francese", "Tedesco"][["en","it","fr","de"].indexOf(l)] :
                     lang === "fr" ? ["Anglais", "Italien", "Français", "Allemand"][["en","it","fr","de"].indexOf(l)] :
                     ["Englisch", "Italienisch", "Französisch", "Deutsch"][["en","it","fr","de"].indexOf(l)]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="gold-rule mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs">
            <p>{t.footer.legal}</p>
            <div className="flex gap-6">
              <Link href="/orders" className="hover:text-[#c9a84c] transition-colors">
                {lang === "it" ? "I Miei Ordini" : lang === "fr" ? "Mes Commandes" : lang === "de" ? "Meine Bestellungen" : "My Orders"}
              </Link>
              <Link href="/privacy-policy" className="hover:text-[#c9a84c] transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="/terms" className="hover:text-[#c9a84c] transition-colors">
                {t.footer.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
