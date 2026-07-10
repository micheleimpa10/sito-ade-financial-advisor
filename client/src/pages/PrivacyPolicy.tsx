/**
 * Privacy Policy Page — Adelaide Manta Financial Advisory
 * Compliant with: Swiss nFADP (new Federal Act on Data Protection, in force Sept 2023)
 * Also references: EU GDPR (relevant for EU-resident clients)
 * Design: Swiss Minimalism — Navy/Cream/Gold palette, Playfair Display + DM Sans
 */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

type Lang = "en" | "it" | "fr" | "de";

const content: Record<Lang, {
  title: string;
  subtitle: string;
  lastUpdated: string;
  backHome: string;
  sections: { heading: string; body: string }[];
}> = {
  en: {
    title: "Privacy Policy",
    subtitle: "How Adelaide Manta collects, uses, and protects your personal data",
    lastUpdated: "Last updated: June 2026",
    backHome: "Back to Home",
    sections: [
      {
        heading: "1. Data Controller",
        body: `The data controller responsible for your personal data is:\n\nAdelaide Manta\nIndependent Financial Advisor\nSwitzerland\nEmail: adelaide.manta@swisslife-select.ch\nPhone: +41 76 788 95 13\n\nThis Privacy Policy applies to all personal data collected through this website (the "Site") and through any related services, consultations, or digital products offered by Adelaide Manta.`,
      },
      {
        heading: "2. Legal Basis",
        body: `This policy is governed by the Swiss Federal Act on Data Protection (nFADP / revDSG), which entered into force on 1 September 2023. Where clients are residents of the European Union, the EU General Data Protection Regulation (GDPR) also applies. Adelaide Manta processes personal data only on the following legal bases:\n\n• Your explicit consent (e.g., when you submit a contact form or book a consultation)\n• Performance of a contract or pre-contractual steps (e.g., delivering a purchased digital guide)\n• Compliance with a legal obligation\n• Legitimate interests pursued by Adelaide Manta, provided these do not override your fundamental rights`,
      },
      {
        heading: "3. What Data We Collect",
        body: `We collect only the data necessary to provide our services:\n\n• Contact information: name, email address, phone number (when you submit the contact or booking form)\n• Communication content: the message or questions you send via the contact form\n• Purchase data: name, email, and transaction details when you purchase a digital product (e.g., the Moving to Switzerland Guide)\n• Usage data: anonymised technical data such as browser type and page visit duration, collected automatically via the web server. We do not use tracking cookies or third-party analytics.\n\nWe do not collect sensitive data (health, religion, political opinions, etc.) through this Site.`,
      },
      {
        heading: "4. How We Use Your Data",
        body: `Your personal data is used exclusively for the following purposes:\n\n• To respond to your enquiries and schedule consultations\n• To deliver purchased digital products to your email address\n• To send follow-up information related to your consultation request, if you have consented\n• To comply with legal and regulatory obligations applicable to financial advisory services in Switzerland\n\nWe do not sell, rent, or share your personal data with third parties for marketing purposes.`,
      },
      {
        heading: "5. Data Sharing",
        body: `Your data may be shared with the following categories of recipients only where strictly necessary:\n\n• Scheduling tools: if you book a consultation via a third-party calendar tool (e.g., Calendly), that provider's privacy policy also applies.\n• Payment processors: if you purchase a digital product, payment is handled by a third-party processor (e.g., Stripe). We do not store your payment card details.\n\nAll third-party service providers are contractually required to protect your data and use it only for the specified purpose.`,
      },
      {
        heading: "6. Cookies",
        body: `This Site uses only essential technical cookies required for the website to function correctly (e.g., session management). We do not use advertising, tracking, or analytics cookies. No cookie consent banner is required for essential cookies under Swiss law. If this changes in the future, we will update this policy and implement a consent mechanism.`,
      },
      {
        heading: "7. Data Retention",
        body: `We retain your personal data only for as long as necessary:\n\n• Contact form enquiries: up to 12 months from the date of last contact, unless a client relationship is established\n• Client records: for the duration of the advisory relationship and up to 10 years thereafter, as required by Swiss financial regulations (Art. 958f CO)\n• Purchase records: up to 10 years for accounting and tax purposes\n\nAfter the retention period expires, your data is securely deleted or anonymised.`,
      },
      {
        heading: "8. Your Rights",
        body: `Under the Swiss nFADP (and GDPR where applicable), you have the following rights:\n\n• Right of access: you may request a copy of the personal data we hold about you\n• Right to rectification: you may ask us to correct inaccurate or incomplete data\n• Right to erasure: you may request deletion of your data, subject to legal retention obligations\n• Right to restriction: you may ask us to limit how we process your data in certain circumstances\n• Right to data portability: you may request your data in a structured, machine-readable format\n• Right to object: you may object to processing based on legitimate interests\n• Right to withdraw consent: where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing\n\nTo exercise any of these rights, please contact: adelaide.manta@swisslife-select.ch`,
      },
      {
        heading: "9. Data Security",
        body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include encrypted data transmission (HTTPS), access controls, and regular security reviews. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
      },
      {
        heading: "10. International Transfers",
        body: `Your data is processed primarily in Switzerland. If any data is transferred to a country outside Switzerland or the EU/EEA, we ensure adequate protection through standard contractual clauses or other mechanisms recognised under Swiss and EU law.`,
      },
      {
        heading: "11. Supervisory Authority",
        body: `If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC):\n\nFDPIC — Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter\nwww.edoeb.admin.ch\n\nEU residents may also contact their local data protection authority.`,
      },
      {
        heading: "12. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The date at the top of this page indicates when it was last revised. We encourage you to review this page periodically. Continued use of the Site after any changes constitutes your acceptance of the updated policy.`,
      },
    ],
  },
  it: {
    title: "Informativa sulla Privacy",
    subtitle: "Come Adelaide Manta raccoglie, utilizza e protegge i tuoi dati personali",
    lastUpdated: "Ultimo aggiornamento: Giugno 2026",
    backHome: "Torna alla Home",
    sections: [
      {
        heading: "1. Titolare del Trattamento",
        body: `Il titolare del trattamento dei tuoi dati personali è:\n\nAdelaide Manta\nConsulente Finanziaria Indipendente\nSvizzera\nEmail: adelaide.manta@swisslife-select.ch\nTelefono: +41 76 788 95 13\n\nLa presente Informativa sulla Privacy si applica a tutti i dati personali raccolti attraverso questo sito web e attraverso i servizi, le consulenze o i prodotti digitali offerti da Adelaide Manta.`,
      },
      {
        heading: "2. Base Giuridica",
        body: `La presente informativa è disciplinata dalla Legge federale svizzera sulla protezione dei dati (nLPD / revDSG), entrata in vigore il 1° settembre 2023. Per i clienti residenti nell'Unione Europea si applica anche il Regolamento Generale sulla Protezione dei Dati (GDPR). I dati personali vengono trattati esclusivamente sulla base di: consenso esplicito, esecuzione di un contratto, obbligo legale o legittimo interesse.`,
      },
      {
        heading: "3. Dati Raccolti",
        body: `Raccogliamo solo i dati necessari per fornire i nostri servizi:\n\n• Dati di contatto: nome, indirizzo email, numero di telefono (tramite modulo di contatto o prenotazione)\n• Contenuto delle comunicazioni: il messaggio inviato tramite il modulo di contatto\n• Dati di acquisto: nome, email e dettagli della transazione per i prodotti digitali acquistati\n• Dati tecnici anonimi: tipo di browser e durata della visita, raccolti automaticamente. Non utilizziamo cookie di tracciamento o analisi di terze parti.`,
      },
      {
        heading: "4. Utilizzo dei Dati",
        body: `I tuoi dati personali vengono utilizzati esclusivamente per: rispondere alle tue richieste e programmare consulenze; consegnare i prodotti digitali acquistati; inviare informazioni di follow-up relative alla tua richiesta di consulenza, previo consenso; adempiere agli obblighi legali e normativi applicabili ai servizi di consulenza finanziaria in Svizzera.\n\nNon vendiamo, affittiamo o condividiamo i tuoi dati con terzi a scopo di marketing.`,
      },
      {
        heading: "5. Condivisione dei Dati",
        body: `I tuoi dati possono essere condivisi solo dove strettamente necessario con: strumenti di prenotazione di terze parti (es. Calendly); processori di pagamento (es. Stripe). Non conserviamo i dati della tua carta di pagamento.`,
      },
      {
        heading: "6. Cookie",
        body: `Questo sito utilizza solo cookie tecnici essenziali per il corretto funzionamento del sito. Non utilizziamo cookie pubblicitari, di tracciamento o analitici. Non è richiesto un banner di consenso ai cookie per i cookie essenziali ai sensi della legge svizzera.`,
      },
      {
        heading: "7. Conservazione dei Dati",
        body: `Conserviamo i tuoi dati solo per il tempo necessario: richieste tramite modulo di contatto fino a 12 mesi; dossier clienti per la durata del rapporto di consulenza e fino a 10 anni successivi (art. 958f CO); dati di acquisto fino a 10 anni per obblighi contabili e fiscali.`,
      },
      {
        heading: "8. I Tuoi Diritti",
        body: `Ai sensi della nLPD svizzera (e del GDPR ove applicabile), hai diritto di: accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati, opposizione e revoca del consenso.\n\nPer esercitare questi diritti: adelaide.manta@swisslife-select.ch`,
      },
      {
        heading: "9. Sicurezza dei Dati",
        body: `Adottiamo misure tecniche e organizzative adeguate per proteggere i tuoi dati personali da accessi non autorizzati, perdita o divulgazione, inclusa la trasmissione crittografata (HTTPS) e controlli di accesso.`,
      },
      {
        heading: "10. Autorità di Controllo",
        body: `Se ritieni che i tuoi diritti in materia di protezione dei dati siano stati violati, puoi presentare un reclamo all'Incaricato federale della protezione dei dati e della trasparenza (IFPDT): www.edoeb.admin.ch`,
      },
      {
        heading: "11. Modifiche alla Presente Informativa",
        body: `Potremmo aggiornare periodicamente questa Informativa sulla Privacy. La data in cima alla pagina indica l'ultima revisione. L'uso continuato del sito dopo eventuali modifiche costituisce accettazione della policy aggiornata.`,
      },
    ],
  },
  fr: {
    title: "Politique de Confidentialité",
    subtitle: "Comment Adelaide Manta collecte, utilise et protège vos données personnelles",
    lastUpdated: "Dernière mise à jour : Juin 2026",
    backHome: "Retour à l'accueil",
    sections: [
      {
        heading: "1. Responsable du Traitement",
        body: `Le responsable du traitement de vos données personnelles est :\n\nAdelaide Manta\nConseillère Financière Indépendante\nSuisse\nEmail : adelaide.manta@swisslife-select.ch\nTéléphone : +41 76 788 95 13\n\nLa présente Politique de Confidentialité s'applique à toutes les données personnelles collectées via ce site web et via les services, consultations ou produits numériques proposés par Adelaide Manta.`,
      },
      {
        heading: "2. Base Juridique",
        body: `La présente politique est régie par la Loi fédérale suisse sur la protection des données (nLPD / revDSG), entrée en vigueur le 1er septembre 2023. Pour les clients résidant dans l'Union Européenne, le Règlement Général sur la Protection des Données (RGPD) s'applique également. Les données personnelles sont traitées uniquement sur la base du consentement explicite, de l'exécution d'un contrat, d'une obligation légale ou d'un intérêt légitime.`,
      },
      {
        heading: "3. Données Collectées",
        body: `Nous collectons uniquement les données nécessaires à la fourniture de nos services :\n\n• Coordonnées : nom, adresse e-mail, numéro de téléphone (via formulaire de contact ou de réservation)\n• Contenu des communications : le message envoyé via le formulaire de contact\n• Données d'achat : nom, e-mail et détails de la transaction pour les produits numériques achetés\n• Données techniques anonymisées : type de navigateur et durée de visite. Nous n'utilisons pas de cookies de suivi ni d'analyses tierces.`,
      },
      {
        heading: "4. Utilisation des Données",
        body: `Vos données personnelles sont utilisées exclusivement pour : répondre à vos demandes et planifier des consultations ; livrer les produits numériques achetés ; envoyer des informations de suivi relatives à votre demande de consultation, si vous y avez consenti ; respecter les obligations légales et réglementaires applicables aux services de conseil financier en Suisse.\n\nNous ne vendons, ne louons ni ne partageons vos données à des fins de marketing.`,
      },
      {
        heading: "5. Partage des Données",
        body: `Vos données peuvent être partagées uniquement si strictement nécessaire avec : outils de planification tiers (ex. Calendly) ; processeurs de paiement (ex. Stripe). Nous ne conservons pas vos données de carte bancaire.`,
      },
      {
        heading: "6. Cookies",
        body: `Ce site utilise uniquement des cookies techniques essentiels au bon fonctionnement du site. Nous n'utilisons pas de cookies publicitaires, de suivi ou analytiques. Aucune bannière de consentement aux cookies n'est requise pour les cookies essentiels en vertu du droit suisse.`,
      },
      {
        heading: "7. Conservation des Données",
        body: `Nous conservons vos données uniquement le temps nécessaire : demandes via formulaire de contact jusqu'à 12 mois ; dossiers clients pendant la durée de la relation de conseil et jusqu'à 10 ans après (art. 958f CO) ; données d'achat jusqu'à 10 ans pour les obligations comptables et fiscales.`,
      },
      {
        heading: "8. Vos Droits",
        body: `En vertu de la nLPD suisse (et du RGPD le cas échéant), vous disposez des droits suivants : accès, rectification, effacement, limitation du traitement, portabilité des données, opposition et retrait du consentement.\n\nPour exercer ces droits : adelaide.manta@swisslife-select.ch`,
      },
      {
        heading: "9. Sécurité des Données",
        body: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte ou divulgation, notamment via la transmission chiffrée (HTTPS) et des contrôles d'accès.`,
      },
      {
        heading: "10. Autorité de Contrôle",
        body: `Si vous estimez que vos droits en matière de protection des données ont été violés, vous pouvez déposer une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT) : www.edoeb.admin.ch`,
      },
      {
        heading: "11. Modifications de la Présente Politique",
        body: `Nous pouvons mettre à jour cette Politique de Confidentialité périodiquement. La date en haut de cette page indique la dernière révision. L'utilisation continue du site après toute modification constitue votre acceptation de la politique mise à jour.`,
      },
    ],
  },
  de: {
    title: "Datenschutzrichtlinie",
    subtitle: "Wie Adelaide Manta Ihre personenbezogenen Daten erhebt, verwendet und schützt",
    lastUpdated: "Zuletzt aktualisiert: Juni 2026",
    backHome: "Zurück zur Startseite",
    sections: [
      {
        heading: "1. Verantwortliche Stelle",
        body: `Die für Ihre personenbezogenen Daten verantwortliche Stelle ist:\n\nAdelaide Manta\nUnabhängige Finanzberaterin\nSchweiz\nE-Mail: adelaide.manta@swisslife-select.ch\nTelefon: +41 76 788 95 13\n\nDiese Datenschutzrichtlinie gilt für alle personenbezogenen Daten, die über diese Website und im Zusammenhang mit den von Adelaide Manta angebotenen Dienstleistungen, Beratungen oder digitalen Produkten erhoben werden.`,
      },
      {
        heading: "2. Rechtsgrundlage",
        body: `Diese Richtlinie unterliegt dem Schweizer Bundesgesetz über den Datenschutz (revDSG / nDSG), das am 1. September 2023 in Kraft getreten ist. Für Kunden mit Wohnsitz in der Europäischen Union gilt zusätzlich die Datenschutz-Grundverordnung (DSGVO). Personenbezogene Daten werden ausschliesslich auf der Grundlage von ausdrücklicher Einwilligung, Vertragserfüllung, gesetzlicher Verpflichtung oder berechtigtem Interesse verarbeitet.`,
      },
      {
        heading: "3. Erhobene Daten",
        body: `Wir erheben nur die Daten, die zur Erbringung unserer Dienstleistungen erforderlich sind:\n\n• Kontaktdaten: Name, E-Mail-Adresse, Telefonnummer (über Kontakt- oder Buchungsformular)\n• Kommunikationsinhalt: die über das Kontaktformular gesendete Nachricht\n• Kaufdaten: Name, E-Mail und Transaktionsdetails für gekaufte digitale Produkte\n• Anonymisierte technische Daten: Browsertyp und Besuchsdauer. Wir verwenden keine Tracking- oder Analyse-Cookies von Drittanbietern.`,
      },
      {
        heading: "4. Verwendung Ihrer Daten",
        body: `Ihre personenbezogenen Daten werden ausschliesslich für folgende Zwecke verwendet: Beantwortung Ihrer Anfragen und Terminplanung für Beratungen; Lieferung gekaufter digitaler Produkte; Versand von Follow-up-Informationen zu Ihrer Beratungsanfrage, sofern Sie zugestimmt haben; Erfüllung gesetzlicher und regulatorischer Pflichten im Bereich der Finanzberatung in der Schweiz.\n\nWir verkaufen, vermieten oder teilen Ihre Daten nicht zu Marketingzwecken.`,
      },
      {
        heading: "5. Datenweitergabe",
        body: `Ihre Daten können nur dann weitergegeben werden, wenn dies unbedingt erforderlich ist, an: Drittanbieter-Planungstools (z. B. Calendly); Zahlungsdienstleister (z. B. Stripe). Wir speichern keine Zahlungskartendaten.`,
      },
      {
        heading: "6. Cookies",
        body: `Diese Website verwendet nur technisch notwendige Cookies, die für den ordnungsgemässen Betrieb der Website erforderlich sind. Wir verwenden keine Werbe-, Tracking- oder Analyse-Cookies. Für technisch notwendige Cookies ist nach Schweizer Recht kein Cookie-Einwilligungsbanner erforderlich.`,
      },
      {
        heading: "7. Datenspeicherung",
        body: `Wir speichern Ihre Daten nur so lange wie nötig: Kontaktformularanfragen bis zu 12 Monate; Kundendossiers für die Dauer der Beratungsbeziehung und bis zu 10 Jahre danach (Art. 958f OR); Kaufdaten bis zu 10 Jahre für buchhalterische und steuerliche Zwecke.`,
      },
      {
        heading: "8. Ihre Rechte",
        body: `Gemäss dem Schweizer revDSG (und der DSGVO, soweit anwendbar) haben Sie folgende Rechte: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch und Widerruf der Einwilligung.\n\nZur Ausübung dieser Rechte: adelaide.manta@swisslife-select.ch`,
      },
      {
        heading: "9. Datensicherheit",
        body: `Wir treffen angemessene technische und organisatorische Massnahmen zum Schutz Ihrer personenbezogenen Daten vor unbefugtem Zugriff, Verlust oder Offenlegung, einschliesslich verschlüsselter Übertragung (HTTPS) und Zugriffskontrollen.`,
      },
      {
        heading: "10. Aufsichtsbehörde",
        body: `Wenn Sie der Ansicht sind, dass Ihre Datenschutzrechte verletzt wurden, können Sie eine Beschwerde beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) einreichen: www.edoeb.admin.ch`,
      },
      {
        heading: "11. Änderungen dieser Richtlinie",
        body: `Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Das Datum oben auf dieser Seite gibt den letzten Überarbeitungsstand an. Die weitere Nutzung der Website nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.`,
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>("en");
  const t = content[lang];
  const langs: Lang[] = ["en", "it", "fr", "de"];
  const langLabels: Record<Lang, string> = { en: "EN", it: "IT", fr: "FR", de: "DE" };

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-[DM_Sans,sans-serif]">
      {/* Header */}
      <header className="bg-[#1a2744] text-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-[#c9a84c] transition-colors text-sm">
            <ArrowLeft size={16} />
            {t.backHome}
          </Link>
          <div className="flex gap-3">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold tracking-widest px-2 py-1 transition-colors ${
                  lang === l ? "text-[#c9a84c] border-b border-[#c9a84c]" : "text-white/50 hover:text-white"
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1a2744] text-white pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-[Playfair_Display,serif] text-4xl md:text-5xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-white/60 text-lg mb-2">{t.subtitle}</p>
          <p className="text-white/40 text-sm">{t.lastUpdated}</p>
        </div>
      </div>

      {/* Gold divider */}
      <div className="h-1 bg-[#c9a84c]" />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-10">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-[Playfair_Display,serif] text-xl font-bold text-[#1a2744] mb-3">
                {section.heading}
              </h2>
              <div className="text-[#3a3a3a] leading-relaxed text-[15px] whitespace-pre-line">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        {/* Contact box */}
        <div className="mt-16 p-8 bg-[#1a2744] text-white rounded-sm">
          <h3 className="font-[Playfair_Display,serif] text-xl font-bold mb-3 text-[#c9a84c]">
            {lang === "en" && "Questions about this policy?"}
            {lang === "it" && "Domande su questa informativa?"}
            {lang === "fr" && "Des questions sur cette politique ?"}
            {lang === "de" && "Fragen zu dieser Richtlinie?"}
          </h3>
          <p className="text-white/70 text-sm mb-4">
            {lang === "en" && "Contact Adelaide Manta directly:"}
            {lang === "it" && "Contatta direttamente Adelaide Manta:"}
            {lang === "fr" && "Contactez directement Adelaide Manta :"}
            {lang === "de" && "Kontaktieren Sie Adelaide Manta direkt:"}
          </p>
          <div className="space-y-1 text-sm">
            <p>
              <a href="mailto:adelaide.manta@swisslife-select.ch" className="text-[#c9a84c] hover:underline">
                adelaide.manta@swisslife-select.ch
              </a>
            </p>
            <p>
              <a href="tel:+41767889513" className="text-[#c9a84c] hover:underline">
                +41 76 788 95 13
              </a>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-[#1a2744] hover:text-[#c9a84c] transition-colors text-sm font-semibold tracking-widest uppercase">
            ← {t.backHome}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2744] text-white/40 text-xs text-center py-6 px-6">
        © 2026 Adelaide Manta. {lang === "en" && "All rights reserved."}{lang === "it" && "Tutti i diritti riservati."}{lang === "fr" && "Tous droits réservés."}{lang === "de" && "Alle Rechte vorbehalten."}
      </footer>
    </div>
  );
}
