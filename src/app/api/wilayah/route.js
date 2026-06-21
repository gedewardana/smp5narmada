import { NextResponse } from "next/server";
import {
    getAllProvinsi,
    getKabupatenByProvinsi,
    getKecamatanByKabupaten,
    getKelurahanByKecamatan,
} from "@/services/wilayah/wilayahServices";

/**
 * GET /api/wilayah
 * Mengambil data wilayah berdasarkan type dan parent ID
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const type = searchParams.get("type");
        const parentId = searchParams.get("parentId");

        // Mapping handler biar clean (no switch-case)
        const handlers = {
            provinsi: async () => await getAllProvinsi(),

            kabupaten: async () => {
                if (!parentId) throw new Error("parentId wajib untuk kabupaten");
                return await getKabupatenByProvinsi(parentId);
            },

            kecamatan: async () => {
                if (!parentId) throw new Error("parentId wajib untuk kecamatan");
                return await getKecamatanByKabupaten(parentId);
            },

            kelurahan: async () => {
                if (!parentId) throw new Error("parentId wajib untuk kelurahan");
                return await getKelurahanByKecamatan(parentId);
            },
        };

        // Validasi type
        if (!handlers[type]) {
            return NextResponse.json(
                { success: false, message: "Type tidak valid" },
                { status: 400 }
            );
        }

        const data = await handlers[type]();

        return NextResponse.json(
            { success: true, data },
            { status: 200 }
        );

    } catch (error) {
        console.error("API WILAYAH ERROR:", error.message);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
