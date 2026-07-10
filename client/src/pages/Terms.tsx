/**
 * Terms of Service Page — Adelaide Manta Financial Advisory
 * Covers: consultation services, digital product purchases, refund policy
 * Governed by Swiss law (OR — Code of Obligations)
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
    title: "Terms of Service",
    subtitle: "Terms governing consultations, digital products, and use of this website",
    lastUpdated: "Last updated: June 2026",
    backHome: "Back to Home",
    sections: [
      {
        heading: "1. About These Terms",
        body: `These Terms of Service ("Terms") govern your use of the website operated by Adelaide Manta, independent financial advisor, Switzerland ("we", "us", or "our"). By accessing this website or purchasing any product or service, you agree to be bound by these Terms. If you do not agree, please do not use this website.\n\nThese Terms are governed by Swiss law, in particular the Swiss Code of Obligations (CO).`,
      },
      {
        heading: "2. Services Offered",
        body: `Adelaide Manta offers the following services through this website:\n\n• Free initial consultation: a complimentary 30-minute introductory session to understand your financial situation and goals. This is an informational meeting and does not constitute formal financial advice.\n• Premium Advisory Package (CHF 295): a comprehensive one-time advisory engagement covering personalised financial planning, insurance review, and investment strategy.\n• Digital products: downloadable guides and resources (e.g., "Moving to Switzerland — Complete Professional Guide 2026") sold at the listed price.\n\nAll advisory services are provided in accordance with applicable Swiss financial regulations.`,
      },
      {
        heading: "3. Booking and Consultations",
        body: `Booking a consultation through this website constitutes a request for a meeting. Confirmation is subject to availability and will be communicated by email or phone.\n\nFor the free initial consultation, no payment is required. Adelaide Manta reserves the right to decline or reschedule appointments at her discretion.\n\nFor paid advisory services, full payment is required prior to the commencement of the engagement unless otherwise agreed in writing. Pricing is listed in Swiss Francs (CHF) and is inclusive of all applicable Swiss taxes.`,
      },
      {
        heading: "4. Digital Products — Purchase and Delivery",
        body: `Digital products (such as downloadable PDF guides) are sold at the price displayed on the website at the time of purchase. All prices are in CHF.\n\nUpon successful payment, the product will be delivered to the email address provided at checkout. Delivery is typically immediate or within 24 hours. If you do not receive your product, please contact adelaide.manta@swisslife-select.ch.\n\nDigital products are for personal, non-commercial use only. You may not reproduce, distribute, resell, or share the content without prior written permission.`,
      },
      {
        heading: "5. Refund Policy",
        body: `Free consultation: no payment is taken, so no refund applies.\n\nPremium Advisory Package (CHF 295): if you wish to cancel before the advisory engagement has commenced, you may request a full refund within 7 days of payment by contacting adelaide.manta@swisslife-select.ch. Once the engagement has commenced (i.e., the first substantive advisory session has taken place), no refund will be issued.\n\nDigital products: due to the nature of digital goods, all sales are final once the product has been delivered (i.e., the download link has been accessed). If you have a technical issue preventing access to your purchased product, please contact us and we will resolve it promptly. This does not affect your statutory rights under Swiss consumer protection law.`,
      },
      {
        heading: "6. Intellectual Property",
        body: `All content on this website — including text, images, graphics, logos, and digital products — is the property of Adelaide Manta or her licensors and is protected by Swiss and international intellectual property law.\n\nYou may not copy, reproduce, modify, distribute, or create derivative works from any content on this website without express written permission, except for personal, non-commercial use.`,
      },
      {
        heading: "7. Disclaimer of Liability",
        body: `The information provided on this website is for general informational purposes only and does not constitute formal financial, legal, or tax advice. While Adelaide Manta takes care to ensure the accuracy of information, no warranty is given as to its completeness or suitability for your specific situation.\n\nAdelaide Manta shall not be liable for any loss or damage arising from reliance on information provided on this website, to the extent permitted by Swiss law. All formal advisory engagements are governed by a separate written agreement.`,
      },
      {
        heading: "8. Third-Party Links",
        body: `This website may contain links to third-party websites (e.g., scheduling tools, payment processors). These links are provided for convenience only. Adelaide Manta is not responsible for the content, privacy practices, or availability of third-party websites.`,
      },
      {
        heading: "9. Privacy",
        body: `Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review the Privacy Policy to understand how we collect and use your personal data.`,
      },
      {
        heading: "10. Governing Law and Jurisdiction",
        body: `These Terms are governed by Swiss law. Any disputes arising from or related to these Terms or your use of this website shall be subject to the exclusive jurisdiction of the competent courts of Switzerland, unless mandatory consumer protection provisions of your country of residence require otherwise.`,
      },
      {
        heading: "11. Changes to These Terms",
        body: `We reserve the right to update these Terms at any time. The date at the top of this page indicates the last revision. Continued use of the website after any changes constitutes acceptance of the updated Terms. For significant changes, we will endeavour to provide notice via the website.`,
      },
      {
        heading: "12. Contact",
        body: `For any questions about these Terms, please contact:\n\nAdelaide Manta\nEmail: adelaide.manta@swisslife-select.ch\nPhone: +41 76 788 95 13`,
      },
    ],
  },
  it: {
    title: "Termini di Servizio",
    subtitle: "Termini che regolano le consulenze, i prodotti digitali e l'uso di questo sito web",
    lastUpdated: "Ultimo aggiornamento: Giugno 2026",
    backHome: "Torna alla Home",
    sections: [
      {
        heading: "1. Informazioni sui Presenti Termini",
        body: `I presenti Termini di Servizio ("Termini") regolano l'utilizzo del sito web gestito da Adelaide Manta, consulente finanziaria indipendente, Svizzera. Accedendo al sito o acquistando qualsiasi prodotto o servizio, si accettano i presenti Termini. I presenti Termini sono disciplinati dal diritto svizzero, in particolare dal Codice delle Obbligazioni svizzero (CO).`,
      },
      {
        heading: "2. Servizi Offerti",
        body: `Adelaide Manta offre i seguenti servizi tramite questo sito web:\n\n• Consulenza iniziale gratuita: una sessione introduttiva gratuita di 30 minuti per comprendere la situazione finanziaria e gli obiettivi del cliente. Si tratta di un incontro informativo e non costituisce consulenza finanziaria formale.\n• Pacchetto Consulenza Premium (CHF 295): un impegno consulenziale completo una tantum che copre pianificazione finanziaria personalizzata, revisione assicurativa e strategia di investimento.\n• Prodotti digitali: guide e risorse scaricabili (es. "Guida Professionale Completa per Trasferirsi in Svizzera 2026") vendute al prezzo indicato.`,
      },
      {
        heading: "3. Prenotazione e Consulenze",
        body: `La prenotazione di una consulenza tramite questo sito costituisce una richiesta di appuntamento. La conferma è soggetta a disponibilità e verrà comunicata via email o telefono. Per la consulenza iniziale gratuita non è richiesto alcun pagamento. Per i servizi di consulenza a pagamento, il pagamento integrale è richiesto prima dell'inizio dell'incarico, salvo diverso accordo scritto. I prezzi sono espressi in franchi svizzeri (CHF).`,
      },
      {
        heading: "4. Prodotti Digitali — Acquisto e Consegna",
        body: `I prodotti digitali vengono venduti al prezzo indicato sul sito al momento dell'acquisto. Tutti i prezzi sono in CHF. Dopo il pagamento, il prodotto verrà consegnato all'indirizzo email fornito al momento del pagamento. La consegna è generalmente immediata o entro 24 ore. I prodotti digitali sono destinati esclusivamente all'uso personale e non commerciale.`,
      },
      {
        heading: "5. Politica di Rimborso",
        body: `Consulenza gratuita: non viene effettuato alcun pagamento, quindi non si applica alcun rimborso.\n\nPacchetto Premium (CHF 295): se si desidera annullare prima dell'inizio dell'incarico, è possibile richiedere un rimborso completo entro 7 giorni dal pagamento contattando adelaide.manta@swisslife-select.ch. Una volta iniziato l'incarico, non verrà emesso alcun rimborso.\n\nProdotti digitali: a causa della natura dei beni digitali, tutte le vendite sono definitive una volta consegnato il prodotto. In caso di problemi tecnici, contattare il servizio clienti.`,
      },
      {
        heading: "6. Proprietà Intellettuale",
        body: `Tutti i contenuti di questo sito web — testi, immagini, grafica, loghi e prodotti digitali — sono di proprietà di Adelaide Manta o dei suoi licenziatari e sono protetti dalla legge svizzera e internazionale sulla proprietà intellettuale. Non è consentita la riproduzione o distribuzione senza autorizzazione scritta.`,
      },
      {
        heading: "7. Limitazione di Responsabilità",
        body: `Le informazioni fornite su questo sito hanno scopo puramente informativo e non costituiscono consulenza finanziaria, legale o fiscale formale. Adelaide Manta non sarà responsabile per eventuali perdite o danni derivanti dall'affidamento alle informazioni fornite sul sito, nei limiti consentiti dalla legge svizzera.`,
      },
      {
        heading: "8. Legge Applicabile e Giurisdizione",
        body: `I presenti Termini sono disciplinati dal diritto svizzero. Qualsiasi controversia sarà soggetta alla giurisdizione esclusiva dei tribunali competenti della Svizzera.`,
      },
      {
        heading: "9. Contatti",
        body: `Per qualsiasi domanda sui presenti Termini:\n\nAdelaide Manta\nEmail: adelaide.manta@swisslife-select.ch\nTelefono: +41 76 788 95 13`,
      },
    ],
  },
  fr: {
    title: "Conditions d'Utilisation",
    subtitle: "Conditions régissant les consultations, les produits numériques et l'utilisation de ce site web",
    lastUpdated: "Dernière mise à jour : Juin 2026",
    backHome: "Retour à l'accueil",
    sections: [
      {
        heading: "1. À Propos des Présentes Conditions",
        body: `Les présentes Conditions d'Utilisation ("Conditions") régissent votre utilisation du site web exploité par Adelaide Manta, conseillère financière indépendante, Suisse. En accédant à ce site ou en achetant un produit ou service, vous acceptez d'être lié par ces Conditions. Les présentes Conditions sont régies par le droit suisse, notamment le Code des Obligations suisse (CO).`,
      },
      {
        heading: "2. Services Proposés",
        body: `Adelaide Manta propose les services suivants via ce site web :\n\n• Consultation initiale gratuite : une session introductive gratuite de 30 minutes. Il s'agit d'une réunion d'information et ne constitue pas un conseil financier formel.\n• Pack Conseil Premium (CHF 295) : un engagement de conseil complet couvrant la planification financière personnalisée, la révision des assurances et la stratégie d'investissement.\n• Produits numériques : guides et ressources téléchargeables (ex. "Guide Professionnel Complet pour S'installer en Suisse 2026") vendus au prix affiché.`,
      },
      {
        heading: "3. Réservation et Consultations",
        body: `La réservation d'une consultation via ce site constitue une demande de rendez-vous. La confirmation est soumise à disponibilité et sera communiquée par e-mail ou téléphone. Pour la consultation initiale gratuite, aucun paiement n'est requis. Pour les services de conseil payants, le paiement intégral est requis avant le début de la mission. Les prix sont exprimés en francs suisses (CHF).`,
      },
      {
        heading: "4. Produits Numériques — Achat et Livraison",
        body: `Les produits numériques sont vendus au prix affiché sur le site au moment de l'achat. Tous les prix sont en CHF. Après le paiement, le produit sera livré à l'adresse e-mail fournie lors du paiement. La livraison est généralement immédiate ou dans les 24 heures. Les produits numériques sont destinés à un usage personnel et non commercial uniquement.`,
      },
      {
        heading: "5. Politique de Remboursement",
        body: `Consultation gratuite : aucun paiement n'est effectué, donc aucun remboursement ne s'applique.\n\nPack Premium (CHF 295) : si vous souhaitez annuler avant le début de la mission, vous pouvez demander un remboursement complet dans les 7 jours suivant le paiement en contactant adelaide.manta@swisslife-select.ch. Une fois la mission commencée, aucun remboursement ne sera effectué.\n\nProduits numériques : en raison de la nature des biens numériques, toutes les ventes sont définitives une fois le produit livré. En cas de problème technique, veuillez nous contacter.`,
      },
      {
        heading: "6. Propriété Intellectuelle",
        body: `Tout le contenu de ce site web — textes, images, graphiques, logos et produits numériques — est la propriété d'Adelaide Manta ou de ses concédants de licence et est protégé par le droit suisse et international de la propriété intellectuelle. Toute reproduction ou distribution sans autorisation écrite est interdite.`,
      },
      {
        heading: "7. Limitation de Responsabilité",
        body: `Les informations fournies sur ce site sont à titre informatif uniquement et ne constituent pas un conseil financier, juridique ou fiscal formel. Adelaide Manta ne saurait être tenue responsable des pertes ou dommages résultant de la confiance accordée aux informations fournies sur le site, dans les limites autorisées par le droit suisse.`,
      },
      {
        heading: "8. Droit Applicable et Juridiction",
        body: `Les présentes Conditions sont régies par le droit suisse. Tout litige sera soumis à la juridiction exclusive des tribunaux compétents de Suisse.`,
      },
      {
        heading: "9. Contact",
        body: `Pour toute question concernant ces Conditions :\n\nAdelaide Manta\nEmail : adelaide.manta@swisslife-select.ch\nTéléphone : +41 76 788 95 13`,
      },
    ],
  },
  de: {
    title: "Nutzungsbedingungen",
    subtitle: "Bedingungen für Beratungen, digitale Produkte und die Nutzung dieser Website",
    lastUpdated: "Zuletzt aktualisiert: Juni 2026",
    backHome: "Zurück zur Startseite",
    sections: [
      {
        heading: "1. Über Diese Bedingungen",
        body: `Die vorliegenden Nutzungsbedingungen ("Bedingungen") regeln die Nutzung der Website von Adelaide Manta, unabhängige Finanzberaterin, Schweiz. Durch den Zugriff auf diese Website oder den Kauf eines Produkts oder einer Dienstleistung erklären Sie sich mit diesen Bedingungen einverstanden. Diese Bedingungen unterliegen dem Schweizer Recht, insbesondere dem Schweizer Obligationenrecht (OR).`,
      },
      {
        heading: "2. Angebotene Dienstleistungen",
        body: `Adelaide Manta bietet über diese Website folgende Dienstleistungen an:\n\n• Kostenlose Erstberatung: ein kostenloses 30-minütiges Einführungsgespräch. Es handelt sich um ein Informationsgespräch und stellt keine formelle Finanzberatung dar.\n• Premium-Beratungspaket (CHF 295): ein umfassendes einmaliges Beratungsengagement mit persönlicher Finanzplanung, Versicherungsüberprüfung und Anlagestrategie.\n• Digitale Produkte: herunterladbare Leitfäden und Ressourcen (z. B. "Vollständiger Professioneller Leitfaden für den Umzug in die Schweiz 2026") zum angegebenen Preis.`,
      },
      {
        heading: "3. Buchung und Beratungen",
        body: `Die Buchung einer Beratung über diese Website stellt eine Terminanfrage dar. Die Bestätigung erfolgt nach Verfügbarkeit per E-Mail oder Telefon. Für die kostenlose Erstberatung ist keine Zahlung erforderlich. Für kostenpflichtige Beratungsleistungen ist die vollständige Zahlung vor Beginn des Auftrags erforderlich. Die Preise sind in Schweizer Franken (CHF) angegeben.`,
      },
      {
        heading: "4. Digitale Produkte — Kauf und Lieferung",
        body: `Digitale Produkte werden zum auf der Website angezeigten Preis zum Zeitpunkt des Kaufs verkauft. Alle Preise sind in CHF. Nach erfolgreicher Zahlung wird das Produkt an die beim Kauf angegebene E-Mail-Adresse geliefert. Die Lieferung erfolgt in der Regel sofort oder innerhalb von 24 Stunden. Digitale Produkte sind ausschliesslich für den persönlichen, nicht-kommerziellen Gebrauch bestimmt.`,
      },
      {
        heading: "5. Rückgaberecht",
        body: `Kostenlose Beratung: Es wird keine Zahlung geleistet, daher gilt kein Rückgaberecht.\n\nPremium-Paket (CHF 295): Wenn Sie vor Beginn des Auftrags stornieren möchten, können Sie innerhalb von 7 Tagen nach der Zahlung eine vollständige Rückerstattung beantragen, indem Sie adelaide.manta@swisslife-select.ch kontaktieren. Nach Beginn des Auftrags wird keine Rückerstattung gewährt.\n\nDigitale Produkte: Aufgrund der Natur digitaler Güter sind alle Verkäufe endgültig, sobald das Produkt geliefert wurde. Bei technischen Problemen wenden Sie sich bitte an uns.`,
      },
      {
        heading: "6. Geistiges Eigentum",
        body: `Alle Inhalte dieser Website — einschliesslich Texte, Bilder, Grafiken, Logos und digitale Produkte — sind Eigentum von Adelaide Manta oder ihren Lizenzgebern und durch Schweizer und internationales Recht zum Schutz des geistigen Eigentums geschützt. Eine Vervielfältigung oder Verbreitung ohne schriftliche Genehmigung ist untersagt.`,
      },
      {
        heading: "7. Haftungsausschluss",
        body: `Die auf dieser Website bereitgestellten Informationen dienen ausschliesslich allgemeinen Informationszwecken und stellen keine formelle Finanz-, Rechts- oder Steuerberatung dar. Adelaide Manta haftet nicht für Verluste oder Schäden, die aus dem Vertrauen auf die auf der Website bereitgestellten Informationen entstehen, soweit nach Schweizer Recht zulässig.`,
      },
      {
        heading: "8. Anwendbares Recht und Gerichtsstand",
        body: `Diese Bedingungen unterliegen dem Schweizer Recht. Alle Streitigkeiten unterliegen der ausschliesslichen Zuständigkeit der zuständigen Gerichte der Schweiz.`,
      },
      {
        heading: "9. Kontakt",
        body: `Bei Fragen zu diesen Bedingungen:\n\nAdelaide Manta\nE-Mail: adelaide.manta@swisslife-select.ch\nTelefon: +41 76 788 95 13`,
      },
    ],
  },
};

export default function Terms() {
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
            {lang === "en" && "Questions about these Terms?"}
            {lang === "it" && "Domande sui presenti Termini?"}
            {lang === "fr" && "Des questions sur ces Conditions ?"}
            {lang === "de" && "Fragen zu diesen Bedingungen?"}
          </h3>
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
