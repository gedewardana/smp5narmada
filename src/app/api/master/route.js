import { getMasterData } from "@/services/master/masterServices";
import { NextResponse } from "next/server";

/**
 * GET /api/master?type=[nama_tabel]
 * Endpoint terpusat untuk dropdown data referensi di formulir.
 * Contoh pemanggilan: /api/master?type=agama
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        if (!type) {
            return NextResponse.json(
                { success: false, message: "Parameter 'type' wajib dikirimkan." },
                { status: 400 }
            );
        }

        const data = await getMasterData(type);

        return NextResponse.json(
            { success: true, data },
            { status: 200 }
        );
    } catch (error) {
        console.error("API MASTER ERROR:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
