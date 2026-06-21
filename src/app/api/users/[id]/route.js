import { getUserById, updateUser } from "@/services/users/userServices";
import { NextResponse } from "next/server"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fungsi bantuan untuk cek otorisasi (Pemilik akun asli ATAU Admin)
async function checkAuthorization(userId) {
    const session = await getServerSession(authOptions);
    if (!session) return { authorized: false, error: "Tidak ada akses (Sesi tidak ditemukan)" };
    
    // Boleh diakses jika yang login adalah pemilik ID tersebut, ATAU dia adalah ADMIN
    if (session.user.id_pengguna !== userId && session.user.role !== "ADMIN") {
        return { authorized: false, error: "Forbidden: Anda tidak berhak mengakses data ini" };
    }
    
    return { authorized: true };
}

// untuk get by id
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const auth = await checkAuthorization(userId);
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        const user = await getUserById(userId);
        return NextResponse.json(user);

    } catch (error) {
        console.error("GET user error:", error);
        if (error.message === "User tidak ditemukan") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// untuk update (password oleh user sendiri)
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const auth = await checkAuthorization(userId);
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        const { oldPassword, newPassword } = await request.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: "Password lama dan baru wajib diisi" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
        }

        await updateUser(userId, oldPassword, newPassword);

        return NextResponse.json({ message: "Password berhasil diubah" });

    } catch (error) {
        if (error.message === "Password lama salah") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        if (error.message === "User tidak ditemukan") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}