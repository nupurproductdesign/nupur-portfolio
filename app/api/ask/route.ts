import Anthropic from "@anthropic-ai/sdk";
import { KB } from "@/lib/kb";

// Ask-Nupur backend. Runs on the server only, so ANTHROPIC_API_KEY never reaches the browser.

const MODEL = "claude-haiku-4-5"; // small + fast
const MAX_TOKENS = 350; // 2–5 sentences fits comfortably
const MAX_QUESTION = 400; // matches the input's maxLength
const MAX_ANSWER = 2000; // earlier answers sent back as history
const MAX_TURNS = 8;

// Basic per-IP rate limit. In-memory, so it's per server instance: good enough to stop casual abuse.
const WINDOW_MS = 60_000;
const PER_WINDOW = 8;
const PER_DAY = 60;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const inWindow = recent.filter((t) => now - t < WINDOW_MS).length;
  if (inWindow >= PER_WINDOW || recent.length >= PER_DAY) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

const MSG = {
  off: "Live answers aren't switched on yet. Try a suggested question, or reach me on LinkedIn.",
  rate: "Lots of questions at once. Give it a minute.",
  bad: "I couldn't read that question. Try asking it a different way.",
  long: `That's a long one. Keep questions under ${MAX_QUESTION} characters.`,
  fail: "Something went wrong on my side. Try again, or reach me on LinkedIn.",
};

const json = (error: string, status: number) => Response.json({ error }, { status });

function parseMessages(body: unknown): Anthropic.MessageParam[] | "bad" | "long" {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return "bad";
  const turns = raw.slice(-MAX_TURNS);
  // history must start with the visitor
  while (turns.length && turns[0]?.role !== "user") turns.shift();
  const out: Anthropic.MessageParam[] = [];
  for (const [i, t] of turns.entries()) {
    const role = t?.role, content = t?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return "bad";
    if (role !== (i % 2 === 0 ? "user" : "assistant")) return "bad";
    if (content.length > (role === "user" ? MAX_QUESTION : MAX_ANSWER)) return role === "user" ? "long" : "bad";
    out.push({ role, content });
  }
  if (out.at(-1)?.role !== "user") return "bad";
  return out;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json(MSG.off, 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return json(MSG.rate, 429);

  const body = await req.json().catch(() => null);
  const messages = parseMessages(body);
  if (messages === "bad") return json(MSG.bad, 400);
  if (messages === "long") return json(MSG.long, 400);

  const client = new Anthropic();
  const stream = client.messages.stream({ model: MODEL, max_tokens: MAX_TOKENS, system: KB, messages });
  const events = stream[Symbol.asyncIterator]();

  // Wait for the first event so API errors become a friendly JSON error instead of a broken stream.
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    console.error("ask: anthropic error", err);
    return json(err instanceof Anthropic.RateLimitError ? MSG.rate : MSG.fail, 502);
  }

  const enc = new TextEncoder();
  const text = (e: Anthropic.MessageStreamEvent) =>
    e.type === "content_block_delta" && e.delta.type === "text_delta" ? e.delta.text : "";

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done) controller.enqueue(enc.encode(text(first.value)));
        for (let r = await events.next(); !r.done; r = await events.next()) {
          const t = text(r.value);
          if (t) controller.enqueue(enc.encode(t));
        }
      } catch (err) {
        console.error("ask: stream error", err);
        controller.enqueue(enc.encode(" …sorry, I lost my train of thought. Try again?"));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
