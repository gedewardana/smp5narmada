import { NextResponse } from "next/server";
import { 
    getPengumumanById, 
    getPengumumanByPendaftaranId
} from "@/services/pengumuman/pengumumanServices";

/**
 * GET /api/pengumuman/[id]
 * Mengambil detail pengumuman berdasarkan ID Pengumuman atau ID Pendaftaran.
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type"); // 'pendaftaran' atau null

        let pengumuman;

        if (type === "pendaftaran") {
            pengumuman = await getPengumumanByPendaftaranId(id);
        } else {
            try {
                // Default: Coba cari berdasarkan ID Pengumuman
                pengumuman = await getPengumumanById(id);
            } catch (err) {
                // Fallback: Jika gagal, coba cari berdasarkan ID Pendaftaran
                // Ini membantu jika frontend mengirimkan ID Pendaftaran ke route ini.
                pengumuman = await getPengumumanByPendaftaranId(id);
            }
        }

        // Clean Code: Normalisasi data untuk UI (Alias field agar cocok dengan HasilCard.jsx)
        const formatted = {
            ...pengumuman,
            hasil_pengumuman: pengumuman.pengumuman_hasil_seleksi,
            tanggal_pengumuman: pengumuman.diperbaharui_pada || pengumuman.dibuat_pada,
        };

        return NextResponse.json({ success: true, data: formatted }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 404 }
        );
    }
}

