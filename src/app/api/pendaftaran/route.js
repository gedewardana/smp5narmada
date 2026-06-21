import { NextResponse } from "next/server";
import { getAllPendaftaran } from "@/services/pendaftaran/pendaftaranServices";

// GET /api/pendaftaran
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            tahun_ajaran: searchParams.get("tahun_ajaran") || undefined,
            status_pendaftaran: searchParams.get("status_pendaftaran") || undefined,
            status_verifikasi: searchParams.get("status_verifikasi") || undefined,
            jalur_pendaftaran: searchParams.get("jalur_pendaftaran") || undefined,
            search: searchParams.get("search") || undefined,
            dateFrom: searchParams.get("dateFrom") || undefined,
            dateTo: searchParams.get("dateTo") || undefined,
            urutan: searchParams.get("urutan") || "terbaru",
            page: parseInt(searchParams.get("page") ?? "1"),
            limit: parseInt(searchParams.get("limit") ?? "10"),
        };

        const result = await getAllPendaftaran(filters);

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

