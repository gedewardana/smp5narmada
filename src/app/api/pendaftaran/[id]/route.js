import { NextResponse } from "next/server";
import {
    getPendaftaranById,
    updatePendaftaran,
    deletePendaftaran,
} from "@/services/pendaftaran/pendaftaranServices";

// GET /api/pendaftaran/[id]
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const pendaftaran = await getPendaftaranById(Number(id));
        return NextResponse.json({ success: true, data: pendaftaran }, { status: 200 });
    } catch (error) {
        const isNotFound = error.message.includes("tidak ditemukan");
        return NextResponse.json(
            { success: false, message: error.message },
            { status: isNotFound ? 404 : 500 }
        );
    }
}

// PUT /api/pendaftaran/[id]
// Update (DRAFT only)
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { jalur_pendaftaran, tahun_pelajaran } = body;
        const result = await updatePendaftaran(Number(id), {
            jalur_pendaftaran,
            tahun_pelajaran,
        });

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        const isNotFound = error.message.includes("tidak ditemukan");
        const isBadRequest =
            error.message.includes("tidak dapat diubah") ||
            error.message.includes("sudah pernah disubmit") ||
            error.message.includes("masih DRAFT") ||
            error.message.includes("belum diisi") ||
            error.message.includes("tidak valid");

        const status = isNotFound ? 404 : isBadRequest ? 400 : 500;

        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}

// DELETE /api/pendaftaran/[id]
// Hanya bisa dihapus jika statusnya DRAFT
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deletePendaftaran(Number(id));
        return NextResponse.json(
            { success: true, message: `Pendaftaran dengan ID ${id} berhasil dihapus.` },
            { status: 200 }
        );
    } catch (error) {
        const isNotFound = error.message.includes("tidak ditemukan");
        const isBadRequest = error.message.includes("tidak dapat dihapus");
        const status = isNotFound ? 404 : isBadRequest ? 400 : 500;

        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}