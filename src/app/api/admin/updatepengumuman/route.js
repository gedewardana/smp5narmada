import { NextResponse } from "next/server";
import { updatePengumuman } from "@/services/pengumuman/pengumumanServices";


export async function PUT(request) {
    try {
        const body = await request.json();
        const { id_pengumuman, pengumuman_hasil_seleksi, catatan, diumumkan_oleh } = body;

        if (!id_pengumuman) {
            throw new Error("ID Pengumuman wajib diisi.");
        }

        // TODO: Ganti diumumkan_oleh dengan session.user.id jika ada sistem Auth
        const adminId = diumumkan_oleh ? parseInt(diumumkan_oleh) : null; 

        const result = await updatePengumuman(id_pengumuman, {
            pengumuman_hasil_seleksi,
            catatan,
            diumumkan_oleh: adminId
        });

        return NextResponse.json({ success: true, ...result }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}