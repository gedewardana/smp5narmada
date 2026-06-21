import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { 
    getNotifikasiByUser, 
    markAllAsRead, 
    getUnreadCount 
} from "@/services/notifikasi/notifikasiServices";

/**
 * GET /api/notifikasi?id_pengguna=...
 * Mengambil daftar notifikasi user dan jumlah yang belum terbaca.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id_pengguna = searchParams.get("id_pengguna");
        const limit = searchParams.get("limit") || 5;

        if (!id_pengguna) {
            return NextResponse.json({ success: false, message: "ID Pengguna diperlukan" }, { status: 400 });
        }

        const notifications = await getNotifikasiByUser(id_pengguna, Number(limit));
        const unreadCount = await getUnreadCount(id_pengguna);
        
        // Cek total notifikasi untuk hasMore logic
        const totalCount = await prisma.notifikasi.count({
            where: { id_pengguna: Number(id_pengguna) }
        });

        return NextResponse.json({ 
            success: true, 
            data: notifications,
            unreadCount,
            totalCount
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/notifikasi?id_pengguna=...
 * Menandai semua notifikasi user sebagai terbaca.
 */
export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id_pengguna = searchParams.get("id_pengguna");

        if (!id_pengguna) {
            return NextResponse.json({ success: false, message: "ID Pengguna diperlukan" }, { status: 400 });
        }

        await markAllAsRead(id_pengguna);

        return NextResponse.json({ success: true, message: "Semua notifikasi ditandai terbaca" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
