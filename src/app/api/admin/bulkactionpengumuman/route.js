import { NextResponse } from "next/server";
import { updatePengumumanMassal } from "@/services/pengumuman/pengumumanServices";

export async function POST(request) {
    try {
        const body = await request.json();
        const { id_pengumuman_list, pengumuman_hasil_seleksi, catatan, diumumkan_oleh } = body;

        if (!id_pengumuman_list || !Array.isArray(id_pengumuman_list) || id_pengumuman_list.length === 0) {
            return NextResponse.json(
                { error: "Daftar ID Pengumuman tidak boleh kosong." },
                { status: 400 }
            );
        }

        const result = await updatePengumumanMassal(id_pengumuman_list, {
            pengumuman_hasil_seleksi,
            catatan,
            diumumkan_oleh: diumumkan_oleh ? Number(diumumkan_oleh) : null
        });

        return NextResponse.json({
            success: true,
            message: "Pengumuman massal berhasil dirilis!",
            data: result
        });

    } catch (error) {
        console.error("[API Update Pengumuman Massal] Error:", error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}