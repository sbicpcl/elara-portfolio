import { NextResponse } from "next/server";
import {
  getClient,
  MODEL,
  ANALYSIS_SCHEMA,
  ANALYSIS_SYSTEM,
  analysisUserText,
  DEMO_ANALYSIS,
  type Analysis,
} from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const DATA_URL_RE = /^data:(image\/(?:png|jpe?g|webp|gif));base64,([A-Za-z0-9+/=]+)$/;
// ~6MB of base64 ≈ ~4.5MB image; comfortably under Anthropic's per-image limit.
const MAX_BASE64 = 6_000_000;

export async function POST(req: Request) {
  let body: { image?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const image = String(body.image ?? "");
  const notes = typeof body.notes === "string" ? body.notes : "";

  const match = image.match(DATA_URL_RE);
  if (!match) {
    return NextResponse.json(
      { ok: false, error: "Please upload a valid image (JPEG, PNG, or WebP)." },
      { status: 400 },
    );
  }
  const [, mediaType, data] = match;
  if (data.length > MAX_BASE64) {
    return NextResponse.json(
      { ok: false, error: "That image is too large — try a smaller photo." },
      { status: 413 },
    );
  }

  // Demo mode: no key configured — return sample data so the app still works.
  const client = getClient();
  if (!client) {
    return NextResponse.json({ ok: true, demo: true, analysis: DEMO_ANALYSIS });
  }

  try {
    // output_config.format (structured outputs) guarantees schema-valid JSON.
    // Typed loosely to stay resilient to SDK type drift on newer fields.
    const params = {
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: ANALYSIS_SCHEMA },
      },
      system: ANALYSIS_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data } },
            { type: "text", text: analysisUserText(notes) },
          ],
        },
      ],
    };

    const message = await client.messages.create(params as never);

    if (message.stop_reason === "refusal") {
      return NextResponse.json(
        { ok: false, error: "I couldn't analyze this image. Please try a clear, well-lit photo of skin." },
        { status: 422 },
      );
    }

    const textBlock = message.content.find(
      (b: { type: string }) => b.type === "text",
    ) as { text?: string } | undefined;
    if (!textBlock?.text) {
      throw new Error("No analysis returned.");
    }

    const analysis = JSON.parse(textBlock.text) as Analysis;
    return NextResponse.json({ ok: true, demo: false, analysis });
  } catch (err) {
    console.error("[analyze] failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong analyzing your photo. Please try again." },
      { status: 502 },
    );
  }
}
