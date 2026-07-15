/**
 * Email helper using Resend.
 * Sends transactional purchase confirmation emails in EN, IT, FR, DE.
 * Language is detected from the `language` field in OrderEmailData.
 * Sender: configured via RESEND_FROM_EMAIL env var (defaults to onboarding@resend.dev).
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Adelaide Manta <onboarding@resend.dev>";

export interface OrderEmailData {
  customerEmail: string;
  customerName?: string;
  productName: string;
  productShortName: string;
  downloadUrl: string;
  licenseKey?: string;
  amountPaid: number; // CHF cents
  currency: string;
  language?: string; // "en" | "it" | "fr" | "de"
}

// ─── Translations ─────────────────────────────────────────────────────────────

type Lang = "en" | "it" | "fr" | "de";

interface EmailStrings {
  subject: (productShortName: string) => string;
  greeting: (firstName: string) => string;
  purchaseConfirmed: (productName: string, price: string) => string;
  licenseLabel: string;
  licenseNote: string;
  downloadBtn: string;
  downloadNote: string;
  supportNote: string;
  closing: string;
  role: string;
  footerText: string;
}

const translations: Record<Lang, EmailStrings> = {
  en: {
    subject: (p) => `Your purchase is confirmed — ${p}`,
    greeting: (n) => `Thank you, ${n}! 🎉`,
    purchaseConfirmed: (p, price) =>
      `Your purchase of <strong>${p}</strong> is confirmed. You paid <strong>${price}</strong>.`,
    licenseLabel: "Your License Key",
    licenseNote: "Keep this safe — you will need it to activate your product.",
    downloadBtn: "⬇ Download Your Product",
    downloadNote: "This link is personal to you. Keep it safe.",
    supportNote:
      "If you have any questions or need help, simply reply to this email or reach out via WhatsApp. I am always happy to help.",
    closing: "With gratitude,",
    role: "Financial Advisor · Switzerland",
    footerText: "© 2026 Adelaide Manta · Switzerland",
  },
  it: {
    subject: (p) => `Il tuo acquisto è confermato — ${p}`,
    greeting: (n) => `Grazie, ${n}! 🎉`,
    purchaseConfirmed: (p, price) =>
      `Il tuo acquisto di <strong>${p}</strong> è confermato. Hai pagato <strong>${price}</strong>.`,
    licenseLabel: "La Tua Chiave di Licenza",
    licenseNote: "Conservala al sicuro — ti servirà per attivare il prodotto.",
    downloadBtn: "⬇ Scarica il Tuo Prodotto",
    downloadNote: "Questo link è personale. Conservalo al sicuro.",
    supportNote:
      "Per qualsiasi domanda o assistenza, rispondi a questa email o contattami via WhatsApp. Sono sempre felice di aiutarti.",
    closing: "Con gratitudine,",
    role: "Consulente Finanziaria · Svizzera",
    footerText: "© 2026 Adelaide Manta · Svizzera",
  },
  fr: {
    subject: (p) => `Votre achat est confirmé — ${p}`,
    greeting: (n) => `Merci, ${n} ! 🎉`,
    purchaseConfirmed: (p, price) =>
      `Votre achat de <strong>${p}</strong> est confirmé. Vous avez payé <strong>${price}</strong>.`,
    licenseLabel: "Votre Clé de Licence",
    licenseNote: "Conservez-la précieusement — vous en aurez besoin pour activer votre produit.",
    downloadBtn: "⬇ Télécharger Votre Produit",
    downloadNote: "Ce lien vous est personnel. Gardez-le en sécurité.",
    supportNote:
      "Pour toute question ou besoin d'aide, répondez simplement à cet e-mail ou contactez-moi via WhatsApp. Je suis toujours ravie de vous aider.",
    closing: "Avec gratitude,",
    role: "Conseillère Financière · Suisse",
    footerText: "© 2026 Adelaide Manta · Suisse",
  },
  de: {
    subject: (p) => `Ihr Kauf ist bestätigt — ${p}`,
    greeting: (n) => `Vielen Dank, ${n}! 🎉`,
    purchaseConfirmed: (p, price) =>
      `Ihr Kauf von <strong>${p}</strong> ist bestätigt. Sie haben <strong>${price}</strong> bezahlt.`,
    licenseLabel: "Ihr Lizenzschlüssel",
    licenseNote: "Bewahren Sie ihn sicher auf — Sie benötigen ihn zur Aktivierung Ihres Produkts.",
    downloadBtn: "⬇ Ihr Produkt Herunterladen",
    downloadNote: "Dieser Link ist persönlich für Sie. Bitte sicher aufbewahren.",
    supportNote:
      "Bei Fragen oder Hilfebedarf antworten Sie einfach auf diese E-Mail oder kontaktieren Sie mich per WhatsApp. Ich helfe Ihnen gerne weiter.",
    closing: "Mit herzlichem Dank,",
    role: "Finanzberaterin · Schweiz",
    footerText: "© 2026 Adelaide Manta · Schweiz",
  },
};

function detectLang(lang?: string): Lang {
  if (lang === "it" || lang === "fr" || lang === "de") return lang;
  return "en";
}

function formatPrice(cents: number, currency: string): string {
  return `CHF ${(cents / 100).toFixed(2)}`;
}

function buildEmailHtml(data: OrderEmailData): string {
  const lang = detectLang(data.language);
  const t = translations[lang];
  const price = formatPrice(data.amountPaid, data.currency);
  const firstName = data.customerName?.split(" ")[0] || (lang === "de" ? "Kunde" : lang === "fr" ? "cher client" : lang === "it" ? "cliente" : "there");

  const licenseSection = data.licenseKey
    ? `
    <tr>
      <td style="padding: 0 40px 24px;">
        <div style="background: #f8f5f0; border: 1px solid #c9a84c; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px;">${t.licenseLabel}</p>
          <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1a2744; font-family: monospace; letter-spacing: 2px;">${data.licenseKey}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #888;">${t.licenseNote}</p>
        </div>
      </td>
    </tr>`
    : "";

  const htmlLang = lang === "de" ? "de" : lang === "fr" ? "fr" : lang === "it" ? "it" : "en";

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.subject(data.productShortName)}</title>
</head>
<body style="margin: 0; padding: 0; background: #f0ede8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0ede8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: #1a2744; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #c9a84c; text-transform: uppercase; letter-spacing: 3px;">Adelaide Manta</p>
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 300; letter-spacing: 1px;">Financial Advisory</h1>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #c9a84c, #e8c96a, #c9a84c);"></td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 24px;">
              <h2 style="margin: 0 0 12px; font-size: 24px; color: #1a2744; font-weight: 600;">${t.greeting(firstName)}</h2>
              <p style="margin: 0; font-size: 16px; color: #444; line-height: 1.6;">
                ${t.purchaseConfirmed(data.productName, price)}
              </p>
            </td>
          </tr>

          ${licenseSection}

          <!-- Download button -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <a href="${data.downloadUrl}"
                 style="display: inline-block; background: #c9a84c; color: #1a2744; text-decoration: none; font-weight: 700; font-size: 15px; padding: 16px 40px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px;">
                ${t.downloadBtn}
              </a>
              <p style="margin: 12px 0 0; font-size: 12px; color: #999;">${t.downloadNote}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
            </td>
          </tr>

          <!-- Support note -->
          <tr>
            <td style="padding: 24px 40px 32px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #444; line-height: 1.6;">
                ${t.supportNote}
              </p>
              <p style="margin: 0; font-size: 14px; color: #444;">
                ${t.closing}<br />
                <strong style="color: #1a2744;">Adelaide Manta</strong><br />
                <span style="color: #888; font-size: 13px;">${t.role}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1a2744; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8899bb;">
                ${t.footerText} ·
                <a href="https://adelaidemanta-financialadvisor.ch" style="color: #c9a84c; text-decoration: none;">adelaidemanta-financialadvisor.ch</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPurchaseConfirmationEmail(
  data: OrderEmailData
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email send");
    return false;
  }

  const lang = detectLang(data.language);
  const t = translations[lang];

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: t.subject(data.productShortName),
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return false;
    }

    console.log(`[Email] Confirmation sent to ${data.customerEmail} (lang: ${lang})`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send confirmation email:", err);
    return false;
  }
}
