import React from 'react'

function InfoBox() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informasi Penting</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Pastikan semua berkas sudah ditandatangani dengan jelas</li>
                <li>Format file yang diterima: PDF, JPG, PNG (Maksimal 5MB)</li>
                <li>Proses verifikasi membutuhkan waktu 1-3 hari kerja</li>
                <li>Jika ada berkas yang perlu perbaikan, silakan upload ulang</li>
            </ul>
        </div>
    )
}

export default InfoBox