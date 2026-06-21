import { NextResponse } from "next/server";
import { markAsRead, deleteNotifikasi } from "@/services/notifikasi/notifikasiServices";

/**
 * PATCH /api/notifikasi/[id]
 * Menandai satu notifikasi spesifik sebagai terbaca.
 */
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const updated = await markAsRead(id);

        return NextResponse.json({ 
            success: true, 
            message: "Notifikasi ditandai terbaca", 
            data: updated 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/notifikasi/[id]
 * Menghapus satu notifikasi spesifik.
 */
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteNotifikasi(id);

        return NextResponse.json({ 
            success: true, 
            message: "Notifikasi berhasil dihapus" 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
