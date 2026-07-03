import React from 'react'
import { FileText } from 'lucide-react'
import { useDashboardData } from '@/hooks/useDashboardData'

function PrinRekap({ selectedYear }) {
    const { data, isLoading } = useDashboardData({ tahun_ajaran: selectedYear })

    // Ambil data live dari rekap chart
    const DataRekapHarian = data?.chart || []

    const totals = DataRekapHarian.reduce((acc, r) => ({
        pendaftarL: acc.pendaftarL + r.pendaftarL,
        pendaftarP: acc.pendaftarP + r.pendaftarP,
        diterimaL: acc.diterimaL + r.diterimaL,
        diterimaP: acc.diterimaP + r.diterimaP,
    }), { pendaftarL: 0, pendaftarP: 0, diterimaL: 0, diterimaP: 0 })

    const totalDaftar = data?.total_pendaftar ?? (totals.pendaftarL + totals.pendaftarP)
    const totalDiterima = data?.diterima ?? (totals.diterimaL + totals.diterimaP)
    const dayaTampung = data?.daya_tampung ?? 0

    // const tanggalCetak = new Intl.DateTimeFormat('id-ID', {
    //     day: 'numeric', month: 'long', year: 'numeric'
    // }).format(new Date())

    return (
        <div className="rekap-print-container">

            {/* Tanggal Cetak - pojok kanan atas */}
            {/* <div className="tanggal-cetak">
                Narmada, {tanggalCetak}
            </div> */}

            {/* HEADER TABLE */}
            <div className="header-title-print">
                <h1 className="title-text">
                    Daftar Harian Penerimaan Calon Peserta Murid Baru
                </h1>
                <h2 className="title-text">
                    SMP Negeri 5 Narmada
                </h2>
                <h3 className="title-text">
                    Tahun Pelajaran {data?.tahun_ajaran || '...'}
                </h3>
            </div>

            {/* TABLE */}
            <div className="table-wrapper">
                <table className="rekap-table">
                    <thead>
                        <tr>
                            <th rowSpan="3" className="col-no">No</th>
                            <th rowSpan="3" className="col-tgl">Hari / Tanggal</th>
                            <th colSpan="2" className="col-group">Pendaftar</th>
                            <th colSpan="2" className="col-group">Diterima</th>
                            <th rowSpan="3" className="col-total">Total</th>
                        </tr>
                        <tr>
                            <th colSpan="2" className="col-group">SD</th>
                            <th colSpan="2" className="col-group">SD</th>
                        </tr>
                        <tr>
                            <th className="col-jk">L</th>
                            <th className="col-jk">P</th>
                            <th className="col-jk">L</th>
                            <th className="col-jk">P</th>
                        </tr>
                    </thead>

                    <tbody>
                        {DataRekapHarian.length > 0 ? (
                            DataRekapHarian.map((row, i) => {
                                const subTotal = row.pendaftarL + row.pendaftarP
                                return (
                                    <tr key={i}>
                                        <td className="text-center">{i + 1}</td>
                                        <td className="text-left px-2">{row.tgl}</td>

                                        {/* Pendaftar L P */}
                                        <td className="text-center">{row.pendaftarL}</td>
                                        <td className="text-center">{row.pendaftarP}</td>

                                        {/* Diterima L P */}
                                        <td className="text-center">{row.diterimaL}</td>
                                        <td className="text-center">{row.diterimaP}</td>

                                        {/* Total */}
                                        <td className="text-center font-bold">{subTotal}</td>
                                    </tr>
                                )
                            })
                        ) : (
                            // EMPTY STATE DESIGN
                            <tr>
                                <td colSpan="7" className="empty-state">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText className="empty-icon" />
                                        <span>{isLoading ? 'Memuat data...' : 'Data tidak tersedia'}</span>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* BARIS JUMLAH */}
                        <tr className="row-jumlah">
                            <td colSpan="2" className="text-center font-bold uppercase">
                                Jumlah
                            </td>
                            {/* Gabungan Pendaftar L & P (2 Kolom) */}
                            <td colSpan="2" className="text-center font-black">
                                {totalDaftar}
                            </td>
                            {/* Gabungan Diterima & Total (3 Kolom) */}
                            <td colSpan="3" className="text-center font-black">
                                {totalDiterima}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*ringkasan akhir*/}
            <div className="flex justify-between items-start mt-6 text-sm">
                <div className="keterangan-box !mt-0">
                    <p className="font-semibold underline mb-1">Keterangan:</p>
                    <p>L = Laki-laki</p>
                    <p>P = Perempuan</p>
                </div>
                <div className="text-sm text-black">
                    <table className="w-auto font-semibold">
                        <tbody>
                            <tr>
                                <td className="pb-1 pr-4 text-left">Daya Tampung</td>
                                <td className="pb-1 pr-2">:</td>
                                <td className="pb-1 text-right">{dayaTampung} Siswa</td>
                            </tr>
                            <tr>
                                <td className="pb-1 pr-4 text-left">Total Pendaftar</td>
                                <td className="pb-1 pr-2">:</td>
                                <td className="pb-1 text-right">{totalDaftar} Siswa</td>
                            </tr>
                            <tr>
                                <td className="pb-1 pr-4 text-left">Total Diterima</td>
                                <td className="pb-1 pr-2">:</td>
                                <td className="pb-1 text-right">{totalDiterima} Siswa</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TANDA TANGAN PENGESAHAN */}
            {/* <div className="flex justify-end mt-12 text-sm">
                <div className="text-center w-64">
                    <p>Narmada, {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
                    <p className="font-semibold mt-1">Ketua Panitia PPDB</p>
                    
                    <div className="h-24"></div>
                    
                    <p className="font-bold underline text-base">.......................................</p>
                    <p>NIP. ..............................</p>
                </div>
            </div> */}

            <style jsx>{`
                .rekap-print-container {
                    width: 794px;
                    min-height: 1123px;
                    padding: 60px;
                    background: white;
                    color: black;
                    font-family: 'Times New Roman', Times, serif;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                .header-title-print {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .title-text {
                    font-size: 14pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin: 4px 0;
                    line-height: 1.3;
                }

                .table-wrapper {
                    width: 100%;
                    margin-bottom: 20px;
                }

                .rekap-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12pt;
                }

                .rekap-table th, .rekap-table td {
                    border: 1px solid black;
                    padding: 6px 8px;
                }

                .rekap-table th {
                    text-align: center;
                    font-weight: bold;
                    background-color: #f8fafc !important;
                }

                .rekap-table tr {
                    background-color: transparent !important;
                }

                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .px-2 { padding-left: 8px; padding-right: 8px; }
                .font-bold { font-weight: bold; }
                .font-black { font-weight: 900; }
                .uppercase { text-transform: uppercase; }

                .col-no { width: 5%; }
                .col-tgl { width: 25%; }
                .col-group { width: 15%; }
                .col-jk { width: 7.5%; }
                .col-total { width: 10%; }

                .empty-state {
                    padding: 30px 0;
                    text-align: center;
                    color: #6b7280;
                }

                .empty-icon {
                    width: 32px;
                    height: 32px;
                    margin-bottom: 8px;
                }

                .row-jumlah {
                    background-color: #f1f5f9 !important;
                }
                
                .text-blue { color: #1d4ed8; }
                .text-green { color: #047857; }

                .keterangan-box {
                    font-size: 12pt;
                    margin-top: 20px;
                }

                .keterangan-box p {
                    margin: 2px 0;
                }
                .font-semibold {
                    font-weight: 600;
                }

                @media print {
                    .rekap-print-container {
                        width: 100%;
                        min-height: auto;
                        padding: 0;
                        margin: 0;
                        box-shadow: none;
                    }
                }
            `}</style>

        </div>
    )
}

export default PrinRekap