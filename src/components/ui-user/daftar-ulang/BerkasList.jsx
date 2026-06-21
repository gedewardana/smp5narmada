'use client'

import BerkasCard from './BerkasCard'

/**
 * BerkasList - List semua berkas daftar ulang
 */
function BerkasList({ berkasList, onUpload, onDelete }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                {berkasList.map((berkas) => (
                    <BerkasCard
                        key={berkas.jenis_berkas_daftar_ulang}
                        berkas={berkas}
                        onUpload={onUpload}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default BerkasList
