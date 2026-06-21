import { NextResponse } from "next/server";
import { getAllJadwal, createJadwal, getJadwalSummary, autoUpdateJadwal } from "@/services/admin/jadwal/jadwalServices";
import { jadwalSchema, formatZodError } from "@/utils/jadwalvalidation";

// GET all jadwal
export async function GET(request) {
    try {
        // Trigger auto-update secara lazy saat endpoint dipanggil
        await autoUpdateJadwal();

        const { searchParams } = new URL(request.url);
        const tahun_ajaran = searchParams.get("tahun_ajaran");

        const filters = {};
        if (tahun_ajaran) filters.tahun_ajaran = tahun_ajaran;

        const jadwal = await getAllJadwal(filters);
        return NextResponse.json({
            data: jadwal,
            summary: getJadwalSummary(jadwal)
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal mengambil data jadwal: " + error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // VALIDASI ZOD
        const parseResult = jadwalSchema.safeParse(data);
        if (!parseResult.success) {
            return NextResponse.json(
                formatZodError(parseResult.error),
                { status: 400 }
            );
        }

        // 6. BUAT JADWAL
        const newJadwal = await createJadwal(parseResult.data);
        return NextResponse.json(newJadwal, { status: 201 });

    } catch (error) {
        // Handle unique constraint Prisma
        if (error.code === "P2002") { // P2002 adalah error code untuk unique constraint
            return NextResponse.json(
                { error: "Tahun ajaran sudah ada" },
                { status: 400 }
            );
        }

        // error dari service (validasi)
        if (error.message) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // error lain
        return NextResponse.json(
            { error: "Gagal membuat jadwal" },
            { status: 500 }
        );
    }
}
