import { verifikasiPendaftaran } from "@/services/pendaftaran/pendaftaranServices";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status_verifikasi, catatan, diverifikasi_oleh } = body;

        if (!status_verifikasi || !diverifikasi_oleh) {
            return NextResponse.json(
                { success: false, message: "Status verifikasi dan diverifikasi oleh wajib diisi" },
                { status: 400 }
            );
        }

        const result = await verifikasiPendaftaran(Number(id), {
            status_verifikasi,
            catatan,
            diverifikasi_oleh,
        });

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}