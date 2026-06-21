import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // ← ambil dari NextAuth, bukan cookie biasa

export async function middleware(request) {
    // Ambil token yang sudah diverifikasi NextAuth (di-sign dengan NEXTAUTH_SECRET)
    // User tidak bisa manipulasi ini dari browser
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,

    });




    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isUserPage = pathname.startsWith("/user");
    const isPanitiaPage = pathname.startsWith("/admin");
    const isAdminApi = pathname.startsWith("/api/admin");

    const role = token?.role; // ← dari JWT callback yang kamu set di authOptions

    // 1. Belum login & akses halaman publik → lanjut
    if (!token && isAuthPage) {
        return NextResponse.next();
    }

    // 2. Belum login & akses halaman protected → redirect ke login
    if (!token && (isUserPage || isPanitiaPage)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname); // ← ingat halaman asal
        return NextResponse.redirect(loginUrl);
    }

    // 3. Sudah login & akses halaman login/register → redirect ke dashboard
    if (token && isAuthPage) {
        if (role === "USER") {
            return NextResponse.redirect(new URL("/user/dashboard", request.url));
        }
        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
    }

    // 4. Sudah login & akses /user tapi bukan USER → forbidden
    if (token && isUserPage && role !== "USER") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // 5. Sudah login & akses /panitia tapi bukan ADMIN → forbidden
    if (token && isPanitiaPage && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    // 6. Rute API Admin wajib login dan role ADMIN
    if (isAdminApi) {
        if (!token || role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized / Forbidden" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login/:path*", "/register/:path*", "/user/:path*", "/admin/:path*", "/api/admin/:path*"],
};