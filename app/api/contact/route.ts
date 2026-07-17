import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim(); // honeypot — humans never fill this

  // Silently accept bot submissions so they don't retry.
  if (company) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Please add your name, email, and a message." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ ok: false, error: "That message is a little long — please trim it a bit." }, { status: 400 });
  }

  // --- Delivery ---------------------------------------------------------
  // Sends via Resend when RESEND_API_KEY is set; otherwise logs the enquiry
  // so local dev works with no configuration.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[contact] (no RESEND_API_KEY — logging only)", { name, email, preview: message.slice(0, 140) });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? "hello@elaravance.design",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json({ ok: false, error: "Couldn't send just now — please email me directly." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Couldn't send just now — please email me directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
