import { useLocation, Link } from "wouter";
import { ArrowLeft, ShoppingCart, ShoppingBag, CheckCircle2, Download, Star, Lock, Wifi, Globe } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState, useCallback } from "react";

// ─── SCREENSHOT URLS (from this project's storage) ───────────────────────────
const SCREENSHOTS = {
  "moving-guide": [
    "/manus-storage/moving_guide_p1_bd2c786e.png",
    "/manus-storage/moving_guide_p2_77053f2c.png",
    "/manus-storage/moving_guide_p3_0e5fd0e2.png",
  ],
  "financial-agenda-single": [
    "/manus-storage/agenda_single_cover_418e25e8.webp",
    "/manus-storage/agenda_single_january_56b529ac.webp",
    "/manus-storage/agenda_single_budget_8dec2796.webp",
    "/manus-storage/agenda_single_annual_8cb0b56f.webp",
    "/manus-storage/agenda_single_habits_b572db15.webp",
    "/manus-storage/agenda_single_tips_5c18d01d.webp",
  ],
  // Legacy key alias (keep for backward compatibility)
  "agenda-single": [
    "/manus-storage/agenda_single_cover_418e25e8.webp",
    "/manus-storage/agenda_single_january_56b529ac.webp",
    "/manus-storage/agenda_single_budget_8dec2796.webp",
    "/manus-storage/agenda_single_annual_8cb0b56f.webp",
    "/manus-storage/agenda_single_habits_b572db15.webp",
    "/manus-storage/agenda_single_tips_5c18d01d.webp",
  ],
  "financial-agenda-couples": [
    "/manus-storage/agenda_couples_cover_d676894d.webp",
    "/manus-storage/agenda_couples_january_f6b7a1fc.webp",
    "/manus-storage/agenda_couples_split_071ea927.webp",
  ],
  // Legacy key alias
  "agenda-couples": [
    "/manus-storage/agenda_couples_cover_d676894d.webp",
    "/manus-storage/agenda_couples_january_f6b7a1fc.webp",
    "/manus-storage/agenda_couples_split_071ea927.webp",
  ],
  "budget-manager-personal": [
    "/manus-storage/bm_personal_dashboard_4fd8e26b.webp",
    "/manus-storage/bm_personal_populated_bf28bb52.webp",
    "/manus-storage/bm_personal_charts_0a4f04e3.webp",
  ],
  // Legacy key alias
  "budget-personal": [
    "/manus-storage/bm_personal_dashboard_4fd8e26b.webp",
    "/manus-storage/bm_personal_populated_bf28bb52.webp",
    "/manus-storage/bm_personal_charts_0a4f04e3.webp",
  ],
  "budget-manager-family": [
    "/manus-storage/bm_family_dashboard_784df8f1.webp",
    "/manus-storage/bm_family_populated_5f345063.webp",
    "/manus-storage/bm_family_charts_e697f1b0.webp",
  ],
  // Legacy key alias
  "budget-family": [
    "/manus-storage/bm_family_dashboard_784df8f1.webp",
    "/manus-storage/bm_family_populated_5f345063.webp",
    "/manus-storage/bm_family_charts_e697f1b0.webp",
  ],
  "single-bundle": [
    "/manus-storage/agenda_single_cover_418e25e8.webp",
    "/manus-storage/agenda_single_january_56b529ac.webp",
    "/manus-storage/bm_personal_dashboard_4fd8e26b.webp",
    "/manus-storage/bm_personal_populated_bf28bb52.webp",
    "/manus-storage/bm_personal_charts_0a4f04e3.webp",
  ],
  "family-bundle": [
    "/manus-storage/agenda_couples_cover_d676894d.webp",
    "/manus-storage/agenda_couples_january_f6b7a1fc.webp",
    "/manus-storage/bm_family_dashboard_784df8f1.webp",
    "/manus-storage/bm_family_populated_5f345063.webp",
    "/manus-storage/bm_family_charts_e697f1b0.webp",
  ],
};

// ─── COVER URLS (personal Manus storage URLs) ─────────────────────────────────
const COVERS: Record<string, string> = {
  "moving-guide": "/manus-storage/cover_01_moving_guide_6b2afe40.png",
  // New canonical keys
  "financial-agenda-couples": "/manus-storage/cover_02_agenda_couples_0d2e4c0e.png",
  "financial-agenda-single": "/manus-storage/cover_03_agenda_single_a6e0e6c5.png",
  "budget-manager-personal": "/manus-storage/cover_04_budget_personal_b9cb2af0.png",
  "budget-manager-family": "/manus-storage/cover_05_budget_family_b9cb2af0.png",
  // Legacy key aliases
  "agenda-couples": "/manus-storage/cover_02_agenda_couples_0d2e4c0e.png",
  "agenda-single": "/manus-storage/cover_03_agenda_single_a6e0e6c5.png",
  "budget-personal": "/manus-storage/cover_04_budget_personal_b9cb2af0.png",
  "budget-family": "/manus-storage/cover_05_budget_family_b9cb2af0.png",
  "single-bundle": "/manus-storage/cover_06_single_bundle_0aadc427.png",
  "family-bundle": "/manus-storage/cover_07_family_bundle_72494c46.png",
};

// ─── PRICES ───────────────────────────────────────────────────────────────────
const PRICES: Record<string, { price: string; regular?: string; amount: number }> = {
  "moving-guide":             { price: "CHF 9.90",  amount: 990 },
  // New canonical keys
  "financial-agenda-single":  { price: "CHF 14.90", amount: 1490 },
  "financial-agenda-couples": { price: "CHF 19.90", amount: 1990 },
  "budget-manager-personal":  { price: "CHF 22.90", amount: 2290 },
  "budget-manager-family":    { price: "CHF 32.90", amount: 3290 },
  // Legacy key aliases
  "agenda-single":   { price: "CHF 14.90", amount: 1490 },
  "agenda-couples":  { price: "CHF 19.90", amount: 1990 },
  "budget-personal": { price: "CHF 22.90", amount: 2290 },
  "budget-family":   { price: "CHF 32.90", amount: 3290 },
  "single-bundle":   { price: "CHF 29.90", regular: "CHF 37.80", amount: 2990 },
  "family-bundle":   { price: "CHF 39.90", regular: "CHF 52.80", amount: 3990 },
};

// ─── CONTENT ──────────────────────────────────────────────────────────────────
type Lang = "en" | "it" | "fr" | "de";

interface ProductContent {
  name: string;
  tagline: string;
  description: string;
  whatYouGet: string;
  features: string[];
  techSpecs: string[];
  ideal: string;
}

const CONTENT: Record<string, Record<Lang, ProductContent>> = {
  "moving-guide": {
    en: {
      name: "Moving to Switzerland — Complete Professional Guide 2026",
      tagline: "Everything you need to start your Swiss life with confidence",
      description: "A comprehensive 39-page PDF guide written by Adelaide Manta, independent financial and insurance advisor based in Switzerland. This guide covers every practical aspect of relocating to Switzerland — from residence permits and apartment hunting to the Swiss tax system, health insurance, pension pillars, and daily life. All information is verified as of January 2026.",
      whatYouGet: "What's inside the guide",
      features: [
        "Residence permits (B, C, L, G) — requirements, timelines, renewal",
        "Finding & renting an apartment — contracts, deposits, tenant rights",
        "Swiss transportation system — GA, Half-Fare card, zones",
        "Education in Switzerland — public schools, universities, language courses",
        "Swiss taxation system — cantonal differences, tax return, deductions",
        "Financial system & insurance — banking, Krankenkasse, Pillar 3a/3b",
        "Waste management, driving license, importing belongings",
        "Swiss life & culture — etiquette, holidays, day trips",
        "Contacts & resources — official links, emergency numbers",
      ],
      techSpecs: [
        "Format: PDF, 39 pages, A4",
        "Language: English",
        "Verified: January 2026",
        "Instant download after purchase",
      ],
      ideal: "Ideal for expats, international professionals, and anyone planning to relocate to Switzerland.",
    },
    it: {
      name: "Trasferirsi in Svizzera — Guida Professionale Completa 2026",
      tagline: "Tutto quello che ti serve per iniziare la tua vita svizzera con sicurezza",
      description: "Una guida PDF completa di 39 pagine scritta da Adelaide Manta, consulente finanziaria e assicurativa indipendente con sede in Svizzera. La guida copre ogni aspetto pratico del trasferimento in Svizzera — dai permessi di soggiorno alla ricerca di un appartamento, dal sistema fiscale svizzero all'assicurazione sanitaria, ai pilastri pensionistici e alla vita quotidiana. Tutte le informazioni sono verificate a gennaio 2026.",
      whatYouGet: "Cosa trovi nella guida",
      features: [
        "Permessi di soggiorno (B, C, L, G) — requisiti, tempistiche, rinnovo",
        "Trovare e affittare un appartamento — contratti, depositi, diritti dell'inquilino",
        "Sistema di trasporti svizzero — GA, metà prezzo, zone",
        "Istruzione in Svizzera — scuole pubbliche, università, corsi di lingua",
        "Sistema fiscale svizzero — differenze cantonali, dichiarazione dei redditi, deduzioni",
        "Sistema finanziario e assicurativo — banche, Krankenkasse, Pilastro 3a/3b",
        "Gestione rifiuti, patente di guida, importazione effetti personali",
        "Vita e cultura svizzera — etichetta, festività, gite",
        "Contatti e risorse — link ufficiali, numeri di emergenza",
      ],
      techSpecs: [
        "Formato: PDF, 39 pagine, A4",
        "Lingua: Inglese",
        "Verificato: gennaio 2026",
        "Download immediato dopo l'acquisto",
      ],
      ideal: "Ideale per expat, professionisti internazionali e chiunque stia pianificando di trasferirsi in Svizzera.",
    },
    fr: {
      name: "S'installer en Suisse — Guide Professionnel Complet 2026",
      tagline: "Tout ce qu'il vous faut pour démarrer votre vie suisse en toute confiance",
      description: "Un guide PDF complet de 39 pages rédigé par Adelaide Manta, conseillère financière et en assurances indépendante basée en Suisse. Ce guide couvre tous les aspects pratiques du déménagement en Suisse — des permis de séjour à la recherche d'un appartement, en passant par le système fiscal suisse, l'assurance maladie, les piliers de retraite et la vie quotidienne. Toutes les informations sont vérifiées à janvier 2026.",
      whatYouGet: "Ce que contient le guide",
      features: [
        "Permis de séjour (B, C, L, G) — conditions, délais, renouvellement",
        "Trouver et louer un appartement — contrats, dépôts, droits du locataire",
        "Système de transport suisse — AG, demi-tarif, zones",
        "Éducation en Suisse — écoles publiques, universités, cours de langue",
        "Système fiscal suisse — différences cantonales, déclaration d'impôts, déductions",
        "Système financier et assurances — banques, Krankenkasse, Pilier 3a/3b",
        "Gestion des déchets, permis de conduire, importation d'effets personnels",
        "Vie et culture suisses — étiquette, jours fériés, excursions",
        "Contacts et ressources — liens officiels, numéros d'urgence",
      ],
      techSpecs: [
        "Format : PDF, 39 pages, A4",
        "Langue : Anglais",
        "Vérifié : janvier 2026",
        "Téléchargement immédiat après l'achat",
      ],
      ideal: "Idéal pour les expatriés, les professionnels internationaux et toute personne envisageant de s'installer en Suisse.",
    },
    de: {
      name: "Umzug in die Schweiz — Vollständiger Professioneller Leitfaden 2026",
      tagline: "Alles, was Sie brauchen, um Ihr Schweizer Leben mit Zuversicht zu beginnen",
      description: "Ein umfassender 39-seitiger PDF-Leitfaden, verfasst von Adelaide Manta, unabhängiger Finanz- und Versicherungsberaterin mit Sitz in der Schweiz. Dieser Leitfaden deckt jeden praktischen Aspekt eines Umzugs in die Schweiz ab — von Aufenthaltsbewilligungen und Wohnungssuche bis hin zum Schweizer Steuersystem, Krankenversicherung, Vorsorgesäulen und dem Alltag. Alle Informationen wurden im Januar 2026 überprüft.",
      whatYouGet: "Was der Leitfaden enthält",
      features: [
        "Aufenthaltsbewilligungen (B, C, L, G) — Voraussetzungen, Fristen, Verlängerung",
        "Wohnung finden und mieten — Verträge, Kautionen, Mieterrechte",
        "Schweizer Transportsystem — GA, Halbtax, Zonen",
        "Bildung in der Schweiz — öffentliche Schulen, Universitäten, Sprachkurse",
        "Schweizer Steuersystem — kantonale Unterschiede, Steuererklärung, Abzüge",
        "Finanzsystem & Versicherungen — Banken, Krankenkasse, Säule 3a/3b",
        "Abfallentsorgung, Führerschein, Einfuhr von Hausrat",
        "Schweizer Leben & Kultur — Etikette, Feiertage, Ausflüge",
        "Kontakte & Ressourcen — offizielle Links, Notrufnummern",
      ],
      techSpecs: [
        "Format: PDF, 39 Seiten, A4",
        "Sprache: Englisch",
        "Überprüft: Januar 2026",
        "Sofortiger Download nach dem Kauf",
      ],
      ideal: "Ideal für Expats, internationale Fachkräfte und alle, die einen Umzug in die Schweiz planen.",
    },
  },

  "agenda-single": {
    en: {
      name: "Financial Agenda 2026 — Single Edition",
      tagline: "Your personal financial planner, built for life in Switzerland",
      description: "A complete digital financial agenda designed specifically for individuals living in Switzerland. Runs entirely in your browser — no app to install, no subscription, no cloud. Open the HTML file, add it to your phone's home screen, and it works like a native app. Your data is saved automatically in your browser and persists between sessions.",
      whatYouGet: "What's inside the agenda",
      features: [
        "365 daily pages — schedule, priorities, and daily spending tracker",
        "Monthly budget with auto-calculating totals and visual charts",
        "No Spending Day tracker and wishlist manager",
        "Swiss tax deadlines and Pillar 3a/2 contribution reminders",
        "Health insurance guide — basic (LAMal) and supplementary coverage",
        "Black Friday survival guide and Christmas gift budget planner",
        "Travel budget planner — monthly and annual overview",
        "Investment tips and mindful spending habits section",
        "Annual overview with visual charts and year-end summary",
      ],
      techSpecs: [
        "Format: HTML file (runs in any browser)",
        "Works offline — 100% private, no internet needed",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "Printable: clean A4 layout, navigation hides on print",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for individuals living or working in Switzerland who want to take control of their daily finances.",
    },
    it: {
      name: "Agenda Finanziaria 2026 — Edizione Single",
      tagline: "Il tuo pianificatore finanziario personale, pensato per la vita in Svizzera",
      description: "Un'agenda finanziaria digitale completa, progettata specificamente per chi vive in Svizzera. Funziona interamente nel browser — nessuna app da installare, nessun abbonamento, nessun cloud. Apri il file HTML, aggiungilo alla schermata home del tuo telefono e funziona come un'app nativa. I tuoi dati vengono salvati automaticamente nel browser e rimangono tra una sessione e l'altra.",
      whatYouGet: "Cosa trovi nell'agenda",
      features: [
        "365 pagine giornaliere — agenda, priorità e tracker delle spese quotidiane",
        "Budget mensile con totali automatici e grafici visivi",
        "Tracker 'Giorno Senza Spese' e gestore della wishlist",
        "Scadenze fiscali svizzere e promemoria contributi Pilastro 3a/2",
        "Guida all'assicurazione sanitaria — copertura base (LAMal) e complementare",
        "Guida sopravvivenza Black Friday e pianificatore regali di Natale",
        "Pianificatore budget viaggi — panoramica mensile e annuale",
        "Consigli sugli investimenti e sezione spesa consapevole",
        "Panoramica annuale con grafici visivi e riepilogo di fine anno",
      ],
      techSpecs: [
        "Formato: file HTML (funziona in qualsiasi browser)",
        "Funziona offline — 100% privato, nessuna connessione necessaria",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Stampabile: layout A4 pulito, la navigazione si nasconde in stampa",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per chi vive o lavora in Svizzera e vuole prendere il controllo delle proprie finanze quotidiane.",
    },
    fr: {
      name: "Agenda Financier 2026 — Édition Single",
      tagline: "Votre planificateur financier personnel, conçu pour la vie en Suisse",
      description: "Un agenda financier numérique complet, conçu spécifiquement pour les personnes vivant en Suisse. Fonctionne entièrement dans votre navigateur — aucune application à installer, aucun abonnement, aucun cloud. Ouvrez le fichier HTML, ajoutez-le à l'écran d'accueil de votre téléphone et il fonctionne comme une application native. Vos données sont enregistrées automatiquement dans votre navigateur et persistent entre les sessions.",
      whatYouGet: "Ce que contient l'agenda",
      features: [
        "365 pages quotidiennes — agenda, priorités et suivi des dépenses journalières",
        "Budget mensuel avec totaux automatiques et graphiques visuels",
        "Suivi des 'Jours Sans Dépenses' et gestionnaire de liste de souhaits",
        "Échéances fiscales suisses et rappels de cotisations Pilier 3a/2",
        "Guide de l'assurance maladie — couverture de base (LAMal) et complémentaire",
        "Guide de survie Black Friday et planificateur de cadeaux de Noël",
        "Planificateur de budget voyage — aperçu mensuel et annuel",
        "Conseils d'investissement et section dépenses responsables",
        "Aperçu annuel avec graphiques visuels et bilan de fin d'année",
      ],
      techSpecs: [
        "Format : fichier HTML (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — 100% privé, aucune connexion nécessaire",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Imprimable : mise en page A4 propre, la navigation se cache à l'impression",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les personnes vivant ou travaillant en Suisse qui souhaitent prendre le contrôle de leurs finances quotidiennes.",
    },
    de: {
      name: "Finanzagenda 2026 — Single-Edition",
      tagline: "Ihr persönlicher Finanzplaner, entwickelt für das Leben in der Schweiz",
      description: "Eine vollständige digitale Finanzagenda, speziell für Personen konzipiert, die in der Schweiz leben. Läuft vollständig in Ihrem Browser — keine App zu installieren, kein Abonnement, keine Cloud. Öffnen Sie die HTML-Datei, fügen Sie sie dem Startbildschirm Ihres Telefons hinzu und sie funktioniert wie eine native App. Ihre Daten werden automatisch im Browser gespeichert und bleiben zwischen den Sitzungen erhalten.",
      whatYouGet: "Was die Agenda enthält",
      features: [
        "365 Tagesseiten — Terminplaner, Prioritäten und täglicher Ausgaben-Tracker",
        "Monatsbudget mit automatisch berechneten Summen und visuellen Diagrammen",
        "Tracker für 'Tage ohne Ausgaben' und Wunschlisten-Manager",
        "Schweizer Steuerfristen und Erinnerungen für Säule-3a/2-Beiträge",
        "Krankenversicherungsführer — Grundversicherung (KVG) und Zusatzversicherung",
        "Black-Friday-Überlebensführer und Weihnachtsgeschenk-Budgetplaner",
        "Reisebudgetplaner — monatliche und jährliche Übersicht",
        "Investitionstipps und Abschnitt für bewusstes Ausgeben",
        "Jahresübersicht mit visuellen Diagrammen und Jahresabschluss",
      ],
      techSpecs: [
        "Format: HTML-Datei (läuft in jedem Browser)",
        "Funktioniert offline — 100% privat, keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Druckbar: sauberes A4-Layout, Navigation wird beim Drucken ausgeblendet",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Personen, die in der Schweiz leben oder arbeiten und ihre täglichen Finanzen in den Griff bekommen möchten.",
    },
  },

  "agenda-couples": {
    en: {
      name: "Financial Agenda 2026 — Couples Edition",
      tagline: "Plan your shared financial year together, built for Switzerland",
      description: "The Couples Edition of the Financial Agenda 2026 is designed for two people managing their finances together in Switzerland. It includes everything in the Single Edition, plus dedicated sections for shared savings goals, partner expense splitting, and joint budget planning. Perfect for couples, flatmates, or any two people who want financial clarity together.",
      whatYouGet: "What's inside the agenda",
      features: [
        "365 daily pages — shared schedule, priorities, and couple spending tracker",
        "Monthly budget with partner split view and auto-calculating totals",
        "Shared savings goals and joint wishlist manager",
        "Swiss tax deadlines and Pillar 3a/2 reminders for both partners",
        "Health insurance guide — individual and family coverage options",
        "Couple-specific sections: shared expenses, who paid what, balance tracker",
        "Travel budget planner for shared trips",
        "Annual overview with couple charts and year-end summary",
        "Black Friday and Christmas gift budget planner",
      ],
      techSpecs: [
        "Format: HTML file (runs in any browser)",
        "Works offline — 100% private, no internet needed",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "Printable: clean A4 layout",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for couples, partners, or flatmates living in Switzerland who want to manage shared and personal finances together.",
    },
    it: {
      name: "Agenda Finanziaria 2026 — Edizione Coppia",
      tagline: "Pianificate insieme il vostro anno finanziario, pensata per la Svizzera",
      description: "L'Edizione Coppia dell'Agenda Finanziaria 2026 è progettata per due persone che gestiscono le proprie finanze insieme in Svizzera. Include tutto ciò che è presente nell'Edizione Single, più sezioni dedicate agli obiettivi di risparmio condivisi, alla suddivisione delle spese tra partner e alla pianificazione del budget congiunto. Perfetta per coppie, coinquilini o chiunque voglia chiarezza finanziaria condivisa.",
      whatYouGet: "Cosa trovi nell'agenda",
      features: [
        "365 pagine giornaliere — agenda condivisa, priorità e tracker spese di coppia",
        "Budget mensile con vista suddivisione partner e totali automatici",
        "Obiettivi di risparmio condivisi e gestore wishlist congiunta",
        "Scadenze fiscali svizzere e promemoria Pilastro 3a/2 per entrambi i partner",
        "Guida all'assicurazione sanitaria — opzioni di copertura individuale e familiare",
        "Sezioni specifiche per coppia: spese condivise, chi ha pagato cosa, tracker saldo",
        "Pianificatore budget viaggi per gite condivise",
        "Panoramica annuale con grafici di coppia e riepilogo di fine anno",
        "Pianificatore budget Black Friday e regali di Natale",
      ],
      techSpecs: [
        "Formato: file HTML (funziona in qualsiasi browser)",
        "Funziona offline — 100% privato, nessuna connessione necessaria",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Stampabile: layout A4 pulito",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per coppie, partner o coinquilini che vivono in Svizzera e vogliono gestire insieme le finanze condivise e personali.",
    },
    fr: {
      name: "Agenda Financier 2026 — Édition Couple",
      tagline: "Planifiez ensemble votre année financière, conçu pour la Suisse",
      description: "L'Édition Couple de l'Agenda Financier 2026 est conçue pour deux personnes gérant leurs finances ensemble en Suisse. Elle comprend tout ce qui se trouve dans l'Édition Single, plus des sections dédiées aux objectifs d'épargne partagés, à la répartition des dépenses entre partenaires et à la planification budgétaire conjointe. Parfait pour les couples, les colocataires ou toute personne souhaitant une clarté financière partagée.",
      whatYouGet: "Ce que contient l'agenda",
      features: [
        "365 pages quotidiennes — agenda partagé, priorités et suivi des dépenses en couple",
        "Budget mensuel avec vue répartition partenaire et totaux automatiques",
        "Objectifs d'épargne partagés et gestionnaire de liste de souhaits commune",
        "Échéances fiscales suisses et rappels Pilier 3a/2 pour les deux partenaires",
        "Guide de l'assurance maladie — options de couverture individuelle et familiale",
        "Sections spécifiques au couple : dépenses partagées, qui a payé quoi, suivi du solde",
        "Planificateur de budget voyage pour les sorties partagées",
        "Aperçu annuel avec graphiques de couple et bilan de fin d'année",
        "Planificateur de budget Black Friday et cadeaux de Noël",
      ],
      techSpecs: [
        "Format : fichier HTML (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — 100% privé, aucune connexion nécessaire",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Imprimable : mise en page A4 propre",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les couples, partenaires ou colocataires vivant en Suisse qui souhaitent gérer ensemble leurs finances partagées et personnelles.",
    },
    de: {
      name: "Finanzagenda 2026 — Paar-Edition",
      tagline: "Planen Sie Ihr gemeinsames Finanzjahr zusammen, entwickelt für die Schweiz",
      description: "Die Paar-Edition der Finanzagenda 2026 ist für zwei Personen konzipiert, die ihre Finanzen gemeinsam in der Schweiz verwalten. Sie enthält alles aus der Single-Edition, plus spezielle Abschnitte für gemeinsame Sparziele, Partneraufteilung der Ausgaben und gemeinsame Budgetplanung. Perfekt für Paare, Mitbewohner oder alle, die gemeinsam finanzielle Klarheit wollen.",
      whatYouGet: "Was die Agenda enthält",
      features: [
        "365 Tagesseiten — gemeinsamer Terminplaner, Prioritäten und Paar-Ausgaben-Tracker",
        "Monatsbudget mit Partner-Aufteilungsansicht und automatisch berechneten Summen",
        "Gemeinsame Sparziele und gemeinsamer Wunschlisten-Manager",
        "Schweizer Steuerfristen und Säule-3a/2-Erinnerungen für beide Partner",
        "Krankenversicherungsführer — individuelle und familiäre Deckungsoptionen",
        "Paar-spezifische Abschnitte: gemeinsame Ausgaben, wer was bezahlt hat, Saldo-Tracker",
        "Reisebudgetplaner für gemeinsame Ausflüge",
        "Jahresübersicht mit Paar-Diagrammen und Jahresabschluss",
        "Black-Friday- und Weihnachtsgeschenk-Budgetplaner",
      ],
      techSpecs: [
        "Format: HTML-Datei (läuft in jedem Browser)",
        "Funktioniert offline — 100% privat, keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Druckbar: sauberes A4-Layout",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Paare, Partner oder Mitbewohner in der Schweiz, die gemeinsame und persönliche Finanzen zusammen verwalten möchten.",
    },
  },

  // Canonical key (matches Home.tsx product keys)
  "budget-manager-personal": {
    en: {
      name: "BudgetManager Pro — Personal Edition",
      tagline: "The Swiss budget tracker for individuals — track, compare, optimize",
      description: "BudgetManager Pro is a powerful monthly budget tracker built specifically for life in Switzerland. Enter your income, add your expenses by category, and instantly see how your budget compares to Swiss averages across all 26 cantons. Includes interactive charts, PDF/CSV export, dark mode, and 5 languages — all 100% offline in your browser.",
      whatYouGet: "What's inside BudgetManager Pro",
      features: [
        "Monthly income & expense tracker with Swiss-specific categories",
        "All 26 cantons — compare your budget vs. Swiss averages by canton",
        "Interactive charts: income vs. expenses, savings rate, category breakdown",
        "Swiss categories: Krankenkasse, GA/Half-Fare, Pillar 3a, taxes",
        "Monthly trend analysis and multi-month historical tracking",
        "PDF & CSV export for tax preparation and record keeping",
        "Dark mode, 5 languages (EN, IT, FR, DE, ES)",
        "100% offline — your data never leaves your device",
        "License key included — one-time activation, no subscription",
      ],
      techSpecs: [
        "Format: HTML file + license.js (runs in any browser)",
        "Works offline — no internet connection needed after activation",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX format",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for individuals living in Switzerland who want to track their budget against Swiss benchmarks and optimize their spending.",
    },
    it: {
      name: "BudgetManager Pro — Edizione Personale",
      tagline: "Il tracker di budget svizzero per individui — traccia, confronta, ottimizza",
      description: "BudgetManager Pro è un potente tracker di budget mensile costruito specificamente per la vita in Svizzera.",
      whatYouGet: "Cosa trovi in BudgetManager Pro",
      features: [
        "Tracker mensile di entrate e uscite con categorie specifiche svizzere",
        "Tutti i 26 cantoni — confronta il tuo budget con le medie svizzere per cantone",
        "Grafici interattivi: entrate vs. uscite, tasso di risparmio, suddivisione per categoria",
        "Categorie svizzere: Krankenkasse, GA/Metà Prezzo, Pilastro 3a, tasse",
        "Analisi delle tendenze mensili e monitoraggio storico multi-mese",
        "Esportazione PDF e CSV per la dichiarazione dei redditi",
        "Modalità scura, 5 lingue (EN, IT, FR, DE, ES)",
        "100% offline — i tuoi dati non lasciano mai il tuo dispositivo",
        "Chiave di licenza inclusa — attivazione una tantum, nessun abbonamento",
      ],
      techSpecs: [
        "Formato: file HTML + license.js (funziona in qualsiasi browser)",
        "Funziona offline — nessuna connessione internet necessaria dopo l'attivazione",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per chi vive in Svizzera e vuole monitorare il proprio budget rispetto ai benchmark svizzeri.",
    },
    fr: {
      name: "BudgetManager Pro — Édition Personnelle",
      tagline: "Le tracker de budget suisse pour les particuliers — suivez, comparez, optimisez",
      description: "BudgetManager Pro est un puissant tracker de budget mensuel conçu spécifiquement pour la vie en Suisse.",
      whatYouGet: "Ce que contient BudgetManager Pro",
      features: [
        "Suivi mensuel des revenus et dépenses avec des catégories spécifiques à la Suisse",
        "Les 26 cantons — comparez votre budget aux moyennes suisses par canton",
        "Graphiques interactifs : revenus vs. dépenses, taux d'épargne, répartition par catégorie",
        "Catégories suisses : Krankenkasse, AG/demi-tarif, Pilier 3a, impôts",
        "Analyse des tendances mensuelles et suivi historique multi-mois",
        "Export PDF et CSV pour la déclaration d'impôts",
        "Mode sombre, 5 langues (EN, IT, FR, DE, ES)",
        "100% hors ligne — vos données ne quittent jamais votre appareil",
        "Clé de licence incluse — activation unique, pas d'abonnement",
      ],
      techSpecs: [
        "Format : fichier HTML + license.js (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — aucune connexion internet nécessaire après activation",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les personnes vivant en Suisse qui souhaitent suivre leur budget par rapport aux références suisses.",
    },
    de: {
      name: "BudgetManager Pro — Persönliche Edition",
      tagline: "Der Schweizer Budget-Tracker für Einzelpersonen — verfolgen, vergleichen, optimieren",
      description: "BudgetManager Pro ist ein leistungsstarker monatlicher Budget-Tracker, der speziell für das Leben in der Schweiz entwickelt wurde.",
      whatYouGet: "Was BudgetManager Pro enthält",
      features: [
        "Monatlicher Einnahmen- und Ausgaben-Tracker mit schweizspezifischen Kategorien",
        "Alle 26 Kantone — vergleichen Sie Ihr Budget mit Schweizer Durchschnittswerten nach Kanton",
        "Interaktive Diagramme: Einnahmen vs. Ausgaben, Sparquote, Kategorieaufschlüsselung",
        "Schweizer Kategorien: Krankenkasse, GA/Halbtax, Säule 3a, Steuern",
        "Monatliche Trendanalyse und mehrmonatiges historisches Tracking",
        "PDF- und CSV-Export für Steuererklärung und Aufzeichnungen",
        "Dunkelmodus, 5 Sprachen (EN, IT, FR, DE, ES)",
        "100% offline — Ihre Daten verlassen nie Ihr Gerät",
        "Lizenzschlüssel inklusive — einmalige Aktivierung, kein Abonnement",
      ],
      techSpecs: [
        "Format: HTML-Datei + license.js (läuft in jedem Browser)",
        "Funktioniert offline — nach der Aktivierung keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Personen in der Schweiz, die ihr Budget anhand Schweizer Benchmarks verfolgen und ihre Ausgaben optimieren möchten.",
    },
  },

  // Legacy key alias
  "budget-personal": {
    en: {
      name: "BudgetManager Pro — Personal Edition",
      tagline: "The budget app built specifically for Swiss life",
      description: "BudgetManager Pro is a complete offline budget tracking application designed exclusively for Switzerland. It runs in your browser as a single HTML file — no subscription, no cloud, no account needed. Your financial data never leaves your device. The app includes Swiss-specific expense categories (Krankenkasse, Pillar 3a, GA, cantonal taxes), benchmarks for all 26 cantons, and a license key for activation.",
      whatYouGet: "What's inside BudgetManager Pro",
      features: [
        "Swiss-specific expense categories: Krankenkasse, Pillar 3a, GA, cantonal taxes, Kita",
        "All 26 cantons — compare your budget against Swiss cantonal averages",
        "Interactive charts and graphs — income vs. expenses, savings rate, trends",
        "Multi-month planning and historical tracking",
        "PDF & CSV export for tax preparation and personal records",
        "Dark mode for comfortable evening use",
        "5 languages: EN, IT, FR, DE, ES",
        "100% offline — your data stays private on your device",
        "License key included — one-time activation, no subscription",
      ],
      techSpecs: [
        "Format: HTML file + license.js (runs in any browser)",
        "Works offline — no internet connection needed after activation",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX format",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for individuals living in Switzerland who want a private, offline budget tool tailored to Swiss expenses and benchmarks.",
    },
    it: {
      name: "BudgetManager Pro — Edizione Personale",
      tagline: "L'app per il budget costruita specificamente per la vita in Svizzera",
      description: "BudgetManager Pro è un'applicazione completa per il monitoraggio del budget offline, progettata esclusivamente per la Svizzera. Funziona nel browser come un singolo file HTML — nessun abbonamento, nessun cloud, nessun account necessario. I tuoi dati finanziari non lasciano mai il tuo dispositivo. L'app include categorie di spesa specifiche per la Svizzera (Krankenkasse, Pilastro 3a, GA, tasse cantonali), benchmark per tutti i 26 cantoni e una chiave di licenza per l'attivazione.",
      whatYouGet: "Cosa trovi in BudgetManager Pro",
      features: [
        "Categorie di spesa svizzere: Krankenkasse, Pilastro 3a, GA, tasse cantonali, Kita",
        "Tutti i 26 cantoni — confronta il tuo budget con le medie cantonali svizzere",
        "Grafici e diagrammi interattivi — entrate vs. uscite, tasso di risparmio, tendenze",
        "Pianificazione multi-mese e monitoraggio storico",
        "Esportazione PDF e CSV per la dichiarazione dei redditi e i registri personali",
        "Modalità scura per un uso confortevole serale",
        "5 lingue: EN, IT, FR, DE, ES",
        "100% offline — i tuoi dati rimangono privati sul tuo dispositivo",
        "Chiave di licenza inclusa — attivazione una tantum, nessun abbonamento",
      ],
      techSpecs: [
        "Formato: file HTML + license.js (funziona in qualsiasi browser)",
        "Funziona offline — nessuna connessione internet necessaria dopo l'attivazione",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per chi vive in Svizzera e vuole uno strumento di budget privato e offline, adattato alle spese e ai benchmark svizzeri.",
    },
    fr: {
      name: "BudgetManager Pro — Édition Personnelle",
      tagline: "L'application budgétaire conçue spécifiquement pour la vie en Suisse",
      description: "BudgetManager Pro est une application complète de suivi budgétaire hors ligne, conçue exclusivement pour la Suisse. Elle fonctionne dans votre navigateur sous la forme d'un seul fichier HTML — aucun abonnement, aucun cloud, aucun compte nécessaire. Vos données financières ne quittent jamais votre appareil. L'application comprend des catégories de dépenses spécifiques à la Suisse (Krankenkasse, Pilier 3a, AG, impôts cantonaux), des références pour les 26 cantons et une clé de licence pour l'activation.",
      whatYouGet: "Ce que contient BudgetManager Pro",
      features: [
        "Catégories de dépenses suisses : Krankenkasse, Pilier 3a, AG, impôts cantonaux, Kita",
        "Les 26 cantons — comparez votre budget aux moyennes cantonales suisses",
        "Graphiques et diagrammes interactifs — revenus vs. dépenses, taux d'épargne, tendances",
        "Planification multi-mois et suivi historique",
        "Export PDF et CSV pour la déclaration d'impôts et les dossiers personnels",
        "Mode sombre pour une utilisation confortable en soirée",
        "5 langues : EN, IT, FR, DE, ES",
        "100% hors ligne — vos données restent privées sur votre appareil",
        "Clé de licence incluse — activation unique, pas d'abonnement",
      ],
      techSpecs: [
        "Format : fichier HTML + license.js (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — aucune connexion internet nécessaire après activation",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les personnes vivant en Suisse qui souhaitent un outil budgétaire privé et hors ligne, adapté aux dépenses et aux références suisses.",
    },
    de: {
      name: "BudgetManager Pro — Persönliche Edition",
      tagline: "Die Budget-App, die speziell für das Leben in der Schweiz entwickelt wurde",
      description: "BudgetManager Pro ist eine vollständige Offline-Budget-Tracking-Anwendung, die ausschließlich für die Schweiz entwickelt wurde. Sie läuft in Ihrem Browser als einzelne HTML-Datei — kein Abonnement, keine Cloud, kein Konto erforderlich. Ihre Finanzdaten verlassen niemals Ihr Gerät. Die App enthält schweizspezifische Ausgabenkategorien (Krankenkasse, Säule 3a, GA, Kantonssteuern), Benchmarks für alle 26 Kantone und einen Lizenzschlüssel zur Aktivierung.",
      whatYouGet: "Was BudgetManager Pro enthält",
      features: [
        "Schweizer Ausgabenkategorien: Krankenkasse, Säule 3a, GA, Kantonssteuern, Kita",
        "Alle 26 Kantone — vergleichen Sie Ihr Budget mit kantonalen Schweizer Durchschnittswerten",
        "Interaktive Diagramme und Grafiken — Einnahmen vs. Ausgaben, Sparquote, Trends",
        "Mehrmonatige Planung und historisches Tracking",
        "PDF- und CSV-Export für Steuererklärung und persönliche Unterlagen",
        "Dunkelmodus für komfortablen Abendgebrauch",
        "5 Sprachen: EN, IT, FR, DE, ES",
        "100% offline — Ihre Daten bleiben privat auf Ihrem Gerät",
        "Lizenzschlüssel inklusive — einmalige Aktivierung, kein Abonnement",
      ],
      techSpecs: [
        "Format: HTML-Datei + license.js (läuft in jedem Browser)",
        "Funktioniert offline — nach der Aktivierung keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Personen in der Schweiz, die ein privates, offline Budget-Tool wünschen, das auf Schweizer Ausgaben und Benchmarks zugeschnitten ist.",
    },
  },

  // Canonical key (matches Home.tsx product keys)
  "budget-manager-family": {
    en: {
      name: "BudgetManager Pro — Family Edition",
      tagline: "Complete household budget management for Swiss families",
      description: "BudgetManager Pro Family is the household version of BudgetManager Pro, designed for couples and families managing shared finances in Switzerland. It supports up to 4 individual profiles within a single household dashboard, with a smart split calculator that shows exactly who owes what. Includes all Swiss-specific categories — Krankenkasse for each family member, Kita fees, cantonal taxes, and Pillar 3a contributions.",
      whatYouGet: "What's inside BudgetManager Pro Family",
      features: [
        "Up to 4 individual profiles — track personal and shared expenses separately",
        "Household dashboard — see the full family financial picture at a glance",
        "Smart split calculator — who paid what, who owes what, instant balance",
        "Swiss family categories: Krankenkasse per person, Kita, school fees, family GA",
        "All 26 cantons — compare household budget vs. Swiss family averages by canton",
        "Interactive charts: income vs. expenses, savings rate, per-person breakdown",
        "Multi-month planning and historical tracking",
        "PDF & CSV export for tax preparation and family records",
        "Dark mode, 5 languages, 100% offline",
        "License key included — one-time activation, no subscription",
      ],
      techSpecs: [
        "Format: HTML file + license.js (runs in any browser)",
        "Works offline — no internet connection needed after activation",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX format",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for couples and families living in Switzerland who need to track both shared household expenses and individual spending in one place.",
    },
    it: {
      name: "BudgetManager Pro — Edizione Famiglia",
      tagline: "Gestione completa del budget familiare per le famiglie svizzere",
      description: "BudgetManager Pro Famiglia è la versione domestica di BudgetManager Pro, progettata per coppie e famiglie che gestiscono le finanze condivise in Svizzera.",
      whatYouGet: "Cosa trovi in BudgetManager Pro Famiglia",
      features: [
        "Fino a 4 profili individuali — traccia le spese personali e condivise separatamente",
        "Dashboard familiare — visualizza l'intera situazione finanziaria della famiglia a colpo d'occhio",
        "Calcolatore di suddivisione intelligente — chi ha pagato cosa, chi deve cosa",
        "Categorie svizzere per famiglie: Krankenkasse per persona, Kita, spese scolastiche, GA familiare",
        "Tutti i 26 cantoni — confronta il budget familiare con le medie svizzere per cantone",
        "Grafici interattivi: entrate vs. uscite, tasso di risparmio, suddivisione per persona",
        "Pianificazione multi-mese e monitoraggio storico",
        "Esportazione PDF e CSV per la dichiarazione dei redditi e i registri familiari",
        "Modalità scura, 5 lingue, 100% offline",
        "Chiave di licenza inclusa — attivazione una tantum, nessun abbonamento",
      ],
      techSpecs: [
        "Formato: file HTML + license.js (funziona in qualsiasi browser)",
        "Funziona offline — nessuna connessione internet necessaria dopo l'attivazione",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per coppie e famiglie che vivono in Svizzera e hanno bisogno di tracciare sia le spese domestiche condivise che quelle individuali in un unico posto.",
    },
    fr: {
      name: "BudgetManager Pro — Édition Famille",
      tagline: "Gestion complète du budget familial pour les familles suisses",
      description: "BudgetManager Pro Famille est la version ménagère de BudgetManager Pro, conçue pour les couples et les familles gérant leurs finances partagées en Suisse.",
      whatYouGet: "Ce que contient BudgetManager Pro Famille",
      features: [
        "Jusqu'à 4 profils individuels — suivez les dépenses personnelles et partagées séparément",
        "Tableau de bord familial — visualisez la situation financière complète de la famille en un coup d'œil",
        "Calculateur de répartition intelligent — qui a payé quoi, qui doit quoi",
        "Catégories suisses pour familles : Krankenkasse par personne, crèche, frais scolaires, AG familial",
        "Les 26 cantons — comparez le budget familial aux moyennes suisses par canton",
        "Graphiques interactifs : revenus vs. dépenses, taux d'épargne, répartition par personne",
        "Planification multi-mois et suivi historique",
        "Export PDF et CSV pour la déclaration d'impôts et les dossiers familiaux",
        "Mode sombre, 5 langues, 100% hors ligne",
        "Clé de licence incluse — activation unique, pas d'abonnement",
      ],
      techSpecs: [
        "Format : fichier HTML + license.js (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — aucune connexion internet nécessaire après activation",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les couples et les familles vivant en Suisse qui ont besoin de suivre à la fois les dépenses ménagères partagées et les dépenses individuelles en un seul endroit.",
    },
    de: {
      name: "BudgetManager Pro — Familien-Edition",
      tagline: "Vollständiges Haushaltsbudget-Management für Schweizer Familien",
      description: "BudgetManager Pro Familie ist die Haushaltsversion von BudgetManager Pro, konzipiert für Paare und Familien, die gemeinsame Finanzen in der Schweiz verwalten.",
      whatYouGet: "Was BudgetManager Pro Familie enthält",
      features: [
        "Bis zu 4 individuelle Profile — verfolgen Sie persönliche und gemeinsame Ausgaben getrennt",
        "Haushalts-Dashboard — sehen Sie das gesamte finanzielle Bild der Familie auf einen Blick",
        "Intelligenter Aufteilungsrechner — wer hat was bezahlt, wer schuldet was",
        "Schweizer Familienkategorien: Krankenkasse pro Person, Kita, Schulgebühren, Familien-GA",
        "Alle 26 Kantone — vergleichen Sie das Familienbudget mit Schweizer Familiendurchschnittswerten nach Kanton",
        "Interaktive Diagramme: Einnahmen vs. Ausgaben, Sparquote, Aufschlüsselung pro Person",
        "Mehrmonatige Planung und historisches Tracking",
        "PDF- und CSV-Export für Steuererklärung und Familienunterlagen",
        "Dunkelmodus, 5 Sprachen, 100% offline",
        "Lizenzschlüssel inklusive — einmalige Aktivierung, kein Abonnement",
      ],
      techSpecs: [
        "Format: HTML-Datei + license.js (läuft in jedem Browser)",
        "Funktioniert offline — nach der Aktivierung keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Paare und Familien in der Schweiz, die sowohl gemeinsame Haushaltsausgaben als auch individuelle Ausgaben an einem Ort verfolgen müssen.",
    },
  },

  // Legacy key alias
  "budget-family": {
    en: {
      name: "BudgetManager Pro — Family Edition",
      tagline: "Complete household budget management for Swiss families",
      description: "BudgetManager Pro Family is the household version of BudgetManager Pro, designed for couples and families managing shared finances in Switzerland. It supports up to 4 individual profiles within a single household dashboard, with a smart split calculator that shows exactly who owes what. Includes all Swiss-specific categories — Krankenkasse for each family member, Kita fees, cantonal taxes, and Pillar 3a contributions.",
      whatYouGet: "What's inside BudgetManager Pro Family",
      features: [
        "Up to 4 individual profiles — track personal and shared expenses separately",
        "Household dashboard — see the full family financial picture at a glance",
        "Smart split calculator — who paid what, who owes what, instant balance",
        "Swiss family categories: Krankenkasse per person, Kita, school fees, family GA",
        "All 26 cantons — compare household budget vs. Swiss family averages by canton",
        "Interactive charts: income vs. expenses, savings rate, per-person breakdown",
        "Multi-month planning and historical tracking",
        "PDF & CSV export for tax preparation and family records",
        "Dark mode, 5 languages, 100% offline",
        "License key included — one-time activation, no subscription",
      ],
      techSpecs: [
        "Format: HTML file + license.js (runs in any browser)",
        "Works offline — no internet connection needed after activation",
        "Add to Home Screen for app-like experience (iOS & Android)",
        "Data saved automatically in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX format",
        "Languages: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal for couples and families living in Switzerland who need to track both shared household expenses and individual spending in one place.",
    },
    it: {
      name: "BudgetManager Pro — Edizione Famiglia",
      tagline: "Gestione completa del budget familiare per le famiglie svizzere",
      description: "BudgetManager Pro Famiglia è la versione domestica di BudgetManager Pro, progettata per coppie e famiglie che gestiscono le finanze condivise in Svizzera. Supporta fino a 4 profili individuali all'interno di un unico dashboard familiare, con un calcolatore di suddivisione intelligente che mostra esattamente chi deve cosa. Include tutte le categorie specifiche svizzere — Krankenkasse per ogni membro della famiglia, spese Kita, tasse cantonali e contributi al Pilastro 3a.",
      whatYouGet: "Cosa trovi in BudgetManager Pro Famiglia",
      features: [
        "Fino a 4 profili individuali — traccia le spese personali e condivise separatamente",
        "Dashboard familiare — visualizza l'intera situazione finanziaria della famiglia a colpo d'occhio",
        "Calcolatore di suddivisione intelligente — chi ha pagato cosa, chi deve cosa, saldo istantaneo",
        "Categorie svizzere per famiglie: Krankenkasse per persona, Kita, spese scolastiche, GA familiare",
        "Tutti i 26 cantoni — confronta il budget familiare con le medie svizzere per canton",
        "Grafici interattivi: entrate vs. uscite, tasso di risparmio, suddivisione per persona",
        "Pianificazione multi-mese e monitoraggio storico",
        "Esportazione PDF e CSV per la dichiarazione dei redditi e i registri familiari",
        "Modalità scura, 5 lingue, 100% offline",
        "Chiave di licenza inclusa — attivazione una tantum, nessun abbonamento",
      ],
      techSpecs: [
        "Formato: file HTML + license.js (funziona in qualsiasi browser)",
        "Funziona offline — nessuna connessione internet necessaria dopo l'attivazione",
        "Aggiungi alla schermata home per un'esperienza simile a un'app (iOS e Android)",
        "Dati salvati automaticamente nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
        "Lingue: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideale per coppie e famiglie che vivono in Svizzera e hanno bisogno di tracciare sia le spese domestiche condivise che quelle individuali in un unico posto.",
    },
    fr: {
      name: "BudgetManager Pro — Édition Famille",
      tagline: "Gestion complète du budget familial pour les familles suisses",
      description: "BudgetManager Pro Famille est la version ménagère de BudgetManager Pro, conçue pour les couples et les familles gérant leurs finances partagées en Suisse. Il prend en charge jusqu'à 4 profils individuels au sein d'un seul tableau de bord familial, avec un calculateur de répartition intelligent qui montre exactement qui doit quoi. Comprend toutes les catégories spécifiques suisses — Krankenkasse pour chaque membre de la famille, frais de crèche, impôts cantonaux et cotisations au Pilier 3a.",
      whatYouGet: "Ce que contient BudgetManager Pro Famille",
      features: [
        "Jusqu'à 4 profils individuels — suivez les dépenses personnelles et partagées séparément",
        "Tableau de bord familial — visualisez la situation financière complète de la famille en un coup d'œil",
        "Calculateur de répartition intelligent — qui a payé quoi, qui doit quoi, solde instantané",
        "Catégories suisses pour familles : Krankenkasse par personne, crèche, frais scolaires, AG familial",
        "Les 26 cantons — comparez le budget familial aux moyennes suisses par canton",
        "Graphiques interactifs : revenus vs. dépenses, taux d'épargne, répartition par personne",
        "Planification multi-mois et suivi historique",
        "Export PDF et CSV pour la déclaration d'impôts et les dossiers familiaux",
        "Mode sombre, 5 langues, 100% hors ligne",
        "Clé de licence incluse — activation unique, pas d'abonnement",
      ],
      techSpecs: [
        "Format : fichier HTML + license.js (fonctionne dans n'importe quel navigateur)",
        "Fonctionne hors ligne — aucune connexion internet nécessaire après activation",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application (iOS et Android)",
        "Données enregistrées automatiquement dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
        "Langues : EN, IT, FR, DE, ES",
      ],
      ideal: "Idéal pour les couples et les familles vivant en Suisse qui ont besoin de suivre à la fois les dépenses ménagères partagées et les dépenses individuelles en un seul endroit.",
    },
    de: {
      name: "BudgetManager Pro — Familien-Edition",
      tagline: "Vollständiges Haushaltsbudget-Management für Schweizer Familien",
      description: "BudgetManager Pro Familie ist die Haushaltsversion von BudgetManager Pro, konzipiert für Paare und Familien, die gemeinsame Finanzen in der Schweiz verwalten. Es unterstützt bis zu 4 individuelle Profile innerhalb eines einzigen Haushalts-Dashboards, mit einem intelligenten Aufteilungsrechner, der genau zeigt, wer was schuldet. Enthält alle schweizspezifischen Kategorien — Krankenkasse für jedes Familienmitglied, Kita-Gebühren, Kantonssteuern und Säule-3a-Beiträge.",
      whatYouGet: "Was BudgetManager Pro Familie enthält",
      features: [
        "Bis zu 4 individuelle Profile — verfolgen Sie persönliche und gemeinsame Ausgaben getrennt",
        "Haushalts-Dashboard — sehen Sie das gesamte finanzielle Bild der Familie auf einen Blick",
        "Intelligenter Aufteilungsrechner — wer hat was bezahlt, wer schuldet was, sofortiger Saldo",
        "Schweizer Familienkategorien: Krankenkasse pro Person, Kita, Schulgebühren, Familien-GA",
        "Alle 26 Kantone — vergleichen Sie das Familienbudget mit Schweizer Familiendurchschnittswerten nach Kanton",
        "Interaktive Diagramme: Einnahmen vs. Ausgaben, Sparquote, Aufschlüsselung pro Person",
        "Mehrmonatige Planung und historisches Tracking",
        "PDF- und CSV-Export für Steuererklärung und Familienunterlagen",
        "Dunkelmodus, 5 Sprachen, 100% offline",
        "Lizenzschlüssel inklusive — einmalige Aktivierung, kein Abonnement",
      ],
      techSpecs: [
        "Format: HTML-Datei + license.js (läuft in jedem Browser)",
        "Funktioniert offline — nach der Aktivierung keine Internetverbindung erforderlich",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung (iOS & Android)",
        "Daten automatisch im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
        "Sprachen: EN, IT, FR, DE, ES",
      ],
      ideal: "Ideal für Paare und Familien in der Schweiz, die sowohl gemeinsame Haushaltsausgaben als auch individuelle Ausgaben an einem Ort verfolgen müssen.",
    },
  },

  "single-bundle": {
    en: {
      name: "Single Money Bundle 2026 — Financial Agenda + BudgetManager Pro",
      tagline: "The complete financial toolkit for one person in Switzerland. Save 21%.",
      description: "The Single Money Bundle combines the Financial Agenda 2026 (Single Edition) and BudgetManager Pro (Personal Edition) into one package at a 21% discount. Plan your days and goals with the Agenda, then track every franc against Swiss benchmarks with BudgetManager. Both tools run 100% offline in your browser, require no subscription, and are yours forever.",
      whatYouGet: "What's included in the bundle",
      features: [
        "Financial Agenda 2026 — Single Edition (CHF 14.90 value)",
        "BudgetManager Pro — Personal Edition (CHF 22.90 value)",
        "BudgetManager license key included",
        "Save CHF 7.90 vs. buying separately",
        "Both tools work 100% offline — no subscription, no cloud",
        "All 26 Swiss cantons, Krankenkasse, Pillar 3a, Swiss tax reminders",
        "5 languages: EN, IT, FR, DE, ES",
        "Instant download after purchase",
      ],
      techSpecs: [
        "2 HTML files + license.js",
        "Works offline in any browser",
        "Add to Home Screen for app-like experience",
        "Data saved in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideal for individuals living in Switzerland who want both a daily planner and a budget tracker in one purchase.",
    },
    it: {
      name: "Single Money Bundle 2026 — Agenda Finanziaria + BudgetManager Pro",
      tagline: "Il kit finanziario completo per una persona in Svizzera. Risparmia il 21%.",
      description: "Il Single Money Bundle combina l'Agenda Finanziaria 2026 (Edizione Single) e BudgetManager Pro (Edizione Personale) in un unico pacchetto con il 21% di sconto. Pianifica le tue giornate e i tuoi obiettivi con l'Agenda, poi traccia ogni franco rispetto ai benchmark svizzeri con BudgetManager. Entrambi gli strumenti funzionano al 100% offline nel browser, non richiedono abbonamento e sono tuoi per sempre.",
      whatYouGet: "Cosa è incluso nel bundle",
      features: [
        "Agenda Finanziaria 2026 — Edizione Single (valore CHF 14.90)",
        "BudgetManager Pro — Edizione Personale (valore CHF 22.90)",
        "Chiave di licenza BudgetManager inclusa",
        "Risparmia CHF 7.90 rispetto all'acquisto separato",
        "Entrambi gli strumenti funzionano al 100% offline — nessun abbonamento, nessun cloud",
        "Tutti i 26 cantoni svizzeri, Krankenkasse, Pilastro 3a, promemoria fiscali svizzeri",
        "5 lingue: EN, IT, FR, DE, ES",
        "Download immediato dopo l'acquisto",
      ],
      techSpecs: [
        "2 file HTML + license.js",
        "Funziona offline in qualsiasi browser",
        "Aggiungi alla schermata home per un'esperienza simile a un'app",
        "Dati salvati nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideale per chi vive in Svizzera e vuole sia un pianificatore giornaliero che un tracker del budget in un unico acquisto.",
    },
    fr: {
      name: "Single Money Bundle 2026 — Agenda Financier + BudgetManager Pro",
      tagline: "La boîte à outils financière complète pour une personne en Suisse. Économisez 21%.",
      description: "Le Single Money Bundle combine l'Agenda Financier 2026 (Édition Single) et BudgetManager Pro (Édition Personnelle) en un seul package avec 21% de réduction. Planifiez vos journées et vos objectifs avec l'Agenda, puis suivez chaque franc par rapport aux références suisses avec BudgetManager. Les deux outils fonctionnent 100% hors ligne dans votre navigateur, ne nécessitent aucun abonnement et vous appartiennent pour toujours.",
      whatYouGet: "Ce qui est inclus dans le bundle",
      features: [
        "Agenda Financier 2026 — Édition Single (valeur CHF 14.90)",
        "BudgetManager Pro — Édition Personnelle (valeur CHF 22.90)",
        "Clé de licence BudgetManager incluse",
        "Économisez CHF 7.90 par rapport à l'achat séparé",
        "Les deux outils fonctionnent 100% hors ligne — aucun abonnement, aucun cloud",
        "Les 26 cantons suisses, Krankenkasse, Pilier 3a, rappels fiscaux suisses",
        "5 langues : EN, IT, FR, DE, ES",
        "Téléchargement immédiat après l'achat",
      ],
      techSpecs: [
        "2 fichiers HTML + license.js",
        "Fonctionne hors ligne dans n'importe quel navigateur",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application",
        "Données enregistrées dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Idéal pour les personnes vivant en Suisse qui souhaitent à la fois un planificateur quotidien et un suivi budgétaire en un seul achat.",
    },
    de: {
      name: "Single Money Bundle 2026 — Finanzagenda + BudgetManager Pro",
      tagline: "Das vollständige Finanz-Toolkit für eine Person in der Schweiz. Sparen Sie 21%.",
      description: "Das Single Money Bundle kombiniert die Finanzagenda 2026 (Single-Edition) und BudgetManager Pro (Persönliche Edition) in einem Paket mit 21% Rabatt. Planen Sie Ihre Tage und Ziele mit der Agenda, dann verfolgen Sie jeden Franken anhand Schweizer Benchmarks mit BudgetManager. Beide Tools laufen 100% offline in Ihrem Browser, benötigen kein Abonnement und gehören Ihnen für immer.",
      whatYouGet: "Was im Bundle enthalten ist",
      features: [
        "Finanzagenda 2026 — Single-Edition (Wert CHF 14.90)",
        "BudgetManager Pro — Persönliche Edition (Wert CHF 22.90)",
        "BudgetManager-Lizenzschlüssel inklusive",
        "Sparen Sie CHF 7.90 gegenüber dem Einzelkauf",
        "Beide Tools funktionieren 100% offline — kein Abonnement, keine Cloud",
        "Alle 26 Schweizer Kantone, Krankenkasse, Säule 3a, Schweizer Steuererinnerungen",
        "5 Sprachen: EN, IT, FR, DE, ES",
        "Sofortiger Download nach dem Kauf",
      ],
      techSpecs: [
        "2 HTML-Dateien + license.js",
        "Funktioniert offline in jedem Browser",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung",
        "Daten im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideal für Personen in der Schweiz, die sowohl einen Tagesplaner als auch einen Budget-Tracker in einem Kauf möchten.",
    },
  },

  "family-bundle": {
    en: {
      name: "Family Money Bundle 2026 — Financial Agenda Couples + BudgetManager Family",
      tagline: "The complete financial toolkit for couples and families in Switzerland. Save 24%.",
      description: "The Family Money Bundle combines the Financial Agenda 2026 (Couples Edition) and BudgetManager Pro (Family Edition) into one package at a 24% discount. Plan your shared year with the Couples Agenda, then track every household franc against Swiss family averages with BudgetManager Family. Both tools run 100% offline, require no subscription, and handle everything from Kita fees to Pillar 3a.",
      whatYouGet: "What's included in the bundle",
      features: [
        "Financial Agenda 2026 — Couples Edition (CHF 19.90 value)",
        "BudgetManager Pro — Family Edition (CHF 32.90 value)",
        "BudgetManager license key included",
        "Save CHF 12.90 vs. buying separately",
        "Up to 4 profiles, household dashboard, smart split calculator",
        "Krankenkasse, Kita, Pillar 3a, all 26 cantons — everything Swiss families need",
        "Both tools work 100% offline — no subscription, no cloud",
        "5 languages: EN, IT, FR, DE, ES",
      ],
      techSpecs: [
        "2 HTML files + license.js",
        "Works offline in any browser",
        "Add to Home Screen for app-like experience",
        "Data saved in browser localStorage",
        "License key: BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideal for couples and families living in Switzerland who want a complete shared financial planning and tracking solution.",
    },
    it: {
      name: "Family Money Bundle 2026 — Agenda Finanziaria Coppia + BudgetManager Famiglia",
      tagline: "Il kit finanziario completo per coppie e famiglie in Svizzera. Risparmia il 24%.",
      description: "Il Family Money Bundle combina l'Agenda Finanziaria 2026 (Edizione Coppia) e BudgetManager Pro (Edizione Famiglia) in un unico pacchetto con il 24% di sconto. Pianifica il vostro anno condiviso con l'Agenda Coppia, poi tracciate ogni franco domestico rispetto alle medie delle famiglie svizzere con BudgetManager Famiglia. Entrambi gli strumenti funzionano al 100% offline, non richiedono abbonamento e gestiscono tutto, dalle spese Kita al Pilastro 3a.",
      whatYouGet: "Cosa è incluso nel bundle",
      features: [
        "Agenda Finanziaria 2026 — Edizione Coppia (valore CHF 19.90)",
        "BudgetManager Pro — Edizione Famiglia (valore CHF 32.90)",
        "Chiave di licenza BudgetManager inclusa",
        "Risparmia CHF 12.90 rispetto all'acquisto separato",
        "Fino a 4 profili, dashboard familiare, calcolatore di suddivisione intelligente",
        "Krankenkasse, Kita, Pilastro 3a, tutti i 26 cantoni — tutto ciò di cui le famiglie svizzere hanno bisogno",
        "Entrambi gli strumenti funzionano al 100% offline — nessun abbonamento, nessun cloud",
        "5 lingue: EN, IT, FR, DE, ES",
      ],
      techSpecs: [
        "2 file HTML + license.js",
        "Funziona offline in qualsiasi browser",
        "Aggiungi alla schermata home per un'esperienza simile a un'app",
        "Dati salvati nel localStorage del browser",
        "Chiave di licenza: formato BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideale per coppie e famiglie che vivono in Svizzera e vogliono una soluzione completa di pianificazione e monitoraggio finanziario condiviso.",
    },
    fr: {
      name: "Family Money Bundle 2026 — Agenda Financier Couple + BudgetManager Famille",
      tagline: "La boîte à outils financière complète pour les couples et familles en Suisse. Économisez 24%.",
      description: "Le Family Money Bundle combine l'Agenda Financier 2026 (Édition Couple) et BudgetManager Pro (Édition Famille) en un seul package avec 24% de réduction. Planifiez votre année partagée avec l'Agenda Couple, puis suivez chaque franc du ménage par rapport aux moyennes des familles suisses avec BudgetManager Famille. Les deux outils fonctionnent 100% hors ligne, ne nécessitent aucun abonnement et gèrent tout, des frais de crèche au Pilier 3a.",
      whatYouGet: "Ce qui est inclus dans le bundle",
      features: [
        "Agenda Financier 2026 — Édition Couple (valeur CHF 19.90)",
        "BudgetManager Pro — Édition Famille (valeur CHF 32.90)",
        "Clé de licence BudgetManager incluse",
        "Économisez CHF 12.90 par rapport à l'achat séparé",
        "Jusqu'à 4 profils, tableau de bord familial, calculateur de répartition intelligent",
        "Krankenkasse, crèche, Pilier 3a, les 26 cantons — tout ce dont les familles suisses ont besoin",
        "Les deux outils fonctionnent 100% hors ligne — aucun abonnement, aucun cloud",
        "5 langues : EN, IT, FR, DE, ES",
      ],
      techSpecs: [
        "2 fichiers HTML + license.js",
        "Fonctionne hors ligne dans n'importe quel navigateur",
        "Ajouter à l'écran d'accueil pour une expérience similaire à une application",
        "Données enregistrées dans le localStorage du navigateur",
        "Clé de licence : format BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Idéal pour les couples et les familles vivant en Suisse qui souhaitent une solution complète de planification et de suivi financier partagé.",
    },
    de: {
      name: "Family Money Bundle 2026 — Finanzagenda Paar + BudgetManager Familie",
      tagline: "Das vollständige Finanz-Toolkit für Paare und Familien in der Schweiz. Sparen Sie 24%.",
      description: "Das Family Money Bundle kombiniert die Finanzagenda 2026 (Paar-Edition) und BudgetManager Pro (Familien-Edition) in einem Paket mit 24% Rabatt. Planen Sie Ihr gemeinsames Jahr mit der Paar-Agenda, dann verfolgen Sie jeden Haushaltsfranken anhand Schweizer Familiendurchschnittswerten mit BudgetManager Familie. Beide Tools laufen 100% offline, benötigen kein Abonnement und verwalten alles von Kita-Gebühren bis Säule 3a.",
      whatYouGet: "Was im Bundle enthalten ist",
      features: [
        "Finanzagenda 2026 — Paar-Edition (Wert CHF 19.90)",
        "BudgetManager Pro — Familien-Edition (Wert CHF 32.90)",
        "BudgetManager-Lizenzschlüssel inklusive",
        "Sparen Sie CHF 12.90 gegenüber dem Einzelkauf",
        "Bis zu 4 Profile, Haushalts-Dashboard, intelligenter Aufteilungsrechner",
        "Krankenkasse, Kita, Säule 3a, alle 26 Kantone — alles, was Schweizer Familien brauchen",
        "Beide Tools funktionieren 100% offline — kein Abonnement, keine Cloud",
        "5 Sprachen: EN, IT, FR, DE, ES",
      ],
      techSpecs: [
        "2 HTML-Dateien + license.js",
        "Funktioniert offline in jedem Browser",
        "Zum Startbildschirm hinzufügen für App-ähnliche Erfahrung",
        "Daten im Browser-localStorage gespeichert",
        "Lizenzschlüssel: Format BM-XXXX-XXXX-XXXX-XXXX",
      ],
      ideal: "Ideal für Paare und Familien in der Schweiz, die eine vollständige gemeinsame Finanzplanungs- und Tracking-Lösung wünschen.",
    },
  },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const [, navigate] = useLocation();
  const { addItem, isInCart, openCart, lang: cartLang } = useCart();
  const lang: Lang = (cartLang as Lang) || "en";

  // Get product key from URL: /shop/:key
  const [location] = useLocation();
  const productKey = location.split("/shop/")[1] || "";

  const content = CONTENT[productKey]?.[lang];
  const screenshots = SCREENSHOTS[productKey as keyof typeof SCREENSHOTS] || [];
  const cover = COVERS[productKey];
  const priceInfo = PRICES[productKey];
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  const createCheckout = trpc.stripe.createCheckout.useMutation();
  const handleBuyNow = useCallback(() => {
    createCheckout.mutate(
      { productKey, language: lang, origin: window.location.origin },
      {
        onSuccess: (data) => {
          if (data?.url) window.open(data.url, "_blank");
        },
        onError: () => {
          toast.error("Could not start checkout. Please try again.");
        },
      }
    );
  }, [productKey, lang, createCheckout]);

  if (!content || !priceInfo) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1a2744] text-lg mb-4">Product not found.</p>
          <Link href="/#shop" className="text-[#c9a84c] underline">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const isBundleOrLicensed = ["budget-personal", "budget-family", "budget-manager-personal", "budget-manager-family", "single-bundle", "family-bundle"].includes(productKey);

  const backLabel = lang === "it" ? "← Torna al negozio" : lang === "fr" ? "← Retour à la boutique" : lang === "de" ? "← Zurück zum Shop" : "← Back to Shop";
  const buyLabel = lang === "it" ? "Acquista ora" : lang === "fr" ? "Acheter maintenant" : lang === "de" ? "Jetzt kaufen" : "Buy Now";
  const addCartLabel = lang === "it" ? "Aggiungi al carrello" : lang === "fr" ? "Ajouter au panier" : lang === "de" ? "In den Warenkorb" : "Add to Cart";
  const inCartLabel = lang === "it" ? "Nel Carrello ✓" : lang === "fr" ? "Dans le Panier ✓" : lang === "de" ? "Im Warenkorb ✓" : "In Cart ✓";
  const techLabel = lang === "it" ? "Specifiche tecniche" : lang === "fr" ? "Spécifications techniques" : lang === "de" ? "Technische Details" : "Technical Details";
  const idealLabel = lang === "it" ? "Per chi è pensato" : lang === "fr" ? "Pour qui c'est fait" : lang === "de" ? "Für wen ist es gedacht" : "Who it's for";
  const offlineLabel = lang === "it" ? "100% Offline" : lang === "fr" ? "100% Hors ligne" : lang === "de" ? "100% Offline" : "100% Offline";
  const noSubLabel = lang === "it" ? "Nessun abbonamento" : lang === "fr" ? "Aucun abonnement" : lang === "de" ? "Kein Abonnement" : "No subscription";
  const instantLabel = lang === "it" ? "Download immediato" : lang === "fr" ? "Téléchargement immédiat" : lang === "de" ? "Sofort-Download" : "Instant download";

  return (
    <div className="min-h-screen bg-[#f8f5f0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top nav bar */}
      <div className="bg-[#1a2744] py-3 px-6">
        <button
          onClick={() => navigate("/#shop")}
          className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Screenshots */}
          <div className="sticky top-6">
            {/* Main screenshot */}
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#1a2744] mb-3" style={{ aspectRatio: "16/10" }}>
              {screenshots.length > 0 ? (
                <img
                  src={screenshots[activeScreenshot]}
                  alt={content.name}
                  className="w-full h-full object-cover"
                />
              ) : cover ? (
                <img src={cover} alt={content.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Download className="h-16 w-16 text-[#c9a84c]/40" />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {screenshots.length > 1 && (
              <div className="flex gap-2">
                {screenshots.map((src: string, i: number) => (
                  <button
                    key={src}
                    onClick={() => setActiveScreenshot(i)}
                    className={`flex-1 rounded-lg overflow-hidden border-2 transition-all ${i === activeScreenshot ? "border-[#c9a84c]" : "border-transparent opacity-60 hover:opacity-100"}`}
                    style={{ aspectRatio: "16/10" }}
                  >
                    <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Wifi, label: offlineLabel },
                { icon: Lock, label: noSubLabel },
                { icon: Download, label: instantLabel },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm">
                  <Icon className="h-4 w-4 text-[#c9a84c]" />
                  <span className="text-[10px] font-semibold text-[#1a2744] text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Content */}
          <div>
            {/* Price & name */}
            <div className="mb-6">
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-2">Adelaide Manta</p>
              <h1 className="text-2xl font-bold text-[#1a2744] leading-snug mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {content.name}
              </h1>
              <p className="text-[#1a2744]/60 text-base italic mb-4">{content.tagline}</p>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-bold text-[#c9a84c]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {priceInfo.price}
                </span>
                {priceInfo.regular && (
                  <span className="text-lg text-[#1a2744]/35 line-through">{priceInfo.regular}</span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mb-6">
                {isInCart(productKey) ? (
                  <button
                    onClick={openCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {inCartLabel}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addItem({
                        key: productKey,
                        name: content.name,
                        price: priceInfo.amount,
                        displayPrice: priceInfo.price,
                        cover,
                      });
                      toast.success(
                        lang === "it" ? `"${content.name}" aggiunto al carrello` :
                        lang === "fr" ? `"${content.name}" ajouté au panier` :
                        lang === "de" ? `"${content.name}" zum Warenkorb hinzugefügt` :
                        `"${content.name}" added to cart`,
                        { duration: 2500 }
                      );
                    }}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1a2744] text-[#1a2744] px-5 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#1a2744] hover:text-white transition-all"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {addCartLabel}
                  </button>
                )}
                <button
                  onClick={handleBuyNow}
                  disabled={createCheckout.isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a2744] text-white px-5 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all disabled:opacity-60"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {createCheckout.isPending ? "…" : buyLabel}
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#1a2744]/75 text-base leading-relaxed mb-8">{content.description}</p>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {content.whatYouGet}
              </h2>
              <ul className="space-y-3">
                {content.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a2744]/80 text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech specs */}
            <div className="bg-[#1a2744]/5 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-[#1a2744] uppercase tracking-widest mb-3">{techLabel}</h3>
              <ul className="space-y-2">
                {content.techSpecs.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <Star className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a2744]/70 text-xs">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who it's for */}
            <div className="border-l-4 border-[#c9a84c] pl-4">
              <p className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest mb-1">{idealLabel}</p>
              <p className="text-[#1a2744]/70 text-sm italic">{content.ideal}</p>
            </div>

            {/* License key note for BudgetManager products */}
            {isBundleOrLicensed && (
              <div className="mt-6 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                <p className="text-[#1a2744]/80 text-sm">
                  {lang === "it"
                    ? "Una chiave di licenza univoca (formato BM-XXXX-XXXX-XXXX-XXXX) viene generata automaticamente al momento dell'acquisto e inviata via email."
                    : lang === "fr"
                    ? "Une clé de licence unique (format BM-XXXX-XXXX-XXXX-XXXX) est générée automatiquement à l'achat et envoyée par e-mail."
                    : lang === "de"
                    ? "Ein eindeutiger Lizenzschlüssel (Format BM-XXXX-XXXX-XXXX-XXXX) wird beim Kauf automatisch generiert und per E-Mail zugesandt."
                    : "A unique license key (format BM-XXXX-XXXX-XXXX-XXXX) is automatically generated at purchase and sent by email."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
