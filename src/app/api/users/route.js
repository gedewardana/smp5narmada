import { registerUser } from "@/services/users/userServices";
import { NextResponse } from "next/server";
import { registerSchema, formatZodError } from "@/utils/regisvalidation";

// Register user
export async function POST(request) {
    try {
        const body = await request.json()

        // 🔥 validasi pakai Zod
        const result = registerSchema.safeParse(body)

        // kalau gagal
        if (!result.success) {
            return NextResponse.json(
                formatZodError(result.error),
                { status: 400 }
            )
        }

        // kalau berhasil
        const { nama_lengkap, email, password } = result.data

        const user = await registerUser({ nama_lengkap, email, password });

        return NextResponse.json(user, { status: 201 });

    } catch (error) {
        console.error("ERROR REGISTER:", error) // 🔥 TAMBAH INI
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