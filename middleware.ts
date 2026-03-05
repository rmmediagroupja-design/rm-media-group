import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Edge-compatible middleware using NextAuth v5 auth wrapper.
 * This is the recommended way to protect routes in v5.
 */
export default auth((req) => {
    const { pathname } = req.nextUrl;
    const token = req.auth?.user;

    // ─── Admin routes: require ADMIN or STAFF ─────────────────────────────────
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
        }
        if (token.role !== "ADMIN" && token.role !== "STAFF") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Hide admin routes from public indexing
        const response = NextResponse.next();
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
        return response;
    }

    // ─── Client portal: require CLIENT (or ADMIN) ─────────────────────────────
    if (pathname.startsWith("/client")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/client", req.url));
        }
        if (token.role !== "CLIENT" && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    // ─── Already logged in → redirect away from login ─────────────────────────
    if (pathname === "/login" && token) {
        if (token.role === "ADMIN" || token.role === "STAFF") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.redirect(new URL("/client", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/admin/:path*",
        "/client/:path*",
        "/login",
        // Skip static files and Next.js internals
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2)).*)",
    ],
};
