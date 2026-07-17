import { NextResponse } from "next/server";
import { getClient, MODEL, chatSystem, DEMO_CHAT_REPLY, type Analysis } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[]; analysis?: Analysis | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const clean = messages
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return NextResponse.json({ ok: false, error: "Send a message to continue." }, { status: 400 });
  }

  const client = getClient();
  if (!client) {
    return NextResponse.json({ ok: true, demo: true, reply: DEMO_CHAT_REPLY });
  }

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: chatSystem(body.analysis ?? null),
      messages: clean,
    } as never);

    if (message.stop_reason === "refusal") {
      return NextResponse.json({
        ok: true,
        demo: false,
        reply: "I'd rather not weigh in on that one — but I'm happy to help with your skincare routine.",
      });
    }

    const reply = (message.content as Array<{ type: string; text?: string }>)
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("\n")
      .trim();

    return NextResponse.json({ ok: true, demo: false, reply: reply || "Could you rephrase that?" });
  } catch (err) {
    console.error("[chat] failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
