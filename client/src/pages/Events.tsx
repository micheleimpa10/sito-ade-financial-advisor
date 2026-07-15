/**
 * Adelaide Manta - Events & Community Page
 * Design: Swiss Minimalism meets Editorial Luxury
 * Colors: Navy (#1a2744) + Warm Cream (#f8f5f0) + Gold (#c9a84c)
 * Typography: Playfair Display (serif headings) + DM Sans (body)
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Instagram,
  Calendar,
  MapPin,
  Users,
  Heart,
  Leaf,
  Briefcase,
  ChevronRight,
  Menu,
  X,
  Send,
} from "lucide-react";

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const translations = {
  en: {
    nav: {
      about: "ABOUT",
      services: "SERVICES",
      plans: "PLANS",
      shop: "SHOP",
      events: "EVENTS",
      cta: "BOOK A FREE CONSULTATION",
      backHome: "← BACK HOME",
    },
    hero: {
      badge: "EVENTS & COMMUNITY",
      title: "Connecting people through meaningful experiences in Switzerland",
      subtitle:
        "Discover regular gatherings designed to bring together professionals and individuals across finance, health, wellness, and lifestyle sectors — creating space for genuine conversations, shared ideas, and new collaboration opportunities.",
    },
    upcoming: {
      title: "UPCOMING EVENTS",
      events: [
        {
          date: "June 7th",
          category: "Wellness & Health",
          title: "Outdoor Wellness Talk & Complementary Medicine Session",
          desc: "An open-air event with a certified Swiss practitioner, addressing complementary treatments and microcirculation techniques. This session aims to offer clarity on integrating these services into Swiss health insurance.",
          theme: "Complementary care, prevention, and insurance understanding.",
          activities:
            "Open discussion, practitioner insights, and practical guidance on Swiss coverage options.",
          location: "Zurich, Switzerland",
        },
        {
          date: "July 4th",
          category: "Movement & Community",
          title: "Pilates & Social Gathering",
          desc: "A one-hour Pilates class followed by a social gathering. This event combines movement with insights into wellness professionals eligible for Swiss supplementary insurance reimbursement.",
          theme: "Wellness, mobility, and trusted professional connections.",
          activities:
            "Pilates practice, informal networking, and guidance around reimbursable wellness services.",
          location: "Geneva, Switzerland",
        },
      ],
      themeLabel: "Theme",
      activitiesLabel: "Key Activities",
    },
    past: {
      title: "PAST EVENTS",
      events: [
        {
          date: "May 15th",
          category: "Financial Planning",
          title: "Swiss Tax Optimization Workshop",
          desc: "An in-depth workshop on optimizing tax strategies for high-net-worth individuals in Switzerland. Covered cantonal differences, deductions, and planning strategies.",
          theme: "Tax efficiency, wealth preservation, and strategic planning.",
          activities:
            "Interactive workshop, Q&A session, and personalized consultation insights.",
          location: "Bern, Switzerland",
        },
        {
          date: "April 20th",
          category: "Wellness & Community",
          title: "Spring Wellness Retreat",
          desc: "A rejuvenating day combining wellness practices with professional networking. Featured yoga, meditation, and informal discussions on work-life balance.",
          theme: "Holistic wellness, community building, and professional connections.",
          activities:
            "Yoga session, meditation, wellness talks, and networking aperitivo.",
          location: "Lugano, Switzerland",
        },
      ],
    },
    collab: {
      title: "COLLABORATIONS",
      desc: "I'm always open to connecting with professionals in health, wellness, lifestyle, and sustainable living who want to create thoughtful, people-centered experiences. If you'd like to co-host an event, share your expertise, or join a growing network built on trust and collaboration, I'd love to hear from you.",
      categories: [
        {
          icon: "heart",
          title: "Health & Wellness",
          desc: "Practitioners, coaches, therapists, and movement specialists.",
        },
        {
          icon: "leaf",
          title: "Lifestyle & Sustainable Living",
          desc: "Brands and experts focused on conscious, balanced everyday living.",
        },
        {
          icon: "briefcase",
          title: "Professional Network",
          desc: "People building bridges across finance, education, and community initiatives.",
        },
      ],
    },
    form: {
      badge: "COLLABORATION CONTACT FORM",
      title: "Reach out to co-host or join the network",
      subtitle:
        "Share a few details about your work, your area of expertise, and the kind of collaboration you have in mind.",
      name: "Full Name",
      namePlaceholder: "Sofia Rossi",
      nameRequired: "FULL NAME*",
      email: "Email Address",
      emailPlaceholder: "sofia.rossi@example.com",
      emailRequired: "EMAIL ADDRESS*",
      phone: "Phone Number",
      phonePlaceholder: "+41 79 123 45 67",
      phoneLabel: "PHONE NUMBER",
      profession: "Profession / Role",
      professionPlaceholder: "Certified wellness coach",
      professionRequired: "PROFESSION / ROLE*",
      sector: "Sector",
      sectorRequired: "SECTOR*",
      sectorOptions: ["Health", "Wellness", "Lifestyle", "Sustainable Living", "Finance", "Other"],
      message: "How would you like to collaborate?",
      messagePlaceholder:
        "I'd love to co-host a community session focused on preventive wellness and practical insurance education...",
      messageRequired: "HOW WOULD YOU LIKE TO COLLABORATE?*",
      submit: "SEND COLLABORATION REQUEST",
      reset: "RESET",
      successTitle: "Request sent!",
      successDesc: "Thank you for reaching out. Adelaide will be in touch with you soon.",
    },
  },
  it: {
    nav: {
      about: "CHI SONO",
      services: "SERVIZI",
      plans: "PIANI",
      shop: "NEGOZIO",
      events: "EVENTI",
      cta: "PRENOTA UNA CONSULENZA GRATUITA",
      backHome: "← TORNA ALLA HOME",
    },
    hero: {
      badge: "EVENTI & COMUNITÀ",
      title: "Connettere le persone attraverso esperienze significative in Svizzera",
      subtitle:
        "Scopri incontri regolari pensati per riunire professionisti e privati nei settori della finanza, salute, benessere e lifestyle — creando spazio per conversazioni autentiche, idee condivise e nuove opportunità di collaborazione.",
    },
    upcoming: {
      title: "PROSSIMI EVENTI",
      events: [
        {
          date: "7 Giugno",
          category: "Benessere & Salute",
          title: "Talk all'Aperto sul Benessere e Medicina Complementare",
          desc: "Un evento all'aperto con un professionista svizzero certificato, dedicato ai trattamenti complementari e alle tecniche di microcircolazione. Questa sessione mira a offrire chiarezza sull'integrazione di questi servizi nell'assicurazione sanitaria svizzera.",
          theme: "Cure complementari, prevenzione e comprensione delle assicurazioni.",
          activities:
            "Discussione aperta, approfondimenti del professionista e guida pratica sulle opzioni di copertura svizzera.",
          location: "Zurigo, Svizzera",
        },
        {
          date: "4 Luglio",
          category: "Movimento & Comunità",
          title: "Pilates & Incontro Sociale",
          desc: "Un'ora di Pilates seguita da un incontro sociale. Questo evento unisce il movimento con approfondimenti sui professionisti del benessere idonei al rimborso dell'assicurazione complementare svizzera.",
          theme: "Benessere, mobilità e connessioni professionali di fiducia.",
          activities:
            "Pratica di Pilates, networking informale e guida sui servizi di benessere rimborsabili.",
          location: "Ginevra, Svizzera",
        },
      ],
      themeLabel: "Tema",
      activitiesLabel: "Attività Principali",
    },
    past: {
      title: "EVENTI PASSATI",
      events: [
        {
          date: "15 Maggio",
          category: "Pianificazione Finanziaria",
          title: "Workshop di Ottimizzazione Fiscale Svizzera",
          desc: "Un workshop approfondito su strategie fiscali ottimizzate per individui ad alto patrimonio netto in Svizzera. Coperte differenze cantonali, detrazioni e strategie di pianificazione.",
          theme: "Efficienza fiscale, preservazione della ricchezza e pianificazione strategica.",
          activities:
            "Workshop interattivo, sessione Q&A e approfondimenti di consulenza personalizzata.",
          location: "Berna, Svizzera",
        },
        {
          date: "20 Aprile",
          category: "Benessere & Comunità",
          title: "Ritiro Benessere Primaverile",
          desc: "Una giornata rigenerante che combina pratiche di benessere con networking professionale. Ha presentato yoga, meditazione e discussioni informali sull'equilibrio lavoro-vita.",
          theme: "Benessere olistico, costruzione della comunità e connessioni professionali.",
          activities:
            "Sessione di yoga, meditazione, talk sul benessere e aperitivo di networking.",
          location: "Lugano, Svizzera",
        },
      ],
    },
    collab: {
      title: "COLLABORAZIONI",
      desc: "Sono sempre aperta a connettermi con professionisti della salute, del benessere, dello stile di vita e del living sostenibile che vogliono creare esperienze significative e centrate sulle persone. Se desideri co-organizzare un evento, condividere la tua esperienza o unirti a una rete in crescita basata sulla fiducia e la collaborazione, mi farebbe piacere sentirti.",
      categories: [
        {
          icon: "heart",
          title: "Salute & Benessere",
          desc: "Professionisti, coach, terapisti e specialisti del movimento.",
        },
        {
          icon: "leaf",
          title: "Lifestyle & Living Sostenibile",
          desc: "Brand ed esperti focalizzati su uno stile di vita consapevole ed equilibrato.",
        },
        {
          icon: "briefcase",
          title: "Rete Professionale",
          desc: "Persone che costruiscono ponti tra finanza, educazione e iniziative comunitarie.",
        },
      ],
    },
    form: {
      badge: "MODULO DI COLLABORAZIONE",
      title: "Contattami per co-organizzare o unirti alla rete",
      subtitle:
        "Condividi alcuni dettagli sul tuo lavoro, la tua area di competenza e il tipo di collaborazione che hai in mente.",
      name: "Nome Completo",
      namePlaceholder: "Sofia Rossi",
      nameRequired: "NOME COMPLETO*",
      email: "Indirizzo Email",
      emailPlaceholder: "sofia.rossi@example.com",
      emailRequired: "INDIRIZZO EMAIL*",
      phone: "Numero di Telefono",
      phonePlaceholder: "+41 79 123 45 67",
      phoneLabel: "NUMERO DI TELEFONO",
      profession: "Professione / Ruolo",
      professionPlaceholder: "Coach certificata del benessere",
      professionRequired: "PROFESSIONE / RUOLO*",
      sector: "Settore",
      sectorRequired: "SETTORE*",
      sectorOptions: ["Salute", "Benessere", "Lifestyle", "Living Sostenibile", "Finanza", "Altro"],
      message: "Come vorresti collaborare?",
      messagePlaceholder:
        "Mi piacerebbe co-organizzare una sessione comunitaria focalizzata sul benessere preventivo e l'educazione assicurativa pratica...",
      messageRequired: "COME VORRESTI COLLABORARE?*",
      submit: "INVIA RICHIESTA DI COLLABORAZIONE",
      reset: "RESET",
      successTitle: "Richiesta inviata!",
      successDesc: "Grazie per averci contattato. Adelaide ti risponderà presto.",
    },
  },
  fr: {
    nav: {
      about: "À PROPOS",
      services: "SERVICES",
      plans: "PLANS",
      shop: "BOUTIQUE",
      events: "ÉVÉNEMENTS",
      cta: "RÉSERVER UNE CONSULTATION GRATUITE",
      backHome: "← RETOUR À L'ACCUEIL",
    },
    hero: {
      badge: "ÉVÉNEMENTS & COMMUNAUTÉ",
      title: "Connecter les personnes à travers des expériences significatives en Suisse",
      subtitle:
        "Découvrez des rencontres régulières conçues pour réunir professionnels et particuliers dans les secteurs de la finance, la santé, le bien-être et le lifestyle — créant un espace pour des conversations authentiques, des idées partagées et de nouvelles opportunités de collaboration.",
    },
    upcoming: {
      title: "PROCHAINS ÉVÉNEMENTS",
      events: [
        {
          date: "7 Juin",
          category: "Bien-être & Santé",
          title: "Conférence Bien-être en Plein Air & Médecine Complémentaire",
          desc: "Un événement en plein air avec un praticien suisse certifié, abordant les traitements complémentaires et les techniques de microcirculation. Cette session vise à clarifier l'intégration de ces services dans l'assurance maladie suisse.",
          theme: "Soins complémentaires, prévention et compréhension des assurances.",
          activities:
            "Discussion ouverte, éclairages du praticien et conseils pratiques sur les options de couverture suisse.",
          location: "Zurich, Suisse",
        },
        {
          date: "4 Juillet",
          category: "Mouvement & Communauté",
          title: "Pilates & Rassemblement Social",
          desc: "Une heure de Pilates suivie d'un rassemblement social. Cet événement combine le mouvement avec des informations sur les professionnels du bien-être éligibles au remboursement de l'assurance complémentaire suisse.",
          theme: "Bien-être, mobilité et connexions professionnelles de confiance.",
          activities:
            "Pratique du Pilates, réseautage informel et conseils sur les services de bien-être remboursables.",
          location: "Genève, Suisse",
        },
      ],
      themeLabel: "Thème",
      activitiesLabel: "Activités Clés",
    },
    past: {
      title: "ÉVÉNEMENTS PASSÉS",
      events: [
        {
          date: "15 Mai",
          category: "Planification Financière",
          title: "Atelier d'Optimisation Fiscale Suisse",
          desc: "Un atelier approfondi sur les stratégies fiscales optimisées pour les particuliers fortunés en Suisse. Couvrait les différences cantonales, les déductions et les stratégies de planification.",
          theme: "Efficacité fiscale, préservation de la richesse et planification stratégique.",
          activities:
            "Atelier interactif, session Q&A et aperçus de consultation personnalisée.",
          location: "Berne, Suisse",
        },
        {
          date: "20 Avril",
          category: "Bien-être & Communauté",
          title: "Retraite Bien-être Printanière",
          desc: "Une journée régénérante combinant des pratiques de bien-être avec du réseautage professionnel. Présentait yoga, méditation et discussions informelles sur l'équilibre travail-vie.",
          theme: "Bien-être holistique, création de communauté et connexions professionnelles.",
          activities:
            "Séance de yoga, méditation, talks bien-être et apéritif de réseautage.",
          location: "Lugano, Suisse",
        },
      ],
    },
    collab: {
      title: "COLLABORATIONS",
      desc: "Je suis toujours ouverte à me connecter avec des professionnels de la santé, du bien-être, du lifestyle et du living durable qui souhaitent créer des expériences réfléchies et centrées sur les personnes. Si vous souhaitez co-organiser un événement, partager votre expertise ou rejoindre un réseau en pleine croissance fondé sur la confiance et la collaboration, j'aimerais avoir de vos nouvelles.",
      categories: [
        {
          icon: "heart",
          title: "Santé & Bien-être",
          desc: "Praticiens, coaches, thérapeutes et spécialistes du mouvement.",
        },
        {
          icon: "leaf",
          title: "Lifestyle & Living Durable",
          desc: "Marques et experts axés sur un mode de vie conscient et équilibré.",
        },
        {
          icon: "briefcase",
          title: "Réseau Professionnel",
          desc: "Personnes construisant des ponts entre la finance, l'éducation et les initiatives communautaires.",
        },
      ],
    },
    form: {
      badge: "FORMULAIRE DE COLLABORATION",
      title: "Contactez-moi pour co-organiser ou rejoindre le réseau",
      subtitle:
        "Partagez quelques détails sur votre travail, votre domaine d'expertise et le type de collaboration que vous envisagez.",
      name: "Nom Complet",
      namePlaceholder: "Sophie Martin",
      nameRequired: "NOM COMPLET*",
      email: "Adresse Email",
      emailPlaceholder: "sophie.martin@example.com",
      emailRequired: "ADRESSE EMAIL*",
      phone: "Numéro de Téléphone",
      phonePlaceholder: "+41 79 123 45 67",
      phoneLabel: "NUMÉRO DE TÉLÉPHONE",
      profession: "Profession / Rôle",
      professionPlaceholder: "Coach bien-être certifiée",
      professionRequired: "PROFESSION / RÔLE*",
      sector: "Secteur",
      sectorRequired: "SECTEUR*",
      sectorOptions: ["Santé", "Bien-être", "Lifestyle", "Living Durable", "Finance", "Autre"],
      message: "Comment souhaitez-vous collaborer ?",
      messagePlaceholder:
        "J'aimerais co-organiser une session communautaire axée sur le bien-être préventif et l'éducation pratique en matière d'assurance...",
      messageRequired: "COMMENT SOUHAITEZ-VOUS COLLABORER ?*",
      submit: "ENVOYER LA DEMANDE DE COLLABORATION",
      reset: "RÉINITIALISER",
      successTitle: "Demande envoyée !",
      successDesc: "Merci de nous avoir contactés. Adelaide vous répondra bientôt.",
    },
  },
  de: {
    nav: {
      about: "ÜBER MICH",
      services: "LEISTUNGEN",
      plans: "PLÄNE",
      shop: "SHOP",
      events: "VERANSTALTUNGEN",
      cta: "KOSTENLOSE BERATUNG BUCHEN",
      backHome: "← ZURÜCK ZUR STARTSEITE",
    },
    hero: {
      badge: "VERANSTALTUNGEN & GEMEINSCHAFT",
      title: "Menschen durch bedeutungsvolle Erlebnisse in der Schweiz verbinden",
      subtitle:
        "Entdecken Sie regelmässige Treffen, die Fachleute und Privatpersonen aus den Bereichen Finanzen, Gesundheit, Wellness und Lifestyle zusammenbringen — ein Raum für echte Gespräche, gemeinsame Ideen und neue Kooperationsmöglichkeiten.",
    },
    upcoming: {
      title: "BEVORSTEHENDE VERANSTALTUNGEN",
      events: [
        {
          date: "7. Juni",
          category: "Wellness & Gesundheit",
          title: "Outdoor-Wellness-Gespräch & Komplementärmedizin-Sitzung",
          desc: "Eine Outdoor-Veranstaltung mit einem zertifizierten Schweizer Praktiker, der sich mit komplementären Behandlungen und Mikrozirkulationstechniken befasst. Diese Sitzung zielt darauf ab, Klarheit über die Integration dieser Dienstleistungen in die Schweizer Krankenversicherung zu schaffen.",
          theme: "Komplementäre Pflege, Prävention und Versicherungsverständnis.",
          activities:
            "Offene Diskussion, Einblicke des Praktikers und praktische Anleitung zu Schweizer Deckungsoptionen.",
          location: "Zürich, Schweiz",
        },
        {
          date: "4. Juli",
          category: "Bewegung & Gemeinschaft",
          title: "Pilates & Soziales Treffen",
          desc: "Eine einstündige Pilates-Klasse gefolgt von einem sozialen Treffen. Diese Veranstaltung verbindet Bewegung mit Einblicken in Wellnessprofis, die für die Schweizer Zusatzversicherung erstattet werden können.",
          theme: "Wellness, Mobilität und vertrauensvolle berufliche Verbindungen.",
          activities:
            "Pilates-Praxis, informelles Networking und Anleitung zu erstattungsfähigen Wellnessdienstleistungen.",
          location: "Genf, Schweiz",
        },
      ],
      themeLabel: "Thema",
      activitiesLabel: "Wichtigste Aktivitäten",
    },
    past: {
      title: "VERGANGENE VERANSTALTUNGEN",
      events: [
        {
          date: "15. Mai",
          category: "Finanzplanung",
          title: "Schweizer Steueroptimierungs-Workshop",
          desc: "Ein umfassender Workshop zu optimierten Steuerstrategien für vermögende Privatpersonen in der Schweiz. Behandelte kantonale Unterschiede, Abzüge und Planungsstrategien.",
          theme: "Steuereffizienz, Vermögensschutz und strategische Planung.",
          activities:
            "Interaktiver Workshop, Fragerunde und Einblicke in personalisierte Beratung.",
          location: "Bern, Schweiz",
        },
        {
          date: "20. April",
          category: "Wellness & Gemeinschaft",
          title: "Frühlings-Wellness-Retreat",
          desc: "Ein verjüngender Tag, der Wellnesspraktiken mit professionellem Networking verbindet. Umfasste Yoga, Meditation und informelle Diskussionen über Work-Life-Balance.",
          theme: "Ganzheitliches Wohlbefinden, Gemeinschaftsbildung und berufliche Verbindungen.",
          activities:
            "Yoga-Sitzung, Meditation, Wellness-Talks und Networking-Aperitif.",
          location: "Lugano, Schweiz",
        },
      ],
    },
    collab: {
      title: "KOOPERATIONEN",
      desc: "Ich bin immer offen dafür, mich mit Fachleuten aus den Bereichen Gesundheit, Wellness, Lifestyle und nachhaltiges Leben zu vernetzen, die durchdachte, menschenzentrierte Erlebnisse schaffen möchten. Wenn Sie eine Veranstaltung mitorganisieren, Ihr Fachwissen teilen oder einem wachsenden Netzwerk beitreten möchten, das auf Vertrauen und Zusammenarbeit aufgebaut ist, freue ich mich von Ihnen zu hören.",
      categories: [
        {
          icon: "heart",
          title: "Gesundheit & Wellness",
          desc: "Praktiker, Coaches, Therapeuten und Bewegungsspezialisten.",
        },
        {
          icon: "leaf",
          title: "Lifestyle & Nachhaltiges Leben",
          desc: "Marken und Experten, die sich auf bewusstes, ausgewogenes Alltagsleben konzentrieren.",
        },
        {
          icon: "briefcase",
          title: "Professionelles Netzwerk",
          desc: "Menschen, die Brücken zwischen Finanzen, Bildung und Gemeinschaftsinitiativen bauen.",
        },
      ],
    },
    form: {
      badge: "KOOPERATIONSANFRAGE",
      title: "Kontaktieren Sie mich für eine Mitorganisation oder Netzwerkbeitritt",
      subtitle:
        "Teilen Sie einige Details über Ihre Arbeit, Ihr Fachgebiet und die Art der Zusammenarbeit, die Sie sich vorstellen.",
      name: "Vollständiger Name",
      namePlaceholder: "Sofia Rossi",
      nameRequired: "VOLLSTÄNDIGER NAME*",
      email: "E-Mail-Adresse",
      emailPlaceholder: "sofia.rossi@example.com",
      emailRequired: "E-MAIL-ADRESSE*",
      phone: "Telefonnummer",
      phonePlaceholder: "+41 79 123 45 67",
      phoneLabel: "TELEFONNUMMER",
      profession: "Beruf / Rolle",
      professionPlaceholder: "Zertifizierter Wellness-Coach",
      professionRequired: "BERUF / ROLLE*",
      sector: "Bereich",
      sectorRequired: "BEREICH*",
      sectorOptions: ["Gesundheit", "Wellness", "Lifestyle", "Nachhaltiges Leben", "Finanzen", "Sonstiges"],
      message: "Wie möchten Sie zusammenarbeiten?",
      messagePlaceholder:
        "Ich würde gerne eine Gemeinschaftssitzung mitorganisieren, die sich auf präventives Wohlbefinden und praktische Versicherungsaufklärung konzentriert...",
      messageRequired: "WIE MÖCHTEN SIE ZUSAMMENARBEITEN?*",
      submit: "KOOPERATIONSANFRAGE SENDEN",
      reset: "ZURÜCKSETZEN",
      successTitle: "Anfrage gesendet!",
      successDesc: "Vielen Dank für Ihre Kontaktaufnahme. Adelaide wird sich bald bei Ihnen melden.",
    },
  },
};

type Lang = "en" | "it" | "fr" | "de";

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
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Wellness & Health": "bg-emerald-100 text-emerald-800",
  "Movement & Community": "bg-blue-100 text-blue-800",
  "Benessere & Salute": "bg-emerald-100 text-emerald-800",
  "Movimento & Comunità": "bg-blue-100 text-blue-800",
  "Bien-être & Santé": "bg-emerald-100 text-emerald-800",
  "Mouvement & Communauté": "bg-blue-100 text-blue-800",
  "Wellness & Gesundheit": "bg-emerald-100 text-emerald-800",
  "Bewegung & Gemeinschaft": "bg-blue-100 text-blue-800",
};

function CollabIcon({ icon }: { icon: string }) {
  if (icon === "heart") return <Heart className="h-5 w-5 text-[#c9a84c]" />;
  if (icon === "leaf") return <Leaf className="h-5 w-5 text-[#c9a84c]" />;
  return <Briefcase className="h-5 w-5 text-[#c9a84c]" />;
}

// ─── UTILITY: Parse date string to Date object ──────────────────────────────────
function parseEventDate(dateStr: string): Date {
  // Formats: "June 7th", "7 Giugno", "7 Juin", "7. Juni"
  const monthMap: Record<string, number> = {
    // English
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    // Italian
    gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
    luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre_it: 10, dicembre: 11,
    // French
    janvier: 0, février: 1, mars_fr: 2, avril_fr: 3, mai_fr: 4, juin: 5,
    juillet: 6, août: 7, septembre_fr: 8, octobre_fr: 9, décembre: 11,
    // German
    januar: 0, februar: 1, märz: 2, juni_de: 5,
    juli: 6, september_de: 8, oktober: 9, dezember: 11,
  };

  const parts = dateStr.toLowerCase().split(/\s+/);
  let day = 0, month = 0;

  for (const part of parts) {
    const num = parseInt(part.replace(/[^0-9]/g, ""));
    if (!isNaN(num) && num > 0 && num <= 31) day = num;
    for (const [monthName, monthIdx] of Object.entries(monthMap)) {
      if (part.includes(monthName)) month = monthIdx;
    }
  }

  const year = new Date().getFullYear();
  return new Date(year, month, day);
}

// ─── UTILITY: Filter events by date ────────────────────────────────────────────
function filterEventsByDate(allEvents: any[], pastEvents: any[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allEvents.filter((e) => {
    const eventDate = parseEventDate(e.date);
    return eventDate >= today;
  });

  const past = pastEvents.filter((e) => {
    const eventDate = parseEventDate(e.date);
    return eventDate < today;
  });

  // Add any upcoming events that have passed to past events
  const movedToPast = allEvents.filter((e) => {
    const eventDate = parseEventDate(e.date);
    return eventDate < today;
  });

  return {
    upcoming,
    past: [...past, ...movedToPast],
  };
}

export default function EventsPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    sector: "",
    message: "",
  });

  const t = translations[lang];
  const { upcoming: filteredUpcoming, past: filteredPast } = filterEventsByDate(
    t.upcoming.events,
    t.past?.events || []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langLabels: Record<Lang, string> = { en: "EN", it: "IT", fr: "FR", de: "DE" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", phone: "", profession: "", sector: "", message: "" });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── HEADER ──────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-[#1a2744] py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className={`text-xl font-bold tracking-tight flex-shrink-0 transition-colors ${
              scrolled ? "text-[#1a2744]" : "text-white"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Adelaide Manta
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {(["about", "services", "plans", "shop"] as const).map((key) => (
              <Link
                key={key}
                href={`/#${key}`}
                className={`text-xs font-semibold tracking-widest transition-colors hover:text-[#c9a84c] ${
                  scrolled ? "text-[#1a2744]" : "text-white/90"
                }`}
              >
                {t.nav[key]}
              </Link>
            ))}
            <span
              className={`text-xs font-semibold tracking-widest text-[#c9a84c] border-b border-[#c9a84c] pb-0.5`}
            >
              {t.nav.events}
            </span>
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
            <Link
              href="/"
              className={`text-xs font-semibold tracking-widest transition-colors hover:text-[#c9a84c] ${
                scrolled ? "text-[#1a2744]" : "text-white/80"
              }`}
            >
              {t.nav.backHome}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden transition-colors ${scrolled ? "text-[#1a2744]" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-5">
            {(["about", "services", "plans", "shop"] as const).map((key) => (
              <Link
                key={key}
                href={`/#${key}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-[#1a2744] hover:text-[#c9a84c] transition-colors"
              >
                {t.nav[key]}
              </Link>
            ))}
            <span className="text-sm font-bold uppercase tracking-widest text-[#c9a84c]">
              {t.nav.events}
            </span>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              {(["en", "it", "fr", "de"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setMenuOpen(false); }}
                  className={`text-xs font-bold uppercase px-2 py-1 rounded transition-all ${
                    lang === l ? "bg-[#c9a84c] text-white" : "text-[#1a2744]/50 hover:text-[#1a2744]"
                  }`}
                >
                  {langLabels[l]}
                </button>
              ))}
            </div>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-[#1a2744] hover:text-[#c9a84c] transition-colors"
            >
              {t.nav.backHome}
            </Link>
          </div>
        )}
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-[#1a2744] text-white text-center px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 border border-[#c9a84c]/40 rounded-full px-5 py-2 text-xs font-bold tracking-widest text-[#c9a84c] mb-8">
            <Calendar className="h-3.5 w-3.5" />
            {t.hero.badge}
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-white max-w-4xl mx-auto mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.hero.title}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
            {t.hero.subtitle}
          </p>
        </Reveal>
      </section>

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Upcoming & Past Events */}
          <Reveal>
            <div className="space-y-8">
              {/* UPCOMING EVENTS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-[#1a2744] flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-[#c9a84c]" />
                  </div>
                  <h2 className="text-sm font-black tracking-widest text-[#1a2744] uppercase">
                    {t.upcoming.title}
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  {filteredUpcoming.map((event, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-6 hover:border-[#c9a84c]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-[#1a2744] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        {event.date}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${
                          CATEGORY_COLORS[event.category] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.category}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-[#1a2744] mb-3 leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.desc}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <MapPin className="h-3.5 w-3.5 text-[#c9a84c]" />
                      {event.location}
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-[#f8f5f0] rounded-lg p-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                          {t.upcoming.themeLabel}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">{event.theme}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                          {t.upcoming.activitiesLabel}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">{event.activities}</p>
                      </div>
                    </div>
                  </div>
                                  ))}
                </div>
              </div>

              {/* PAST EVENTS */}
              {t.past && t.past.events && t.past.events.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gray-400 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-sm font-black tracking-widest text-[#1a2744] uppercase">
                      {t.past.title}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    {filteredPast.map((event, i) => (
                      <div
                        key={i}
                        className="border border-gray-100 rounded-xl p-6 hover:border-[#c9a84c]/30 hover:shadow-md transition-all duration-300 opacity-75"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="bg-gray-400 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                            {event.date}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${CATEGORY_COLORS[event.category] || "bg-gray-100 text-gray-700"}`}
                          >
                            {event.category}
                          </span>
                        </div>
                        <h3
                          className="text-lg font-bold text-[#1a2744] mb-3 leading-snug"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.desc}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <MapPin className="h-3.5 w-3.5 text-[#c9a84c]" />
                          {event.location}
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-[#f8f5f0] rounded-lg p-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                              {t.upcoming.themeLabel}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">{event.theme}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                              {t.upcoming.activitiesLabel}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">{event.activities}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* RIGHT: Collaboration Form */}
          <Reveal delay={150}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#c9a84c] mb-3">
                {t.form.badge}
              </p>
              <h2
                className="text-2xl font-bold text-[#1a2744] mb-3 leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.form.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{t.form.subtitle}</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-7 w-7 text-[#c9a84c]" />
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1a2744] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t.form.successTitle}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">{t.form.successDesc}</p>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] hover:text-[#1a2744] transition-colors"
                  >
                    {t.form.reset}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                        {t.form.nameRequired}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.form.namePlaceholder}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-300 focus:outline-none focus:border-[#c9a84c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                        {t.form.emailRequired}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t.form.emailPlaceholder}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-300 focus:outline-none focus:border-[#c9a84c] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                        {t.form.phoneLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={t.form.phonePlaceholder}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-300 focus:outline-none focus:border-[#c9a84c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                        {t.form.professionRequired}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.form.professionPlaceholder}
                        value={form.profession}
                        onChange={(e) => setForm({ ...form, profession: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-300 focus:outline-none focus:border-[#c9a84c] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                      {t.form.sectorRequired}
                    </label>
                    <select
                      required
                      value={form.sector}
                      onChange={(e) => setForm({ ...form, sector: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a84c] transition-colors bg-white"
                    >
                      <option value="">—</option>
                      {t.form.sectorOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#1a2744] mb-1.5">
                      {t.form.messageRequired}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t.form.messagePlaceholder}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1a2744] placeholder-gray-300 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1a2744] text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#1a2744] transition-all rounded-lg"
                    >
                      {t.form.submit}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 border border-gray-200 text-[#1a2744] py-3 text-xs font-black uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all rounded-lg"
                    >
                      {t.form.reset}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── COLLABORATIONS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="bg-[#1a2744] rounded-2xl p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-[#c9a84c]" />
                </div>
                <h2 className="text-sm font-black tracking-widest text-[#c9a84c] uppercase">
                  {t.collab.title}
                </h2>
              </div>
              <p className="text-white/75 leading-relaxed max-w-3xl mb-10">{t.collab.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {t.collab.categories.map((cat, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#c9a84c]/40 hover:bg-white/8 transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center mb-4">
                        <CollabIcon icon={cat.icon} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">{cat.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1a2744] border-t border-white/10 py-8 px-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#c9a84c] hover:text-white transition-colors text-sm font-semibold mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.nav.backHome}
        </Link>
        <p className="text-white/40 text-xs">© 2025 Adelaide Manta. All rights reserved.</p>
      </footer>
    </div>
  );
}
