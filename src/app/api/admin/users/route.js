import { getAllUsers, createUserByAdmin } from "@/services/users/userServices";
import { NextResponse } from "next/server";

// GET all users
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const role = searchParams.get("role");
        const status_akun = searchParams.get("status_akun");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const result = await getAllUsers({ 
            role, 
            status_akun, 
            search, 
            page, 
            limit 
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("ERROR GET USERS:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// ─── Create user oleh Admin ───────────────────
// Mendukung penentuan role & status_akun secara eksplisit
export async function PUT(request) {
    try {
        const body = await request.json();
        const { nama_lengkap, email, password, status_akun } = body;

        // Validasi field wajib
        if (!nama_lengkap || !email || !password) {
            return NextResponse.json(
                { error: "nama_lengkap, email, dan password wajib diisi" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password minimal 6 karakter" },
                { status: 400 }
            );
        }

        const user = await createUserByAdmin({
            nama_lengkap,
            email,
            password,
            status_akun,
        });

        return NextResponse.json(
            { message: "User berhasil dibuat", data: user },
            { status: 201 }
        );

    } catch (error) {
        console.error("ERROR CREATE USER BY ADMIN:", error);
        if (error.message === "Email sudah terdaftar") {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
