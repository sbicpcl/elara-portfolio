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

const DATA_URL_RE =
  /^data:(image\/(?:png|jpe?g|webp|gif)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/;
// ~14MB of base64 ≈ ~10MB file; covers multi-page PDFs, under Anthropic's request limit.
const MAX_BASE64 = 14_000_000;

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
      { ok: false, error: "Please upload a valid image (JPEG, PNG, WebP) or a PDF." },
      { status: 400 },
    );
  }
  const [, mediaType, data] = match;
  const isPdf = mediaType === "application/pdf";
  if (data.length > MAX_BASE64) {
    return NextResponse.json(
      { ok: false, error: "That file is too large — try a smaller photo or PDF." },
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
            // PDF → document block; image → image block. Document/image goes before the text.
            isPdf
              ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
              : { type: "image", source: { type: "base64", media_type: mediaType, data } },
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
