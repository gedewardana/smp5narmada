import { NextResponse } from "next/server";
import { getAllJadwal } from "@/services/admin/jadwal/jadwalServices";

export async function GET() {
    try {
        const jadwal = await getAllJadwal();
        return NextResponse.json({
            status: 200,
            message: "Berhasil mendapatkan data jadwal pendaftaran",
            data: jadwal
        });
    } catch (error) {
        console.error("Error fetching data jadwal pendaftaran:", error);
        return NextResponse.json({
            status: 500,
            message: "Internal server error"
        });
    }
}