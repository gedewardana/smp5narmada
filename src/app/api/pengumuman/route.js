import { NextResponse } from "next/server";
import { getAllPengumuman } from "@/services/pengumuman/pengumumanServices";

// GET /api/pengumuman
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            tahun_ajaran: searchParams.get("tahun_ajaran") ? parseInt(searchParams.get("tahun_ajaran")) : undefined,
            pengumuman_hasil_seleksi: searchParams.get("pengumuman_hasil_seleksi") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            jalur_pendaftaran: searchParams.get("jalur_pendaftaran") ?? undefined,
            dateFrom: searchParams.get("dateFrom") ?? undefined,
            dateTo: searchParams.get("dateTo") ?? undefined,
            urutan: searchParams.get("urutan") ?? "terbaru",
            page: parseInt(searchParams.get("page") ?? "1"),
            limit: parseInt(searchParams.get("limit") ?? "10"),
        };

        const result = await getAllPengumuman(filters);

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}