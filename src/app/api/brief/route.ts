import { NextResponse } from "next/server";
import { briefSchema } from "@/lib/brief-schema";

export const runtime = "nodejs";

/**
 * Project brief intake.
 *
 * A successful response means the enquiry reached its configured inbox.
 * Server logs are ephemeral on many hosts, so they cannot stand in for a
 * durable record of a visitor's full brief.
 *
 * `BRIEF_WEBHOOK_URL` points at whatever system is in use — n8n, Make,
 * HubSpot, GoHighLevel, Supabase. Swapping it is an environment change, not a
 * code change. No secret is ever read on the client.
 */
const WEBHOOK = process.env.BRIEF_WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.BRIEF_WEBHOOK_TOKEN;

/** Bots submit instantly; a human cannot complete six steps this fast. */
const MIN_ELAPSED_MS = 3000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some answers need attention.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const brief = parsed.data;

  // Honeypot and timing. Both answer 200 so a bot learns nothing from the
  // response, while nothing is recorded or forwarded.
  const trapped =
    (brief.website && brief.website.length > 0) ||
    (typeof brief.elapsedMs === "number" && brief.elapsedMs < MIN_ELAPSED_MS);
  if (trapped) {
    return NextResponse.json({ ok: true });
  }

  const record = {
    receivedAt: new Date().toISOString(),
    stage: brief.stage,
    create: brief.create,
    objective: brief.objective,
    presence: brief.presence,
    presenceLink: brief.presenceLink ?? null,
    timeline: brief.timeline,
    project: brief.project,
    contact: {
      name: brief.name,
      company: brief.company ?? null,
      city: brief.city ?? null,
      phone: brief.phone,
      email: brief.email || null,
    },
    detail: brief.detail ?? null,
    attribution: brief.attribution ?? null,
  };

  if (!WEBHOOK) {
    console.error("[brief] inbox not configured");
    return NextResponse.json(
      { error: "The project inbox is unavailable. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(WEBHOOK_TOKEN ? { authorization: `Bearer ${WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[brief] webhook rejected", res.status);
      return NextResponse.json(
        { error: "The project inbox is unavailable. Please try again later." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error(
      "[brief] webhook unreachable",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: "The project inbox is unavailable. Please try again later." },
      { status: 502 },
    );
  }

  console.info("[brief] delivered", { receivedAt: record.receivedAt });
  return NextResponse.json({ ok: true });
}
