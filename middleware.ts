import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge-compatible middleware.
 * Uses next-auth/jwt `getToken` which only reads the JWT cookie — no Prisma needed.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });

    // ─── Admin routes: require ADMIN or STAFF ─────────────────────────────────
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url));
        }
        if (token.role !== "ADMIN" && token.role !== "STAFF") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Hide admin routes from public indexing
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
    }

    // ─── Client portal: require CLIENT (or ADMIN) ─────────────────────────────
    if (pathname.startsWith("/client")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/client", request.url));
        }
        if (token.role !== "CLIENT" && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    // ─── Already logged in → redirect away from login ─────────────────────────
    if (pathname === "/login" && token) {
        if (token.role === "ADMIN" || token.role === "STAFF") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/client", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/client/:path*",
        "/login",
        // Skip static files and Next.js internals
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2)).*)",
    ],
};
