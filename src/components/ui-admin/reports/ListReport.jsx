'use client'

import React, { useMemo } from 'react'
import DataTable from '@/components/ui-admin/common/DataTable'
import { Eye, Download } from 'lucide-react'
import { handleDownload } from '@/utils/downloadUtils'

function ListReport({ dataSiswa }) {
    const columns = useMemo(() => [
        {
            id: 'no',
            header: 'No',
            cell: (info) => info.row.index + 1
        },
        {
            accessorKey: 'no_pendaftaran',
            header: 'No. Pendaftaran',
        },
        {
            accessorKey: 'nama',
            header: 'Nama Lengkap',
        },
        {
            accessorKey: 'alamat',
            header: 'Alamat Tempat Tinggal',
        },
        {
            accessorKey: 'prestasi',
            header: 'Prestasi',
            cell: ({ row }) => {
                const prestasi = row.original.prestasi;
                if (prestasi && prestasi !== "-") {
                    return (
                        <div className="flex items-center gap-2">
                            <span>{prestasi.nama}</span>
                            {prestasi.file && (
                                <div className="flex items-center gap-1">
                                    <a
                                        href={prestasi.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="print:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Lihat Bukti Prestasi"
                                    >
                                        <Eye className="w-4 h-4 text-blue-500" />
                                    </a>
                                    <button
                                        onClick={() => handleDownload(prestasi.file, `Prestasi-${row.original.nama}`)}
                                        className="print:hidden p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                        title="Download Bukti Prestasi"
                                    >
                                        <Download className="w-4 h-4 text-emerald-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }
                return <span className="text-gray-400">-</span>;
            }
        }
    ], []);

    return (
        <>
            {/* print header */}
            <div className="mt-4 mb-4 hidden print:flex justify-between items-center">
                <p className="text-sm font-bold">
                    Total Pendaftar: {dataSiswa?.length || 0}
                </p>

                <span className="italic text-sm font-bold">
                    Dicetak pada: {new Date().toLocaleDateString("id-ID")}
                </span>
            </div>

            <DataTable
                columns={columns}
                data={dataSiswa || []}
                emptyTitle="Belum Ada Data Laporan"
                emptyDescription="Data laporan penerimaan murid baru belum tersedia."
                footerText={`Total Laporan: ${dataSiswa?.length || 0} Data`}
            />
        </>
    )
}

export default ListReport