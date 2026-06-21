import { NextResponse } from "next/server";
import { getJadwalById, updateJadwal, deleteJadwal } from "@/services/admin/jadwal/jadwalServices";
import { jadwalSchema, formatZodError } from "@/utils/jadwalvalidation";

// GET jadwal by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const jadwalId = parseInt(id);

        if (isNaN(jadwalId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const jadwal = await getJadwalById(jadwalId);

        if (!jadwal) {
            return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(jadwal);
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal mengambil data jadwal: " + error.message },
            { status: 500 }
        );
    }
}

// UPDATE jadwal by ID
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const jadwalId = parseInt(id);

        if (isNaN(jadwalId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const data = await request.json();

        // VALIDASI ZOD
        const parseResult = jadwalSchema.safeParse(data);
        if (!parseResult.success) {
            return NextResponse.json(
                formatZodError(parseResult.error),
                { status: 400 }
            );
        }

        // update jadwal
        const updatedJadwal = await updateJadwal(jadwalId, parseResult.data);
        return NextResponse.json(updatedJadwal, { status: 200 });

    } catch (error) {
        // 
        if (error.message) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // error tidak dikenal
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// DELETE jadwal by ID
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const jadwalId = parseInt(id);

        if (isNaN(jadwalId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const deletedJadwal = await deleteJadwal(jadwalId);
        return NextResponse.json({ success: true, message: "Jadwal berhasil dihapus", data: deletedJadwal }, { status: 200 });

    } catch (error) {
        if (error.message) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Terjadi kesalahan server saat menghapus jadwal" },
            { status: 500 }
        );
    }
}
