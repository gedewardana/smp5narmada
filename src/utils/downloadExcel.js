import * as XLSX from 'xlsx'

export function downloadExcel(ref, fileName) {
    try {
        const element = ref.current
        
        // Cari semua tabel di dalam komponen
        const tables = element.querySelectorAll('table')
        
        if (tables.length === 0) {
            alert("Tabel tidak ditemukan untuk diekspor.")
            return
        }

        // Convert tabel HTML utama (pertama) menjadi worksheet
        const ws = XLSX.utils.table_to_sheet(tables[0])

        // Jika ada tabel lain (misalnya Ringkasan Akhir), gabungkan ke bawahnya
        for (let i = 1; i < tables.length; i++) {
            const wsNext = XLSX.utils.table_to_sheet(tables[i])
            const dataNext = XLSX.utils.sheet_to_json(wsNext, { header: 1 })
            
            // Tambahkan baris kosong sebagai pemisah, lalu tambahkan datanya
            XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 })
            XLSX.utils.sheet_add_aoa(ws, dataNext, { origin: -1 })
        }

        // Buat workbook dan masukkan worksheet
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, ws, "Rekap Data")

        // Tulis dan download file excel
        XLSX.writeFile(workbook, fileName)

    } catch (err) {
        console.error("Error generating Excel:", err)
        alert("Gagal membuat file Excel. Silakan coba lagi.")
    }
}
