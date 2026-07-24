import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { Resend } from "resend";

const OWNER_EMAIL = "adelaide.manta.advisor@gmail.com";

export const contactRouter = router({
  /**
   * Handle the event organisation contact form.
   * Sends an email to Adelaide with the enquirer's details.
   */
  eventRequest: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        profession: z.string().optional(),
        sector: z.string().optional(),
        message: z.string().min(1),
        language: z.enum(["en", "it", "fr", "de"]).default("en"),
      })
    )
    .mutation(async ({ input }) => {
      const resendKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@adelaidemanta-financialadvisor.ch";

      if (!resendKey) {
        console.warn("[Contact] RESEND_API_KEY not configured — event request not sent");
        return { success: false };
      }

      const resend = new Resend(resendKey);

      const subject = `New Event Organisation Request from ${input.name}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f5f0;">
          <div style="background: #1a2744; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #c9a84c; font-size: 22px; margin: 0;">New Event Organisation Request</h1>
            <p style="color: #fff; margin: 8px 0 0;">adelaidemanta-financialadvisor.ch</p>
          </div>
          <div style="background: #fff; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;"><strong>Name</strong></td><td style="padding: 8px 0; color: #1a2744;">${input.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${input.email}" style="color: #c9a84c;">${input.email}</a></td></tr>
              ${input.phone ? `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Phone</strong></td><td style="padding: 8px 0; color: #1a2744;">${input.phone}</td></tr>` : ""}
              ${input.profession ? `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Profession</strong></td><td style="padding: 8px 0; color: #1a2744;">${input.profession}</td></tr>` : ""}
              ${input.sector ? `<tr><td style="padding: 8px 0; color: #6b7280;"><strong>Sector</strong></td><td style="padding: 8px 0; color: #1a2744;">${input.sector}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #6b7280;"><strong>Language</strong></td><td style="padding: 8px 0; color: #1a2744;">${input.language.toUpperCase()}</td></tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f8f5f0; border-radius: 6px; border-left: 4px solid #c9a84c;">
              <strong style="color: #1a2744;">Message:</strong>
              <p style="color: #374151; margin: 8px 0 0; white-space: pre-wrap;">${input.message}</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${input.email}" style="background: #c9a84c; color: #1a2744; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reply to ${input.name}</a>
            </div>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">Adelaide Manta Financial Advisor · adelaidemanta-financialadvisor.ch</p>
        </div>
      `;

      try {
        await resend.emails.send({
          from: fromEmail,
          to: OWNER_EMAIL,
          replyTo: input.email,
          subject,
          html,
        });
        console.log(`[Contact] Event request email sent to ${OWNER_EMAIL} from ${input.email}`);
        return { success: true };
      } catch (err) {
        console.error("[Contact] Failed to send event request email:", err);
        return { success: false };
      }
    }),
});
