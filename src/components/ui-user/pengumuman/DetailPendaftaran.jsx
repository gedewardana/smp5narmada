'use client'

/**
 * DetailPendaftaran - Detail data pendaftaran
 */
function DetailPendaftaran({ data }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                📋 Detail Pendaftaran
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Nomor Pendaftaran</p>
                    <p className="font-semibold text-gray-800">{data.nomor_pendaftaran}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-semibold text-gray-800">{data.nama_lengkap}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">NISN</p>
                    <p className="font-semibold text-gray-800">{data.nisn}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Asal Sekolah</p>
                    <p className="font-semibold text-gray-800">{data.asal_sekolah}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Nilai SKHU</p>
                    <p className="font-semibold text-gray-800">{data.nilai_skhu}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Tanggal Pendaftaran</p>
                    <p className="font-semibold text-gray-800">
                        {new Date(data.tanggal_submit).toLocaleDateString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DetailPendaftaran
