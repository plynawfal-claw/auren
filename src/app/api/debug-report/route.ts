import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

/**
 * TEMPORARY iOS diagnostics sink (branch debug/ios-diagnostics). Remove before
 * merge, together with `public/auren-debug.js`.
 *
 * The on-device panel posts its report here so a physical iPhone on the LAN
 * can be diagnosed without a cable or copy-paste. Development only: in any
 * production build this route answers 404. Reports land in `.debug-reports/`
 * at the project root (gitignored), one file per device session, overwritten
 * with the latest snapshot.
 */
const DIR = path.join(process.cwd(), ".debug-reports");
const MAX_BYTES = 2_000_000;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const text = await request.text();
  if (text.length > MAX_BYTES) {
    return NextResponse.json({ error: "Too large." }, { status: 413 });
  }

  let report: { session?: unknown };
  try {
    report = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Malformed report." }, { status: 400 });
  }

  // The session id becomes a filename, so only a narrow alphabet survives.
  const session = String(report.session ?? "unknown").replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "unknown";
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, `${session}.json`), JSON.stringify(report, null, 1));
  return NextResponse.json({ ok: true });
}
