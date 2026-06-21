import { NextResponse } from "next/server";
import { getAllDaftarUlang } from "@/services/daftarulang/daftarUlangServices";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Menangkap parameter kueri dari Frontend
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || "";
        const status_daftar_ulang = searchParams.get("status_daftar_ulang") || undefined;
        const tahun_ajaran = searchParams.get("tahun_ajaran") || undefined;
        const jalur_pendaftaran = searchParams.get("jalur_pendaftaran") || undefined;
        const dateFrom = searchParams.get("dateFrom") || undefined;
        const dateTo = searchParams.get("dateTo") || undefined;
        const urutan = searchParams.get("urutan") || "terbaru";

        // Memanggil Service Layer Database
        const result = await getAllDaftarUlang({
            page,
            limit,
            search,
            status_daftar_ulang,
            tahun_ajaran,
            jalur_pendaftaran,
            dateFrom,
            dateTo,
            urutan
        });

        // Mengembalikan Respons JSON Berhasil
        return NextResponse.json({
            success: true,
            ...result
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}