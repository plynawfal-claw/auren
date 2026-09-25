import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/navigation";

// Next 16 renamed `middleware` to `proxy`. Same mechanism, same file position
// (beside `app/`), different filename — see node_modules/next/dist/docs.
const handleLocale = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The default-locale rewrite from next-intl currently loops back to the
  // same URL in Next 16. Resolve English paths directly while keeping their
  // public URLs unprefixed. The internal `/en` route must pass through: a
  // rewrite can invoke the proxy again before the page renders.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  if (pathname !== "/fr" && !pathname.startsWith("/fr/")) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(destination);
  }

  return handleLocale(request);
}

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  // Crucially this keeps sitemap.xml / robots.txt / llms.txt off the locale
  // rewrite path, so they are served exactly where crawlers expect them.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
