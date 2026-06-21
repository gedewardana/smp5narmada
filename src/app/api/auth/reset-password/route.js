import { NextResponse } from "next/server";
import { resetPassword } from "@/services/auth/forgotPasswordService";

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token dan password wajib diisi" },
                { status: 400 }
            );
        }

        await resetPassword(token, password);

        return NextResponse.json(
            { message: "Password berhasil diperbarui" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { message: error.message || "Terjadi kesalahan internal" },
            { status: 500 }
        );
    }
}
