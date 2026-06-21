import { NextResponse } from "next/server"
import { DashboardData, getDailyChart, getYearlyChart, getStatsPendaftaran, getStatsPengumuman, getStatsDaftarUlang } from "@/services/admin/dashboard/dasboardServices"
import { getRekapHarian } from "@/utils/rekapHarian"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const tahun_ajaran = searchParams.get('tahun_ajaran')

        // get dashboard data
        const data = await DashboardData(tahun_ajaran)
        console.log("=== API DASHBOARD DATA ===", data)

        if (!data) {
            return NextResponse.json(
                { error: "Jadwal tidak ditemukan" },
                { status: 404 }
            )
        }

        // get daily chart & stats
        const { chartData: chart, puncak } = await getDailyChart(data.jadwal)
        const yearly = await getYearlyChart()
        const stats_verifikasi = await getStatsPendaftaran(data.jadwal.id_jadwal)
        const stats_pengumuman = await getStatsPengumuman(data.jadwal.id_jadwal)
        const stats_daftar_ulang = await getStatsDaftarUlang(data.jadwal.id_jadwal)
        
        // Fast JS computation for Rekap Harian
        const rekap_harian = getRekapHarian(data.jadwal, puncak, data.total_pendaftar, data.diterima)

        return NextResponse.json({
            ...data,
            chart,
            yearly,
            stats_verifikasi,
            stats_pengumuman,
            stats_daftar_ulang,
            rekap_harian
        })

    } catch (error) {
        console.error("Dashboard error:", error)

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        )
    }
}