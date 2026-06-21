import { NextResponse } from "next/server";
import { submitPendaftaran } from "@/services/pendaftaran/pendaftaranServices";

/**
 * POST /api/user/submitted
 * Endpoint untuk mensubmit pendaftaran siswa (mengubah status dari DRAFT menjadi SUBMITTED)
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { id_pendaftaran } = body;

        if (!id_pendaftaran) {
            return NextResponse.json(
                { success: false, message: "ID Pendaftaran diperlukan." },
                { status: 400 }
            );
        }

        // Panggil fungsi submitPendaftaran dari service layer
        // Fungsi ini juga otomatis menangani pembuatan notifikasi ke admin
        const result = await submitPendaftaran(id_pendaftaran);

        return NextResponse.json(
            { success: true, message: "Pendaftaran berhasil disubmit!", data: result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Submit Pendaftaran Error:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
