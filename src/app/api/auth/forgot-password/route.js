import { NextResponse } from "next/server";
import { generateResetToken } from "@/services/auth/forgotPasswordService";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email wajib diisi" },
                { status: 400 }
            );
        }

        await generateResetToken(email);

        return NextResponse.json(
            { message: "Link reset password telah dikirim ke email Anda" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { message: error.message || "Terjadi kesalahan internal" },
            { status: 500 }
        );
    }
}
