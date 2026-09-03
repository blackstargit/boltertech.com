import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/lib/site";

/**
 * Contact form intake.
 *
 * The only runtime endpoint on the site. Everything else is prerendered.
 */

/** Escape anything that goes into the notification email's HTML body. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Per-IP rate limit, in memory.
 *
 * ponytail: in-memory counter, resets on cold start and is per-instance.
 * That is fine for a marketing form — it stops a script hammering one
 * instance, which is the realistic threat. Move to Upstash/Redis if the
 * site ever runs multi-region or the spam gets targeted rather than
 * opportunistic.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the form and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot tripped: report success so the bot learns nothing, send nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;

  if (!apiKey) {
    // Missing configuration is our failure, not the visitor's. Log loudly,
    // and tell them plainly rather than pretending the message was sent.
    console.error("RESEND_API_KEY is not set — contact form cannot deliver.");
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${site.name} website <website@boltertech.com>`,
      to: [to],
      replyTo: data.email,
      subject: `Enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
      html: `
        <h2>New enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(data.company || "—")}</p>
        <p><strong>Type:</strong> ${escapeHtml(data.projectType)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "We could not send that. Please email us directly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form delivery failed:", err);
    return NextResponse.json(
      { ok: false, error: "We could not send that. Please email us directly." },
      { status: 502 },
    );
  }
}
