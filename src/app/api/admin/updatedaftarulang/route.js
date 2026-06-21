import { NextResponse } from "next/server";
import { updateDaftarUlang } from "@/services/daftarulang/daftarUlangServices";

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id_daftar_ulang, status_daftar_ulang, diinput_oleh } = body;

        if (!id_daftar_ulang) {
            throw new Error("ID Daftar Ulang wajib disertakan.");
        }

        // Fallback untuk diinput_oleh jika session authentication belum diintegrasikan
        const adminId = diinput_oleh ? parseInt(diinput_oleh) : null; 

        const result = await updateDaftarUlang(id_daftar_ulang, {
            status_daftar_ulang,
            diinput_oleh: adminId
        });

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
