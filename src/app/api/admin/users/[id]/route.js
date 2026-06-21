import { updateNonaktifUser, updateUserAdmin, deleteUserAdmin } from "@/services/users/userServices";
import { NextResponse } from "next/server"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// untuk delete / nonaktifkan (DELETE /api/admin/users/[id])
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const mode = searchParams.get("mode");

        if (mode === "hard") {
            const session = await getServerSession(authOptions);
            const adminId = session?.user?.id_pengguna;

            await deleteUserAdmin(userId, adminId);
            return NextResponse.json({ message: "User berhasil dihapus permanen" });
        }

        const user = await updateNonaktifUser(userId);
        return NextResponse.json({
            message: "User berhasil dinonaktifkan",
            data: user,
        });

    } catch (error) {
        console.error("DELETE USER ERROR:", error);
        if (error.message === "User tidak ditemukan") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        // Handle error status SUBMITTED atau hapus diri sendiri dari userServices
        if (
            error.message.includes("pendaftaran sudah berstatus SUBMITTED") || 
            error.message.includes("tidak dapat menghapus akun Anda sendiri")
        ) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// untuk update data oleh Admin (PATCH /api/admin/users/[id])
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const body = await request.json();
        const { nama_lengkap, email, role, status_akun, password } = body;

        // Minimal satu field harus diisi
        if (!nama_lengkap && !email && !role && !status_akun && !password) {
            return NextResponse.json({ error: "Tidak ada data yang diperbarui" }, { status: 400 });
        }

        const user = await updateUserAdmin(userId, { nama_lengkap, email, role, status_akun, password });

        return NextResponse.json({
            message: "User berhasil diperbarui",
            data: user,
        });

    } catch (error) {
        console.error("ERROR PATCH USER ADMIN:", error);
        if (error.message === "User tidak ditemukan") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
