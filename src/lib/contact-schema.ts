import { z } from "zod";

/**
 * Contact form contract.
 *
 * Shared by the client form and the route handler so there is one
 * definition of what a valid submission is. The server validates
 * independently regardless — client-side validation is a convenience for
 * the person filling the form, never a trust boundary.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().default(""),
  projectType: z
    .enum(["ai-automation", "software", "data", "not-sure"])
    .default("not-sure"),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
  /**
   * Honeypot. Hidden from people, irresistible to naive bots.
   *
   * Deliberately accepts any string. Rejecting a filled value here would
   * return a validation error naming this field, which tells the bot
   * exactly what caught it. Instead the value passes validation and the
   * route handler drops the submission while replying 200, so the bot
   * gets no signal at all.
   */
  website: z.string().max(500).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
